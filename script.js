const modal = document.getElementById('backdrop');
const modalContent = document.getElementById('monthly_budget');
const setBudgetBtn = document.getElementById('set_budget');


setBudgetBtn.addEventListener('click', () => {
    const budgetInput = document.getElementById('budget_input').value;
    if(budgetInput && budgetInput > 0){
        // Here you can add code to save the budget value
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