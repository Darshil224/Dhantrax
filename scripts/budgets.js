import { addToBudgets, budgets, removeFromBudgets, calculateBudgetCardData, loadBudgetForEditing, updateBudget } from "../data/budgetsData.js";
import { formatCurrency } from "../utils/money.js";
import { categoryIcons } from "../data/categoryIcons.js";
import { categoryColors } from "../data/categoryColors.js";

let editingIndex = null;

function renderBudgetsHTML(){
    let budgetsHTML='';
    budgets.forEach((budget)=>{
        const icon = categoryIcons[budget.category];
        const iconColor = categoryColors[budget.category];
        const budgetCardData=calculateBudgetCardData(budget);

        //adding visual changes, if budget is near its limit or if it exceeds:-
        let budgetStatusClass = '';
        let budgetStatusBadge = '';

        if (budgetCardData.percentageSpent > 100) {
          budgetStatusClass = 'budget-exceeded';
          budgetStatusBadge = 'Over Budget';
        } else if (budgetCardData.percentageSpent === 100) {
          budgetStatusClass = 'budget-reached';
          budgetStatusBadge = 'Budget Reached';
        } else if (budgetCardData.percentageSpent >= 80) {
          budgetStatusClass = 'budget-warning';
          budgetStatusBadge = 'Near Limit';
        }


        let budgetStatusBadgeHTML = '';

        if (budgetStatusBadge !== '') {
          budgetStatusBadgeHTML = `
            <div class="budget-status-badge">
              ${budgetStatusBadge}
            </div>
          `;
        }


        const progressWidth = Math.min(budgetCardData.percentageSpent, 100);
    
        budgetsHTML+= `
        <div class="budgets-card ${budgetStatusClass}">

            ${budgetStatusBadgeHTML}
            <div class="budget-card-actions">
              <button class="edit-budget-button js-edit-budget-button" title="Edit Budget" data-id="${budget.id}">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button class="delete-budget-button js-delete-budget-button" title="Delete Budget" data-id="${budget.id}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="card-top">
              <div class="top-logo-container">
                <div class="icon-container" style="background-color: ${iconColor};"> 
                <i class="logo-icon fa-solid ${icon}"> </i>
                </div>
                
              </div>
              <div class="top-title">
                <p class="budgets-card-title">${budget.category}</p>
                <p class="budgets-card-subtitle">Budget: $${formatCurrency(budgetCardData.budgetAmountCents)}</p>
              </div>
            </div>
            <div class="card-mid">
              <p class="card-mid-text">Spent: $${formatCurrency(budgetCardData.amountSpentCents)}</p>
              <p class="card-mid-text">Remaining: $${formatCurrency(budgetCardData.remainingCents)}</p>
              <div class="mid-progress-bar">
                <div class="mid-progress-fill" style="background-color: ${iconColor}; width: ${progressWidth}%;"></div>
              </div>
            </div>
            <div class="card-bottom">
              <div class="bottom-percent">${budgetCardData.percentageSpent.toFixed(0)}% of budget</div>
              <div class="bottom-amount">$${formatCurrency(budgetCardData.remainingCents)} left</div>
            </div>
          </div>
        
        `
    });
    document.querySelector('.budgets-card-grid')
    .innerHTML=budgetsHTML;

     //adding eventlisteners to delete buttons every time we render 
     document.querySelectorAll('.js-delete-budget-button')
     .forEach((button)=>{
        button.addEventListener('click',()=>{
          if (confirm('Are you sure you want to delete this budget permanently?') === false) {
                return;
              }
          const index=budgets.findIndex((budget)=>{
            return budget.id===button.dataset.id;
          });
          removeFromBudgets(index);
          renderBudgetsHTML();
        });
     });

     //adding eventlisteners to edit buttons every time we render 
     document.querySelectorAll('.js-edit-budget-button')
             .forEach((button)=>{
                 button.addEventListener('click', ()=>{
                     const index = budgets.findIndex((budget) => {
                         return budget.id === button.dataset.id;
                     });
     
                     editingIndex = index;
                     loadBudgetForEditing(editingIndex);
                 });
             });

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

    editingIndex=null;
    document.querySelector('.js-save-budget-button')
    .innerHTML='Save Budget';
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
        alert('Please select a budget category.');
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

  if(editingIndex===null){
    addToBudgets(budgObj);
  }else{
          updateBudget(editingIndex, budgObj);
  
          editingIndex=null;
  
          document.querySelector('.js-save-budget-button').innerHTML = 'Save Budget';
      }

  
  renderBudgetsHTML();


  resetBudgetForm()
  addBudgetButton.innerHTML = '+ Add Budget';
  addBudgetButton.classList.remove('close-Budget');
  budgetForm.classList.remove('show-form');
  

})

// Code for Budget Status Guide modal
const budgetGuideOverlay = document.querySelector(
  '.js-budget-guide-overlay'
);

document
  .querySelector('.js-budget-guide-button')
  .addEventListener('click', () => {
    budgetGuideOverlay.classList.add('show');
  });

document
  .querySelector('.js-close-budget-guide')
  .addEventListener('click', () => {
    budgetGuideOverlay.classList.remove('show');
  });

budgetGuideOverlay.addEventListener('click', (event) => {
  if (event.target === budgetGuideOverlay) {
    budgetGuideOverlay.classList.remove('show');
  }
});