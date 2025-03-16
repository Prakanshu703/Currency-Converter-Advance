const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left"); // Swap Icon

// Set default amount to 0 and clear message
amountInput.value = "0";
msg.innerText = ""; // Clear default result message

// Populating dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update the flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to swap "From" and "To" currencies
const swapCurrencies = () => {
  let tempValue = fromCurr.value; // Store "From" currency
  fromCurr.value = toCurr.value;  // Assign "To" currency to "From"
  toCurr.value = tempValue;       // Assign stored "From" currency to "To"

  updateFlag(fromCurr); // Update flag for "From" currency
  updateFlag(toCurr);   // Update flag for "To" currency

  msg.innerText = ""; // Clear the previous exchange rate message
};

// Function to fetch and update the exchange rate
const updateExchangeRate = async () => {
  let amtVal = amountInput.value.trim();

  // Prevent fetching if amount is 0, empty, or not a valid number
  if (amtVal === "" || amtVal === "0" || isNaN(amtVal)) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  try {
    const URL = `${BASE_URL}/${fromCurr.value}`;
    console.log("Fetching:", URL);

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    let data = await response.json();
    console.log("API Response:", data);

    if (!data.rates) {
      throw new Error("Invalid response structure. No rates found.");
    }

    let rate = data.rates[toCurr.value];
    if (!rate) {
      throw new Error(`Exchange rate for ${toCurr.value} not found.`);
    }

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again.";
    console.error("Fetch Error:", error);
  }
};

// Button click event to fetch exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Click event to swap currencies when the arrow icon is clicked
swapBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  swapCurrencies();
});
