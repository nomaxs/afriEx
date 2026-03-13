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

function renderCards(rates, african, top){

const container = document.getElementById("currencyCards")
container.innerHTML=""

const currencies=[...african,...top].sort()

currencies.forEach(base=>{
currencies.forEach(target=>{

if(base===target) return

let rate = "N/A"

if(rates[target] !== undefined && rates[base] !== undefined){

const baseRate = Number(rates[base])
const targetRate = Number(rates[target])

rate = (targetRate / baseRate).toFixed(5)

}

const baseMeta = currencyMeta[base] || {country:base, symbol:"", flag:"na"}
const targetMeta = currencyMeta[target] || {country:target, symbol:"", flag:"na"}

const card = document.createElement("div")
card.className="card"
card.dataset.base=base
card.dataset.target=target

card.innerHTML=`

<div class="cardRow">

<div class="currencyInfo">
<img class="flag"
loading="lazy"
width="24"
height="16"
src="images/flags/${baseMeta.flag}.png"
alt="${baseMeta.country} flag">

<span class="currencyCode">${base}</span>
</div>

<div class="currencyInfo">
<img class="flag"
loading="lazy"
width="24"
height="16"
src="images/flags/${targetMeta.flag}.png"
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

`

container.appendChild(card)

})
})

}
