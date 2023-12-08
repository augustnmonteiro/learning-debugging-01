const selectCategory = document.getElementById('category_id');

function fetchCategoryList() {
    fetch('http://localhost:3001/category')
        .then(response => response.json())
        .then(data => {
            const categorySearch = document.getElementById('categorySelect');

            categorySearch.innerHTML = '';

            categorySearch.innerHTML += '<option value="0">All Categories</option>';
            selectCategory.innerHTML += '<option value="0">Select a Category</option>';

            data.forEach(category => {
                categorySearch.innerHTML += `<option value="${category.id}">${category.name}</option>`;
                selectCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        })
        .catch(error => console.error('Erro:', error));
}

function searchCategory(categoryId) {
    let url = 'http://localhost:3001/transaction';

    if (categoryId) {
        url += `?id=${categoryId}`;
    }
    fetch(url)
        .then(response => response.json())
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

                if (transaction.category_id === parseFloat(categoryId)) {
                    totalBalance += parseFloat(transaction.balance);
                    transactionListElement.innerHTML += `<p>Description: ${transaction.description}, Value: ${formattedValue}, Balance: ${formattedBalance}, Category: ${transaction.category_name} <button type="button" class="removeTransaction" onclick="deleteTransaction(${transaction.id})">X</button></p>`;
                    totalBalanceElement.textContent = `Balance Total: ${totalBalance}`;
                }
                else if (parseFloat(categoryId) === 0) {
                    totalBalance += parseFloat(transaction.balance);
                    transactionListElement.innerHTML += `<p>Description: ${transaction.description}, Value: ${formattedValue}, Balance: ${formattedBalance}, Category: ${transaction.category_name} <button type="button" class="removeTransaction" onclick="deleteTransaction(${transaction.id})">X</button></p>`;
                    totalBalanceElement.textContent = `Total Balance: ${totalBalance}`;
                }
                const formattedTotalBalance = totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                totalBalanceElement.textContent = `Total Balance: ${formattedTotalBalance}`;
            });
        })
        .catch(error => console.error('Erro:', error));
}

function getCategories() {
    return fetch('http://localhost:3001/category')
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('Erro:', error);
            return []; 
        });
}

function selectNewCategory() {
    getCategories()
        .then(categories => {
            const categorySelects = document.getElementsByClassName('selectNewCategory');

            Array.from(categorySelects).forEach(selectElement => {

                selectElement.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.value = ''; 
                defaultOption.textContent = 'New Category'; 
                selectElement.appendChild(defaultOption);

                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    selectElement.appendChild(option);
                });
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

selectNewCategory();

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
    const categorySelect = document.getElementById('categoriesSelect');
    const selectedCategoryId = categorySelect.value;
    searchCategory(selectedCategoryId);
});

fetchCategoryList();