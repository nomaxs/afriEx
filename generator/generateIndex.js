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

/* META */
const currencyMeta = {
NGN:{country:"Nigeria",symbol:"₦",flag:"ng"},
KES:{country:"Kenya",symbol:"KSh",flag:"ke"},
GHS:{country:"Ghana",symbol:"GH₵",flag:"gh"},
ZAR:{country:"South Africa",symbol:"R",flag:"za"},
EGP:{country:"Egypt",symbol:"£",flag:"eg"},
MAD:{country:"Morocco",symbol:"MAD",flag:"ma"},
TND:{country:"Tunisia",symbol:"TND",flag:"tn"},
DZD:{country:"Algeria",symbol:"DA",flag:"dz"},
ETB:{country:"Ethiopia",symbol:"Br",flag:"et"},
TZS:{country:"Tanzania",symbol:"TSh",flag:"tz"},
UGX:{country:"Uganda",symbol:"USh",flag:"ug"},
RWF:{country:"Rwanda",symbol:"RF",flag:"rw"},
BWP:{country:"Botswana",symbol:"P",flag:"bw"},
MUR:{country:"Mauritius",symbol:"₨",flag:"mu"},
SCR:{country:"Seychelles",symbol:"₨",flag:"sc"},
MWK:{country:"Malawi",symbol:"MK",flag:"mw"},
MZN:{country:"Mozambique",symbol:"MT",flag:"mz"},
NAD:{country:"Namibia",symbol:"$",flag:"na"},
AOA:{country:"Angola",symbol:"Kz",flag:"ao"},
CDF:{country:"DR Congo",symbol:"FC",flag:"cd"},
SDG:{country:"Sudan",symbol:"£",flag:"sd"},
GMD:{country:"Gambia",symbol:"D",flag:"gm"},
GNF:{country:"Guinea",symbol:"FG",flag:"gn"},
LRD:{country:"Liberia",symbol:"$",flag:"lr"},
SLL:{country:"Sierra Leone",symbol:"Le",flag:"sl"},
SOS:{country:"Somalia",symbol:"Sh",flag:"so"},
DJF:{country:"Djibouti",symbol:"Fdj",flag:"dj"},
KMF:{country:"Comoros",symbol:"CF",flag:"km"},
MRU:{country:"Mauritania",symbol:"UM",flag:"mr"},
STN:{country:"Sao Tome & Principe",symbol:"Db",flag:"st"},
CVE:{country:"Cape Verde",symbol:"$",flag:"cv"},
LSL:{country:"Lesotho",symbol:"L",flag:"ls"},
SZL:{country:"Eswatini",symbol:"E",flag:"sz"},
XAF:{country:"Central African CFA",symbol:"FCFA",flag:"cm"},
XOF:{country:"West African CFA",symbol:"CFA",flag:"sn"},
BIF:{country:"Burundi",symbol:"FBu",flag:"bi"},
ERN:{country:"Eritrea",symbol:"Nfk",flag:"er"},
LYD:{country:"Libya",symbol:"LD",flag:"ly"},
ZMW:{country:"Zambia",symbol:"ZK",flag:"zm"},
SHP:{country:"Saint Helena",symbol:"£",flag:"sh"},
SSP:{country:"South Sudan",symbol:"£",flag:"ss"},
MGA:{country:"Madagascar",symbol:"Ar",flag:"mg"},

USD:{country:"United States",symbol:"$",flag:"us"},
EUR:{country:"Eurozone",symbol:"€",flag:"eu"},
GBP:{country:"United Kingdom",symbol:"£",flag:"gb"},
CNY:{country:"China",symbol:"¥",flag:"cn"},
JPY:{country:"Japan",symbol:"¥",flag:"jp"},
AED:{country:"United Arab Emirates",symbol:"د.إ",flag:"ae"},
INR:{country:"India",symbol:"₹",flag:"in"},
CAD:{country:"Canada",symbol:"$",flag:"ca"},
AUD:{country:"Australia",symbol:"$",flag:"au"},
CHF:{country:"Switzerland",symbol:"CHF",flag:"ch"},
SGD:{country:"Singapore",symbol:"$",flag:"sg"},
HKD:{country:"Hong Kong",symbol:"$",flag:"hk"}
}

/* GENERATE CARDS (NOW CLICKABLE) */
function generateCards(rates, currencies, date) {
  const [y, m, d] = date.split("-")
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

      const link = `/pages/${y}/${m}/${d}/${base}-to-${target}-exchange-${date}.html`

      html += `
<a href="${link}" class="card" data-base="${base}" data-target="${target}">

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

</a>
`
    })
  })

  return html
}

/* MAIN */
const date = latestDate()
const rates = getRates(date)

const currencies = [...african, ...top].sort()

const cardsHTML = generateCards(rates, currencies, date)

/* FULL HTML */
const html = `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>African Exchange Rates Today (${date})</title>

<meta name="description" content="Daily African exchange rates for ${date}. Compare NGN, ZAR, GHS, KES and global currencies instantly.">

<meta name="robots" content="index, follow">

<link rel="canonical" href="${SITE_URL}/">

<!-- Open Graph -->
<meta property="og:title" content="African Exchange Rates (${date})">
<meta property="og:description" content="Live currency exchange rates updated daily (${date})">
<meta property="og:url" content="${SITE_URL}/">

<!-- Freshness -->
<meta name="last-modified" content="${date}">
<meta http-equiv="last-modified" content="${date}">

<link rel="stylesheet" href="css/styles.css">

</head>

<body>

<header class="hero">

<h1>AFRICAN-EXCHANGE</h1>

<div class="heroContent">

<div class="heroText">

<h3>Live Exchange Rates – ${date}</h3>

<p>
Explore today's snapshot of African and global currency exchange rates.  
All rates are updated daily and archived for historical tracking.
</p>

<p>
Each card links to a detailed page for that specific currency pair on ${date}.
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

<div style="height:140px;"></div>

<div id="adBanner"></div>

<script src="js/cache.js"></script>
<script src="js/api.js"></script>
<script src="js/filters.js"></script>
<script src="js/app.js"></script>
<script src="js/calculator.js"></script>
<script src="js/ads.js"></script>

</body>
</html>`

fs.writeFileSync(path.join(__dirname, "..", "index.html"), html)

console.log("✅ index.html generated with clickable SEO cards")
