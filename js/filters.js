function renderFilters(list){

const container = document.getElementById("currencyFilters")

container.innerHTML=""

list.sort().forEach(code=>{

const btn = document.createElement("button")

btn.innerText = code

btn.onclick = (e)=>selectCurrency(code,e)

container.appendChild(btn)

})

}

function selectCurrency(base, e){
  const cards = document.querySelectorAll("#currencyCards .card")
  cards.forEach(card => {
    if(card.dataset.base === base){
      card.style.display = "flex"  // or "block" depending on your CSS
    }else{
      card.style.display = "none"
    }
  })

  document.querySelectorAll("#currencyFilters button")
    .forEach(btn=>btn.classList.remove("active"))

  e.target.classList.add("active")
}

const tabs = document.querySelectorAll(".tabs span")
tabs.forEach(tab=>{
  tab.onclick = () => {
    tabs.forEach(t=>t.classList.remove("active"))
    tab.classList.add("active")
    const list = tab.innerText === "African" ? window.africanCurrencies : window.topCurrencies
    renderFilters(list)
    // Optionally show first currency in the list
    selectCurrency(list[0], {target: document.querySelector(`#currencyFilters button:first-child`)})
  }
})
