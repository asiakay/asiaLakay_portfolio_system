# asiaLakay Portfolio System

A lightweight, Cloudflare-native portfolio system that serves dynamic content with static-site speed. Built for engineers, artists, and creators who want full control over their presentation layer, data, and automation.

## 🌐 Overview
This system runs entirely on Cloudflare Pages and Workers, using KV Storage for dynamic data like contact forms or project submissions. It’s modular, low-cost, and serverless — perfect for scaling a personal site or multi-portfolio network.

### Live Example
- [Deeds](https://deeds.asialakay.com) — Real-world deployment showcasing the portfolio system in production.

## ⚙️ Architecture
```
public/         → Static assets (HTML, CSS, JS)
src/            → Core logic and components
backend/
  ├── workers/  → Cloudflare Workers handling API routes
  └── automation/ → Scheduled or triggered tasks
data/           → JSON content (projects, blog posts)
scripts/        → Build/deploy scripts
```

### Logic Flow
1. **Frontend (HTML/CSS/JS)** serves static pages via Cloudflare Pages.  
2. **Workers** manage email submissions, sign-ups, or dynamic data retrieval.  
3. **KV Storage** persists form data or analytics without a traditional database.  
4. **Automation scripts** can refresh portfolio data or sync GitHub commits daily.

---

## 🧰 Tech Stack
- **Frontend:** Vanilla JS + HTML5 + CSS3 (no framework required)
- **Backend:** Cloudflare Workers (JavaScript)
- **Storage:** Cloudflare KV Storage
- **Deployment:** Cloudflare Pages + Wrangler CLI
- **Automation:** Cron Triggers or GitHub Actions

---

## ▶️ Local development
If access to the npm registry is restricted you can run the bundled static server:
```bash
node scripts/dev-server.js [directory] --port=4173
```
This mirrors `npx serve` by defaulting to the `public/` directory.

## 🛠 Setup
```bash
# Clone repo
git clone https://github.com/asiakay/asiaLakay_portfolio_system.git
cd asiaLakay_portfolio_system

# Install Wrangler CLI
npm install -g wrangler

# Configure Cloudflare
wrangler login
wrangler kv:namespace create "PORTFOLIO_DATA"

# Build and publish
npm run build
wrangler publish
```

Update your `wrangler.toml` with:
```toml
kv_namespaces = [
  { binding = "PORTFOLIO_DATA", id = "<your_kv_id>" }
]
```

---

## 🧱 Key Features
- Serverless, cost-free deployment  
- Editable JSON data for rapid updates  
- Contact form and email submission via Workers  
- Optional API endpoint integration (GitHub, Notion, etc.)  
- Ready for custom themes or layouts

---

## 📦 Roadmap
- [ ] Add form validation and spam protection  
- [ ] Create JSON-based content manager  
- [ ] Build automation for project sync  
- [ ] Include analytics endpoint  
- [ ] Add dark/light theme toggle  

---

## 🪪 License
MIT — free for personal and commercial use.
