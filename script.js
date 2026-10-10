const modal = document.getElementById('backdrop');
const modalContent = document.getElementById('monthly_budget');
const setBudgetBtn = document.getElementById('set_budget');
const addExpenseBtn = document.getElementById('add_expense');

const addDateInput = document.getElementById('date');
const addAmountInput = document.getElementById('amount');
const addInfoInput = document.getElementById('info');
const addCategorySelect = document.getElementById('category');
const customCategoryLabel = document.getElementById('custom_category_label');
const customCategoryInput = document.getElementById('custom_category');
const paymentModeSelect = document.getElementById('payment_mode');
const cancelEditBtn = document.getElementById('cancel_edit');
const editBudgetBtn = document.getElementById('edit_budget');
const resetBtn = document.getElementById('reset');

let expenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
let monthlyBudget = localStorage.getItem('monthlyBudget') ? parseFloat(localStorage.getItem('monthlyBudget')) : 0;
let customCategories = localStorage.getItem('customCategories') ? JSON.parse(localStorage.getItem('customCategories')) : [];
let editingExpenseId = null;




window.addEventListener('DOMContentLoaded', loadData);

addCategorySelect.addEventListener('change', () => {
    const isOther = addCategorySelect.value === 'other';
    customCategoryLabel.hidden = !isOther;
    customCategoryInput.required = isOther;
    if (!isOther) customCategoryInput.value = '';
});

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
cancelEditBtn.addEventListener('click', resetExpenseForm);

function add_expense() {
  
    const add_date = addDateInput.value;
    const add_amount = addAmountInput.value;
    const add_info = addInfoInput.value.trim();
    const add_category = addCategorySelect.value;
    const custom_category = customCategoryInput.value.trim();
    const payment_mode = paymentModeSelect.value;
    const category = add_category === 'other' ? custom_category : add_category;

    if (add_date && add_amount && add_info && category && payment_mode) {
        const expense = editingExpenseId === null ? {
            id: Date.now(),
            date: add_date,
            amount: parseFloat(add_amount),
            description: add_info,
            category,
            paymentMode: payment_mode
        } : expenses.find(item => item.id === editingExpenseId);

        if (editingExpenseId === null) {
            expenses.push(expense);
        } else {
            Object.assign(expense, { date: add_date, amount: parseFloat(add_amount), description: add_info, category, paymentMode: payment_mode });
        }
        if (add_category === 'other' && !customCategories.includes(custom_category)) {
            customCategories.push(custom_category);
            addCustomCategoryOption(custom_category);
        }

        resetExpenseForm();

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
    expenseList.replaceChildren();

    if (expenses.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'No expenses added yet.';
        emptyRow.appendChild(emptyCell);
        expenseList.appendChild(emptyRow);
        return;
    }

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        [
            formatDate(expense.date),
            `Rs. ${expense.amount.toFixed(2)}`,
            expense.description,
            getCategoryIcon(expense.category),
            formatPaymentMode(expense.paymentMode)
        ].forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editExpense(expense.id));
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteExpense(expense.id));
        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);
        expenseList.appendChild(row);
    });
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
    return icons[category] || `📦 ${category}`;
}

function formatPaymentMode(paymentMode) {
    const labels = { upi: 'UPI', cash: 'Cash', debit_card: 'Debit Card', credit_card: 'Credit Card' };
    return labels[paymentMode] || 'Not specified';
}

function addCustomCategoryOption(category) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = `📦 ${category}`;
    addCategorySelect.appendChild(option);
}

function loadCustomCategories() {
    customCategories = Array.isArray(customCategories) ? customCategories : [];
    customCategories.forEach(category => {
        if (![...addCategorySelect.options].some(option => option.value === category)) {
            addCustomCategoryOption(category);
        }
    });
}

function saveData() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('monthlyBudget', monthlyBudget.toString());
        localStorage.setItem('customCategories', JSON.stringify(customCategories));
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

function editExpense(id) {
    const expense = expenses.find(item => item.id === id);
    if (!expense) return;
    editingExpenseId = id;
    addDateInput.value = expense.date;
    addAmountInput.value = expense.amount;
    addInfoInput.value = expense.description;
    paymentModeSelect.value = expense.paymentMode || '';
    if (![...addCategorySelect.options].some(option => option.value === expense.category)) {
        addCustomCategoryOption(expense.category);
    }
    addCategorySelect.value = expense.category;
    customCategoryLabel.hidden = true;
    customCategoryInput.required = false;
    addExpenseBtn.textContent = 'Save Changes';
    cancelEditBtn.hidden = false;
    addInfoInput.focus();
}

function resetExpenseForm() {
    editingExpenseId = null;
    addDateInput.value = '';
    addAmountInput.value = '';
    addInfoInput.value = '';
    addCategorySelect.value = '';
    customCategoryInput.value = '';
    customCategoryLabel.hidden = true;
    customCategoryInput.required = false;
    paymentModeSelect.value = '';
    addExpenseBtn.textContent = 'Add Expense';
    cancelEditBtn.hidden = true;
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

    loadCustomCategories();
    displayExpenses();
    updateSummary();

    if (monthlyBudget === 0) {
        setTimeout(() => {
            openModal();
        }, 500);
    }
}