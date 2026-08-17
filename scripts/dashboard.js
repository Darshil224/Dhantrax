import { calculateStats, getSpendingByCategory, getMonthlyIncomeExpense } from "../data/transactionsData.js";
import { formatCurrency } from "../utils/money.js";
import { transactions } from "../data/transactionsData.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { categoryIcons } from "../data/categoryIcons.js";
import { categoryColors } from "../data/categoryColors.js";


export function renderDashboardCardHTML(){
    const stats = calculateStats();
    const dashboardCardHTML=`
    
    <div class="summary-card">
            <p class="card-title">Total Balance</p>
            <p class="card-value">$${formatCurrency(stats.totalBalanceCents)}</p>
            <p class="card-change">&uarr; 0% from last month</p>
          </div>
          <div class="summary-card">
            <p class="card-title">Income (This Month)</p>
            <p class="card-value">$${formatCurrency(stats.monthlyIncomeCents)}</p>
            <p class="card-change">&uarr; 5% from last month</p>
          </div>
          <div class="summary-card">
            <p class="card-title">Expenses (This Month)</p>
            <p class="card-value">$${formatCurrency(stats.monthlyExpenseCents)}</p>
            <p class="card-change">&darr; 2% from last month</p>
          </div>
          <div class="summary-card">
            <p class="card-title">Savings Rate</p>
            <p class="card-value">${stats.savingsRate.toFixed(1)}%</p>
            <p class="card-change">% of income</p>
          </div>
    
    `;

    document.querySelector('.card-container')
    .innerHTML=dashboardCardHTML;


}

renderDashboardCardHTML();

export function renderRecentTransactionsHTML(){
  let recentTransactionsHTML='';
  const sortedTransactions = [...transactions];
  sortedTransactions.sort((a, b) => { //sorting based on dates, descending order of dates... and if dates are same, then for tiebreaker, sorting as descending order of created at value.
  
      const dateDifference =
          dayjs(b.date).valueOf() - dayjs(a.date).valueOf();

      if (dateDifference !== 0) {
          return dateDifference;
      }

      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();

  });

  const recentTransactions = sortedTransactions.slice(0, 5);
  recentTransactions.forEach((transaction)=>{
    let sign='+';
        if(transaction.type==='Income'){
            sign='+';
        }else{
            sign='-';
        }
    const icon = categoryIcons[transaction.category];
    const iconColor = categoryColors[transaction.category];
    recentTransactionsHTML+=`
            <div class="recent-transaction-card">
              <div class="transaction-left-section">
                <div class="transaction-icon-container" style="background-color:${iconColor}">
                  <i class="fa-solid ${icon}"></i>
                </div>
                <div class="transaction-info">
                  <div class="transaction-description">${transaction.description}</div>
                  <div class="transaction-meta">
                    ${transaction.category} • ${dayjs(transaction.date).format('MMM D, YYYY')}
                  </div>
                </div>
              </div>
              <div class="transaction-right-section">
                <div class="transaction-amount ${transaction.type.toLowerCase()}">${sign}$${formatCurrency(transaction.amountCents)}</div>
              </div>
            </div>


    `;
  })

  document.querySelector('.recent-transactions-list')
  .innerHTML=recentTransactionsHTML;


}
renderRecentTransactionsHTML();

const seeMoreButton= document.querySelector('.see-more-button');
seeMoreButton.addEventListener('click', ()=>{
  window.location.href = 'transactions.html';
});

// spending chart render:- 


// console.log(getSpendingByCategory());

function renderSpendingChart() {
    const categoryTotals = getSpendingByCategory();

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    // console.log(categories);
    // console.log(amounts);

    const spendingChart = document.querySelector('#spending-chart');

    const chartColors = categories.map(category => categoryColors[category]);

    let spendingChartInstance;
    spendingChartInstance = new Chart(spendingChart, {
      type: 'doughnut',

      data: {
        labels: categories,

        datasets: [
          {
            data: amounts,
            backgroundColor: chartColors,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '60%',

        plugins: {
          legend: {
            position: 'bottom',

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

                const percentage = ((context.raw / total) * 100).toFixed(1);
                const amount = context.raw / 100;

                return ` $${amount.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

}

renderSpendingChart();


//monthly income expense chart render:-

// console.log(getMonthlyIncomeExpense());

function renderIncomeExpenseChart(){
  const monthlyTotals = getMonthlyIncomeExpense();

  const months = Object.keys(monthlyTotals).sort((a, b) => {
    return dayjs(a, 'MMM YYYY').valueOf() - dayjs(b, 'MMM YYYY').valueOf();
  });

  const recentMonths = months.slice(-6);

  // console.log(recentMonths);

  const incomeAmounts = recentMonths.map(month => {
    return monthlyTotals[month].income;
  });

  const expenseAmounts = recentMonths.map(month => {
    return monthlyTotals[month].expense;
  });

  // console.log(recentMonths);
  // console.log(incomeAmounts);
  // console.log(expenseAmounts);

  //now creating chart using the data:-

  const monthlyChart = document.querySelector('#monthly-chart');

  new Chart(monthlyChart, {
  type: 'bar',

  data: {
    labels: recentMonths,

    datasets: [
  {
    label: 'Income',
    data: incomeAmounts,
    backgroundColor: '#00b4d8',
    borderRadius: 6,
    borderSkipped: false
  },
  {
    label: 'Expenses',
    data: expenseAmounts,
    backgroundColor: '#ff3b5c',
    borderRadius: 6,
    borderSkipped: false
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
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
     tooltip: {
    callbacks: {
      label: function(context) {
        const amount = context.raw / 100;
        return ` $${amount.toFixed(2)}`;
      }
    }
  }
  },

  scales: {
    y: {
      beginAtZero: true,

       ticks: {
        callback: function(value) {
          return '$' + (value / 100).toFixed(0);
        }
      },

      grid: {
        color: '#d8caca'
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

renderIncomeExpenseChart();