import { transactions, addToTransactions, removeFromTransactions } from "../data/transactionsData.js";
import { formatCurrency } from "../utils/money.js";

//function to generate html for table and load the table on the page
function renderTableHTML(){
    let tableHTML='';
    transactions.forEach((transaction, index)=>{
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
              <td>${sign}$${formatCurrency(transaction.amountCents)}</td>
              <td><button class="edit-button js-edit-button" data-index="${index}">Edit</button><button class="delete-button js-delete-button" data-index="${index}">Delete</button></td>
        </tr>
        `;

    });
    document.querySelector('.js-transaction-table-body')
    .innerHTML=tableHTML;

    //adding eventlisteners to delete link every time we render 
    document.querySelectorAll('.js-delete-button')
        .forEach((button)=>{
            button.addEventListener('click', ()=>{
                removeFromTransactions(button.dataset.index);
                renderTableHTML();
            });
        });
            
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

    const amountInput = document.querySelector('.js-amount-input').value;
  
    //if amount is blank then it will do nothing, not saving data, and not even make the form hidden.
    if (amountInput === '') {
        alert('Please enter an amount.');
        return;
    }
    const amountCents = Math.round(Number(amountInput) * 100);
    const transObj={
        description: description,
        category: category,
        type: type,
        amountCents: amountCents
    };
   
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
//moved inside render function, so that everytime we render, the eventlistener adds to delete buttons
// document.querySelectorAll('.js-delete-button')
// .forEach((button)=>{
//     button.addEventListener('click', ()=>{
//         removeFromTransactions(button.dataset.index);
//         renderTableHTML();
//     });
// });