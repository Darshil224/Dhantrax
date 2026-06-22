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
                amount: 0
            },
            {
                date: 'default2',
                description: 'Pizza2',
                category: 'Food2',
                type: 'Expense2',
                amount: 0
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
        amount: Number(transObj.amount)
     });
    saveToStorage();
     
}

export function removeFromTransactions(index){
    transactions.splice(index, 1);
    saveToStorage();
}

export function calculateStats(){
   
    let monthlyIncome=0;
    let monthlyExpense=0;
    
    transactions.forEach((transaction)=>{
        if(transaction.type==='Income'){
            monthlyIncome+=transaction.amount;
        }else if(transaction.type==='Expense'){
            monthlyExpense+=transaction.amount;
        }
    })
    const totalBalance=monthlyIncome-monthlyExpense;
    let savingsRate=0;
    if(monthlyIncome>0){
        savingsRate=(totalBalance/monthlyIncome)*100;
    }
    return {
        monthlyIncome,
        monthlyExpense,
        totalBalance,
        savingsRate

    };
}
