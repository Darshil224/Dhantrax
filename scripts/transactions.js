import { transactions, addToTransactions, removeFromTransactions, loadTransactionForEditing, updateTransaction} from "../data/transactionsData.js";


import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { categoryIcons } from "../data/categoryIcons.js";
import { categoryColors } from "../data/categoryColors.js";

let editingIndex = null;

//function to generate html for table and load the table on the page
function renderTableHTML(transactionsToRender){
    let tableHTML='';
    const sortedTransactions = [...transactionsToRender]; //creating a exact copy of transactions. btw: const sortedTransactions =transactions; is wrong, bcz it dont make a copy, it just points to that same array.
    sortedTransactions.sort((a, b) => { //sorting bassed on dates, descending order of dates... and if dates are same, then for tiebreaker, sorting as descending order of created at value.

        const dateDifference =
            dayjs(b.date).valueOf() - dayjs(a.date).valueOf();

        if (dateDifference !== 0) {
            return dateDifference;
        }

        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();

    });

    sortedTransactions.forEach((transaction)=>{
        let sign='+';
        if(transaction.type==='Income'){
            sign='+';
        }else{
            sign='-';
        }
        const icon = categoryIcons[transaction.category];
        const iconColor=categoryColors[transaction.category];
        tableHTML+=`
        <tr>
              <td>${dayjs(transaction.date).format('MMM D, YYYY')}</td>
              <td>${transaction.description}</td>
              <td><div class="transaction-category-td-div"><i class="fa-solid ${icon}" style="color: ${iconColor};"> </i>${transaction.category}</div></td>
              <td class="td-${transaction.type.toLowerCase()}">${transaction.type}</td>
              <td class="td-transaction-amount td-${transaction.type.toLowerCase()}">${sign}$${formatCurrency(transaction.amountCents)}</td>
              <td class="action-buttons">
              <button class="edit-button js-edit-button" data-id="${transaction.id}">
                <img class="edit-button-icon" src="icons/edit-black-pencil-28048.svg" alt="edit icon"/>
                <span class="tooltip">Edit</span>
              </button>

              <button class="delete-button js-delete-button" data-id="${transaction.id}">
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
                if (confirm('Are you sure you want to delete this transaction permanently?') === false) {
                    return;
                }
                const index = transactions.findIndex((transaction) => {
                    return transaction.id === button.dataset.id;
                });
                /*
                //the above code works same as this for loop:-
                let index = -1;

                for (let i = 0; i < transactions.length; i++) {

                    if (transactions[i].id === button.dataset.id) {
                        index = i;
                        break;
                    }

                }
                */
                removeFromTransactions(index);
                renderTableHTML(transactions);
            });
        });



     //adding eventlisteners to edit buttons every time we render 
    document.querySelectorAll('.js-edit-button')
        .forEach((button)=>{
            button.addEventListener('click', ()=>{

                const index = transactions.findIndex((transaction) => {
                    return transaction.id === button.dataset.id;
                });

                editingIndex = index;
                loadTransactionForEditing(editingIndex);
            });
        });
            
}

renderTableHTML(transactions);



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
  
    //if category is blank, then it will do nothing
    if (category === '') {
        alert('Please select a transaction category.');
        return;
    }
    //if type is blank, then it will do nothing
    if (type === '') {
        alert('Please select a transaction type.');
        return;
    }
    //if amount is blank then it will do nothing, not saving data, and not even make the form hidden.
    if (amountInput === '') {
        alert('Please enter an amount.');
        return;
    }
    //if amount is less than 0, it will do nothing, not saving data, and not even make the form hidden.
    if (amountInput<0) {
        alert('Please enter an amount greater than 0.');
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

    renderTableHTML(transactions);
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
//         renderTableHTML(transactions);
//     });
// });

//filters:-

const typeFilter = document.querySelector('.js-type-filter');
const categoryFilter = document.querySelector('.js-category-filter');
const monthFilter = document.querySelector('.js-month-filter');

function updateTableByFilters(){
    let filteredTransactions=transactions; //we dont need to make a copy, bcz .filter() gives new array and dont modifies the original array

    

    const typeValue=typeFilter.value;
    const categoryValue=categoryFilter.value;
    const monthValue=monthFilter.value;

    filteredTransactions = filteredTransactions.filter((transaction) => {
            return typeValue === '' || transaction.type === typeValue;
    });
    filteredTransactions = filteredTransactions.filter((transaction) => {
            return categoryValue === '' || transaction.category === categoryValue;
    });
    filteredTransactions = filteredTransactions.filter((transaction) => {
            return monthValue===''|| dayjs(transaction.date).month() === Number(monthValue);
    });

    renderTableHTML(filteredTransactions);
}




typeFilter.addEventListener('change', () => {
    updateTableByFilters();
});
categoryFilter.addEventListener('change', () => {
    updateTableByFilters();
});
monthFilter.addEventListener('change', () => {
    updateTableByFilters();
});