'use strict';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

const initialSettings = {
    bill: null,
    tip: 0,
    numberOfPeople: null,
    tipAmount: 0,
    total: 0,
}

let state = {...initialSettings}


window.addEventListener('DOMContentLoaded', () => {
    const inpBill = document.querySelector('#inpBill');
    const btnsTip = document.querySelectorAll('button[data-tip-value]');
    const inpTipCustom = document.querySelector('#inpTipCusom');
    const inpNumberOfPeople = document.querySelector('#inpNumberOfPeople');
    const elemTipAmount = document.querySelector('#tipAmountValue');
    const elemTotal = document.querySelector('#totalValue');
    const btnReset = document.querySelector('#btnReset');

    const updateState = (data = {}) => {
        state = Object.assign(state, data);

        calculate(state);
        renderApp();
        
        // console.log(state);
    }

    const showError = (elem, value) => {
        const elemWrapper = elem.parentElement.parentElement;

        if (!value) {
            elemWrapper.classList.add('is-error')
        } else {
            elemWrapper.classList.remove('is-error')
        }
    }

    const renderApp = () => {
        // Section Input
        inpBill.value = state.bill;
        showError(inpBill, state.bill);

        btnsTip.forEach(btn => {
            btn.classList.remove('btn--is-active');
        })

        const btnTip = document.querySelector(`button[data-tip-value="${state.tip}"]`)

        if (btnTip) {
            btnTip.classList.add('btn--is-active');
            inpTipCustom.value = '';
        } else {
            if (state.tip) {
                inpTipCustom.value = state.tip
            }
        }

        inpNumberOfPeople.value = state.numberOfPeople;
        showError(inpNumberOfPeople, state.numberOfPeople);

        // Section Total
        elemTipAmount.innerHTML = formatter.format(state.tipAmount);
        elemTotal.innerHTML = formatter.format(state.total);

        btnReset.disabled = false;
        btnReset.classList.add('btn--is-active')
    }

    const calculate = ({bill, tip, numberOfPeople}) => {
        if (!bill) return;
        if (!numberOfPeople) return;

        const pct = parseFloat(tip) / 100;
        const tipAmount = pct * bill;
        const total = bill + tipAmount;

        state.total = total / numberOfPeople;
        state.tipAmount = tipAmount / numberOfPeople
    }

    // Bill
    const inpBillHandler = () => {
        const bill = +inpBill.value;

        updateState({bill})
    }

    inpBill.addEventListener('change', inpBillHandler);

    // Buttons Tip Value
    const btnTipHandler = (e) => {
        const tip = +e.target.dataset.tipValue;

        updateState({tip});
    }

    btnsTip.forEach(btn => {
        btn.addEventListener('click', btnTipHandler)
    })

    // Custom Tip Value
    const inpTipCustomHandler = () => {
        const tip = +inpTipCustom.value;

        updateState({tip});
    }

    inpTipCustom.addEventListener('change', inpTipCustomHandler);


    // Number of People
    const inpNumberOfPeopleHandler = () => {
        const numberOfPeople = +inpNumberOfPeople.value;

        updateState({numberOfPeople})
    }

    inpNumberOfPeople.addEventListener('change', inpNumberOfPeopleHandler);

    const btnResetHandler = () => {
        
        updateState(initialSettings);
        document.querySelectorAll('.field.is-error').forEach(elem => elem.classList.remove('is-error'));
        btnReset.classList.remove('btn--is-active');
        btnReset.disabled = true;
    }

    btnReset.addEventListener('click', btnResetHandler);
})