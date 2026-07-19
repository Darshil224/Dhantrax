import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { savings, addToSavings, removeFromSavings, calculateSavingsCardData, loadGoalForEditing, updateGoal, addMoneyToGoal, getGoalStatusClass} from "../data/savingsData.js";

let editingIndex=null;
let selectedSaving = null;

function renderSavingsHTML(){
    let savingsHTML='';
    savings.forEach((saving)=>{
        const savingsCardData= calculateSavingsCardData(saving);

    const progressWidth = Math.min(savingsCardData.savedAmountPercentage, 100);
    const savedPercent= savingsCardData.savedAmountPercentage;
    const daysLeft=savingsCardData.daysLeft;
    const statusClass = getGoalStatusClass(savedPercent,daysLeft);

   
    savingsHTML += `
        <div class="savings-goals-card ${statusClass}">
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
              <button class="add-money-button js-open-add-money" title="Add Saved Money" data-id="${saving.id}">+ Add Money</button>
              <div class="action-buttons">
                <button class="edit-goal-button js-edit-goal-button" title="Edit Goal" data-id="${saving.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-goal-button js-delete-goal-button" title="Delete Goal" data-id="${saving.id}"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        

        
        `
    });

    document.querySelector('.savings-goals-card-grid')
    .innerHTML=savingsHTML;

    //adding eventlisteners to delete buttons every time we render:
    document.querySelectorAll('.js-delete-goal-button')
    .forEach((button)=>{
      button.addEventListener('click', ()=>{
        if(confirm('Are you sure you want to delete this saving goal?')===false){
          return;
        }
        const index=savings.findIndex((saving)=>{
          return saving.id===button.dataset.id;
        });
        removeFromSavings(index);
        renderSavingsHTML();
      });
    });



    //adding eventlisteners to edit buttons every time we render:
    document.querySelectorAll('.js-edit-goal-button')
    .forEach((button)=>{
      button.addEventListener('click', ()=>{
        const index=savings.findIndex((saving)=>{
          return saving.id===button.dataset.id;
        });
        editingIndex=index;
        loadGoalForEditing(editingIndex);
      });
    });


//adding eventlisteners to add money buttons every time we render:
    const modal = document.querySelector('.add-money-modal');

    document.querySelectorAll('.js-open-add-money')
    .forEach((button)=>{
      button.addEventListener('click', () => {
        selectedSaving = savings.find((saving) => {
            return saving.id === button.dataset.id;
        });


        document.querySelector('.js-description-div').innerHTML=selectedSaving.description;
        modal.style.display = 'flex';
    });
    });
    
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

    if(editingIndex===null){
      addToSavings(savObj);
    }else{
      updateGoal(editingIndex, savObj);
      editingIndex=null;
      document.querySelector('.js-save-goal-button').innerHTML='Save Goal'
    }
   

    renderSavingsHTML();

    resetSavingsForm();

    addGoalButton.innerHTML = '+ Add Goal';
    addGoalButton.classList.remove('close-goal');
    savingsForm.classList.remove('show-form');

    
})

//if clicked on close button, then close:-

const modal = document.querySelector('.add-money-modal');
    document.querySelector('.js-cancel-button')
    .addEventListener('click', () => {
        modal.style.display = 'none';
        document.querySelector('.js-add-money-input').value='';

    });

// if clicked in blur part, then closes:

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.querySelector('.js-add-money-input').value='';

    }
});

//if add-money button (of modal) is clicked:
document.querySelector('.js-add-money-button')
.addEventListener('click',()=>{
  const addedAmountCents=Number(document.querySelector('.js-add-money-input').value) * 100;

  addMoneyToGoal(selectedSaving, addedAmountCents);
  renderSavingsHTML();

  modal.style.display = 'none';

})
//code for status/badge modal:-
const overlay =
document.querySelector('.js-goal-guide-overlay');

document.querySelector('.js-goal-guide-button')
.addEventListener('click',()=>{

    overlay.classList.add('show');

});

document.querySelector('.js-close-guide')
.addEventListener('click',()=>{

    overlay.classList.remove('show');

});


overlay.addEventListener('click',(event)=>{

    if(event.target===overlay){
        overlay.classList.remove('show');
    }

});
