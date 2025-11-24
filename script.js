const modal = document.getElementById('backdrop');
const modalContent = document.getElementById('monthly_budget');
const setBudgetBtn = document.getElementById('set_budget');
const addExpenseBtn = document.getElementById('add_expense');
const add_date = document.getElementById('date').value;
const add_amount = document.getElementById('amount').value;
const add_info = document.getElementById('info').value;
const add_category = document.getElementById('category').value;




setBudgetBtn.addEventListener('click', () => {
    const budgetInput = document.getElementById('budget_input').value;
    if(budgetInput && budgetInput > 0){
        console.log(`Monthly Budget Set: Rs. ${budgetInput}`);
        closeModal();
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

// setTimeout(openModal, 500);

addExpenseBtn.addEventListener('click', add_expense());

function add_expense(){
    if (add_date && add_amount && add_info && add_category){
        console.log(`Expense Added: ${add_date}, Rs.${add_amount}, ${add_info}, ${add_category}`);
    }

    else {
        console.log("Please fill all the fields to add an expense.");
    }
}
