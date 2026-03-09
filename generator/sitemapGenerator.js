// sitemapGenerator.js
const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

// Ensure seo folder exists
if (!fs.existsSync("../seo")) fs.mkdirSync("../seo", { recursive: true })

const urls = []

african.forEach(a => {
  african.forEach(b => {
    if (a !== b) urls.push(`/pages/${a}-to-${b}.html`)
  })
  top.forEach(t => urls.push(`/pages/${t}-to-${a}.html`))
})

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
urls.forEach(u => {
  xml += `<url><loc>https://site.com${u}</loc></url>`
})
xml += `</urlset>`

fs.writeFileSync("../seo/sitemap.xml", xml)
console.log("✅ Sitemap generated: ../seo/sitemap.xml")
