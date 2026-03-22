const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

const SITE_URL = "https://african-exchange.com"

/* GET LATEST DATE */
function latestDate() {
  const archiveFolder = path.join(__dirname, "..", "archives")

  const years = fs.readdirSync(archiveFolder)
  const year = years.sort().reverse()[0]

  const months = fs.readdirSync(path.join(archiveFolder, year))
  const month = months.sort().reverse()[0]

  const days = fs.readdirSync(path.join(archiveFolder, year, month))
  const day = days.sort().reverse()[0]

  return `${year}-${month}-${day}`
}

/* LOAD RATES */
function getRates(date) {
  const [y, m, d] = date.split("-")
  const file = path.join(__dirname, "..", "archives", y, m, d, "rates.json")

  if (!fs.existsSync(file)) return {}
  return JSON.parse(fs.readFileSync(file)).rates || {}
}

/* META (same as cards.js) */
const currencyMeta = require("../data/currencyMeta.json") // optional: move meta here

/* GENERATE CARDS HTML */
function generateCards(rates, currencies) {
  let html = ""

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base === target) return

      let rate = "N/A"

      if (rates[target] && rates[base]) {
        rate = (Number(rates[target]) / Number(rates[base])).toFixed(5)
      }

      const baseMeta = currencyMeta[base] || { country: base, symbol: "", flag: "na" }
      const targetMeta = currencyMeta[target] || { country: target, symbol: "", flag: "na" }

      html += `
<div class="card" data-base="${base}" data-target="${target}">

  <div class="cardRow">
    <div class="currencyInfo">
      <img class="flag" loading="lazy" src="images/flags/${baseMeta.flag}.png">
      <span class="currencyCode">${base}</span>
    </div>

    <div class="currencyInfo">
      <img class="flag" loading="lazy" src="images/flags/${targetMeta.flag}.png">
      <span class="currencyCode">${target}</span>
    </div>
  </div>

  <div class="cardRow countryRow">
    <span>${baseMeta.country} (${baseMeta.symbol})</span>
    <span class="arrow">→</span>
    <span>${targetMeta.country} (${targetMeta.symbol})</span>
  </div>

  <div class="amount">
    ${targetMeta.symbol} ${rate}
  </div>

</div>
`
    })
  })

  return html
}

/* MAIN */
const date = latestDate()
const rates = getRates(date)

const currencies = [...african, ...top].sort()

const cardsHTML = generateCards(rates, currencies)

/* FULL INDEX HTML */
const html = `<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>African Exchange Rates Today (${date})</title>

<meta name="description" content="Live African exchange rates updated daily (${date}). Compare Naira, Rand, Cedi, Shilling and global currencies.">

<link rel="canonical" href="${SITE_URL}/">

<!-- SEO BOOST -->
<meta name="robots" content="index, follow">
<meta name="last-modified" content="${date}">
<meta http-equiv="last-modified" content="${date}">

<link rel="stylesheet" href="css/styles.css">

</head>

<body>

<header class="hero">

<h1>AFRICAN-EXCHANGE</h1>

<div class="heroContent">

<div class="heroText">

<h3>Live Exchange Rates (${date})</h3>

<p>
Daily updated African and global exchange rates. Instantly compare all currency pairs.
</p>

<button id="openCalculator">Calculator</button>

</div>

<div class="heroImage"></div>

</div>

</header>

<section class="filterSection">

<div class="tabs">
<span class="active">Non-African</span>
<span>African</span>
</div>

<div class="filterScroll">
<button class="scrollBtn" id="leftBtn">&lt;</button>
<div id="currencyFilters"></div>
<button class="scrollBtn" id="rightBtn">&gt;</button>
</div>

</section>

<section id="currencyCards">
${cardsHTML}
</section>

<div id="calculatorOverlay">
  <div class="calculatorModal">

    <div class="calculatorHeader">Calculator</div>

    <div class="calculatorBody">

      <div class="calcRow">
        <select id="fromCurrency" class="calcSelect"></select>
        <div class="calcArrow">→</div>
        <select id="toCurrency" class="calcSelect"></select>
      </div>

      <input id="amount" class="calcInput" type="number" placeholder="Enter amount">

      <button id="calculate" class="calcBtn">Calculate</button>

    </div>

    <div id="result" class="calcResult">₦ 0</div>

  </div>
</div>

<div id="adBanner"></div>

<script src="js/cache.js"></script>
<script src="js/api.js"></script>
<script src="js/filters.js"></script>
<script src="js/app.js"></script>
<script src="js/calculator.js"></script>
<script src="js/ads.js"></script>

</body>
</html>`

/* SAVE */
fs.writeFileSync(path.join(__dirname, "..", "index.html"), html)

console.log("✅ index.html generated with full SEO cards")
