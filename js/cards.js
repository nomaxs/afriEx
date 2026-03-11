function renderCards(rates, african, top) {
  const container = document.getElementById("currencyCards");
  container.innerHTML = "";

  const currencies = [...african, ...top].sort();

  // Currency symbols and flags (can be local images in /images/flags/)
  const symbols = {
    USD: "$", NGN: "₦", GHS: "GH₵", KES: "KSh", ZAR: "R", EGP: "£",
    AOA: "Kz", AED: "د.إ", EUR: "€", GBP: "£", CNY: "¥"
  };

  const flags = {
    USD: "us", NGN: "ng", GHS: "gh", KES: "ke", ZAR: "za", EGP: "eg",
    AOA: "ao", AED: "ae", EUR: "eu", GBP: "gb", CNY: "cn"
  };

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base === target) return;

      const rate = (rates[target] / rates[base]).toFixed(4);

      const card = document.createElement("div");
      card.className = `card card-${base}`;
      card.dataset.base = base;
      card.dataset.target = target;

      card.innerHTML = `
        <div class="cardRow">
          <div class="currencyInfo">
            <img class="flag" src="images/flags/${flags[base] || 'na'}.png" alt="${base} flag">
            <span class="currencyName">${base}</span>
          </div>
          <div class="currencyInfo">
            <img class="flag" src="images/flags/${flags[target] || 'na'}.png" alt="${target} flag">
            <span class="currencyName">${target}</span>
          </div>
        </div>
        <div class="cardRow">
          <div class="rateInfo">
            <span class="symbol">${symbols[base] || '¢'}</span> → <span class="symbol">${symbols[target] || '¢'}</span>
          </div>
        </div>
        <div class="cardRow">
          <div class="amount">
            ${symbols[target] || '¢'}${rate}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  });
}
