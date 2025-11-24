const modal = document.getElementById('backdrop');
const modalContent = document.getElementById('monthly_budget');
const setBudgetBtn = document.getElementById('set_budget');
const addExpenseBtn = document.getElementById('add_expense');

const addDateInput = document.getElementById('date');
const addAmountInput = document.getElementById('amount');
const addInfoInput = document.getElementById('info');
const addCategorySelect = document.getElementById('category');
const editBudgetBtn = document.getElementById('edit_budget');
const resetBtn = document.getElementById('reset');

let expenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
let monthlyBudget = localStorage.getItem('monthlyBudget') ? parseFloat(localStorage.getItem('monthlyBudget')) : 0;




window.addEventListener('DOMContentLoaded', loadData);

resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        expenses = [];
        monthlyBudget = 0;
        displayExpenses();
        updateSummary();
        saveData();
    }
});


setBudgetBtn.addEventListener('click', () => {
    const raw = document.getElementById('budget_input').value;
    const budgetInput = parseFloat(raw);
    if (!isNaN(budgetInput) && budgetInput > 0) {
        
        monthlyBudget = budgetInput;
        
        console.log(`Monthly Budget Set: Rs. ${monthlyBudget}`);
        updateSummary();
        saveData();
        closeModal();
    } else {
        alert('Please enter a valid budget amount');
    }
});

function closeModal() {
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
}

function openModal() {
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modalContent.style.transform = 'scale(1)';
}

editBudgetBtn.addEventListener('click', openModal);

// setTimeout(openModal, 500);



addExpenseBtn.addEventListener('click', add_expense);

function add_expense() {
  
    const add_date = addDateInput.value;
    const add_amount = addAmountInput.value;
    const add_info = addInfoInput.value.trim();
    const add_category = addCategorySelect.value;

    if (add_date && add_amount && add_info && add_category) {
        const expense = {
            id: Date.now(),
            date: add_date,
            amount: parseFloat(add_amount),
            description: add_info,
            category: add_category
        };
        expenses.push(expense);

        addDateInput.value = '';
        addAmountInput.value = '';
        addInfoInput.value = '';
        addCategorySelect.value = '';

        displayExpenses();
        updateSummary();
        saveData();
    } else {
        console.log("Please fill all the fields to add an expense.");
        alert('Please fill all the fields to add an expense.');
    }
}

function displayExpenses() {
    const expenseList = document.getElementById('expense_list');

    if (expenses.length === 0) {
        expenseList.innerHTML = '<tr><td colspan="5">No expenses added yet.</td></tr>';
        return;
    }

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    expenseList.innerHTML = sortedExpenses.map(expense => `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td>Rs. ${expense.amount.toFixed(2)}</td>
            <td>${expense.description}</td>
            <td>${getCategoryIcon(expense.category)}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button></td>
        </tr>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = {
        'food': '🍴 Food',
        'transport': '🚌 Transport',
        'enetertainment': '🎬 Entertainment',
        'utilities': '💡 Utilities',
        'travel': '✈️ Travel',
        'other': '📦 Others'
    };
    return icons[category] || category;
}

function saveData() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    } catch (e) {
        console.error('Failed to save data to localStorage:', e);
    }
    window.expenseTrackerData = { expenses: expenses, monthlyBudget: monthlyBudget };
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        displayExpenses();
        updateSummary();
        saveData();
    }
}

function updateSummary() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const todayExpenses = getTodayExpenses();
    const remaining = monthlyBudget - totalExpenses;

    document.getElementById('total').textContent = `Rs. ${totalExpenses.toFixed(2)}`;
    document.getElementById('today').textContent = `Rs. ${todayExpenses.toFixed(2)}`;
    document.getElementById('budget').textContent = `Rs. ${monthlyBudget.toFixed(2)}`;
    document.getElementById('remaining').textContent = `Rs. ${remaining.toFixed(2)}`;

    const remainingElement = document.getElementById('remaining');
    if (remaining < 0) {
        remainingElement.style.color = 'red';
    } else {
        remainingElement.style.color = 'green';
    }
}

function getTodayExpenses() {
    const today = new Date().toISOString().split('T')[0];
    return expenses
        .filter(expense => expense.date === today)
        .reduce((sum, expense) => sum + expense.amount, 0);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function loadData() {
    // Prefer localStorage values if available; fall back to window.expenseTrackerData
    const storedExpenses = localStorage.getItem('expenses');
    const storedBudget = localStorage.getItem('monthlyBudget');

    if (storedExpenses) {
        try {
            expenses = JSON.parse(storedExpenses) || [];
        } catch (e) {
            console.error('Error parsing stored expenses, clearing stored data:', e);
            expenses = [];
        }
    } else if (window.expenseTrackerData && window.expenseTrackerData.expenses) {
        expenses = window.expenseTrackerData.expenses;
    }

    if (storedBudget) {
        monthlyBudget = parseFloat(storedBudget) || 0;
    } else if (window.expenseTrackerData && typeof window.expenseTrackerData.monthlyBudget !== 'undefined') {
        monthlyBudget = window.expenseTrackerData.monthlyBudget;
    }

    displayExpenses();
    updateSummary();

    if (monthlyBudget === 0) {
        setTimeout(() => {
            openModal();
        }, 500);
    }
}