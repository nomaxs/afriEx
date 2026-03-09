// generatePages.js
const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

const archiveFolder = "archives"
const currencies = [...african, ...top]

function latestArchive() {
  const years = fs.readdirSync(archiveFolder)
    .filter(f => fs.statSync(path.join(archiveFolder, f)).isDirectory())
  if (!years.length) throw new Error("No year folders found in archives/")

  const year = years.sort().reverse()[0]

  const months = fs.readdirSync(path.join(archiveFolder, year))
    .filter(f => fs.statSync(path.join(archiveFolder, year, f)).isDirectory())
  if (!months.length) throw new Error(`No month folders found in archives/${year}/`)

  const month = months.sort().reverse()[0]

  const days = fs.readdirSync(path.join(archiveFolder, year, month))
    .filter(f => fs.statSync(path.join(archiveFolder, year, month, f)).isDirectory())
  if (!days.length) throw new Error(`No day folders found in archives/${year}/${month}/`)

  const day = days.sort().reverse()[0]

  const archivePath = path.join(archiveFolder, year, month, day, "rates.json")

  if (!fs.existsSync(archivePath)) throw new Error(`Archive file missing: ${archivePath}`)
  const content = fs.readFileSync(archivePath, "utf-8").trim()
  if (!content) throw new Error(`Archive file empty: ${archivePath}`)

  return archivePath
}

function generateHTML(base, target, rates, date) {
  const rate = (rates[target] / rates[base]).toFixed(4)

  let links = ""
  currencies.forEach(c => {
    if (c !== base) {
      links += `
      <li>
        <a href="/pages/${base}-to-${c}.html">${base} to ${c}</a>
      </li>`
    }
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${base} to ${target} Exchange Rate</title>
<meta name="description" content="Live ${base} to ${target} exchange rate on ${date}.">
<link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<header class="hero">
<h1>AFRICAN-EXCHANGE</h1>
<div class="heroContent">
  <div class="heroText">
    <h3>${base} to ${target}</h3>
    <p>Exchange rate on ${date}</p>
    <a href="/" class="backLink">← Back to main exchange table</a>
  </div>
  <div class="heroImage"></div>
</div>
</header>
<section id="currencyCards">
  <div class="card">
    <div class="cardLeft">
      <div class="currencyIcon">¢</div>
      <div class="currencyName">${base} → ${target}</div>
    </div>
    <div class="rate">${rate}</div>
  </div>
</section>
<section class="seoLinks">
  <h3>Other exchange rates</h3>
  <ul>
    ${links}
  </ul>
</section>
<div id="adBanner"></div>
<script src="/ads/banner.js"></script>
</body>
</html>
`
}

function generatePages() {
  const archive = latestArchive()
  const data = JSON.parse(fs.readFileSync(archive, "utf-8"))

  const rates = data.rates
  const date = data.date

  if (!fs.existsSync("pages")) fs.mkdirSync("pages")

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base !== target) {
        const html = generateHTML(base, target, rates, date)
        const file = path.join("pages", `${base}-to-${target}.html`)
        fs.writeFileSync(file, html)
      }
    })
  })
  console.log(`✅ Pages generated: ${currencies.length * (currencies.length - 1)}`)
}

generatePages()
