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