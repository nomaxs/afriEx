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

let existingUrls = new Set();

if (fs.existsSync(sitemapPath)) {
  const existingXML = fs.readFileSync(sitemapPath, "utf-8");

  const matches = existingXML.match(/<loc>(.*?)<\/loc>/g);

  if (matches) {
    matches.forEach(m => {
      const url = m.replace("<loc>", "").replace("</loc>", "");
      existingUrls.add(url);
    });
  }
}

// Generate all combinations: african ↔ african, african ↔ top, top ↔ african, top ↔ top
const currencies = [...african, ...top]

const allUrls = new Set([...existingUrls]);

currencies.forEach(base => {
  currencies.forEach(target => {
    if (base !== target) {
      const url = `${SITE_URL}/pages/${year}/${month}/${day}/${base}-to-${target}-exchange-${date}.html`;
      allUrls.add(url);
    }
  });
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

allUrls.forEach(u => {
  xml += `\n  <url><loc>${u}</loc></url>`;
});

xml += `\n</urlset>`;

const sitemapPath = path.join(seoDir, "sitemap.xml")
fs.writeFileSync(sitemapPath, xml)

console.log(`✅ Sitemap generated: ${sitemapPath}`)
