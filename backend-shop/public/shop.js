fetch('/api/products')
.then(response => response.json())
.then(products => {
  const container = document.getElementById('products');
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