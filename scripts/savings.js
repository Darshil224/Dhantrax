import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { savings, addToSavings, removeFromSavings, calculateSavingsCardData } from "../data/savingsData.js";

let editingIndex=null;

function renderSavingsHTML(){
    let savingsHTML='';
    savings.forEach((saving)=>{
        const savingsCardData= calculateSavingsCardData(saving);

    const progressWidth = Math.min(savingsCardData.savedAmountPercentage, 100);
    savingsHTML += `
        <div class="savings-goals-card">
            <div class="goal-header">
              <div class="goal-info">
                <div class="goal-name">${savingsCardData.savingsDescription}</div>
                <div class="goal-target">Target: $${formatCurrency(savingsCardData.targetAmountCents)}</div>
              </div>

              <div class="goal-days-left">${savingsCardData.daysLeft} days left</div>
            </div>

            <div class="goal-progress">
              <div class="goal-progress-bar">
                <div class="goal-progress-fill"></div>
              </div>
            </div>

            <div class="goal-footer">
              <div class="goal-saved">Saved: $${formatCurrency(savingsCardData.savedAmountCents)} (${savingsCardData.savedAmountPercentage.toFixed(1)}%)</div>

              <div class="goal-date">${savingsCardData.targetDate}</div>
            </div>
          </div>
        

        
        `
    });

    document.querySelector('.savings-goals-card-grid')
    .innerHTML=savingsHTML;
}
renderSavingsHTML();

function resetSavingsForm() {
    document.querySelector('.js-savings-goal-description').value = '';
    document.querySelector('.js-target-date-input').value = '';
    document.querySelector('.js-savings-target-amount-input').value = '';
    document.querySelector('.js-savings-saved-amount-input').value = '';
}