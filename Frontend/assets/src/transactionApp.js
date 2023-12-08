const addTransactionForm = document.querySelector('#addTransactionForm');
const transactionListElement = document.getElementById('transactionList');
const historyList = document.getElementById('registerHistory');
const configCategory = document.getElementById('configCategory');
const totalBalanceElement = document.getElementById('totalBalance');

function addTransaction() {
    const description = document.getElementById('description').value;
    const value = document.getElementById('value').value;
    const category_id = document.getElementById('category_id').value;

    if (description && value && category_id) {
        const transactionData = {
            description: description,
            value: value,
            category_id: category_id
        };

        fetch('http://localhost:3001/transaction/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
            .then(response => response.json())
            .then(data => {
                fetchTransactionList();

                document.getElementById('description').value = '';
                document.getElementById('value').value = '';
                document.getElementById('category_id').value = '';

                addTransactionForm.style.display = 'none';
            })
            .catch(error => console.error('Erro:', error));
    } else {
        alert('Fill in all fields.');
    }
}

function deleteTransaction(transactionId) {
    fetch(`http://localhost:3001/transaction/delete?id=${transactionId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            fetchTransactionList();
        })
        .catch(error => console.error('Erro:', error));
}

function fetchTransactionList() {

    fetch('http://localhost:3001/transaction')
        .then(response => {
            return response.json();
        })
        .then(data => {

            transactionListElement.innerHTML = '';

            let totalBalance = 0;

            data.forEach((transaction, index) => {
                const formattedValue = parseFloat(transaction.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                const formattedBalance = parseFloat(transaction.balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' });


                if (index === 0) {
                    totalBalance = parseFloat(transaction.balance);
                } else {
                    totalBalance += parseFloat(transaction.value);
                }

                transactionListElement.innerHTML += `<p>Description: ${transaction.description}, Value: ${formattedValue}, Balance: ${formattedBalance}, Category: ${transaction.category_name} 
                <select class="selectNewCategory" id="selectNewCategory-${transaction.id}"></select>
                <button class="btnUpdate" onclick="updateTransaction(${transaction.id})"><svg xmlns="http://www.w3.org/2000/svg" height="15" width="13" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ffffff" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg></button>
                <button type="button" class="removeTransaction" onclick="deleteTransaction(${transaction.id})">X</button></p>`;
            });

            const formattedTotalBalance = totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            totalBalanceElement.textContent = `Total Balance: ${formattedTotalBalance}`;
        })
        .catch(error => console.error('Erro:', error));
}

function updateTransaction(transactionID) {
    const newCategorySelect = document.getElementById(`selectNewCategory-${transactionID}`);
    const newCategory = newCategorySelect.value;

    fetch(`http://localhost:3001/transaction/update/${transactionID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryID: newCategory }),
    })
        .then(response => response.json())
        .then(data => {
            fetchTransactionList();
        })
        .catch(error => {
            console.error('Error updating category:', error);
        });
}


const toggleFormButton = document.getElementById('toggleFormButton');
toggleFormButton.addEventListener('click', () => {
    const isFormVisible = addTransactionForm.style.display !== 'none';
    const isRegisterVisible = historyList.style.display !== 'none';

    addTransactionForm.style.display = isFormVisible ? 'none' : 'block';
    historyList.style.display = isRegisterVisible ? 'none' : 'flex';
});


addTransactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction();

    const isRegisterVisible = historyList.style.display !== 'none';
    historyList.style.display = isRegisterVisible ? 'none' : 'flex';
});

configCategory.addEventListener('click', function () {
    window.location.href = '/assets/src/pages/admin-category.html';
});


fetchTransactionList();
