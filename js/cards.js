function renderCards(rates,african){

const container=document.getElementById("currencyCards")

container.innerHTML=""

african.forEach(code=>{

const rate=rates[code]

const card=document.createElement("div")

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