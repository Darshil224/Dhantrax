export let transactions;
loadFromStorage();

export function loadFromStorage(){
    transactions= JSON.parse(localStorage.getItem('transactions'));
    if(!transactions){
            transactions = [{
                date: 'default1',
                description: 'Salary1',
                category: 'Income1',
                type: 'Income1',
                amount: '0'
            },
            {
                date: 'default2',
                description: 'Pizza2',
                category: 'Food2',
                type: 'Expense2',
                amount: '0'
            }];
    }
}



function saveToStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function addToTransactions(transObj){
     transactions.push({
        date: 'todays date',
        description: transObj.description,
        category: transObj.category,
        type: transObj.type,
        amount: transObj.amount
     });
    saveToStorage();
     
}