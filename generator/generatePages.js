const fs = require("fs");
const path = require("path");

const african = require("../data/africanCurrencies.json");
const top = require("../data/topCurrencies.json");

const archiveFolder = "archives";
const currencies = [...african, ...top];

const SITE_URL = "https://african-exchange.com";

/* =========================
   CURRENCY META
========================= */

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
};

/* =========================
   TEXT VARIATION HELPERS
========================= */

const intros = [
  "This page shows the official exchange rate",
  "Here you can find the latest conversion rate",
  "Below is the most recent exchange value",
  "This conversion reflects the recorded rate",
];

const notes = [
  "Rates may fluctuate during the day depending on market activity.",
  "Currency values are influenced by global trade and economic events.",
  "Exchange rates change frequently due to supply and demand.",
];

/* =========================
   GET LATEST ARCHIVE
========================= */

function latestArchive() {

  const years = fs.readdirSync(archiveFolder)
    .filter(f => fs.statSync(path.join(archiveFolder, f)).isDirectory());

  const year = years.sort().reverse()[0];

  const months = fs.readdirSync(path.join(archiveFolder, year))
    .filter(f => fs.statSync(path.join(archiveFolder, year, f)).isDirectory());

  const month = months.sort().reverse()[0];

  const days = fs.readdirSync(path.join(archiveFolder, year, month))
    .filter(f => fs.statSync(path.join(archiveFolder, year, month, f)).isDirectory());

  const day = days.sort().reverse()[0];

  return path.join(archiveFolder, year, month, day, "rates.json");
}

/* =========================
   GENERATE HTML
========================= */

function generateHTML(base, target, rates, date) {

  if (!rates[base] || !rates[target]) return "";

  const baseMeta = currencyMeta[base];
  const targetMeta = currencyMeta[target];

  const rate = (rates[target] / rates[base]).toFixed(5);

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const note = notes[Math.floor(Math.random() * notes.length)];

  const [year, month, day] = date.split("-");
  const pathDate = `${year}/${month}/${day}`;

  /* SAME-DAY LINKS */
  let links = "";
  currencies.forEach(c => {
    if (c !== base) {
      links += `
<li>
<a href="/pages/${pathDate}/${base}-to-${c}-exchange-${date}.html">
${base} → ${c} (${date})
</a>
</li>`;
    }
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>${base} to ${target} Exchange Rate (${date})</title>

<meta name="description" content="${base} to ${target} exchange rate on ${date}. Convert ${base} to ${target} with live data and historical archive.">

<meta name="robots" content="index, follow">

<link rel="canonical" href="${SITE_URL}/pages/${pathDate}/${base}-to-${target}-exchange-${date}.html">

<!-- Open Graph -->
<meta property="og:title" content="${base} to ${target} Exchange Rate (${date})">
<meta property="og:description" content="Check ${base} to ${target} exchange rate for ${date}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/pages/${pathDate}/${base}-to-${target}-exchange-${date}.html">

<link rel="stylesheet" href="../../../../css/styles.css">

</head>

<body>

<header class="hero">

<h1>${base} → ${target} Exchange Rate</h1>

<p class="heroDate">
Data for ${date} (archived daily rate)
</p>

<a href="/" class="backLink">
← Back to main exchange page
</a>

</header>

<section id="currencyCards">

<div class="card">

<div class="cardRow">
<div class="currencyInfo">
<img class="flag" src="../../../../images/flags/${baseMeta.flag}.png">
<span class="currencyCode">${base}</span>
</div>

<div class="currencyInfo">
<img class="flag" src="../../../../images/flags/${targetMeta.flag}.png">
<span class="currencyCode">${target}</span>
</div>
</div>

<div class="cardRow countryRow">
<span>${baseMeta.country}</span>
<span class="arrow">→</span>
<span>${targetMeta.country}</span>
</div>

<div class="amount">
${targetMeta.symbol} ${rate}
</div>

</div>

</section>

<section class="seoText">

<h2>${base} to ${target} on ${date}</h2>

<p>${intro} from ${baseMeta.country} (${base}) to ${targetMeta.country} (${target}) on ${date}.</p>

<p>1 ${base} equals <strong>${rate} ${target}</strong> based on archived data.</p>

<p>${note}</p>

<p>This page is part of a daily archive. Each date has its own recorded exchange values.</p>

</section>

<section class="seoLinks">

<h2>${base} conversions for ${date}</h2>

<p class="smallNote">
These links point to exchange rates recorded on ${date}.
</p>

<ul>
${links}
</ul>

</section>

<div id="adBanner"></div>
<script src="/ads/banner.js"></script>

<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"ExchangeRateSpecification",
"currency":"${base}/${target}",
"currentExchangeRate":"${rate}",
"dateModified":"${date}"
}
</script>

</body>
</html>
`;
}

/* =========================
   GENERATE ALL PAGES
========================= */

function generatePages() {

  const archive = latestArchive();
  const data = JSON.parse(fs.readFileSync(archive,"utf-8"));

  const rates = data.rates;
  const date = data.date;

  const [year, month, day] = date.split("-");
  const pageDir = path.join("pages", year, month, day);

  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base !== target) {
        const html = generateHTML(base, target, rates, date);
        const fileName = `${base}-to-${target}-exchange-${date}.html`;
        fs.writeFileSync(path.join(pageDir, fileName), html);
      }
    });
  });

  console.log(`✅ Pages generated for ${date}`);
}

generatePages();
