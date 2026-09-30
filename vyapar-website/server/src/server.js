import express from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import db from "./db.js";
import { siteContent } from "./content.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const clientDistPath = path.resolve(currentDirPath, "..", "..", "client", "dist");
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const authSecret = process.env.AUTH_SECRET;
const githubRepoOwner = process.env.GITHUB_REPO_OWNER || "AkashSuman5002";
const githubRepoName = process.env.GITHUB_REPO_NAME || "vypaar-website";
const githubToken = process.env.GITHUB_TOKEN;
const githubApiBase = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}`;
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const releaseCacheTtlMs = Number(process.env.RELEASE_CACHE_TTL_MS || 300000);
const releaseCache = {
  latest: null,
  all: [],
  fetchedAt: 0
};

if (!adminEmail || !adminPassword || !authSecret) {
  console.error("FATAL: ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET environment variables must be set.");
  console.error("Create a .env file in the server directory with these values.");
  process.exit(1);
}

const downloadConfig = {
  fileName: process.env.DOWNLOAD_FILE_NAME || "Vyapar-Setup-1.0.17.exe",
  version: process.env.DOWNLOAD_VERSION || "1.0.17"
};

const rateLimitStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 120000) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

function rateLimit(maxRequests, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const key = `${ip}:${req.path}`;
    const entry = rateLimitStore.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      rateLimitStore.set(key, { windowStart: now, count: 1 });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    return next();
  };
}

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getWindowsInstaller(release) {
  if (!release?.assets?.length) return null;

  const assets = [...release.assets].filter((asset) => {
    const name = (asset?.name || "").toLowerCase();
    return name.endsWith(".exe") && !name.includes(".blockmap") && !name.includes(".yml") && !name.includes(".yaml");
  });

  return assets[0] || null;
}

async function fetchGithubJson(endpoint) {
  const response = await fetch(`${githubApiBase}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "vyapar-website",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `GitHub API request failed with ${response.status}`);
  }

  return response.json();
}

async function resolveChecksum(asset) {
  if (!asset?.browser_download_url) return null;
  const response = await fetch(asset.browser_download_url, {
    headers: {
      Accept: "application/octet-stream",
      "User-Agent": "vyapar-website"
    }
  });

  if (!response.ok) return null;

  const text = await response.text();
  const match = text.match(/[A-Fa-f0-9]{64}/);
  return match ? match[0].toLowerCase() : null;
}

async function normalizeRelease(release, includeChecksum = false) {
  if (!release || release.draft || release.prerelease) return null;

  const installerAsset = getWindowsInstaller(release);
  const checksumAsset = (release.assets || []).find((asset) => /sha256/i.test(asset.name || ""));
  const checksum = includeChecksum && checksumAsset ? await resolveChecksum(checksumAsset) : null;

  return {
    id: release.id,
    tag_name: release.tag_name || "Unknown",
    version: (release.tag_name || "Unknown").replace(/^v/i, ""),
    name: release.name || release.tag_name || "Release",
    published_at: release.published_at || release.created_at || null,
    html_url: release.html_url || "",
    body: release.body || "No release notes were provided for this version.",
    assets: (release.assets || []).map((asset) => ({
      id: asset.id,
      name: asset.name,
      browser_download_url: asset.browser_download_url,
      download_count: asset.download_count || 0,
      size: asset.size || 0,
      content_type: asset.content_type || "application/octet-stream"
    })),
    installer: installerAsset ? {
      id: installerAsset.id,
      name: installerAsset.name,
      browser_download_url: installerAsset.browser_download_url,
      download_count: installerAsset.download_count || 0,
      size: installerAsset.size || 0,
      file_size_label: formatBytes(installerAsset.size || 0)
    } : null,
    checksum,
    download_count: installerAsset ? installerAsset.download_count || 0 : 0,
    file_size_label: installerAsset ? formatBytes(installerAsset.size || 0) : "N/A"
  };
}

async function getGithubReleases() {
  const now = Date.now();
  if (releaseCache.latest && releaseCache.all.length && now - releaseCache.fetchedAt < releaseCacheTtlMs) {
    return releaseCache;
  }

  const [latest, all] = await Promise.all([
    fetchGithubJson("/releases/latest"),
    fetchGithubJson("/releases")
  ]);

  const latestRelease = await normalizeRelease(latest, true);
  const allReleases = [];

  for (const release of Array.isArray(all) ? all : []) {
    const normalized = await normalizeRelease(release);
    if (normalized) allReleases.push(normalized);
  }

  releaseCache.latest = latestRelease;
  releaseCache.all = allReleases;
  releaseCache.fetchedAt = now;
  return releaseCache;
}

const leadSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15).regex(/^[+\d\s\-()]+$/, "Invalid phone format"),
  email: z.string().email().max(255).optional().or(z.literal("")),
  businessType: z.string().max(100).optional().or(z.literal("")),
  source: z.string().min(2).max(100),
  notes: z.string().max(500).optional().or(z.literal(""))
});

const contactSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(15).optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000)
});

const adminLoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128)
});

function signAdminToken(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", authSecret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || !token.includes(".")) return null;
  const [encodedPayload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", authSecret).update(encodedPayload).digest("base64url");
  if (signature !== expected) return null;
  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  if (!payload?.email || payload.exp < Date.now()) return null;
  return payload;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.admin = payload;
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/site-content", (_req, res) => {
  try {
    const counts = {
      leads: db.prepare("SELECT COUNT(*) as count FROM leads").get().count,
      messages: db.prepare("SELECT COUNT(*) as count FROM contact_messages").get().count
    };
    res.json({ ...siteContent, counts });
  } catch (error) {
    console.error("Error fetching site content:", error.message);
    return res.status(500).json({ error: "Failed to load site content." });
  }
});

app.get("/api/releases/latest", async (_req, res) => {
  try {
    const { latest } = await getGithubReleases();
    if (!latest) {
      return res.status(404).json({ error: "No published release is available yet." });
    }
    return res.json(latest);
  } catch (error) {
    console.error("Error fetching latest release:", error.message);
    return res.status(502).json({
      error: "GitHub Releases is temporarily unavailable. Please try again in a few minutes."
    });
  }
});

app.get("/api/releases/all", async (_req, res) => {
  try {
    const { all } = await getGithubReleases();
    return res.json(all || []);
  } catch (error) {
    console.error("Error fetching all releases:", error.message);
    return res.status(502).json({
      error: "GitHub Releases could not be loaded right now."
    });
  }
});

app.get("/api/releases/download-url", async (_req, res) => {
  try {
    const { latest } = await getGithubReleases();
    if (!latest?.installer?.browser_download_url) {
      return res.status(404).json({ error: "No Windows installer was found for the latest release." });
    }

    return res.json({
      version: latest.version,
      tag_name: latest.tag_name,
      file_name: latest.installer.name,
      download_url: latest.installer.browser_download_url
    });
  } catch (error) {
    console.error("Error resolving download URL:", error.message);
    return res.status(502).json({
      error: "Unable to resolve the latest Windows installer."
    });
  }
});

app.get("/api/releases/release-notes", async (req, res) => {
  try {
    const { version } = req.query;
    const { latest, all } = await getGithubReleases();
    let match = latest;

    if (version) {
      match = (all || []).find((entry) =>
        entry.version === String(version) ||
        entry.tag_name === String(version) ||
        entry.name === String(version)
      ) || latest;
    }

    if (!match) {
      return res.status(404).json({ error: "Release notes were not found for the specified version." });
    }

    return res.json({
      version: match.version,
      tag_name: match.tag_name,
      html_url: match.html_url,
      body: match.body,
      published_at: match.published_at
    });
  } catch (error) {
    console.error("Error fetching release notes:", error.message);
    return res.status(502).json({
      error: "Release notes are unavailable right now."
    });
  }
});

app.post("/api/leads", rateLimit(10, 60000), (req, res) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid lead submission", details: parsed.error.flatten() });
    }

    const stmt = db.prepare(`
      INSERT INTO leads (full_name, phone, email, business_type, source, notes)
      VALUES (@fullName, @phone, @email, @businessType, @source, @notes)
    `);

    const result = stmt.run({
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || "",
      businessType: parsed.data.businessType || "",
      source: parsed.data.source,
      notes: parsed.data.notes || ""
    });

    return res.status(201).json({
      id: result.lastInsertRowid,
      message: "Trial request submitted successfully."
    });
  } catch (error) {
    console.error("Error creating lead:", error.message);
    return res.status(500).json({ error: "Failed to submit lead." });
  }
});

app.post("/api/contact", rateLimit(10, 60000), (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid contact submission", details: parsed.error.flatten() });
    }

    const stmt = db.prepare(`
      INSERT INTO contact_messages (full_name, email, phone, subject, message)
      VALUES (@fullName, @email, @phone, @subject, @message)
    `);

    const result = stmt.run({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      subject: parsed.data.subject,
      message: parsed.data.message
    });
    return res.status(201).json({
      id: Number(result.lastInsertRowid),
      message: "Message received. Our team will reach out soon."
    });
  } catch (error) {
    console.error("Error creating contact message:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to submit contact message." });
  }
});

const downloadsDir = path.resolve(currentDirPath, "..", "..", "client", "public", "downloads");

function sanitizeDownloadFilename(filename) {
  if (!filename || typeof filename !== "string") return null;
  const basename = path.basename(filename);
  if (basename !== filename) return null;
  if (basename.startsWith(".") || basename.length > 200) return null;
  if (!/\.exe$/i.test(basename)) return null;
  return basename;
}

app.get("/api/download/installer", async (req, res) => {
  try {
    const safeName = sanitizeDownloadFilename(downloadConfig.fileName);
    if (!safeName) {
      return res.status(400).json({ error: "Invalid file configuration." });
    }

    const filePath = path.join(downloadsDir, safeName);
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(downloadsDir))) {
      return res.status(403).json({ error: "Access denied." });
    }

    let stat;
    try {
      stat = fs.statSync(resolvedPath);
    } catch {
      try {
        const { latest } = await getGithubReleases();
        if (latest?.installer?.browser_download_url) {
          return res.redirect(latest.installer.browser_download_url);
        }
      } catch (error) {
        console.error("Error resolving GitHub installer:", error.message);
      }
      return res.status(404).json({ error: "Latest desktop application is currently unavailable. Please try again later." });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);
    stream.on("error", (err) => {
      console.error("Download stream error:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Download failed. Please try again later." });
      }
    });
    res.on("close", () => stream.destroy());
  } catch (error) {
    console.error("Error serving download:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Download failed. Please try again later." });
    }
  }
});

app.get("/api/download/info", async (req, res) => {
  try {
    const safeName = sanitizeDownloadFilename(downloadConfig.fileName);
    if (!safeName) {
      return res.status(404).json({
        available: false,
        error: "Latest desktop application is currently unavailable. Please try again later."
      });
    }

    const filePath = path.join(downloadsDir, safeName);
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(path.resolve(downloadsDir))) {
      return res.status(404).json({
        available: false,
        error: "Latest desktop application is currently unavailable. Please try again later."
      });
    }

    let stat;
    try {
      stat = fs.statSync(resolvedPath);
    } catch {
      try {
        const { latest } = await getGithubReleases();
        const installer = latest?.installer;
        if (installer?.browser_download_url) {
          return res.json({
            available: true,
            fileName: installer.name,
            version: latest.version,
            size: installer.size,
            sizeLabel: latest.file_size_label,
            downloadUrl: "/api/download/installer"
          });
        }
      } catch (error) {
        console.error("Error resolving GitHub installer info:", error.message);
      }
      return res.status(404).json({ available: false, error: "Latest desktop application is currently unavailable. Please try again later." });
    }

    const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);

    res.json({
      available: true,
      fileName: safeName,
      version: downloadConfig.version,
      size: stat.size,
      sizeLabel: `${sizeMB} MB`,
      downloadUrl: "/api/download/installer"
    });
  } catch (error) {
    console.error("Error fetching download info:", error.message);
    return res.status(500).json({ error: "Failed to retrieve download info." });
  }
});

app.post("/api/admin/login", rateLimit(10, 60000), (req, res) => {
  try {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid login request" });
    }

    if (parsed.data.email !== adminEmail || parsed.data.password !== adminPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signAdminToken({
      email: parsed.data.email,
      exp: Date.now() + 1000 * 60 * 60 * 8
    });

    return res.json({
      token,
      admin: { email: parsed.data.email }
    });
  } catch (error) {
    console.error("Error during admin login:", error.message);
    return res.status(500).json({ error: "Login failed." });
  }
});

app.get("/api/admin/submissions", requireAdmin, (_req, res) => {
  try {
    const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 50").all();
    const messages = db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50").all();
    res.json({ leads, messages });
  } catch (error) {
    console.error("Error fetching submissions:", error.message);
    return res.status(500).json({ error: "Failed to load submissions." });
  }
});

if (fs.existsSync(clientDistPath)) {
  app.get("/", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err?.message || err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: "Internal server error" });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  db.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  db.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Vyapar website server running on http://localhost:${port}`);
});
