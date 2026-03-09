let africanCurrencies=[]
let topCurrencies=[]

async function init(){

africanCurrencies = await fetch("data/africanCurrencies.json").then(r=>r.json())

topCurrencies = await fetch("data/topCurrencies.json").then(r=>r.json())

createFilterButtons(
topCurrencies,
document.getElementById("topFilter")
)

createFilterButtons(
africanCurrencies,
document.getElementById("africanFilter")
)

loadRates()

}

async function loadRates(){

let rates=getCache()

if(!rates){

rates=await fetchRates(currentBase)

setCache(rates)

}

renderCards(rates)

updateHero(rates)

populateCalculator()

}

function renderCards(rates){

let container=document.getElementById("cards")

container.innerHTML=""

africanCurrencies.forEach(code=>{

let card=document.createElement("div")

card.className="card"

card.innerHTML=`

<div class="cardName">${code}</div>

<div class="cardRate">${rates[code].toFixed(2)}</div>

`

container.appendChild(card)

})

}

function updateHero(rates){

let first=africanCurrencies[0]

document.getElementById("heroPair").innerText=
currentBase+" → "+first

document.getElementById("heroValue").innerText=
rates[first].toFixed(2)

document.getElementById("updateTime").innerText=
"Updated "+new Date().toLocaleDateString()

}

init()