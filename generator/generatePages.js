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

const baseMeta = currencyMeta[base];
const targetMeta = currencyMeta[target];

const rate = (rates[target] / rates[base]).toFixed(5);

const example10 = (rate * 10).toFixed(2);
const example100 = (rate * 100).toFixed(2);
const example1000 = (rate * 1000).toFixed(2);

let links = "";

currencies.forEach(c => {

if (c !== base) {

links += `
<li>
<a href="/pages/${base}-to-${c}.html">
${base} → ${c}
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

<meta name="description"
content="Convert ${base} to ${target}. See today's exchange rate, quick conversion examples, and other currency pairs.">

<link rel="canonical"
href="https://african-exchange.com/pages/${base}-to-${target}.html">

<link rel="stylesheet" href="/css/styles.css">

</head>

<body>


<header class="hero">

<h1>${base} → ${target} Exchange Rate</h1>

<p class="heroDate">
Updated ${date}
</p>

<a href="/" class="backLink">
← Back to exchange table
</a>

</header>



<section id="currencyCards">

<div class="card">

<div class="cardRow">

<div class="currencyInfo">

<img class="flag"
loading="lazy"
width="24"
height="16"
src="/images/flags/${baseMeta.flag}.png"
alt="${baseMeta.country} flag">

<span class="currencyCode">${base}</span>

</div>

<div class="currencyInfo">

<img class="flag"
loading="lazy"
width="24"
height="16"
src="/images/flags/${targetMeta.flag}.png"
alt="${targetMeta.country} flag">

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

</section>



<section class="examples">

<h2>Quick Conversion</h2>

<ul>

<li>1 ${base} = ${rate} ${target}</li>

<li>10 ${base} = ${example10} ${target}</li>

<li>100 ${base} = ${example100} ${target}</li>

<li>1000 ${base} = ${example1000} ${target}</li>

</ul>

</section>



<section class="seoText">

<h2>About this currency pair</h2>

<p>

The current exchange rate from ${baseMeta.country}'s
<strong>${base}</strong> to
${targetMeta.country}'s
<strong>${target}</strong>
is <strong>${rate}</strong> as of ${date}.

</p>

<p>

Exchange rates change throughout the day as financial
markets react to economic news, global trade, and
currency demand.

</p>

<p>

This page helps you quickly convert
${base} to ${target}, view example conversions,
and navigate to other related exchange rates.

</p>

</section>



<section class="seoLinks">

<h2>Other ${base} conversions</h2>

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
