const currency = document.querySelector("#currency");
const rateDisplay = document.querySelector("#rate");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");
const cadOption = document.querySelector('option[value="CAD"]');
const prices = document.querySelectorAll(".price");

let wonPerDollar = 0;

function updatePrices() {
  for (const price of prices) {
    const won = Number(price.dataset.krw);

    if (currency.value === "CAD") {
      price.textContent = "CA$" + (won / wonPerDollar).toFixed(2);
    } else {
      price.textContent = "₩" + won.toLocaleString("en-CA");
    }
  }
}

async function loadRate() {
  retryButton.hidden = true;
  statusText.textContent = "Loading the latest rate…";

  try {
    const response = await fetch("https://api.frankfurter.dev/v1/latest");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();

    const rate = data.rates.KRW / data.rates.CAD;

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Invalid CAD or KRW rate");
    }

    wonPerDollar = rate;
    rateDisplay.textContent = "CA$1 = ₩" + rate.toFixed(2);
    statusText.textContent = "Rate date: " + data.date;
    cadOption.disabled = false;
    updatePrices();
  } catch (error) {
    console.error("Exchange rate request failed:", error);
    currency.value = "KRW";
    cadOption.disabled = true;
    updatePrices();
    rateDisplay.textContent = "CAD / KRW";
    statusText.textContent = "Could not load the rate. Showing prices in won.";
    retryButton.hidden = false;
  }
}

currency.addEventListener("change", updatePrices);
retryButton.addEventListener("click", loadRate);
loadRate();