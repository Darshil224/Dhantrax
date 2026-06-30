import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
export let transactions;
loadFromStorage();

export function loadFromStorage(){
    transactions= JSON.parse(localStorage.getItem('transactions'));
    if(!transactions){
            transactions = [{
                id: crypto.randomUUID(),
                createdAt: dayjs().toISOString(),
                date: 'default1',
                description: 'Salary1',
                category: 'Income1',
                type: 'Income1',
                amountCents: 0
            },
            {   
                id: crypto.randomUUID(),
                createdAt: dayjs().toISOString(),
                date: 'default2',
                description: 'Pizza2',
                category: 'Food2',
                type: 'Expense2',
                amountCents: 0
            }];
    }
}



function saveToStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function addToTransactions(transObj){
     transactions.push({
        id: crypto.randomUUID(),
        createdAt: dayjs().toISOString(),
        date: transObj.date,
        description: transObj.description,
        category: transObj.category,
        type: transObj.type,
        amountCents: Number(transObj.amountCents)
     });
    saveToStorage();
     
}

export function removeFromTransactions(index){
    transactions.splice(index, 1);
    saveToStorage();
}

export function calculateStats(){
   
    let monthlyIncomeCents=0;
    let monthlyExpenseCents=0;
    let totalBalanceCents=0;
    const today= dayjs();
    
    transactions.forEach((transaction)=>{
        const transactionDate = dayjs(transaction.date);

        if(today.month()===transactionDate.month()&&today.year()===transactionDate.year()){
            if(transaction.type==='Income'){
                monthlyIncomeCents+=transaction.amountCents;
            }else if(transaction.type==='Expense'){
                monthlyExpenseCents+=transaction.amountCents;
            }
        }

        if(transaction.type==='Income'){
            totalBalanceCents+=transaction.amountCents;
        }else if(transaction.type==='Expense'){
            totalBalanceCents-=transaction.amountCents;
        }
    
    })
    const monthlyBalanceCents =monthlyIncomeCents-monthlyExpenseCents;
    let savingsRate=0;
    if(monthlyIncomeCents>0){
        savingsRate=(monthlyBalanceCents /monthlyIncomeCents)*100;
    }
    return {
        monthlyIncomeCents,
        monthlyExpenseCents,
        totalBalanceCents,
        savingsRate

    };
}



export function loadTransactionForEditing(index){
   


    const addTransactionButton = document.querySelector('.js-add-transaction-button');
    const transactionForm = document.querySelector('.js-transaction-form');

    if (!transactionForm.classList.contains('show-form')) {
        transactionForm.classList.add('show-form');
    }
    addTransactionButton.innerHTML = '- Close Transaction';
    addTransactionButton.classList.add('close-transaction');

    const tObj=transactions[index];
    

    document.querySelector('.js-date-input').value = tObj.date;

    document.querySelector('.js-description-input').value = tObj.description;

    document.querySelector('.js-category-input').value = tObj.category;

    document.querySelector('.js-type-input').value = tObj.type;

    document.querySelector('.js-amount-input').value = formatCurrency(tObj.amountCents);

    const saveButton= document.querySelector('.js-save-transaction-button');
    saveButton.innerHTML='Edit And Save';

}
export function updateTransaction(index, transObj){
    transactions[index]={
        id: transactions[index].id,
        createdAt: transactions[index].createdAt,
        date: transObj.date,
        description: transObj.description,
        category: transObj.category,
        type: transObj.type,
        amountCents: transObj.amountCents
    };
    saveToStorage();
}


