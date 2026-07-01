import { calculateStats } from "../data/transactionsData.js";
import { formatCurrency } from "../utils/money.js";
import { categoryIcons } from "../data/categoryIcons.js";

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

