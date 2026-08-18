import { transactions } from "../data/transactionsData.js";
import { getIncomeExpenseForMonth } from "../data/reportsData.js";
import { getMonthlyIncomeExpense } from "../data/transactionsData.js";
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
  renderSpendingTrendsChart();
});

nextMonthButton.addEventListener('click', () => {
  selectedMonth = selectedMonth.add(1, 'month');

  renderSelectedMonth();
  renderReport();
  renderSpendingTrendsChart();
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

//code for second chart (spending trends chart):-

let spendingTrendsChartInstance;


function renderSpendingTrendsChart() {
  const monthlyTotals = getMonthlyIncomeExpense();

  // Generate 12 months ending at the selected month
  const endMonth = dayjs(selectedMonth, 'MMM YYYY');

  const months = [];

  for (let i = 11; i >= 0; i--) {
    months.push(endMonth.subtract(i, 'month').format('MMM YYYY'));
  }

  console.log(months);

  const incomeAmounts = months.map(month => {
    return monthlyTotals[month]?.income || 0;
  });

  const expenseAmounts = months.map(month => {
    return monthlyTotals[month]?.expense || 0;
  });

  const balanceAmounts = months.map(month => {
    return (monthlyTotals[month]?.income || 0) -
           (monthlyTotals[month]?.expense || 0);
  });

  console.log(incomeAmounts);
  console.log(expenseAmounts);
  console.log(balanceAmounts);

  const spendingTrendsChart = document.querySelector(
    '#spending-trends-chart'
  );

  // Destroy previous chart before creating a new one
  if (spendingTrendsChartInstance) {
    spendingTrendsChartInstance.destroy();
  }

  spendingTrendsChartInstance = new Chart(spendingTrendsChart, {
    type: 'line',

    data: {
      labels: months,

      datasets: [
        {
          label: 'Income',
          data: incomeAmounts,

          borderColor: '#00b4d8',
          backgroundColor: '#00b4d8',

          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 7,

          tension: 0.3
        },

        {
          label: 'Expenses',
          data: expenseAmounts,

          borderColor: '#ff3b5c',
          backgroundColor: '#ff3b5c',

          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 7,

          tension: 0.3
        },

        {
          label: 'Balance',
          data: balanceAmounts,

          borderColor: '#ff922b',
          backgroundColor: '#ff922b',

          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 7,

          tension: 0.3
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
            padding: 18,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },

        tooltip: {
          callbacks: {
            label: function(context) {
              const amount = context.raw / 100;
              return ` ${context.dataset.label}: $${amount.toFixed(2)}`;
            }
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          grid: {
            color: '#d8caca'
          },

          ticks: {
            callback: function(value) {
              return '$' + (value / 100).toLocaleString();
            }
          }
        },

        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

renderSpendingTrendsChart();