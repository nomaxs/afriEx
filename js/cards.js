function renderCards(rates, african, top) {
  const container = document.getElementById("currencyCards");
  container.innerHTML = "";

  const currencies = [...african, ...top].sort();

  currencies.forEach(base => {
    currencies.forEach(target => {
      if (base === target) return;

      const rate = (rates[target] / rates[base]).toFixed(4);

      const card = document.createElement("div");
      card.className = `card card-${base}`;
      card.dataset.base = base;
      card.dataset.target = target;

      // Use currency symbol if available, otherwise default to ¢
      const symbols = {
        USD: "$", NGN: "₦", GHS: "GH₵", KES: "KSh", ZAR: "R", EGP: "£",
        AOA: "Kz", AED: "د.إ", EUR: "€", GBP: "£", CNY: "¥"
        // add more if needed
      };
      const baseSymbol = symbols[base] || "*";
      const targetSymbol = symbols[target] || "*";

      card.innerHTML = `
        <div class="cardLeft">
          <div class="currencyIcon">${baseSymbol}</div>
          <div class="currencyName">${base} → ${target}</div>
        </div>
        <div class="rate">
          ${targetSymbol}${rate}
        </div>
      `;

      container.appendChild(card);
    });
  });
}
