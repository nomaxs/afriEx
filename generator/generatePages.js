const fs = require("fs");
const path = require("path");

const african = require("../data/africanCurrencies.json");
const top = require("../data/topCurrencies.json");

const archiveFolder = "archives";
const currencies = [...african, ...top];

// Get the latest archive JSON file
function latestArchive() {

  const years = fs.readdirSync(archiveFolder)
    .filter(f => fs.statSync(path.join(archiveFolder, f)).isDirectory());

  if (!years.length) throw new Error("No year folders found");

  const year = years.sort().reverse()[0];

  const months = fs.readdirSync(path.join(archiveFolder, year))
    .filter(f => fs.statSync(path.join(archiveFolder, year, f)).isDirectory());

  const month = months.sort().reverse()[0];

  const days = fs.readdirSync(path.join(archiveFolder, year, month))
    .filter(f => fs.statSync(path.join(archiveFolder, year, month, f)).isDirectory());

  const day = days.sort().reverse()[0];

  const archivePath = path.join(archiveFolder, year, month, day, "rates.json");

  if (!fs.existsSync(archivePath)) throw new Error("Archive file missing");

  return archivePath;

}


// Generate HTML for a currency pair
function generateHTML(base, target, rates, date) {

  const rate = (rates[target] / rates[base]).toFixed(4);

  const example10 = (rate * 10).toFixed(2);
  const example100 = (rate * 100).toFixed(2);
  const example1000 = (rate * 1000).toFixed(2);

  let links = "";

  currencies.forEach(c => {

    if (c !== base) {

      links += `
      <li>
        <a href="/pages/${base}-to-${c}.html">
        ${base} to ${c} exchange rate
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

<title>${base} to ${target} Exchange Rate Today (${date}) | African Exchange</title>

<meta name="description" content="Check the latest ${base} to ${target} exchange rate today (${date}). View live conversion value, examples, and other African currency exchange rates.">

<link rel="canonical" href="https://african-exchange.com/pages/${base}-to-${target}.html">

<link rel="stylesheet" href="/css/styles.css">

</head>


<body>

<header class="hero">

<h1>${base} to ${target} Exchange Rate</h1>

<div class="heroContent">

<div class="heroText">

<p>Live exchange rate on ${date}</p>

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



<section class="examples">

<h2>${base} to ${target} Conversion Examples</h2>

<ul>

<li>1 ${base} = ${rate} ${target}</li>

<li>10 ${base} = ${example10} ${target}</li>

<li>100 ${base} = ${example100} ${target}</li>

<li>1000 ${base} = ${example1000} ${target}</li>

</ul>

</section>



<section class="seoText">

<h2>About the ${base} to ${target} Exchange Rate</h2>

<p>
The current ${base} to ${target} exchange rate on ${date} is ${rate}. 
Exchange rates change frequently due to global market conditions, 
economic activity, and international trade between countries.
</p>

<p>
If you are converting ${base} to ${target} for travel, online payments,
business transactions, or international money transfers, checking the
latest exchange rate is important to get the most accurate value.
</p>

<p>
This page provides the most recent ${base} to ${target} currency rate
along with quick conversion examples and links to other African
currency exchange rates.
</p>

</section>



<section class="seoLinks">

<h2>Other ${base} Exchange Rates</h2>

<ul>

${links}

</ul>

</section>



<div id="adBanner"></div>

<script src="/ads/banner.js"></script>



<script type="application/ld+json">

{

"@context":"https://schema.org",

"@type":"Dataset",

"name":"${base} to ${target} Exchange Rate",

"description":"Exchange rate for ${base} to ${target} on ${date}",

"dateModified":"${date}"

}

</script>


</body>

</html>

`;

}


// Generate all pages
function generatePages() {

  const archive = latestArchive();

  const data = JSON.parse(fs.readFileSync(archive,"utf-8"));

  const rates = data.rates;

  const date = data.date;


  if (!fs.existsSync("pages"))
    fs.mkdirSync("pages");


  currencies.forEach(base => {

    currencies.forEach(target => {

      if(base !== target){

        const html = generateHTML(base,target,rates,date);

        const file = path.join("pages",`${base}-to-${target}.html`);

        fs.writeFileSync(file,html);

      }

    });

  });


  console.log(`✅ Pages generated: ${currencies.length * (currencies.length - 1)}`);

}


// Run
generatePages();
