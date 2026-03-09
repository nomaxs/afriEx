function renderCards(rates,currencies,base="USD"){

const container = document.getElementById("currencyCards")

container.innerHTML=""

currencies.forEach(code=>{

if(code===base) return

const rate = (rates[code]/rates[base]).toFixed(2)

const card = document.createElement("div")

card.className="card"

card.innerHTML=`

<div class="cardLeft">

<div class="currencyIcon">¢</div>

<div class="currencyName">${code}</div>

</div>

<div class="rate">${rate}</div>

`

container.appendChild(card)

})

}
