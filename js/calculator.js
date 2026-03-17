document.addEventListener("DOMContentLoaded", () => {

const overlay = document.getElementById("calculatorOverlay")
const ads = document.getElementById("adBanner")

const fromSelect = document.getElementById("fromCurrency")
const toSelect = document.getElementById("toCurrency")
const amountInput = document.getElementById("amount")
const resultBox = document.getElementById("result")

document.getElementById("openCalculator").onclick = () => {
overlay.style.display = "flex"
ads.style.display = "none"
}

overlay.onclick = e => {
if(e.target === overlay){
overlay.style.display = "none"
ads.style.display = "flex"
}
}

  
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

/*const overlay = document.getElementById("calculatorOverlay")

const fromSelect = document.getElementById("fromCurrency")
const toSelect = document.getElementById("toCurrency")
const amountInput = document.getElementById("amount")
const resultBox = document.getElementById("result")*/

/* OPEN CALCULATOR */

/*document.getElementById("openCalculator").onclick = () => {
overlay.style.display = "flex"
}*/

/* CLOSE WHEN CLICKING OUTSIDE */

/*overlay.onclick = e => {
if(e.target === overlay){
overlay.style.display = "none"
}
}*/

/* POPULATE CURRENCIES */

function loadCurrencies(){

const codes = Object.keys(currencyMeta).sort()

fromSelect.innerHTML = ""
toSelect.innerHTML = ""

codes.forEach(code => {

const meta = currencyMeta[code]

const option1 = document.createElement("option")
option1.value = code
option1.textContent = `${code} — ${meta.country}`

const option2 = option1.cloneNode(true)

fromSelect.appendChild(option1)
toSelect.appendChild(option2)

})

/* DEFAULT SELECTION */

fromSelect.value = "USD"
toSelect.value = "NGN"

}

/* FORMAT NUMBER */

function formatNumber(num){

return Number(num).toLocaleString(undefined,{
maximumFractionDigits:5
})

}

/* CALCULATE */

document.getElementById("calculate").onclick = () => {

const from = fromSelect.value
const to = toSelect.value
const amount = parseFloat(amountInput.value)

if(!amount || !rates[from] || !rates[to]){
resultBox.innerText = "Invalid input"
return
}

const baseRate = Number(rates[from])
const targetRate = Number(rates[to])

const converted = (targetRate / baseRate) * amount

const symbol = currencyMeta[to]?.symbol || ""

resultBox.innerText = `${symbol} ${formatNumber(converted)}`

}

/* INITIALIZE */

loadCurrencies()

})
