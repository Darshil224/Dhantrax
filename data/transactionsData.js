export let transactions = [{
    date: 'May 30, 2026',
    description: 'Salary',
    category: 'Income',
    type: 'Income',
    amount: '1000'
},
{
    date: 'May 31, 2026',
    description: 'Pizza',
    category: 'Food',
    type: 'Expense',
    amount: '1000'
}];

export function addToTransactions(transObj){
     transactions.push({
        date: 'todays date',
        description: transObj.description,
        category: transObj.category,
        type: transObj.type,
        amount: transObj.amount
     });
}