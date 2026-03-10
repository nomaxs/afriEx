function renderCards(rates, african, top){
  const container = document.getElementById("currencyCards")
  container.innerHTML = ""
  const currencies = [...african, ...top].sort()

  currencies.forEach(base=>{
    currencies.forEach(target=>{
      if(base === target) return
      const rate = (rates[target]/rates[base]).toFixed(4)
      const card = document.createElement("div")
      card.className = `card card-${base}`
      card.dataset.base = base
      card.dataset.target = target
      card.innerHTML = `
        <div class="cardLeft">
          <div class="currencyIcon">¢</div>
          <div class="currencyName">${base} → ${target}</div>
        </div>
        <div class="rate">${rate}</div>
      `
      container.appendChild(card)
    })
  })
}
