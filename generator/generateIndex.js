const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

const SITE_URL = "https://african-exchange.com"

// --------------------
// GET LATEST DATE
// --------------------
function latestDate() {
  const archiveFolder = path.join(__dirname, "..", "archives")

  const year = fs.readdirSync(archiveFolder).sort().reverse()[0]
  const month = fs.readdirSync(path.join(archiveFolder, year)).sort().reverse()[0]
  const day = fs.readdirSync(path.join(archiveFolder, year, month)).sort().reverse()[0]

  return { year, month, day }
}

// --------------------
// LOAD RATES
// --------------------
function getRates(year, month, day) {
  const file = path.join(__dirname, "..", "archives", year, month, day, "rates.json")
  return JSON.parse(fs.readFileSync(file)).rates
}

// --------------------
// GENERATE CARDS HTML
// --------------------
function generateCards(rates) {
  const currencies = [...african, ...top].sort()

  let html = ""

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base === target) return

      let rate = "N/A"

      if (rates[target] && rates[base]) {
        const baseRate = Number(rates[base])
        const targetRate = Number(rates[target])
        rate = (targetRate / baseRate).toFixed(5)
      }

      html += `
<div class="card" data-base="${base}" data-target="${target}">

  <div class="cardRow">
    <div class="currencyInfo">
      <img class="flag" loading="lazy" src="images/flags/${base.toLowerCase()}.png">
      <span class="currencyCode">${base}</span>
    </div>

    <div class="currencyInfo">
      <img class="flag" loading="lazy" src="images/flags/${target.toLowerCase()}.png">
      <span class="currencyCode">${target}</span>
    </div>
  </div>

  <div class="cardRow countryRow">
    <span>${base}</span>
    <span class="arrow">→</span>
    <span>${target}</span>
  </div>

  <div class="amount">
    ${rate}
  </div>

</div>
`
    })
  })

  return html
}

// --------------------
// GENERATE FILTERS HTML
// --------------------
function generateFilters(list) {
  return list
    .sort()
    .map(code => `<button>${code}</button>`)
    .join("")
}

// --------------------
// MAIN
// --------------------
const { year, month, day } = latestDate()
const rates = getRates(year, month, day)

const cardsHTML = generateCards(rates)
const filtersHTML = generateFilters(top)

// --------------------
// BUILD FINAL HTML
// --------------------
const html = `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>African Exchange Rates Today (${year}-${month}-${day})</title>

<meta name="description"
content="Live African exchange rates updated daily. View all currency pairs instantly.">

<link rel="stylesheet" href="css/styles.css">

<!-- SEO BOOST -->
<link rel="canonical" href="${SITE_URL}/">
<meta name="robots" content="index, follow">

</head>

<body>

<header class="hero">
<h1>AFRICAN-EXCHANGE</h1>

<div class="heroContent">
<div class="heroText">
<h3>~Quick Info</h3>
<p>
African Exchange provides all African currency exchange rates updated daily.
</p>
<button id="openCalculator">calculator</button>
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
<div id="currencyFilters">
${filtersHTML}
</div>
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

<script src="js/calculator.js"></script>

</body>
</html>
`

// --------------------
// SAVE FILE
// --------------------
fs.writeFileSync(path.join(__dirname, "..", "index.html"), html)

console.log("✅ index.html generated")
