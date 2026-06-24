import { transactions, addToTransactions, removeFromTransactions, loadTransactionForEditing, updateTransaction} from "../data/transactionsData.js";


import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

let editingIndex = null;

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
              <td class="action-buttons">
              <button class="edit-button js-edit-button" data-index="${index}">
                <img class="edit-button-icon" src="icons/edit-black-pencil-28048.svg" alt="edit icon"/>
                <span class="tooltip">Edit</span>
              </button>

              <button class="delete-button js-delete-button" data-index="${index}">
                <img class="delete-button-icon" src="icons/delete-10408.svg" alt="delete icon"/>
                <span class="tooltip">Delete</span>
              </button></td>
        </tr>
        `;

    });
    document.querySelector('.js-transaction-table-body')
    .innerHTML=tableHTML;

    //adding eventlisteners to delete buttons every time we render 
    document.querySelectorAll('.js-delete-button')
        .forEach((button)=>{
            button.addEventListener('click', ()=>{
                removeFromTransactions(Number(button.dataset.index));
                renderTableHTML();
            });
        });



     //adding eventlisteners to edit buttons every time we render 
    document.querySelectorAll('.js-edit-button')
        .forEach((button)=>{
            button.addEventListener('click', ()=>{
                editingIndex = Number(button.dataset.index);
                loadTransactionForEditing(editingIndex);
            });
        });
            
}

renderTableHTML();



function resetTransactionForm() {
    document.querySelector('.js-date-input').value = '';
    document.querySelector('.js-description-input').value = '';
    document.querySelector('.js-category-input').selectedIndex = 0;
    document.querySelector('.js-type-input').selectedIndex = 0;
    document.querySelector('.js-amount-input').value = '';
}


const addTransactionButton = document.querySelector('.js-add-transaction-button');
const transactionForm = document.querySelector('.js-transaction-form');

addTransactionButton.addEventListener('click', () => {
    
    if (transactionForm.classList.contains('show-form')) {
    addTransactionButton.innerHTML = '+ Add Transaction';
    addTransactionButton.classList.remove('close-transaction');
    transactionForm.classList.remove('show-form');

    editingIndex = null;

    document.querySelector('.js-save-transaction-button')
    .innerHTML = 'Save Transaction';
    resetTransactionForm();


    } else {
        addTransactionButton.innerHTML = '- Close Transaction';
        addTransactionButton.classList.add('close-transaction');
        transactionForm.classList.add('show-form');
    }
});

//when save transaction is clicked
document.querySelector('.js-save-transaction-button').addEventListener('click',()=>{

    const selectedDate =document.querySelector('.js-date-input').value;
    const date = selectedDate || dayjs().format('YYYY-MM-DD');
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
        date: date,
        description: description,
        category: category,
        type: type,
        amountCents: amountCents
    };

    if(editingIndex===null){
        addToTransactions(transObj);
    }else{
        updateTransaction(editingIndex, transObj);

        editingIndex=null;

        document.querySelector('.js-save-transaction-button').innerHTML = 'Save Transaction';
    }
   
    // console.log(transObj);
    // addToTransactions(transObj);

    // console.log('break');
    // console.log(transactions);

    renderTableHTML();
    resetTransactionForm();

    addTransactionButton.innerHTML = '+ Add Transaction';
    addTransactionButton.classList.remove('close-transaction');
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