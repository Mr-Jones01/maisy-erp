# Maisy ERP — Feature Log
**Built by:** Daniel Jones  
**Started:** ~February 2026  
**Log started:** March 25, 2026  
**Current version:** 6.10

This document tracks every module, feature, and capability built into the Maisy ERP system. Used for professional compensation documentation.

---

## PLATFORM & INFRASTRUCTURE

| Item | Description | Est. Hours |
|---|---|---|
| React 19 + Vite stack | Full SPA frontend, production build pipeline | 8 |
| IndexedDB persistence | Auto-save with zero data loss, migration from localStorage | 6 |
| Seed data system | fallback seed-data.json for fresh installs | 3 |
| Backup & Restore | Full JSON export/import with snapshot metadata | 4 |
| Role-based access control | 5 roles: Admin, Owner, Office, Shop, ShopQueue | 5 |
| Sidebar navigation | Collapsible, 50+ modules, badge alerts, keyboard shortcut | 5 |
| Auto-save indicator | Live save status in topbar | 2 |
| Version-based auto-logout | Forces re-login on code updates | 2 |
| AI Panel | Integrated Claude AI assistant sidebar | 6 |
| Vercel deployment | Production deployment pipeline | 3 |
| GitHub version control | Full git history, private repo | 2 |
| **Infrastructure subtotal** | | **~46 hrs** |

---

## MODULES

### 1. Dashboard
- KPI stat cards: revenue, orders, on-time delivery, low stock alerts
- Recent orders table
- Overdue invoices alert
- Low stock alert
- Quick links
- **Est. hours: 8**

### 2. Orders
- Full order management: create, edit, delete, cancel with reason tracking
- Order cancellation log with inventory restore
- Status workflow (Quoted → Confirmed → In Production → Shipped → Completed)
- Order import from Excel
- Customer, PO, project, product type, color, line/stair/corner qty tracking
- Order total, deposit, balance tracking
- Sales rep assignment
- **Est. hours: 20**

### 3. Work Orders
- Work order creation linked to orders
- Status tracking through production stages
- Work order traveler print function
- **Est. hours: 12**

### 4. Order Import
- Drag-and-drop Excel import
- Field mapping and validation
- Import queue and log
- **Est. hours: 10**

### 5. Sales & Quotes
- Quote creation and management
- Quote-to-order conversion
- Sales pipeline tracking
- Quote log with history
- **Est. hours: 14**

### 6. Production
- Production status board
- Station-level tracking
- Work in progress visibility
- **Est. hours: 10**

### 7. Queue Analyzer
- Production queue visualization
- Priority sorting
- Capacity analysis
- **Est. hours: 8**

### 8. Hot / Rush Queue
- Dedicated hot order tracking
- Rush flag management
- Shop floor view (ShopQueue role)
- **Est. hours: 8**

### 9. Inventory (Hayden)
- Full inventory management: raw materials, assembly items, consumables, glass
- SKU tracking, categories, locations
- On-hand qty, reorder points, unit cost, value
- Low stock alerts
- Adjustment log with reason tracking
- Cycle count
- Defect log
- **Est. hours: 16**

### 10. Inventory — Bellevue Warehouse
- Separate inventory tracking for Bellevue location
- Items tab: full CRUD inventory management
- Adjustment log tab
- **Hayden → Bellevue Transfer tab** (March 2026):
  - Log bulk material transfers between locations
  - Driver, vehicle, trailer tracking
  - Qty sent vs. qty received with variance calculation
  - Auto-populates Bellevue inventory on receipt
  - Auto-calculates estimated value from Hayden cost data
  - Status: In Transit / Received Full / Received Short / Received Damaged / Cancelled
  - Discrepancy notes
  - Stat cards: in transit, discrepancies, total value, qty variance
- **Est. hours: 20**

### 11. Material Pull Tracker (March 2026)
- Tracks materials robbed from one customer's order and sent to another
- Robbed order + sent-to order fields (linked to orders list)
- Material selection from inventory with qty
- 10 preset reason categories
- Status tracking: Pending Replacement / Replaced / Not Replaced / Resolved
- Resolution notes, qty replaced, estimated cost
- Production impact tracking
- Analytics tab: top reasons bar chart, disposition breakdown, cost impact
- Stat cards: total, last 30 days, orders affected, pending replacement, resolved
- **Est. hours: 10**

### 12. Shipping
- Shipment creation and tracking
- Carrier, tracking number, weight, dimensions
- Packing slip generation
- Shipping cost log
- Monthly summary
- **Est. hours: 12**

### 13. Ship Calculator
- Rate calculation tool
- Multi-carrier comparison
- **Est. hours: 6**

### 14. Invoicing & A/R
- Invoice creation linked to orders
- Status workflow: Draft → Sent → Paid → Overdue
- Overdue alerts on dashboard
- Payment recording
- **Est. hours: 14**

### 15. Purchasing
- Purchase order creation and management
- Vendor assignment
- PO status tracking
- Receiving workflow
- Auto-reorder (AutoPO) module
- **Est. hours: 14**

### 16. Finance & P&L
- Monthly P&L tracking
- Revenue, COGS, gross margin
- Expense categories
- **Est. hours: 10**

### 17. Payments
- Payment method management
- Payment recording
- **Est. hours: 6**

### 18. QuickBooks Integration
- QB OAuth connection setup
- Sync log
- **Est. hours: 8**

### 19. Tax & Compliance
- Resale certificate management
- AvaTax integration setup
- **Est. hours: 6**

### 20. Job Costing
- Per-job cost analysis
- Labor, material, overhead tracking
- **Est. hours: 8**

### 21. Customers
- Customer database
- Contact info, type, city
- YTD revenue (auto-calculated from orders)
- Customer history
- **Est. hours: 8**

### 22. Sister Company
- Inter-company order fulfillment tracking
- Borrowed labor tracking
- **Est. hours: 8**

### 23. People & HR
- Employee profiles
- Training matrix
- Safety log
- Improvement log (Kaizen)
- Employee reviews module
- Shift handoff log
- **Est. hours: 16**

### 24. Automation Roadmap
- CNC, robotic welding, powder coat automation tracking
- Phase planning
- ROI calculations
- **Est. hours: 8**

### 25. KPI Dashboard
- Weekly and monthly KPI tracking
- Target vs. actual
- Trend visualization
- Station output tracking
- **Est. hours: 10**

### 26. Build Schedule
- Production build scheduling
- **Est. hours: 6**

### 27. Process Tracker
- Shop process tracking by station
- **Est. hours: 6**

### 28. Process Cost Analysis
- Per-process cost modeling
- Floor-measured data
- **Est. hours: 8**

### 29. Shop Calculators
- Multiple shop-floor calculators
- Stair angle, material, conversion tools
- **Est. hours: 6**

### 30. Facility Move
- Facility move task tracking
- **Est. hours: 4**

### 31. Product Catalog
- Full product catalog with SKUs
- **Est. hours: 6**

### 32. Ops Reference
- Operational reference documentation
- **Est. hours: 4**

### 33. Shop Reference
- Fastener guide (from Arsenal Supply workbook)
- Drill sizes reference
- Torque specs
- TIG welding settings
- Aluminum alloys
- Material properties
- Weld reference
- Fraction/decimal conversion
- Post manufacturing list
- Materials database
- SKU reference
- Vendor scorecards
- Shop calculators
- **Cut & Drill Reference tab** (March 2026): 42"/36" post cut lengths, drilling specs, quick lookup cards — sourced from Maisy's actual Cut Reference sheet
- **Est. hours: 14**

### 34. Workbook Generator
- Claude AI-powered workbook generation
- **Est. hours: 8**

### 35. Order Analyzer
- Order pattern analysis
- **Est. hours: 6**

### 36. Legacy Orders
- Historical order archive
- **Est. hours: 4**

### 37. SRS Catalog
- SRS product catalog reference
- **Est. hours: 4**

### 38. Print Center
- Unified print hub for all documents
- Work order travelers
- Invoices
- Purchase orders
- Packing slips
- KPI reports
- Inventory reports
- Training matrix
- Safety log
- Improvement log
- Daily huddle board
- **Est. hours: 12**

### 39. Reports
- Reporting module
- **Est. hours: 6**

### 40. Sales Pipeline
- Deal pipeline tracking
- Stage management
- **Est. hours: 6**

### 41. Commissions
- Commission rate management
- Commission calculation
- **Est. hours: 6**

---

## PRINT / DOCUMENT GENERATION

| Document | Description | Est. Hours |
|---|---|---|
| Work Order Traveler | Full shop traveler with process checklist | 6 |
| Invoice | Professional invoice document | 4 |
| Purchase Order | Formatted PO document | 4 |
| Packing Slip | Shipping packing slip | 3 |
| KPI Report | Weekly KPI report | 4 |
| Inventory Report | Full inventory with status | 3 |
| Training Matrix | Cross-training skills snapshot | 3 |
| Safety Log | Incident log with blank form | 2 |
| Improvement Log | Kaizen log with blank form | 2 |
| Daily Huddle Board | Shift standup form | 2 |
| **Print subtotal** | | **~33 hrs** |

---

## DATA & SEED DATA

| Item | Description |
|---|---|
| Raw materials catalog | 45+ aluminum extrusions, flat bar, angle, tube |
| Assembly items | Full assembly component catalog |
| Glass inventory | Glass panel inventory |
| Shop consumables | Consumables catalog |
| Vendor list | Vendor database with scoring |
| Fastener guide | Full fastener reference from Arsenal Supply |
| TIG settings | Welding parameter tables |
| Material properties | Aluminum alloy specs |
| Fraction/decimal table | Shop conversion reference |
| Post manufacturing list | Gate kit and custom post specs |
| SRS catalog | Full SRS product reference |
| Cut & Drill reference | From Maisy's actual shop documents |
| Sample orders, invoices, POs | Realistic seed data for all modules |

---

## HOURS SUMMARY

| Category | Est. Hours |
|---|---|
| Infrastructure & Platform | 46 |
| Core Modules (40 modules avg ~9 hrs) | 360 |
| Print / Document Generation | 33 |
| Data, Seed Data, Integration | 20 |
| Testing, Debugging, Iteration | 40 |
| **TOTAL ESTIMATED** | **~499 hours** |

---

## MARKET VALUATION

| Basis | Value |
|---|---|
| Freelance dev rate ($75/hr × 499 hrs) | $37,425 |
| Freelance dev rate ($100/hr × 499 hrs) | $49,900 |
| Comparable SaaS ERP (annual subscription) | $10,000–$30,000/yr |
| Custom dev shop quote for equivalent system | $60,000–$150,000 |
| **Recommended asking price (fair, defensible)** | **$15,000–$20,000** |
| **Ongoing maintenance/hosting retainer** | **$500–$1,000/month** |

---

## NOTES

- All development performed by Daniel Jones, Director of Operations
- Built using Claude AI assistance for code generation
- All business logic, requirements, and product decisions made by Daniel Jones
- Code is original, custom-built specifically for Maisy Railing's workflows
- Source code remains property of Daniel Jones until compensation is agreed upon
- Vercel deployment controlled by Daniel Jones

---

*Last updated: March 25, 2026*
