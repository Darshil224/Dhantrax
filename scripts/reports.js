import { transactions } from "../data/transactionsData.js";
import { getIncomeExpenseForMonth } from "../data/reportsData.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

let selectedMonth = dayjs();
const selectedMonthElement = document.querySelector('.selected-month');

function renderSelectedMonth() {
  selectedMonthElement.innerHTML = selectedMonth.format('MMMM YYYY');
}

renderSelectedMonth();

const previousMonthButton = document.querySelector('.previous-month-button');
const nextMonthButton = document.querySelector('.next-month-button');

previousMonthButton.addEventListener('click', () => {
  selectedMonth = selectedMonth.subtract(1, 'month');

  renderSelectedMonth();
  renderReport();
});

nextMonthButton.addEventListener('click', () => {
  selectedMonth = selectedMonth.add(1, 'month');

  renderSelectedMonth();
  renderReport();
});


//code for income-expense chart:-

let incomeExpenseChartInstance;

function renderReport() {
  const reportData = getIncomeExpenseForMonth(selectedMonth);

  const incomeExpenseChart = document.querySelector('#income-expense-chart');

  if (incomeExpenseChartInstance) {
    incomeExpenseChartInstance.destroy();
  }

  incomeExpenseChartInstance = new Chart(incomeExpenseChart, {
  type: 'pie',

  data: {
    labels: ['Income', 'Expenses'],

    datasets: [
      {
        data: [
          reportData.incomeCents,
          reportData.expenseCents
        ],

        backgroundColor: [
          '#00b4d8',
          '#ff3b5c'
        ],

        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 12
      }
    ]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'top',

        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce(
              (sum, value) => sum + value,
              0
            );

            const amount = context.raw / 100;
            const percentage = ((context.raw / total) * 100).toFixed(1);

            return ` $${amount.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  }
});
}

renderReport();