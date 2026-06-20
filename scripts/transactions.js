import { transactions, addToTransactions } from "../data/transactionsData.js";

//function to generate html for table and load the table on the page
function renderTableHTML(){
    let tableHTML='';
    transactions.forEach((transaction)=>{
        let sign='+';
        if(transaction.type==='Income'){
            sign='+';
        }else{
            sign='-';
        }
        tableHTML+=`
        <tr>
              <td>${transaction.date}</td>
              <td>${transaction.description}</td>
              <td>${transaction.category}</td>
              <td>${transaction.type}</td>
              <td>${sign}$${transaction.amount}</td>
              <td>Edit Delete</td>
        </tr>
        `;

    });
    document.querySelector('.js-transaction-table-body')
    .innerHTML=tableHTML;
     
}

renderTableHTML();


const addTransactionButton = document.querySelector('.js-add-transaction-button');
const transactionForm = document.querySelector('.js-transaction-form');

addTransactionButton.addEventListener('click', () => {
    
    if (transactionForm.classList.contains('show-form')) {
    addTransactionButton.innerHTML = '+ Add Transaction';
    transactionForm.classList.remove('show-form');
    } else {
        addTransactionButton.innerHTML = '- Close Transaction';
        transactionForm.classList.add('show-form');
    }
});

//when save transaction is clicked
document.querySelector('.js-save-transaction-button').addEventListener('click',()=>{
    const description = document.querySelector('.js-description-input').value;
    const category = document.querySelector('.js-category-input').value;
    const type = document.querySelector('.js-type-input').value;
    const amount = document.querySelector('.js-amount-input').value;
    const transObj={
        description: description,
        category: category,
        type: type,
        amount: amount
    };
    //if amount is blank then it will do nothing, not saving data, and not even make the form hidden.
     if (amount === '') {
        alert('Please enter an amount.');
        return;
    }
    // console.log(transObj);
    addToTransactions(transObj);

    // console.log('break');
    // console.log(transactions);

    renderTableHTML();
    document.querySelector('.js-description-input').value = '';

    document.querySelector('.js-category-input').selectedIndex = 0;

    document.querySelector('.js-type-input').selectedIndex = 0;

    document.querySelector('.js-amount-input').value = '';

    addTransactionButton.innerHTML = '+ Add Transaction';
    transactionForm.classList.remove('show-form');




});