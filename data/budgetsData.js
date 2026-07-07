import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { calculateCategorySpending } from "../utils/transactionCalculations.js";

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

export function calculateBudgetCardData(budget){
    const today=dayjs();
    const month=today.month();
    const year=today.year();
    const categorySpendingCents = calculateCategorySpending(month, year);
    const budgetAmountCents=budget.budgetAmountCents;
    const amountSpentCents=categorySpendingCents[budget.category];
    const remainingCents=budgetAmountCents-amountSpentCents;
    const percentageSpent=(amountSpentCents/budgetAmountCents)*100;

    return{
        budgetAmountCents,
        amountSpentCents,
        remainingCents,
        percentageSpent
    }
}

export function loadBudgetForEditing(index){
   


    const addBudgetButton = document.querySelector('.js-add-budget-button');
    const budgetForm = document.querySelector('.js-budget-form');

    if (!budgetForm.classList.contains('show-form')) {
        budgetForm.classList.add('show-form');
    }
    addBudgetButton.innerHTML = '- Close Budget';
    addBudgetButton.classList.add('close-budget');

    const bObj=budgets[index];
    


    document.querySelector('.js-budget-category-input').value = bObj.category;
    document.querySelector('.js-budget-amount-input').value = formatCurrency(bObj.budgetAmountCents);

    const saveButton= document.querySelector('.js-save-budget-button');
    saveButton.innerHTML='Update Budget';

}

export function updateBudget(index, budgObj){
    budgets[index]={
        id: budgets[index].id,
        category: budgObj.category,
        budgetAmountCents: budgObj.budgetAmountCents
    };
    saveBudgetsToStorage();
}