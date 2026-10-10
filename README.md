# Expense Tracker

A simple browser-based expense tracker for recording spending, managing a monthly budget, and reviewing recent expenses.

## Expense Tracker Link

[Open Expense Tracker](https://palakaggarwal27.github.io/expenseTracker/)

## Features

- Set and edit a monthly budget.
- Add expenses with date, amount, description, category, and payment mode.
- Create a custom category by selecting **Others**. Custom categories are saved for future use.
- Choose UPI, cash, debit card, or credit card as the payment mode.
- Edit or delete existing expenses.
- View total expenses, today's expenses, budget, and remaining budget.
- Use the responsive layout on desktop and mobile screens.

## How to Use

1. Open the link in a web browser.
2. Set a monthly budget when prompted, or use **Edit Monthly Budget** later.
3. Fill in the expense details and select a payment mode.
4. To create a category, select **Others**, enter a name, and add the expense.
5. Use **Edit** in the table to update an expense, or use **Delete** to remove it.

## Project Files

- `index.html` - Application structure and form controls.
- `script.js` - Expense management, calculations, editing, and browser storage.
- `styles.css` - Application styling and responsive layout.
- `README.md` - Project documentation.

## Data Storage

Expenses, the monthly budget, and custom categories are stored in the browser's `localStorage`. Data stays available when the page is reopened in the same browser profile. Clearing browser storage removes the saved tracker data.
