const API_URL = "http://localhost:8080/api/products";

document.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
    fetch(API_URL)
    .then(response => response.json())
    .then(products => {
        const container = document.getElementById('products');
        container.innerHTML = ""; // Очищаем перед обновлением

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>${product.price} руб.</strong></p>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => console.error('Ошибка:', error));
}


function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const categories = document.getElementById("categories").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description, categories})
    })
    .then(response => response.json())
    .then(() => {
        loadProducts();
        alert("Товар добавлен!");
    });
}

function deleteProduct() {
    const id = document.getElementById("delete-id").value;
    if (!id) {
        alert("Введите ID товара для удаления");
        return;
    }

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
            loadProducts();
            alert("Товар удален!");
        });
}

function editProduct() {
    const id = document.getElementById("edit-id").value;
    const name = document.getElementById("edit-name").value;
    const price = document.getElementById("edit-price").value;
    const description = document.getElementById("edit-description").value;
    const categories = document.getElementById("edit-categories").value;

    if (!id) {
        alert("Введите ID товара для редактирования");
        return;
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (price) updatedData.price = Number(price);
    if (description) updatedData.description = description;
    if (categories) updatedData.categories = categories;

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(() => {
        loadProducts();
        alert("Товар обновлен!");
    });
}
