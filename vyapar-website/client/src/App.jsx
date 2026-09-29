import { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, Link, BrowserRouter } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileSpreadsheet,
  Globe,
  Headset,
  Languages,
  LayoutGrid,
  Menu,
  MessageSquareText,
  Monitor,
  Phone,
  Plus,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserRound,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  detailPages,
  footerColumns,
  industries,
  megaMenuGroups,
  resources,
  solutions,
  tools,
  topNav
} from "./data/siteData";
import { getAllReleases, getLatestRelease, getReleaseNotes } from "./services/releaseService";
import { apiFetch, apiUrl } from "./services/api";
import { DOWNLOAD } from "./config/download";
const trustFeatures = [
  { icon: FileSpreadsheet, title: "Sales & Billing" },
  { icon: ShieldCheck, title: "Inventory & Reconciliation" },
  { icon: Headset, title: "GST & Tax Reports" },
  { icon: Store, title: "Backup, Sync & Access Control" }
];

const journeyCards = [
  {
    time: "SETUP",
    title: "Configure your business",
    text: "Create your company profile, product catalog, party records, and financial setup in a structured desktop workflow.",
    footer: "Business Setup"
  },
  {
    time: "DAILY OPERATIONS",
    title: "Create sales and purchase records",
    text: "Generate invoices, estimates, purchase bills, expenses, and payments while keeping transaction history organized.",
    footer: "Sales & Purchases"
  },
  {
    time: "STOCK CONTROL",
    title: "Track stock and warehouse movement",
    text: "Monitor item balances, branch or godown transfers, stock aging, and low-stock alerts across your operation.",
    footer: "Inventory Visibility"
  },
  {
    time: "REPORTING",
    title: "Review compliance and performance",
    text: "Use GST reports, party statements, cash reports, and business summaries to make confident operational decisions.",
    footer: "Insights & Compliance"
  }
];

const moduleCatalog = [
  {
    slug: "sales-invoices-estimates",
    title: "Sales Invoices & Estimates",
    subtitle: "Quote fast, bill faster",
    description: "Create professional GST invoices, quotations, estimates, and proforma invoices within seconds. Generate PDF invoices, share them through WhatsApp or email, print instantly, and track complete payment history.",
    highlights: ["GST Billing", "Quotation", "Estimate", "Proforma", "PDF Invoice", "Payment Tracking"],
    icon: CreditCard,
    cta: "Learn More"
  },
  {
    slug: "purchase-bills-expenses",
    title: "Purchase Bills & Expenses",
    subtitle: "Control every outgoing rupee",
    description: "Manage supplier bills, purchase orders, expenses, and payment history from one place. Inventory and accounting records update automatically every time a purchase is posted.",
    highlights: ["Purchase Entry", "Supplier Bills", "Expense Tracking", "Purchase Returns", "GST Input", "Outstanding Payments"],
    icon: ShoppingCart,
    cta: "Learn More"
  },
  {
    slug: "party-ledger-payment-tracking",
    title: "Party Ledger & Payment Tracking",
    subtitle: "Never lose track of dues",
    description: "Track customer and supplier balances in real time without manual ledger books. View full ledger history, due dates, reminders, and outstanding positions before collections follow-up.",
    highlights: ["Customer Ledger", "Supplier Ledger", "Outstanding", "Payment Reminder", "Credit History", "Statement Export"],
    icon: BookOpen,
    cta: "Learn More"
  },
  {
    slug: "inventory-stock-reconciliation",
    title: "Inventory & Stock Reconciliation",
    subtitle: "See stock movement live",
    description: "Manage unlimited products with real-time inventory visibility across the business. Monitor stock movement, adjustments, barcode-level tracking, and warehouse availability before stockouts happen.",
    highlights: ["Live Inventory", "Stock Adjustment", "Low Stock Alert", "Batch Tracking", "Barcode", "Warehouse"],
    icon: ScanLine,
    cta: "Learn More"
  },
  {
    slug: "branch-godown-transfers",
    title: "Branch / Godown Transfers",
    subtitle: "Move stock without confusion",
    description: "Transfer inventory between branches and godowns without damaging stock accuracy. Every internal transfer is logged with traceable history for audit and warehouse coordination.",
    highlights: ["Multi Branch", "Godown Transfer", "Transfer History", "Warehouse Tracking", "Internal Stock Movement"],
    icon: Truck,
    cta: "Learn More"
  },
  {
    slug: "gst-filing-tax-reports",
    title: "GST Filing & Tax Reports",
    subtitle: "Compliance-ready reporting",
    description: "Generate critical GST reports required for monthly and annual compliance. Prepare GSTR1, GSTR3B, GSTR9, HSN summaries, and tax analysis with cleaner filing inputs.",
    highlights: ["GSTR1", "GSTR3B", "GSTR9", "GST Summary", "HSN Report", "Tax Analysis"],
    icon: FileSpreadsheet,
    cta: "Learn More"
  },
  {
    slug: "cash-bank-journal-entries",
    title: "Cash, Bank & Journal Entries",
    subtitle: "Books that stay balanced",
    description: "Maintain complete accounting records with cash, bank, journal, and contra entries. Auto-calculated balances help you review ledgers and financial statements with fewer reconciliation errors.",
    highlights: ["Cash Book", "Bank Book", "Journal", "Contra", "Ledger", "Trial Balance"],
    icon: Calculator,
    cta: "Learn More"
  },
  {
    slug: "user-management-staff-access",
    title: "User Management & Staff Access",
    subtitle: "Secure access by role",
    description: "Create multiple users with role-based permissions for managers, accountants, and staff. Control module-level access and review activity trails to reduce operational misuse.",
    highlights: ["Roles", "Permissions", "Activity Logs", "Login History", "Employee Access"],
    icon: UserRound,
    cta: "Learn More"
  },
  {
    slug: "barcode-labels-printing",
    title: "Barcode Labels & Printing",
    subtitle: "Label products in minutes",
    description: "Generate barcode labels directly from your product catalog and print in multiple formats. Faster product scanning improves billing speed and warehouse picking accuracy.",
    highlights: ["Barcode Generator", "Label Printing", "Product Scan", "QR Code", "SKU"],
    icon: LayoutGrid,
    cta: "Learn More"
  },
  {
    slug: "import-export-data",
    title: "Import / Export Data",
    subtitle: "Migrate and report with ease",
    description: "Import data from Excel, CSV, SQL backup, or Vyapar backup files without tedious re-entry. Export reports and transactions in multiple formats for audit, analysis, and sharing.",
    highlights: ["Excel Import", "CSV Import", "SQL Backup", "Vyapar Backup", "PDF Export", "Excel Export"],
    icon: Download,
    cta: "Learn More"
  },
  {
    slug: "whatsapp-reminders",
    title: "WhatsApp Reminders",
    subtitle: "Follow up where customers respond",
    description: "Send invoices, quotations, reminders, and account statements straight to customer WhatsApp. Automate communication touchpoints so receivables move faster with fewer manual calls.",
    highlights: ["WhatsApp Invoice", "Payment Reminder", "Auto Message", "Customer Communication"],
    icon: MessageSquareText,
    cta: "Learn More"
  },
  {
    slug: "backup-restore",
    title: "Backup & Restore",
    subtitle: "Protect business continuity",
    description: "Protect sensitive business records with routine local backups and restore support. Recover previous snapshots quickly whenever system failures, accidental deletes, or migration issues occur.",
    highlights: ["Local Backup", "Cloud Backup Ready", "Restore", "Scheduled Backup", "Data Recovery"],
    icon: ShieldCheck,
    cta: "Learn More"
  }
];

const customerReviews = [
  {
    name: "Saurabh Patel",
    title: "Owner, Jewel House",
    quote: "We cut our billing time by more than half and now our staff can focus on customer experience instead of paperwork."
  },
  {
    name: "Mina Rani",
    title: "Retail Store Manager",
    quote: "Inventory and GST reports are easy to understand, and the mobile sync helps me stay updated while travelling."
  },
  {
    name: "Rajeev Sharma",
    title: "Distribution Business",
    quote: "Vyapar made our checkout and stock updates consistent across branches. It feels simple, fast, and dependable."
  }
];

const toolLinks = tools.map((tool) => ({ label: tool.title, href: `/tools/${tool.slug}` }));

function ModuleCardsGrid({ className = "" }) {
  return (
    <div className={`modules-grid ${className}`.trim()}>
      {moduleCatalog.map((module) => {
        const Icon = module.icon;
        return (
          <article key={module.slug} className="module-card">
            <div className="module-card-top">
              <div className="module-icon" aria-hidden="true"><Icon size={24} /></div>
              <span className="module-kicker">{module.subtitle}</span>
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div className="module-highlights" aria-label={`${module.title} highlights`}>
              {module.highlights.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
            <Link className="module-cta" to={`/modules/${module.slug}`}>
              {module.cta} <ArrowRight size={16} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function ModulesPage() {
  return (
    <main className="container detail-page modules-page">
      <SectionHeader
        centered
        badge="Desktop Modules"
        title="12 operational modules for billing, inventory, accounting, and compliance"
        subtitle="Each module is designed to remove repetitive manual work and improve daily business control for stores, distributors, and service teams."
      />
      <ModuleCardsGrid className="modules-grid-page" />
    </main>
  );
}

function ModuleDetailPage() {
  const { slug } = useParams();
  const mod = moduleCatalog.find((entry) => entry.slug === slug);

  if (!mod) return <Navigate to="/modules" replace />;

  const ModuleIcon = mod.icon;
  const relatedModules = moduleCatalog.filter((entry) => entry.slug !== mod.slug).slice(0, 3);
  const screenshots = [
    `${mod.title} dashboard with live summary widgets`,
    `${mod.title} transaction view with smart filters`,
    `${mod.title} printable output and sharing options`
  ];
  const workflow = [
    `Open the ${mod.title} module from the main desktop workspace.`,
    "Capture or update transaction details in a guided, validated form.",
    "Review generated outputs like reports, statements, or printable documents.",
    "Share, export, or follow up actions to close the operational loop quickly."
  ];
  const benefits = [
    `Reduce repetitive data entry by centralizing ${mod.title.toLowerCase()} workflows.`,
    "Improve operational accuracy with structured records and built-in validation.",
    "Speed up decision-making with real-time visibility and searchable history.",
    "Keep teams aligned using consistent process steps and role-based access controls."
  ];
  const faq = [
    {
      q: `Can I use ${mod.title} in daily operations without extra tools?`,
      a: `${mod.title} is integrated with the wider Vyapar workflow, so related billing, stock, and accounting entries stay connected.`
    },
    {
      q: "Will this module support reporting and audits?",
      a: "Yes. Each flow records activity with structured history so teams can verify transactions, track ownership, and export records when needed."
    }
  ];

  return (
    <main className="container detail-page module-detail-page">
      <section className="module-detail-hero">
        <div className="module-detail-hero-copy">
          <div className="pill-badge">Module Overview</div>
          <h1>{mod.title}</h1>
          <p>{mod.description}</p>
          <div className="module-detail-hero-actions">
            <Link className="cta-button" to="/download">Download Vyapar</Link>
            <Link className="secondary-button module-secondary" to="/support">Book Demo</Link>
          </div>
        </div>
        <div className="module-detail-hero-panel" aria-hidden="true">
          <div className="module-hero-icon-wrap"><ModuleIcon size={32} /></div>
          <h2>{mod.subtitle}</h2>
          <div className="module-highlights module-detail-highlights">
            {mod.highlights.map((point) => <span key={point}>{point}</span>)}
          </div>
        </div>
      </section>

      <section className="module-detail-grid">
        <article className="feature-card module-detail-card">
          <h2>Overview</h2>
          <p>{mod.description}</p>
        </article>

        <article className="feature-card module-detail-card">
          <h2>Benefits</h2>
          <ul className="module-list">
            {benefits.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="feature-card module-detail-card module-screenshots-card">
          <h2>Screenshots</h2>
          <div className="module-screenshots-grid">
            {screenshots.map((shot) => (
              <div key={shot} className="module-screenshot">
                <span>{shot}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-card module-detail-card">
          <h2>Feature List</h2>
          <ul className="module-list">
            {mod.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="feature-card module-detail-card">
          <h2>Workflow</h2>
          <ol className="module-workflow-list">
            {workflow.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>

        <article className="feature-card module-detail-card">
          <h2>FAQ</h2>
          <div className="module-faq-list">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </article>

        <article className="feature-card module-detail-card module-related-card">
          <h2>Related Modules</h2>
          <div className="module-related-links">
            {relatedModules.map((item) => (
              <Link key={item.slug} to={`/modules/${item.slug}`}>
                {item.title} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="module-bottom-cta">
        <div className="feature-card module-detail-card">
          <h2>Download CTA</h2>
          <p>Install the desktop app to activate {mod.title.toLowerCase()} for your business workflow.</p>
          <Link className="cta-button" to="/download">Download Now</Link>
        </div>
        <div className="feature-card module-detail-card">
          <h2>Book Demo CTA</h2>
          <p>Get a guided walkthrough and see how this module fits your daily billing, stock, and accounting process.</p>
          <Link className="secondary-button module-secondary" to="/support">Book Demo</Link>
        </div>
      </section>
    </main>
  );
}

function Logo() {
  return (
    <Link className="brand" to="/">
      <div className="brand-mark" />
      <span>Vyapar</span>
    </Link>
  );
}

function SectionHeader({ badge, title, subtitle, centered = false }) {
  return (
    <div className={`section-header ${centered ? "centered" : ""}`}>
      {badge ? <div className="pill-badge">{badge}</div> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="topbar">
        <div className="container nav-row">
          <Logo />
          <nav className={`main-nav ${mobileOpen ? "mobile-open" : ""}`}>
            {topNav.map((item) => (
              item.mega ? (
                <button key={item.label} className={megaOpen ? "nav-link active" : "nav-link"} type="button" onClick={() => setMegaOpen((open) => !open)}>
                  {item.label} <ChevronDown size={16} />
                </button>
              ) : (
                <NavLink key={item.label} className="nav-link" to={item.href}>
                  {item.label}
                </NavLink>
              )
            ))}
            <button className="language-switch" type="button">
              EN <ChevronDown size={16} />
            </button>
          </nav>
          <button className="mobile-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Open navigation menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {megaOpen ? (
          <motion.section
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mega-panel-wrap"
            style={{ zIndex: 21 }}
          >
            <div className="container mega-panel">
              {megaMenuGroups.map((group) => (
                <div key={group.title} className="mega-group">
                  <h4>{group.title}</h4>
                  <div className="mega-items">
                    {group.items.map((item) => (
                      <Link key={item.label} to={item.href}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <button className="mega-close" type="button" onClick={() => setMegaOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Desktop business management software for sales, purchases, inventory, GST, and daily accounting workflows.</p>
        </div>
        <div className="footer-socials">
          {[
            { label: "f", href: "#" },
            { label: "ig", href: "#" },
            { label: "yt", href: "#" },
            { label: "in", href: "#" },
            { label: "x", href: "#" }
          ].map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
          ))}
        </div>
      </div>
      <div className="container footer-grid">
        {footerColumns.map((column) => (
          <div key={column.title} className="footer-card">
            <h4>{column.title}</h4>
            {column.items.map((item) => (
              <Link key={item.label} to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container footer-meta">
        <div className="footer-card compact">
          <h4>COMPANY</h4>
          <Link to="/about">About Us</Link>
          <Link to="/partner">Partner with Vyapar</Link>
          <Link to="/careers">Career</Link>
          <Link to="/desktop">Desktop App</Link>
        </div>
        <div className="footer-card compact">
          <h4>ADDRESS</h4>
          <p>GGR Towers -3 18/2B, Ambilipura, Village, Varthur hobli, Bengaluru, Karnataka 560103</p>
        </div>
        <div className="footer-card compact">
          <h4>PHONE</h4>
          <p>+91-6364-444-752</p>
          <p>+91-9333-911-911</p>
        </div>
        <div className="footer-card compact">
          <h4>EMAIL</h4>
          <p>SUPPORT</p>
          <p>help@vyaparapp.in</p>
        </div>
      </div>
      <div className="container tool-grid">
        <h4>VYAPAR TOOLS</h4>
        <div className="tool-links">
          {toolLinks.map((tool) => (
            <Link key={tool.label} to={tool.href}>
              <BookOpen size={16} />
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function useSiteContent() {
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch("/api/site-content", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load site content.");
        }
        return response.json();
      })
      .then((data) => setSiteContent(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setSiteContent({ faq: [], stats: {}, counts: {} });
        }
      });
    return () => controller.abort();
  }, []);

  return siteContent;
}

function formatInstallerSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  return `${Math.max(1, Math.round(mb))} MB`;
}

function InstallerDownloadCard() {
  const apiDownloadUrl = apiUrl("/api/download/installer");
  const [isAvailable, setIsAvailable] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sizeLabel, setSizeLabel] = useState("");

  useEffect(() => {
    let mounted = true;

    async function probeInstaller() {
      try {
        const response = await apiFetch("/api/download/info", { cache: "no-store" });
        if (!mounted) return;
        if (!response.ok) {
          throw new Error("Installer info unavailable.");
        }
        const data = await response.json();
        if (data.available) {
          setIsAvailable(true);
          setSizeLabel(data.sizeLabel || "");
        } else {
          setIsAvailable(false);
          setSizeLabel("");
        }
      } catch {
        if (!mounted) return;
        setIsAvailable(false);
        setSizeLabel("");
      }
    }

    probeInstaller();

    return () => {
      mounted = false;
    };
  }, []);

  function triggerDownload() {
    if (!isAvailable || isDownloading) {
      return;
    }

    setIsDownloading(true);
    const anchor = document.createElement("a");
    anchor.href = apiDownloadUrl;
    anchor.download = DOWNLOAD.fileName;
    anchor.setAttribute("aria-hidden", "true");
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  }

  return (
    <section className="download-card" aria-label="Desktop app download card">
      <div className="download-card-header">
        <h3>Download Desktop App</h3>
        <span className="download-stable">Latest Stable Version</span>
      </div>

      <div className="download-pill-row">
        <span>{DOWNLOAD.platform}</span>
        <span>Fast Download</span>
        <span>Secure</span>
        <span>Verified Installer</span>
      </div>

      <button
        type="button"
        className={`cta-button download-now-button ${isDownloading ? "loading" : ""}`}
        onClick={triggerDownload}
        disabled={!isAvailable || isDownloading}
        aria-label="Download Vyapar Desktop Application"
      >
        <Download size={18} />
        {isDownloading ? "Downloading..." : "Download Vyapar Now"}
      </button>

      {isAvailable ? (
        <div className="download-meta">
          <p>Windows (.exe)</p>
          <p>Version {DOWNLOAD.version}</p>
          <p>{sizeLabel ? `Size ${sizeLabel}` : "Windows Desktop Application"}</p>
        </div>
      ) : isAvailable === false ? (
        <p className="status error inline">Latest desktop application is not available.</p>
      ) : (
        <div className="download-meta">
          <p>Windows Desktop Application</p>
        </div>
      )}

      <div className="available-for">
        <h4>Available for</h4>
        <div><CheckCircle2 size={16} /> Windows 10</div>
        <div><CheckCircle2 size={16} /> Windows 11</div>
        <div><CheckCircle2 size={16} /> 64-bit</div>
      </div>
    </section>
  );
}

function LeadForm({ source, compact = false }) {
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    email: "",
    businessType: "Retail"
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = useMemo(() => formState.fullName.trim().length > 1 && formState.phone.trim().length >= 10, [formState]);

  async function submitLead(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, source })
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus({ type: "error", message: payload.error || "Unable to submit right now." });
        return;
      }
      setStatus({ type: "success", message: payload.message });
      setFormState((current) => ({ ...current, fullName: "", phone: "", email: "" }));
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className={`trial-form ${compact ? "compact" : ""}`} onSubmit={submitLead}>
        <input aria-label="Your name" value={formState.fullName} onChange={(e) => setFormState((c) => ({ ...c, fullName: e.target.value }))} placeholder="Your name" />
        <input aria-label="Phone number" value={formState.phone} onChange={(e) => setFormState((c) => ({ ...c, phone: e.target.value }))} placeholder="Phone number" />
        {!compact ? <input aria-label="Email address" value={formState.email} onChange={(e) => setFormState((c) => ({ ...c, email: e.target.value }))} placeholder="Email" /> : null}
        <button className="cta-button" disabled={!canSubmit || isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Request"}</button>
      </form>
      {status.message ? <div className={`status ${status.type}`}>{status.message}</div> : null}
    </>
  );
}

function HomePage() {
  const siteContent = useSiteContent();
  const stats = siteContent?.stats ?? {};
  const faq = siteContent?.faq ?? [];
  const [faqOpen, setFaqOpen] = useState(0);

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <div className="pill-badge">{stats.heroTrust || "Desktop-first business software"}</div>
          <h1>Sales, purchases, stock, and GST in one business workflow.</h1>
          <p>Vyapar helps small and growing businesses manage invoicing, vendor bills, inventory, taxes, reports, and company data from a single desktop-first platform.</p>
          <InstallerDownloadCard />
          <div className="hero-metrics">
            <div className="metric-pill"><CheckCircle2 size={18} /> Sales, purchase, stock and accounting</div>
            <div className="metric-pill"><Languages size={18} /> GST-ready reporting</div>
          </div>
          <div className="rating-row">
            <div className="rating-card">4.8 Google Play</div>
            <div className="rating-card">4.9 Source Forge</div>
            <div className="rating-card">4.4 G2</div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="device-cloud">
            <div className="desktop-frame"><div className="desktop-chart" /></div>
            <div className="invoice-card floating-card">INVOICE</div>
            <div className="phone-card">Invoice</div>
            <div className="payment-card floating-card">₹3,568.50</div>
            <div className="upi-card floating-card">UPI Collect Payments</div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          {trustFeatures.map((item) => (
            <div key={item.title} className="trust-item">
              <div className="icon-circle"><item.icon size={28} /></div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container two-column story-section">
        <div>
          <SectionHeader badge="Built for daily operations" title="A practical desktop workflow for billing, stock, and business control." />
          <p className="section-copy">From sales counters to purchase records and compliance reporting, the desktop app is designed to keep each business operation connected without switching systems.</p>
          <div className="stats-grid">
            <div className="stat-card"><strong>{stats.msmesEmpowered || "Sales"}</strong><span>Invoicing & estimates</span></div>
            <div className="stat-card"><strong>{stats.activeStates || "Purchase"}</strong><span>Vendor bills & expenses</span></div>
            <div className="stat-card"><strong>{stats.languageCount || "Stock"}</strong><span>Inventory control</span></div>
            <div className="stat-card"><strong>{stats.dailyBills || "GST"}</strong><span>Reports & filing</span></div>
          </div>
        </div>
        <div className="map-illustration">
          <div className="map-shape" />
          <div className="map-badge badge-1">Vyapar Network</div>
          <div className="map-badge badge-2">Inventory</div>
          <div className="map-badge badge-3">Store to Store</div>
        </div>
      </section>

      <section className="container journey-section">
        <SectionHeader centered title="A complete business operating rhythm" subtitle="The desktop workflow supports daily operations from setup to reporting so owners, staff, and managers can stay aligned." />
        <div className="journey-grid">
          {journeyCards.map((card, index) => (
            <div key={card.title} className="journey-card">
              <div className="journey-index">{String(index + 1).padStart(2, "0")}</div>
              <span className="journey-time">{card.time}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <small>{card.footer}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-band modules-showcase">
        <div className="container">
          <SectionHeader
            centered
            badge="Core Modules"
            title="Every module solves a real business bottleneck"
            subtitle="From invoicing and purchases to ledgers, GST, and backups, each module is tailored for practical daily execution with faster outcomes."
          />
          <ModuleCardsGrid />
        </div>
      </section>

      <section className="container mobile-app-section">
        <div className="mobile-copy">
          <SectionHeader title="The app is designed for practical daily operations" />
          <p className="section-copy">The desktop workflow gives business owners a central place to manage people, products, balances, compliance, and data safety without fragmented tools.</p>
          <div className="benefit-list">
            <div><CheckCircle2 size={18} /> Structured sales, purchase, and stock flow</div>
            <div><CheckCircle2 size={18} /> Team access and user-level management</div>
            <div><CheckCircle2 size={18} /> Secure backup and restore routines</div>
          </div>
          <LeadForm source="Bottom CTA" />
        </div>
        <div className="mobile-visual">
          <div className="phone-stage">
            <div className="app-phone"><div className="app-score">4.8 ★</div></div>
            <div className="store-buttons">
              <button type="button" disabled aria-label="Google Play - Coming Soon">Google Play (Coming Soon)</button>
              <button type="button" disabled aria-label="App Store - Coming Soon">App Store (Coming Soon)</button>
            </div>
          </div>
        </div>
      </section>

      <section className="industry-grid-section">
        <div className="container">
          <SectionHeader centered title="Built for the way businesses actually operate" subtitle="The app is suited to stores, distributors, service providers, and manufacturers that need a single operating workflow." />
          <div className="industry-grid">
            {industries.slice(0, 8).map((industry, index) => {
              const industryIcons = [Store, ShoppingCart, Sparkles, ShoppingBag, Phone, MessageSquareText, ShieldCheck, Plus];
              const Icon = industryIcons[index % industryIcons.length] ?? Store;
              return (
                <div key={industry.slug} className="industry-card">
                  <Icon size={30} />
                  <h3>{industry.title}</h3>
                  <p>{industry.summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container review-section">
        <SectionHeader centered badge="Customer Stories" title="Loved by business owners across India" subtitle="Real feedback from stores and service businesses that moved to smarter billing and stock management." />
        <div className="review-grid">
          <div className="review-highlight">
            <strong>4.8/5</strong>
            <small>Average rating</small>
            <p>Trusted by shops, clinics, restaurants, and growing businesses that need dependable billing workflows.</p>
          </div>
          {customerReviews.map((review) => (
            <article key={review.name} className="quote-card">
              <div className="quote-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p>“{review.quote}”</p>
              <strong>{review.name}</strong>
              <small>{review.title}</small>
            </article>
          ))}
          <div className="quote-card accent">
            <div className="pill-badge small">Growth Story</div>
            <h3>50% faster invoicing</h3>
            <p>Teams save time with cleaner billing, faster stock updates, and real-time visibility for everyday decisions.</p>
            <Link to="/pricing">See pricing <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="container faq-section">
        <SectionHeader centered title="Frequently Asked Questions" subtitle="Find quick answers to common questions regarding Vyapar’s billing software, GST compliance, and small business billing solutions." />
        <div className="faq-list">
          {faq.map((item, index) => (
            <button key={item.question} className={`faq-item ${faqOpen === index ? "open" : ""}`} type="button" onClick={() => setFaqOpen(index)} aria-expanded={faqOpen === index}>
              <div className="faq-title">
                <span>{item.question}</span>
                <Plus size={18} />
              </div>
              {faqOpen === index ? <p>{item.answer}</p> : null}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function DownloadPage() {
  const [release, setRelease] = useState(null);
  const [allReleases, setAllReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadState, setDownloadState] = useState("loading");
  const [error, setError] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadReleases() {
      try {
        const [latest, all] = await Promise.all([getLatestRelease(), getAllReleases()]);
        if (!mounted) return;
        setRelease(latest);
        setAllReleases(Array.isArray(all) ? all : []);
        setSelectedVersion(latest?.version || null);
        setDownloadState(latest?.installer?.browser_download_url ? "ready" : "error");
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Unable to load the latest installer.");
        setDownloadState("error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadReleases();

    return () => {
      mounted = false;
    };
  }, []);

  function handleDownload() {
    const installerUrl = release?.installer?.browser_download_url;
    if (installerUrl) {
      setDownloadState("downloading");
      const link = document.createElement("a");
      link.href = installerUrl;
      link.download = release.installer.name || "Vyapar-Setup.exe";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setDownloadState("downloading");
      const link = document.createElement("a");
      link.href = apiUrl("/api/download/installer");
      link.download = DOWNLOAD.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      setDownloadState("ready");
    }, 3000);
  }

  async function handleViewReleaseNotes(version) {
    const targetVersion = version || release?.version;
    if (!targetVersion) return;

    try {
      const notes = await getReleaseNotes(targetVersion);
      window.open(notes?.html_url || `https://github.com/AkashSuman5002/vyapar-website/releases/tag/${encodeURIComponent(version || release?.tag_name || targetVersion)}`, "_blank", "noopener,noreferrer");
    } catch {
      window.open(`https://github.com/AkashSuman5002/vyapar-website/releases`, "_blank", "noopener,noreferrer");
    }
  }

  const latestDisplayVersion = release?.version || "N/A";
  const latestDate = release?.published_at ? new Date(release.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A";
  const installer = release?.installer;

  return (
    <main className="container detail-page download-page">
      <section className="download-hero feature-card">
        <div className="download-hero-copy">
          <div className="pill-badge">Windows Installer</div>
          <h1>Download the latest Vyapar desktop app.</h1>
          <p>Built for Windows 10 and 11, with direct GitHub release tracking and automatic version updates.</p>
        </div>
        <div className="download-actions">
          <button className="cta-button download-button" type="button" onClick={handleDownload} disabled={loading || downloadState === "downloading"}>
            {loading ? "Loading..." : downloadState === "downloading" ? "Downloading..." : downloadState === "complete" ? "Download Complete" : "Download for Windows"}
          </button>
          <button className="secondary-button" type="button" onClick={() => handleViewReleaseNotes(release?.version)} disabled={!release}>View Release Notes</button>
        </div>
      </section>

      {error ? (
        <section className="status error download-error">{error}</section>
      ) : null}

      <section className="download-meta-grid">
        <div className="feature-card">
          <h3>Latest Version</h3>
          <p className="download-stat">{latestDisplayVersion}</p>
        </div>
        <div className="feature-card">
          <h3>Release Date</h3>
          <p className="download-stat">{latestDate}</p>
        </div>
        <div className="feature-card">
          <h3>File Size</h3>
          <p className="download-stat">{installer?.file_size_label || "N/A"}</p>
        </div>
        <div className="feature-card">
          <h3>Windows Compatibility</h3>
          <p className="download-stat">Windows 10 / 11, 64-bit</p>
        </div>
      </section>

      <section className="download-detail-grid">
        <div className="feature-card">
          <h3>Release Notes</h3>
          <div className="release-notes-box">
            <p>{release?.body ? release.body.replace(/\n+/g, "\n\n").slice(0, 1200) : "Release notes are not available yet."}</p>
          </div>
        </div>

        <div className="feature-card">
          <h3>Download Information</h3>
          <ul className="download-info-list">
            <li><span>Version</span><strong>{release?.version || "N/A"}</strong></li>
            <li><span>File</span><strong>{installer?.name || "N/A"}</strong></li>
            <li><span>Download Count</span><strong>{installer?.download_count ?? "N/A"}</strong></li>
            <li><span>SHA256</span><strong>{release?.checksum || "Not available"}</strong></li>
            <li><span>Release URL</span><a href={release?.html_url || "https://github.com/AkashSuman5002/vyapar-website/releases"} target="_blank" rel="noreferrer">Open GitHub release</a></li>
          </ul>
        </div>
      </section>

      <section className="feature-card system-requirements">
        <h3>System Requirements</h3>
        <div className="requirements-grid">
          <div><Monitor size={18} /><span>Windows 10 / 11</span></div>
          <div><CheckCircle2 size={18} /><span>64-bit</span></div>
          <div><ShieldCheck size={18} /><span>Minimum RAM: 4 GB</span></div>
          <div><Download size={18} /><span>Disk Space: 500 MB free</span></div>
          <div><Globe size={18} /><span>Required Runtime: Microsoft Visual C++ Redistributable</span></div>
        </div>
      </section>

      <section className="feature-card install-section">
        <h3>Installation Instructions</h3>
        <ol className="install-list">
          <li>Download the installer.</li>
          <li>Run Setup.exe.</li>
          <li>Complete installation.</li>
          <li>Launch the application.</li>
        </ol>
      </section>

      <section className="feature-card older-versions-section">
        <h3>Older Versions</h3>
        <div className="older-versions-list">
          {allReleases.length ? allReleases.slice(0, 8).map((item) => (
            <div key={item.version} className="older-version-item">
              <div>
                <strong>{item.version}</strong>
                <small>{item.published_at ? new Date(item.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</small>
              </div>
              <div className="older-version-actions">
                <a href={item.installer?.browser_download_url || "#"} target="_blank" rel="noreferrer">Download</a>
                <button type="button" onClick={() => handleViewReleaseNotes(item.version)}>Release Notes</button>
              </div>
            </div>
          )) : <p>No previous releases are available right now.</p>}
        </div>
      </section>
    </main>
  );
}

function DetailPage({ title, badge, description, sections }) {
  return (
    <main className="container detail-page">
      <section className="detail-hero">
        <SectionHeader badge={badge} title={title} subtitle={description} centered />
      </section>
      <section className="detail-grid">
        {sections.map((section) => (
          <article key={section.title} className="feature-card">
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <section className="detail-cta">
        <div className="feature-card">
          <h3>Start Your Free Trial</h3>
          <p>Share your contact details and our team can help you with the right product fit for your business.</p>
          <LeadForm source={title} />
        </div>
      </section>
    </main>
  );
}

function CollectionPage({ title, subtitle, items, basePath }) {
  return (
    <main className="container detail-page">
      <SectionHeader centered title={title} subtitle={subtitle} />
      <section className="detail-grid">
        {items.map((item) => (
          <article key={item.slug} className="feature-card card-link">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <Link to={`${basePath}/${item.slug}`}>Explore <ArrowRight size={16} /></Link>
          </article>
        ))}
      </section>
    </main>
  );
}

function ToolPage() {
  const { slug } = useParams();
  const tool = tools.find((item) => item.slug === slug);
  const [values, setValues] = useState({
    amount: "1000",
    rate: "18",
    party: "",
    item: "",
    quantity: "1",
    price: "1000",
    note: ""
  });
  if (!tool) return <Navigate to="/" replace />;

  const amount = Number(values.amount || 0);
  const rate = Number(values.rate || 0);
  const gst = Number.isFinite(amount * rate / 100) ? amount * rate / 100 : 0;
  const total = Number(values.quantity || 0) * Number(values.price || 0);

  return (
    <main className="container detail-page">
      <SectionHeader centered badge="Vyapar Tool" title={tool.title} subtitle={tool.summary} />
      <section className="tool-page-grid">
        <form className="contact-form">
          {tool.type === "calculator" ? (
            <>
              <input value={values.amount} onChange={(e) => setValues((c) => ({ ...c, amount: e.target.value }))} placeholder="Base amount" />
              <input value={values.rate} onChange={(e) => setValues((c) => ({ ...c, rate: e.target.value }))} placeholder="GST rate %" />
            </>
          ) : (
            <>
              <input value={values.party} onChange={(e) => setValues((c) => ({ ...c, party: e.target.value }))} placeholder="Customer / Vendor name" />
              <input value={values.item} onChange={(e) => setValues((c) => ({ ...c, item: e.target.value }))} placeholder="Item / Service" />
              <input value={values.quantity} onChange={(e) => setValues((c) => ({ ...c, quantity: e.target.value }))} placeholder="Quantity" />
              <input value={values.price} onChange={(e) => setValues((c) => ({ ...c, price: e.target.value }))} placeholder="Unit price" />
              <textarea value={values.note} onChange={(e) => setValues((c) => ({ ...c, note: e.target.value }))} placeholder="Notes" rows="4" />
            </>
          )}
        </form>
        <div className="feature-card tool-preview">
          <h3>{tool.title} Preview</h3>
          {tool.type === "calculator" ? (
            <div className="preview-stats">
              <div><span>Base Amount</span><strong>₹{amount.toFixed(2)}</strong></div>
              <div><span>GST ({rate}%)</span><strong>₹{gst.toFixed(2)}</strong></div>
              <div><span>Total Amount</span><strong>₹{(amount + gst).toFixed(2)}</strong></div>
            </div>
          ) : (
            <div className="document-preview">
              <h4>{values.party || "Party Name"}</h4>
              <p>{values.item || "Item / Service"}</p>
              <p>Quantity: {values.quantity || "0"}</p>
              <p>Unit Price: ₹{Number(values.price || 0).toFixed(2)}</p>
              <p>Total: ₹{total.toFixed(2)}</p>
              <small>{values.note || "Your notes will appear here."}</small>
              <button className="cta-button" type="button" onClick={() => window.print()}>Print Preview</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SupportPage() {
  return (
    <main className="container detail-page">
      <SectionHeader centered badge="Support" title="Need help with setup or business operations?" subtitle="Reach out for onboarding guidance, product questions, troubleshooting, or help with business workflows." />
      <section className="tool-page-grid">
        <div className="feature-card">
          <h3>Contact support</h3>
          <div className="benefit-list">
            <div><CheckCircle2 size={18} /> Sales and billing setup</div>
            <div><CheckCircle2 size={18} /> Inventory and stock workflows</div>
            <div><CheckCircle2 size={18} /> GST reports and compliance guidance</div>
            <div><CheckCircle2 size={18} /> Backup, restore, and access help</div>
          </div>
          <div className="aside-card" style={{ marginTop: "20px" }}>
            <h4>Direct contact</h4>
            <p>Phone: +91-6364-444-752</p>
            <p>Email: help@vyaparapp.in</p>
            <p>Hours: Monday to Saturday, 9:00 AM to 7:00 PM</p>
          </div>
        </div>
        <div className="feature-card">
          <h3>Send a message</h3>
          <LeadForm source="Support page" />
        </div>
      </section>
    </main>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    try {
      const response = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus({ type: "error", message: payload.error || "Invalid credentials." });
        return;
      }
      localStorage.setItem("vyaparAdminToken", payload.token);
      navigate("/admin");
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <main className="container detail-page">
      <SectionHeader centered badge="Secure Access" title="Admin Login" />
      <section className="tool-page-grid">
        <form className="contact-form" onSubmit={submit}>
          <input aria-label="Email address" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} placeholder="Email" />
          <input aria-label="Password" type="password" value={form.password} onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))} placeholder="Password" />
          <button className="cta-button" type="submit">Login to Admin</button>
          {status.message ? <div className={`status ${status.type}`}>{status.message}</div> : null}
        </form>
      </section>
    </main>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ leads: [], messages: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("vyaparAdminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const controller = new AbortController();
    apiFetch("/api/admin/submissions", {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Unable to load admin data.");
        }
        return payload;
      })
      .then(setData)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        localStorage.removeItem("vyaparAdminToken");
      });
    return () => controller.abort();
  }, [navigate]);

  return (
    <main className="container detail-page">
      <SectionHeader centered badge="Admin Dashboard" title="Website Submissions" subtitle="Review lead capture requests and contact enquiries sent from the public website." />
      {error ? <div className="status error">{error}</div> : null}
      <section className="admin-grid">
        <div className="feature-card">
          <div className="admin-card-header">
            <h3>Leads</h3>
            <button className="plain-link" type="button" onClick={() => { localStorage.removeItem("vyaparAdminToken"); navigate("/login"); }}>Logout</button>
          </div>
          <div className="admin-list">
            {data.leads.map((lead) => (
              <div key={lead.id} className="admin-item">
                <strong>{lead.full_name}</strong>
                <span>{lead.phone}</span>
                <span>{lead.email || "No email"}</span>
                <small>{lead.source}</small>
              </div>
            ))}
            {!data.leads.length ? <p>No leads yet.</p> : null}
          </div>
        </div>
        <div className="feature-card">
          <h3>Contact Messages</h3>
          <div className="admin-list">
            {data.messages.map((message) => (
              <div key={message.id} className="admin-item">
                <strong>{message.full_name}</strong>
                <span>{message.email}</span>
                <span>{message.subject}</span>
                <small>{message.message}</small>
              </div>
            ))}
            {!data.messages.length ? <p>No messages yet.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitContact(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus({ type: "error", message: payload.error || "Unable to send your message right now." });
        return;
      }
      setStatus({ type: "success", message: payload.message || "Thank you! We will get back to you shortly." });
      setFormState({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container detail-page">
      <SectionHeader centered badge="Get in Touch" title="Contact Us" subtitle="Have a question or need assistance? Send us a message and our team will respond promptly." />
      <section className="tool-page-grid">
        <div className="feature-card">
          <h3>Contact information</h3>
          <div className="benefit-list">
            <div><CheckCircle2 size={18} /> Sales and billing inquiries</div>
            <div><CheckCircle2 size={18} /> Product support and troubleshooting</div>
            <div><CheckCircle2 size={18} /> Partnership and business development</div>
            <div><CheckCircle2 size={18} /> Feedback and feature requests</div>
          </div>
          <div className="aside-card" style={{ marginTop: "20px" }}>
            <h4>Reach us directly</h4>
            <p>Phone: +91-6364-444-752</p>
            <p>Email: help@vyaparapp.in</p>
            <p>Hours: Monday to Saturday, 9:00 AM to 7:00 PM</p>
          </div>
        </div>
        <div className="feature-card">
          <h3>Send us a message</h3>
          <form className="trial-form" onSubmit={submitContact}>
            <input aria-label="Your name" value={formState.fullName} onChange={(e) => setFormState((c) => ({ ...c, fullName: e.target.value }))} placeholder="Your name" required />
            <input aria-label="Email address" value={formState.email} onChange={(e) => setFormState((c) => ({ ...c, email: e.target.value }))} placeholder="Email" required />
            <input aria-label="Phone number" value={formState.phone} onChange={(e) => setFormState((c) => ({ ...c, phone: e.target.value }))} placeholder="Phone number" />
            <input aria-label="Subject" value={formState.subject} onChange={(e) => setFormState((c) => ({ ...c, subject: e.target.value }))} placeholder="Subject" required />
            <textarea aria-label="Your message" value={formState.message} onChange={(e) => setFormState((c) => ({ ...c, message: e.target.value }))} placeholder="Your message" rows="5" required />
            <button className="cta-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Send Message"}</button>
          </form>
          {status.message ? <div className={`status ${status.type}`}>{status.message}</div> : null}
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="container detail-page" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div className="pill-badge">404</div>
      <h1>Page Not Found</h1>
      <p style={{ margin: "16px 0 24px", color: "var(--muted, #666)" }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link className="cta-button" to="/">Back to Home</Link>
    </main>
  );
}

function DynamicDetailPage({ collection, fallback }) {
  const { slug } = useParams();
  const item = collection.find((entry) => entry.slug === slug);
  if (!item) return <Navigate to={fallback} replace />;
  return (
    <DetailPage
      badge="Detailed Overview"
      title={item.title}
      description={item.summary}
      sections={[
        { title: "Operational Fit", body: `${item.title} workflows in Vyapar are designed to reduce manual work while keeping billing and records organized.` },
        { title: "Core Benefits", body: "Use practical billing, stock, payment, and reporting flows to improve day-to-day execution." },
        { title: "Ideal For", body: "Best suited for Indian SMEs looking for faster operations with less process overhead." }
      ]}
    />
  );
}

function AppShell() {
  return (
    <div className="page-shell">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<DetailPage {...detailPages.pricing} />} />
        <Route path="/about" element={<DetailPage {...detailPages.about} />} />
        <Route path="/desktop" element={<DetailPage {...detailPages.desktop} />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/careers" element={<DetailPage {...detailPages.careers} />} />
        <Route path="/partner" element={<DetailPage {...detailPages.partner} />} />
        <Route path="/mobile-app" element={<DetailPage {...detailPages.mobileApp} />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/solutions" element={<CollectionPage title="Business Management Solutions" subtitle="Explore billing, accounting, inventory, invoicing, and compliance workflows for Indian SMEs." items={solutions} basePath="/solutions" />} />
        <Route path="/industries" element={<CollectionPage title="Industry Solutions" subtitle="Find the right business flow for your store, branch, product category, or service vertical." items={industries} basePath="/industries" />} />
        <Route path="/resources" element={<CollectionPage title="Resources" subtitle="Browse educational and customer-success oriented content formats." items={resources} basePath="/resources" />} />
        <Route path="/tools" element={<CollectionPage title="Vyapar Tools" subtitle="Use practical calculators and lightweight business document generators directly on the website." items={tools} basePath="/tools" />} />
        <Route path="/modules/:slug" element={<ModuleDetailPage />} />
        <Route path="/solutions/:slug" element={<DynamicDetailPage collection={solutions} fallback="/solutions" />} />
        <Route path="/industries/:slug" element={<DynamicDetailPage collection={industries} fallback="/industries" />} />
        <Route path="/resources/:slug" element={<DynamicDetailPage collection={resources} fallback="/resources" />} />
        <Route path="/resources/products/:slug" element={<DynamicDetailPage collection={[
          { slug: "vyapar-taxone", title: "Vyapar TaxOne", summary: "A tax-focused product line for compliance and return workflows." },
          { slug: "vyapar-flyy", title: "Vyapar Flyy", summary: "Growth-oriented product experience for business outreach and scale." },
          { slug: "vyapar-table", title: "Vyapar Table", summary: "Operational tooling for staff-facing and table-based workflows." },
          { slug: "neodove", title: "NeoDove", summary: "A telecalling CRM-style solution for lead and outreach operations." }
        ]} fallback="/resources" />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
