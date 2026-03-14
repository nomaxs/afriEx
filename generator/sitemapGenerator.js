const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")
const SITE_URL = "https://african-exchange.com";

function latestDate() {

const archiveFolder = path.join(__dirname,"..","archives")

const years = fs.readdirSync(archiveFolder)
const year = years.sort().reverse()[0]

const months = fs.readdirSync(path.join(archiveFolder,year))
const month = months.sort().reverse()[0]

const days = fs.readdirSync(path.join(archiveFolder,year,month))
const day = days.sort().reverse()[0]

return `${year}-${month}-${day}`

}


// Safe path
const seoDir = path.join(__dirname, "..", "seo")
if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir, { recursive: true })

const urls = []

const date = latestDate()
const [year,month,day] = date.split("-")

// Generate all combinations: african ↔ african, african ↔ top, top ↔ african, top ↔ top
const currencies = [...african, ...top]

currencies.forEach(base => {
  currencies.forEach(target => {
    if (base !== target) {
      urls.push(`/pages/${year}/${month}/${day}/${base}-to-${target}-exchange-${date}.html`)
    }
  })
})

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
urls.forEach(u => {
  xml += `\n  <url><loc>${SITE_URL}${u}</loc></url>`
})
xml += `\n</urlset>`

const sitemapPath = path.join(seoDir, "sitemap.xml")
fs.writeFileSync(sitemapPath, xml)

console.log(`✅ Sitemap generated: ${sitemapPath}`)
