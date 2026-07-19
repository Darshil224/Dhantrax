import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export let savings;

loadsavingsFromStorage();

export function loadsavingsFromStorage(){
    savings= JSON.parse(localStorage.getItem('savings'));
    if(!savings){
        savings=[
            {
                id: crypto.randomUUID(),
                description: 'Salary1',
                date: dayjs(),
                targetAmountCents: 25000,
                savedAmountCents: 1000
            },
            {
                id: crypto.randomUUID(),
                description: 'Salary1',
                date: dayjs(),
                targetAmountCents: 10000,
                savedAmountCents: 100
            },
            {
                id: crypto.randomUUID(),
                description: 'Salary1',
                date: 'default1',
                targetAmountCents: 12000,
                savedAmountCents: 1300
            }
        ];
    }
}

function saveSavingsToStorage(){
    localStorage.setItem('savings', JSON.stringify(savings));
}

export function addToSavings(savObj){
     savings.push({
        id: crypto.randomUUID(),
        description: savObj.description,
        date: savObj.date,
        targetAmountCents: Number(savObj.targetAmountCents),
        savedAmountCents: Number(savObj.savedAmountCents)
     });
    saveSavingsToStorage();
     
}

export function removeFromSavings(index){
    savings.splice(index, 1);
    saveSavingsToStorage();
}

export function calculateSavingsCardData(saving){
    const savingsDescription=saving.description;
    const today = dayjs().startOf('day');
    const targetDate = dayjs(saving.date).startOf('day');

    const daysLeft = targetDate.diff(today, 'day');


    const savedAmountCents=saving.savedAmountCents;
    const targetAmountCents=saving.targetAmountCents;
    const savedAmountPercentage=(savedAmountCents/targetAmountCents)*100;

    return{
        savingsDescription,
        daysLeft,
        savedAmountCents,
        savedAmountPercentage,
        targetAmountCents,
        targetDate
    }


}

export function loadGoalForEditing(index){
   


    const addGoalButton = document.querySelector('.js-add-goal-button');
    const savingsForm = document.querySelector('.js-savings-form');

    if (!savingsForm.classList.contains('show-form')) {
        savingsForm.classList.add('show-form');
    }
    addGoalButton.innerHTML = '- Close Goal';
    addGoalButton.classList.add('close-goal');

    const savObj=savings[index];
    


    document.querySelector('.js-savings-goal-description').value = savObj.description;
    document.querySelector('.js-target-date-input').value = savObj.date;
    document.querySelector('.js-savings-target-amount-input').value = formatCurrency(savObj.targetAmountCents);
    document.querySelector('.js-savings-saved-amount-input').value = formatCurrency(savObj.savedAmountCents);

    const saveButton= document.querySelector('.js-save-goal-button');
    saveButton.innerHTML='Update Goal';

}

export function updateGoal(index, savObj){
    savings[index]={
        id: savings[index].id,
        description: savObj.description,
        date: savObj.date,
        targetAmountCents: savObj.targetAmountCents,
        savedAmountCents: savObj.savedAmountCents

    };
    saveSavingsToStorage();
}

export function addMoneyToGoal(saving, addedAmountCents){
    saving.savedAmountCents+=addedAmountCents;
    saveSavingsToStorage();
}

export function getGoalStatusClass(savedPercent, daysLeft) {
  if (savedPercent >= 100) {
    return 'goal-achieved';
  }

  if (daysLeft < 0) {
    return 'goal-overdue';
  }

  if (savedPercent >= 90) {
    return 'final-stretch';
  }

  if (savedPercent >= 75) {
    return 'almost-there';
  }

  if (savedPercent >= 50) {
    return 'halfway-there';
  }

  if (daysLeft <= 7 && savedPercent < 50) {
    return 'behind-schedule';
  }

  return '';
}