import { addToBudgets } from "../data/budgetsData.js";
import { budgets, removeFromBudgets } from "../data/budgetsData.js";
import { formatCurrency } from "../utils/money.js";
import { categoryIcons } from "../data/categoryIcons.js";
import { categoryColors } from "../data/categoryColors.js";

function renderBudgetsHTML(){
    let budgetsHTML='';
    budgets.forEach((budget)=>{
        const icon = categoryIcons[budget.category];
        const iconColor = categoryColors[budget.category];
    
        budgetsHTML+= `
        <div class="budgets-card">
            <div class="card-top">
              <div class="top-logo-container">
                <div class="icon-container" style="background-color: ${iconColor};"> 
                <i class="logo-icon fa-solid ${icon}"> </i>
                </div>
                
              </div>
              <div class="top-title">
                <p class="budgets-card-title">${budget.category}</p>
                <p class="budgets-card-subtitle">Budget: $${formatCurrency(budget.budgetAmountCents)}</p>
              </div>
            </div>
            <div class="card-mid">
              <p class="card-mid-text">Spent:$200.00</p>
              <p class="card-mid-text">Remaining:$100.00</p>
              <div class="mid-progress-bar">
                <div class="mid-progress-fill" style="background-color: ${iconColor};"></div>
              </div>
            </div>
            <div class="card-bottom">
              <div class="bottom-percent">67% of budget</div>
              <div class="bottom-amount">$100.00 left</div>
            </div>
          </div>
        
        `
    });
    document.querySelector('.budgets-card-grid')
    .innerHTML=budgetsHTML;
}
renderBudgetsHTML();


function resetBudgetForm() {
    document.querySelector('.js-budget-category-input').selectedIndex = 0;
    document.querySelector('.js-budget-amount-input').value = '';
}

//making the add budget button interactive
const addBudgetButton = document.querySelector('.js-add-budget-button');
const budgetForm =document.querySelector('.js-budget-form');
addBudgetButton.addEventListener('click',()=>{
  if(budgetForm.classList.contains('show-form')){
    budgetForm.classList.remove('show-form');

    addBudgetButton.innerHTML= '+ Add Budget';
    addBudgetButton.classList.remove('close-budget');
    resetBudgetForm();
   
  }else{
    budgetForm.classList.add('show-form');

    addBudgetButton.innerHTML='- Close Budget';
    addBudgetButton.classList.add('close-budget');
  }
})

//when save budget is clicked
document.querySelector('.js-save-budget-button').addEventListener('click',()=>{

  const category=document.querySelector('.js-budget-category-input').value;
  const amountInput=document.querySelector('.js-budget-amount-input').value;

  //validations:
  //if category is blank, then it will do nothing
    if (category === '') {
        alert('Please select a transaction category.');
        return;
    }
  //if amount is blank then it will do nothing, not saving data, and not even make the form hidden.
    if (amountInput === '') {
        alert('Please enter an amount.');
        return;
    }
  //if amount is less or equal to than 0, it will do nothing, not saving data, and not even make the form hidden.
    if (amountInput<=0) {
        alert('Please enter an amount greater than 0.');
        return;
    }

  const budgetAmountCents = Math.round(Number(amountInput) * 100);
  const budgObj={
    category:category,
    budgetAmountCents: budgetAmountCents
  };

  addToBudgets(budgObj);
  renderBudgetsHTML();


  resetBudgetForm()
  addBudgetButton.innerHTML = '+ Add Transaction';
  addBudgetButton.classList.remove('close-transaction');
  budgetForm.classList.remove('show-form');
  

})