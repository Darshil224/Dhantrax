const addTransactionButton = document.querySelector('.js-add-transaction-button');
const transactionForm = document.querySelector('.transaction-form');

addTransactionButton.addEventListener('click', () => {
    transactionForm.classList.add('show-form');
});