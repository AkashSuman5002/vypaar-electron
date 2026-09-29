export const topNav = [
  { label: "Solutions", href: "/solutions", mega: true },
  { label: "Modules", href: "/modules" },
  { label: "Pricing", href: "/pricing" },
  { label: "Desktop App", href: "/desktop" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Login", href: "/login" }
];

export const megaMenuGroups = [
  {
    title: "Core Modules",
    items: [
      { label: "Sales & Billing", href: "/solutions/sales-billing" },
      { label: "Purchase & Expense", href: "/solutions/purchases-expenses" },
      { label: "Inventory & Stock", href: "/solutions/inventory-stock" },
      { label: "Accounting & Cash", href: "/solutions/accounting-cash" },
      { label: "Reports & GST", href: "/solutions/reports-gst" },
      { label: "Utilities & Backup", href: "/solutions/utilities-backup" }
    ]
  },
  {
    title: "Business Types",
    items: [
      { label: "Retail Stores", href: "/industries/retail" },
      { label: "Wholesale & Distribution", href: "/industries/wholesale-distribution" },
      { label: "Pharmacy", href: "/industries/pharmacy" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Restaurants", href: "/industries/restaurant" },
      { label: "Services", href: "/industries/services" }
    ]
  },
  {
    title: "Operational Tools",
    items: [
      { label: "Party Ledger", href: "/resources/party-ledger" },
      { label: "GST Reports", href: "/resources/gst-reports" },
      { label: "User Management", href: "/resources/user-management" },
      { label: "Barcode Labels", href: "/resources/barcode-labels" },
      { label: "Backup & Restore", href: "/resources/backup-restore" }
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "Setup Guide", href: "/resources/guides" },
      { label: "Use Cases", href: "/resources/use-cases" },
      { label: "GST Reports", href: "/resources/gst-reports" },
      { label: "Party Ledger", href: "/resources/party-ledger" },
      { label: "Backup & Restore", href: "/resources/backup-restore" }
    ]
  }
];

export const detailPages = {
  pricing: {
    title: "Simple Pricing for Growing Businesses",
    badge: "Pricing",
    description: "Choose a plan based on your billing volume, branches, and collaboration needs. Start free and upgrade when your operations expand.",
    sections: [
      { title: "Free", body: "Ideal for first-time businesses starting GST billing, stock tracking, and day-to-day invoice creation." },
      { title: "Silver", body: "Adds multi-device sync, role-based access, and richer inventory and collection workflows." },
      { title: "Gold", body: "Best for fast-growing retailers and distributors needing deeper reports, teams, and support." }
    ]
  },
  about: {
    title: "Built for Indian SMEs That Need Speed and Simplicity",
    badge: "About Vyapar",
    description: "Vyapar helps small businesses bill faster, stay GST ready, and manage stock, payments, and customer records without operational complexity.",
    sections: [
      { title: "Our Mission", body: "Make professional billing and business management accessible to every Indian SME." },
      { title: "What We Focus On", body: "Practical software, offline reliability, multi-device workflows, and local-language friendliness." },
      { title: "Why Teams Choose Vyapar", body: "The platform covers billing, inventory, tax, collections, and business visibility in one workflow." }
    ]
  },
  desktop: {
    title: "Desktop Billing for High-Speed Counter Operations",
    badge: "Desktop App",
    description: "Run billing on larger screens with quick item lookup, invoice formats, barcode support, and branch-ready reporting.",
    sections: [
      { title: "Faster Billing", body: "Large-screen productivity for operators handling many invoices each day." },
      { title: "Peripheral Support", body: "Works well for barcode scanners, thermal printers, and counter billing setups." },
      { title: "Sync with Mobile", body: "Keep mobile and desktop activity aligned through instant cloud sync." }
    ]
  },
  careers: {
    title: "Careers at Vyapar",
    badge: "Join Us",
    description: "We build tools that help millions of business owners save time and reduce manual work. Explore team openings and growth paths.",
    sections: [
      { title: "Engineering", body: "Work across product, performance, mobile, web, and small-business workflow systems." },
      { title: "Design", body: "Shape tools that feel simple for first-time business software users." },
      { title: "Customer Growth", body: "Help business owners discover, adopt, and succeed with the product." }
    ]
  },
  partner: {
    title: "Partner with Vyapar",
    badge: "Partner Program",
    description: "Collaborate as a reseller, implementation partner, trainer, or growth collaborator to help more businesses modernize billing.",
    sections: [
      { title: "Reseller Opportunities", body: "Offer Vyapar to your local market and support onboarding for business owners." },
      { title: "Training & Enablement", body: "Access demo material, solution positioning, and practical rollout guidance." },
      { title: "Growth Model", body: "Build recurring value by combining software with advisory and implementation services." }
    ]
  },
  mobileApp: {
    title: "Run Your Business on Mobile",
    badge: "Mobile App",
    description: "Create invoices, check collections, manage customers, and monitor stock from anywhere using the Vyapar mobile app.",
    sections: [
      { title: "Billing on the Move", body: "Perfect for field sales, shop owners, and business operators who travel frequently." },
      { title: "Cloud Sync", body: "Mobile activity reflects on desktop in near real time through synced workflows." },
      { title: "Android & iOS", body: "Support your team with a consistent experience across modern mobile devices." }
    ]
  },
  login: {
    title: "Admin Login",
    badge: "Secure Access",
    description: "Use the website admin login to review lead submissions and contact enquiries captured from the public site.",
    sections: [
      { title: "Protected Area", body: "The admin dashboard is only available with valid credentials." },
      { title: "Lead Visibility", body: "Review the latest website leads and contact requests in one place." },
      { title: "Operational Use", body: "Useful for marketing, sales, and support follow-up workflows." }
    ]
  }
};

export const solutions = [
  {
    slug: "sales-billing",
    title: "Sales & Billing",
    summary: "Create invoices, estimates, orders, challans, returns, and payment tracking from a single sales workflow."
  },
  {
    slug: "purchases-expenses",
    title: "Purchase & Expense",
    summary: "Record vendor bills, expenses, payment outflows, and supplier-ledger movements with less manual effort."
  },
  {
    slug: "inventory-stock",
    title: "Inventory & Stock",
    summary: "Monitor stock levels, item movement, godown transfers, stock reconciliation, and low-stock alerts."
  },
  {
    slug: "accounting-cash",
    title: "Accounting & Cash",
    summary: "Manage cash, bank accounts, journal entries, party balances, and business-level financial visibility."
  },
  {
    slug: "reports-gst",
    title: "Reports & GST",
    summary: "Generate sales, purchase, stock, GST, and tax reports for faster compliance and daily decisions."
  },
  {
    slug: "utilities-backup",
    title: "Utilities & Backup",
    summary: "Import or export records, print barcode labels, manage users, and back up or restore business data securely."
  }
];

export const industries = [
  "retail",
  "wholesale-distribution",
  "grocery",
  "pharmacy",
  "manufacturing",
  "restaurant",
  "services",
  "jewellery"
].map((slug) => ({
  slug,
  title: slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
  summary: `This workflow helps ${slug.replace(/-/g, " ")} businesses run bills, stock, payments, and reports without scattered processes.`
}));

export const resources = [
  {
    slug: "guides",
    title: "Setup Guides",
    summary: "Operational walkthroughs for business setup, product entries, taxes, reports, and daily workflows."
  },
  {
    slug: "use-cases",
    title: "Business Use Cases",
    summary: "Examples of how stores, distributors, manufacturers, and service businesses manage sales and stock."
  },
  {
    slug: "gst-reports",
    title: "GST Reports",
    summary: "Track tax data, filing inputs, and reporting snapshots across sales, purchases, and stock."
  },
  {
    slug: "party-ledger",
    title: "Party Ledger",
    summary: "Keep customer and supplier balances, payment activity, and outstanding status in one place."
  },
  {
    slug: "backup-restore",
    title: "Backup & Restore",
    summary: "Secure local and cloud-style backup flows for protecting operational data across business teams."
  }
];

export const tools = [
  {
    slug: "gst-calculator",
    title: "GST Calculator",
    type: "calculator",
    summary: "Calculate GST-inclusive and GST-exclusive amounts instantly."
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    type: "invoice",
    summary: "Create a simple professional invoice and print the preview."
  },
  {
    slug: "quotation-maker",
    title: "Quotation Maker",
    type: "quotation",
    summary: "Prepare a customer quotation with amount totals and notes."
  },
  {
    slug: "proforma-invoice-generator",
    title: "Proforma Invoice Generator",
    type: "invoice",
    summary: "Generate a pre-sale invoice format for customer confirmation."
  },
  {
    slug: "purchase-order-generator",
    title: "Purchase Order Generator",
    type: "quotation",
    summary: "Build a vendor-facing purchase order with items and totals."
  },
  {
    slug: "receipt-maker",
    title: "Receipt Maker",
    type: "receipt",
    summary: "Create a customer payment receipt with amount and payment mode."
  }
];

export const footerColumns = [
  {
    title: "OUR PRODUCTS",
    items: [
      { label: "Vyapar App", href: "/mobile-app" },
      { label: "Vyapar TaxOne", href: "/resources/products/vyapar-taxone" },
      { label: "Vyapar Table", href: "/resources/products/vyapar-table" },
      { label: "Vyapar Flyy", href: "/resources/products/vyapar-flyy" },
      { label: "NeoDove (Telecalling CRM)", href: "/resources/products/neodove" },
      { label: "Vyapar Thermal Printer", href: "/desktop" }
    ]
  },
  {
    title: "VYAPAR SOFTWARES",
    items: solutions.map((item) => ({ label: item.title, href: `/solutions/${item.slug}` }))
  },
  {
    title: "INDUSTRY SOLUTIONS",
    items: industries.slice(0, 7).map((item) => ({ label: item.title, href: `/industries/${item.slug}` }))
  },
  {
    title: "RESOURCES",
    items: resources.map((item) => ({ label: item.title, href: `/resources/${item.slug}` }))
  }
];
