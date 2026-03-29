const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

const SITE_URL = "https://african-exchange.com"

/* =========================
   GET LATEST DATE
========================= */

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

/* =========================
   SETUP
========================= */

const seoDir = path.join(__dirname, "..", "seo")
if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir, { recursive: true })

const sitemapIndexPath = path.join(seoDir, "sitemap_index.xml")

const date = latestDate()
const [year, month, day] = date.split("-")

const currencies = [...african, ...top]

/* =========================
   CREATE DAILY SITEMAP
========================= */

const dailySitemapName = `sitemap-${date}.xml`
const dailySitemapPath = path.join(seoDir, dailySitemapName)

/* Prevent rewriting same day */
if (!fs.existsSync(dailySitemapPath)) {

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base !== target) {

        const url = `${SITE_URL}/pages/${year}/${month}/${day}/${base}-to-${target}-exchange-${date}.html`

        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
  </url>`
      }
    })
  })

  xml += `\n</urlset>`

  fs.writeFileSync(dailySitemapPath, xml)

  console.log(`✅ Daily sitemap created: ${dailySitemapName}`)
  console.log("Saving to:", dailySitemapPath)
} else {
  console.log("⚠️ Daily sitemap already exists, skipping...")
}

/* =========================
   UPDATE SITEMAP INDEX
========================= */

let sitemapEntries = new Set()

if (fs.existsSync(sitemapIndexPath)) {
  const existing = fs.readFileSync(sitemapIndexPath, "utf-8")
  const matches = existing.match(/<loc>(.*?)<\/loc>/g)

  if (matches) {
    matches.forEach(m => {
      const url = m.replace("<loc>", "").replace("</loc>", "")
      sitemapEntries.add(url)
    })
  }
}

/* Add today's sitemap */
const sitemapUrl = `${SITE_URL}/seo/${dailySitemapName}`
sitemapEntries.add(sitemapUrl)

/* Build index */
let indexXML = `<?xml version="1.0" encoding="UTF-8"?>\n`
indexXML += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

sitemapEntries.forEach(u => {
  indexXML += `
  <sitemap>
    <loc>${u}</loc>
  </sitemap>`
})

indexXML += `\n</sitemapindex>`

fs.writeFileSync(sitemapIndexPath, indexXML)

console.log(`✅ Sitemap index updated. Total sitemaps: ${sitemapEntries.size}`)
