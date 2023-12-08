function fetchData(page) {
  const url = `http://localhost:3001/transaction/historical/paged?page=${page}`;

  return fetch(url)
    .then((res) => {
      return res.json().then((data) => ({ data }));
    })
    .then(({ data }) => {
      renderData(data);
      previousPage(page);
    })
    .catch((error) => {
      throw error;
    });
}

function renderData(data) {
  const transactionsElement = document.getElementById("transactions");
  
  transactionsElement.innerHTML = "";

  data.transactions.forEach((transaction) => {
    const transactionDate = transaction.created_at;
    const date = new Date(transactionDate);
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const dia = date.getDate().toString().padStart(2, "0");

    const formatedDate = `${dia}/${mes}/${ano}`;
    transactionsElement.innerHTML += `<div class="cardPage"> 
        <section>
        <h5>Value: </h5><p style="color: greenyellow;">$ ${transaction.value}</p>
        <h5>Data:</h5> <p>${formatedDate}<p/>
        <h5>ID:</h5> <p>${transaction.id}<br></p>
        <h5>Description:</h5><p>${transaction.description}</p>
        </section>
        </div>`;
  });

  const paginationElement = document.getElementById("currentPage");
  paginationElement.innerHTML = "";
  for (let i = 1; i <= data.lastPage; i++) {
    paginationElement.innerHTML += `<button onclick="fetchData(${i})">${i}</button>`;
  }
}

function nextPage() {
  const toggleNextPage = document.getElementById("toggleNextPage");
  
  toggleNextPage.addEventListener("click", () => {
    let page = 1;
  
      page++;
      fetchData(page);
    
  });
}

nextPage();

function previousPage(currentPage) {
  const togglePreviousPage = document.getElementById("togglePreviousPage");

  togglePreviousPage.addEventListener("click", () => {
    if (currentPage > 1) {
      let page = currentPage - 1;
      fetchData(page);
    }
  });
}
fetchData(1);
