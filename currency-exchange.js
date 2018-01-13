const currentDocument = document.currentScript.ownerDocument;

class CurrencyExchange extends HTMLElement {
    constructor() {
        super();
    }


    // Called when element is inserted in DOM
    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = currentDocument.querySelector('#currency-exchange-template');
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance);
        
        shadowRoot.querySelector('.disclaimer').addEventListener('click', e => {
            this.toggleDisclaimer();
        }) ;

        shadowRoot.querySelector('#amount-from').addEventListener('blur', e => {
            this.calculateRate(shadowRoot);
        }) ;

        shadowRoot.querySelector('#currency-from').addEventListener('change', e => {
            this.calculateRate(shadowRoot);
        }) ;

        shadowRoot.querySelector('#currency-to').addEventListener('change', e => {
            this.calculateRate(shadowRoot);
        }) ;
    }

        calculateRate(shadowRoot) {
            const currencyFrom = shadowRoot.querySelector('#currency-from').value;
            const currencyTo = shadowRoot.querySelector('#currency-to').value;

            if (currencyFrom === currencyTo) {
                this.render(shadowRoot, 1);
                return;
            }

            fetch(`https://api.fixer.io/latest?base=${currencyFrom}&symbols=${currencyTo}`)
              .then((response) => response.json())
              .then((data) => {
                // todo: cache exchange rate
                
                this.render(shadowRoot, data.rates[currencyTo]);
            })
            .catch((error) => {
                console.error(error);
            });
        }

        render(shadowRoot, rate) {
            const amountFrom = shadowRoot.querySelector('#amount-from').value;
            shadowRoot.querySelector('#amount-to').value = parseFloat(Math.round(amountFrom * rate * 100) / 100).toFixed(2);
        }

        toggleDisclaimer() {
            let elem = this.shadowRoot.querySelector('.disclaimerContent');
            elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
        }
}

customElements.define('currency-exchange', CurrencyExchange);