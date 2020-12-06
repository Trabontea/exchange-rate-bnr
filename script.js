document.addEventListener('DOMContentLoaded', () => {
  let url = "https://www.bnro.ro/nbrfxrates.xml";
  const bankName = 'js-bank';
  const publishingDate = 'js-publishing-date';
  const amount = document.querySelector('.js-amount'); // input amount 
  const currency =  document.querySelector('.js-rate-list');
  let amountResult = document.querySelector('.js-result'); // The result calculated
  const rateEl = document.querySelector('.js-rate');
  const sumRon = document.querySelector('.js-ron');
  const amountTwo = document.querySelector('.js-amount-second'); // input amount 
  let amountResultTwo = document.querySelector('.js-result-second');
  let currencyName = document.querySelector('.js-currency-name');
  let resultFirst;
  let resultSecond;
  let showChangeRateOne; 
  let showChangeRateTwo; 


  fetch(url)
  .then(response=>response.text())
  .then(data => {
    // console.log(data)
    let parser =  new DOMParser();
    let xml = parser.parseFromString(data, "application/xhtml+xml")
   // console.dir(xml)
    buildPage(xml)
  })

  // Create elements on page
  const buildPage = (info) => {
     //console.log('info', info)
     let name = info.getElementsByTagName('Publisher');
     let date  = info.getElementsByTagName('PublishingDate');
     let rate = info.getElementsByTagName('Rate')
     createSingleElement(name, bankName);
     createSingleElement(date, publishingDate);
     createRateSelected(rate);
     showResults();
  }

  // Create simple lement
  const createSingleElement = (collection, element) => {
    for (let item of collection) {
      document.querySelector(`.${element}`).innerHTML = item.innerHTML;
    }
  }

  // Create select element with rates
  const createRateSelected = (rate) => {
    console.log('Rate::', rate)
    for(let item of rate) {
      let currencyName = item.getAttribute('currency');
      let currencyMultiplier = item.getAttribute('multiplier');
      let currencyValue = item.textContent;
      let option = document.createElement('option')
      option.textContent = currencyName;
      option.setAttribute('value', currencyValue);
      if (item.getAttribute('multiplier')) {
        option.setAttribute('multiplier', currencyMultiplier);
      }
      currency.appendChild(option);
    }
  }
  
  const showResults = () => {
    let multiplier = currency.options[currency.selectedIndex].getAttribute('multiplier');
    let takeCurrencyName = currency.options[currency.selectedIndex].text;

    if(!multiplier) {
      calculateRates('1', takeCurrencyName);
    } else {
      calculateRates(multiplier, takeCurrencyName)
    }

    printResults(takeCurrencyName); 
  }

  // Calculate rates
const calculateRates = (multiplier, currencyName) => {
    showChangeRateOne = `1 ${currencyName} = ${(currency.value / multiplier).toFixed(4)} RON`;
    showChangeRateTwo = `1 RON = ${(1/currency.value * multiplier).toFixed(4)} ${currencyName}`;
    resultFirst = (amount.value * currency.value / multiplier).toFixed(2);
    resultSecond = (amountTwo.value / currency.value * multiplier).toFixed(2);
  }

   // Show results
  const printResults = (takeCurrencyName) => {
    amountResult.innerText = resultFirst;
    amountResultTwo.innerText = resultSecond;
    currencyName.innerText = takeCurrencyName;
    rateEl.innerText = showChangeRateOne;
    sumRon.innerText = showChangeRateTwo;
  }

  // Event listener
  currency.addEventListener('change', showResults);
  amount.addEventListener('input', showResults);
  amountTwo.addEventListener('input', showResults)
});

