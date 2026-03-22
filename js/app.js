async function init() {

  // 1. Load rates from cache or API
  let rates = getCache()
  if (!rates) {
    rates = await fetchRates()
    setCache(rates)
  }
  window.rates = rates

  // 2. Load currency lists
  const african = await fetch("data/africanCurrencies.json").then(r => r.json())
  const top = await fetch("data/topCurrencies.json").then(r => r.json())

  window.africanCurrencies = african
  window.topCurrencies = top

  // 3. Render filters (default Non-African tab)
  renderFilters(top)

  // 4. Select first currency by default
  const firstBtn = document.querySelector("#currencyFilters button:first-child")
  if (firstBtn) {
    selectCurrency(firstBtn.innerText, { target: firstBtn })
  }

  // 5. Populate calculator dropdowns
  populateCalculator([...african, ...top])
}

// Run init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  init()
})
