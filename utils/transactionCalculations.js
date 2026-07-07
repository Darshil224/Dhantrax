import { transactions } from "../data/transactionsData.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';


export function calculateCategorySpending(month, year){
    const categorySpendingCents={
    Food: 0,
    Transportation: 0,
    Shopping: 0,
    Housing: 0,
    Bills: 0,
    Healthcare: 0,
    Education: 0,
    Entertainment:0,
    Travel: 0,
    Other: 0
    }
    const today=dayjs();
    transactions.forEach(transaction => {
        const transactionDate = dayjs(transaction.date);
         if(month===transactionDate.month()&&year===transactionDate.year()&&transaction.type==='Expense'){
            categorySpendingCents[transaction.category]+=transaction.amountCents;
         }
    });
    return categorySpendingCents;
}