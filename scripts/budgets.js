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
                <div class="mid-progress-fill"></div>
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