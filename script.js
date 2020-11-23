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
     calculate();
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
  
  const calculate = () => {
    const resultSecond = amountTwo.value / currency.value;
    let takeCurrencyName = currency.options[currency.selectedIndex].text;

    rateEl.innerText = `1 ${takeCurrencyName} = ${currency.value} RON`;
    amountResult.innerText = (amount.value * currency.value).toFixed(2);
  
    amountResultTwo.innerText = resultSecond.toFixed(2);
    currencyName.innerText = takeCurrencyName;
    sumRon.innerText = `1 RON = ${(1/currency.value).toFixed(4)} ${takeCurrencyName}`
  }


  // Event listener
  currency.addEventListener('change', calculate);
  amount.addEventListener('input', calculate);
  amountTwo.addEventListener('input', calculate)
});

