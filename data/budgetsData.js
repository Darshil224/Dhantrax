import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export let budgets;

loadBudgetsFromStorage();

export function loadBudgetsFromStorage(){
    budgets= JSON.parse(localStorage.getItem('budgets'));
    if(!budgets){
        budgets=[
            {
                id: crypto.randomUUID(),
                category: 'Food',
                budgetAmountCents: 25000
            },
            {
                id: crypto.randomUUID(),
                category: 'Transportation',
                budgetAmountCents: 10000
            },
            {
                id: crypto.randomUUID(),
                category: 'Shopping',
                budgetAmountCents: 12000
            }
        ];
    }
}

function saveBudgetsToStorage(){
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

export function addToBudgets(budgObj){
     budgets.push({
        id: crypto.randomUUID(),
        
        category: budgObj.category,
        
        budgetAmountCents: Number(budgObj.budgetAmountCents)
     });
    saveBudgetsToStorage();
     
}

export function removeFromBudgets(index){
    budgets.splice(index, 1);
    saveBudgetsToStorage();
}