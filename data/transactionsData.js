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
                amountCents: 0
            },
            {
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
    
    transactions.forEach((transaction)=>{
        if(transaction.type==='Income'){
            monthlyIncomeCents+=transaction.amountCents;
        }else if(transaction.type==='Expense'){
            monthlyExpenseCents+=transaction.amountCents;
        }
    })
    const totalBalanceCents=monthlyIncomeCents-monthlyExpenseCents;
    let savingsRate=0;
    if(monthlyIncomeCents>0){
        savingsRate=(totalBalanceCents/monthlyIncomeCents)*100;
    }
    return {
        monthlyIncomeCents,
        monthlyExpenseCents,
        totalBalanceCents,
        savingsRate

    };
}
