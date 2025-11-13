const productsList = document.getElementById('productsList');
const addForm = document.getElementById('addProductForm');

async function loadProducts() {
    const res = await fetch('/api/admin/products');
    const products = await res.json();
    productsList.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${p.name}</strong> - $${p.price} <br/>
            <button onclick="deleteProduct('${p._id}')">Delete</button>
            <button onclick="editProduct('${p._id}')">Edit</button>
        `;
        productsList.appendChild(div);
    });
}
loadProducts();

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const product = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        images: formData.get('images').split(',').map(i => i.trim())
    };
    await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    addForm.reset();
    loadProducts();
});

async function deleteProduct(id) {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    loadProducts();
}

async function editProduct(id) {
    const name = prompt('New name:');
    const price = prompt('New price:');
    if (!name || !price) return;
    await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) })
    });
    loadProducts();
}