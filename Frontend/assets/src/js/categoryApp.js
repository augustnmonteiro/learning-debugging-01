function createCategory() {
  const name = document.getElementById("insertCategory").value;
  let errorDisplay = document.getElementById("errorDisplay");
  document.getElementById("insertCategory").value = "";
  if (name.length > 0 && isNaN(name)) {
    const categoryData = {
      name: name,
    };

    fetch("http://localhost:3001/category/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error:" + error);
      });
  } else {
    errorDisplay.style.display = "block";
    setTimeout(() => {
      errorDisplay.style.display = "none";
    }, 2000);
  }
}

function listCategory() {
  let divCategoryList = document.getElementById("list");

  fetch("http://localhost:3001/category")
    .then((response) => response.json())
    .then((data) => {
      divCategoryList.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Exclude</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (category) => `
              <tr>
                <td>${category.name}</td>
                <td>${category.id}</td>
                <td><button onclick="deleteCategory(${category.id})">Exclude</button></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>`;
    })
    .catch((error) => console.error("Erro:", error));
}

function deleteCategory(categoryId) {
  if (confirm("Do you want to exclude category?")) {
    fetch(`http://localhost:3001/category/remove/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.error("Error deleting category:", error));
  }
}

function editCategory() {
  const newCategory = document.getElementById("categoryName").value;
  const categoryID = document.getElementById("selectID").value;

  if (categoryID && newCategory.length > 0) {
    fetch(`http://localhost:3001/category/update/${categoryID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => console.error("Erro ao editar categoria:", error));
  } else {
    document.getElementById("categoryName").value = "Data Inválid";
    setTimeout(() => {
      document.getElementById("categoryName").value = "";
    }, 2500);
  }
}
function closeSearchResults() {
  const searchResults = document.getElementById("searchResults");
  searchResults.style.display = "none";
}
function searchCategory() {
  const searchName = document.getElementById("searchCategory").value.trim(); // Obter o nome da categoria para filtrar
  const categories = document.querySelectorAll("#list tbody tr");

  const foundCategory = Array.from(categories).find((category) => {
    const categoryName = category.querySelector("td:nth-child(1)").textContent.trim();
    return categoryName === searchName;
  });

  if (foundCategory) {
    const categoryId = parseInt(foundCategory.querySelector("td:nth-child(2)").textContent, 10);

    fetch(`http://localhost:3001/category/${categoryId}`)
      .then((response) => response.json())
      .then((categoryData) => {
        const formattedDate = new Date(categoryData[0].created_at).toLocaleDateString("pt-BR");
        document.getElementById("searchResults").innerHTML = `
          <span id="closeButton" onclick="closeSearchResults()" style="color: #fff; background-color: chocolate;">X</span>
          <p>ID: ${categoryData[0].id}</p>
          <p>Name: ${categoryData[0].name}</p>
          <p>Created at: ${formattedDate}</p>`;
        document.getElementById("searchResults").style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        document.getElementById("searchResults").style.display = "none";
      });
  } else {
    document.getElementById("searchResults").style.display = "none";
  }
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

function selectIDForUpdate() {
  const selectID = document.getElementById('selectID');

  getCategories()
    .then(categories => {
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.text = category.name;
        selectID.appendChild(option);
      });
    })
    .catch(error => console.error('Erro:', error));

}

document.getElementById("toggleFormCategory").addEventListener("click", () => {
  createCategory();
});

document.getElementById("toggleFormUpdate").addEventListener("click", () => {
  editCategory();
});

document.getElementById("toggleButtonSearch").addEventListener("click", () => {
  searchCategory();
});

listCategory();
selectIDForUpdate()
