const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

// Safe path
const seoDir = path.join(__dirname, "..", "seo")
if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir, { recursive: true })

const urls = []

// Generate all combinations: african ↔ african, african ↔ top, top ↔ african, top ↔ top
const currencies = [...african, ...top]

currencies.forEach(base => {
  currencies.forEach(target => {
    if (base !== target) {
      urls.push(`/pages/${base}-to-${target}.html`)
    }
  })
})

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
urls.forEach(u => {
  xml += `\n  <url><loc>https://site.com${u}</loc></url>`
})
xml += `\n</urlset>`

const sitemapPath = path.join(seoDir, "sitemap.xml")
fs.writeFileSync(sitemapPath, xml)

console.log(`✅ Sitemap generated: ${sitemapPath}`)
