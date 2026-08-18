import { transactions } from "./transactionsData.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function getIncomeExpenseForMonth(selectedMonth) {
  let incomeCents = 0;
  let expenseCents = 0;

  transactions.forEach((transaction) => {
    const transactionDate = dayjs(transaction.date);

    if (
      transactionDate.month() === selectedMonth.month() &&
      transactionDate.year() === selectedMonth.year()
    ) {
      if (transaction.type === 'Income') {
        incomeCents += transaction.amountCents;
      } else if (transaction.type === 'Expense') {
        expenseCents += transaction.amountCents;
      }
    }
  });

  return {
    incomeCents,
    expenseCents
  };
}