async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    const container = document.getElementById('products');
    container.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.description || 'No description'}</p>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;
        container.appendChild(div);
    });
}
loadProducts();

async function payStripe(product) {
    const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [product] })
    });
    const data = await res.json();
    window.location.href = data.url;
}

async function payPaypal(product) {
    const res = await fetch('/api/paypal/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [product] })
    });
    const data = await res.json();
    alert(`PayPal order created. ID: ${data.id}`);
}