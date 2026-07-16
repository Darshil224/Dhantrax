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
                <div class="goal-progress-fill" style="width:${progressWidth}%"></div>
              </div>
            </div>

            <div class="goal-footer">
              <div class="goal-saved"><span class="goal-saved-text">Saved: </span> $${formatCurrency(savingsCardData.savedAmountCents)} (${savingsCardData.savedAmountPercentage.toFixed(1)}%)</div>

              <div class="goal-date">${savingsCardData.targetDate.format('MMM D, YYYY')}</div>
            </div>
            <div class="buttons-container">
              <button class="add-money-button js-add-money-button" title="Add Saved Money">+ Add Money</button>
              <div class="action-buttons">
                <button class="edit-goal-button js-edit-goal-button" title="Edit Goal"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-goal-button js-delete-goal-button" title="Delete Goal"><i class="fa-solid fa-trash"></i></button>
              </div>
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

//making the add goal button interactive
const addGoalButton = document.querySelector('.js-add-goal-button');
const savingsForm =document.querySelector('.js-savings-form');

addGoalButton.addEventListener('click',()=>{
  if(savingsForm.classList.contains('show-form')){
    savingsForm.classList.remove('show-form');

    addGoalButton.innerHTML='+ Add Goal';
    addGoalButton.classList.remove('close-goal');

    document.querySelector('.js-save-goal-button').innerHTML='Save Goal';
    resetSavingsForm();
  }else{
    savingsForm.classList.add('show-form');

    addGoalButton.innerHTML='- Close Goal';
    addGoalButton.classList.add('close-goal');
  }
})

//when save goal is clicked
document.querySelector('.js-save-goal-button').addEventListener('click', ()=>{
  const description = document.querySelector('.js-savings-goal-description').value;

  const selectedDate =document.querySelector('.js-target-date-input').value;
  

  const targetAmountInput=document.querySelector('.js-savings-target-amount-input').value;
  let savedAmountInput=document.querySelector('.js-savings-saved-amount-input').value;

  //validations:-
  //if description is blank, then it will do nothing
    if (description === '') {
        alert('Please enter savings goal description.');
        return;
    }

    //selected date cannot be empty
    if(selectedDate===''){
      alert('Please select a target date')
      return;
    }

    //if selected date is lesser than or equal to today, then also not do anything
    const selectedDay = dayjs(selectedDate);
    const today = dayjs();
    if (!selectedDay.isAfter(today, 'day')) {
        alert('Please select a future date.');
        return;
    }
    //if targetAmount is blank then it will do nothing, not saving data, and not even make the form hidden.
    if (targetAmountInput === '') {
        alert('Please enter a valid target amount.');
        return;
    }
    //if targetAmount is less than 0, it will do nothing, not saving data, and not even make the form hidden.
    if (targetAmountInput<0) {
        alert('Please enter a target amount greater than 0.');
        return;
    }

    //if its not given, then by default consider it 0
    if (savedAmountInput === '') {
        savedAmountInput=0;
    }

    const targetDate = selectedDate;

    const targetAmountCents=Math.round(Number(targetAmountInput)*100);
    const savedAmountCents=Math.round(Number(savedAmountInput)*100);

    const savObj={
      description: description,
      date: targetDate,
      targetAmountCents: targetAmountCents,
      savedAmountCents: savedAmountCents
    }
    addToSavings(savObj);

    renderSavingsHTML();

    resetSavingsForm();

    addGoalButton.innerHTML = '+ Add Goal';
    addGoalButton.classList.remove('close-goal');
    savingsForm.classList.remove('show-form');

    
})