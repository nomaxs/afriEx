const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

const SITE_URL = "https://african-exchange.com"

/* =========================
   SAFE SORT (VERY IMPORTANT)
========================= */

function sortDesc(arr) {
  return arr.sort((a, b) => Number(b) - Number(a))
}

/* =========================
   GET LATEST VALID DATE
========================= */

function latestDate() {
  const archiveFolder = path.join(__dirname,"..","archives")

  if (!fs.existsSync(archiveFolder)) {
    throw new Error("❌ archives folder missing")
  }

  const years = sortDesc(fs.readdirSync(archiveFolder))
  
  for (const year of years) {

    const yearPath = path.join(archiveFolder, year)
    if (!fs.statSync(yearPath).isDirectory()) continue

    const months = sortDesc(fs.readdirSync(yearPath))

    for (const month of months) {

      const monthPath = path.join(yearPath, month)
      if (!fs.statSync(monthPath).isDirectory()) continue

      const days = sortDesc(fs.readdirSync(monthPath))

      for (const day of days) {

        const dayPath = path.join(monthPath, day)
        if (!fs.statSync(dayPath).isDirectory()) continue

        const ratesFile = path.join(dayPath, "rates.json")

        if (fs.existsSync(ratesFile)) {
          return `${year}-${month}-${day}`
        }
      }
    }
  }

  throw new Error("❌ No valid archive with rates.json found")
}

/* =========================
   SETUP
========================= */

const ROOT = path.resolve(__dirname, "..")
const seoDir = path.join(ROOT, "seo")

if (!fs.existsSync(seoDir)) {
  fs.mkdirSync(seoDir, { recursive: true })
}

const sitemapIndexPath = path.join(seoDir, "sitemap_index.xml")

/* =========================
   GET DATE
========================= */

const date = latestDate()
const [year, month, day] = date.split("-")

console.log("📅 Using date:", date)

const currencies = [...african, ...top]

/* =========================
   CREATE DAILY SITEMAP
========================= */

const dailySitemapName = `sitemap-${date}.xml`
const dailySitemapPath = path.join(seoDir, dailySitemapName)

console.log("📄 Daily sitemap path:", dailySitemapPath)

/* Prevent rewriting same day */
if (!fs.existsSync(dailySitemapPath)) {

  try {

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

  } catch (err) {
    console.error("❌ Failed to write daily sitemap:", err)
  }

} else {
  console.log("⚠️ Daily sitemap already exists, skipping...")
}

/* =========================
   UPDATE SITEMAP INDEX
========================= */

let sitemapEntries = new Set()

if (fs.existsSync(sitemapIndexPath)) {
  try {
    const existing = fs.readFileSync(sitemapIndexPath, "utf-8")

    const matches = existing.match(/<loc>(.*?)<\/loc>/g)

    if (matches) {
      matches.forEach(m => {
        const url = m.replace("<loc>", "").replace("</loc>", "").trim()
        if (url) sitemapEntries.add(url)
      })
    }

  } catch (err) {
    console.warn("⚠️ Could not read existing sitemap index, rebuilding...")
  }
}

/* Add today's sitemap */
const sitemapUrl = `${SITE_URL}/seo/${dailySitemapName}`
sitemapEntries.add(sitemapUrl)

/* =========================
   BUILD INDEX XML
========================= */

let indexXML = `<?xml version="1.0" encoding="UTF-8"?>\n`
indexXML += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

sitemapEntries.forEach(u => {
  indexXML += `
  <sitemap>
    <loc>${u}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>`
})

indexXML += `\n</sitemapindex>`

try {
  fs.writeFileSync(sitemapIndexPath, indexXML)
  console.log(`✅ Sitemap index updated. Total sitemaps: ${sitemapEntries.size}`)
} catch (err) {
  console.error("❌ Failed to write sitemap index:", err)
}
