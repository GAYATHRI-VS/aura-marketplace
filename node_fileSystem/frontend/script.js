
const API_BASE = '';

const productNameInput = document.getElementById('productName');
const materialInput = document.getElementById('material');
const scoreInput = document.getElementById('score');

const createBtn = document.getElementById('createBtn');
const appendBtn = document.getElementById('appendBtn');
const viewBtn = document.getElementById('viewBtn');
const deleteBtn = document.getElementById('deleteBtn');

const productsEl = document.getElementById('products');
const statusEl = document.getElementById('status');

function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = isError ? 'status error' : 'status success';
}

function getProductInput() {
    return {
        name: productNameInput.value.trim(),
        material: materialInput.value.trim(),
        score: scoreInput.value.trim(),
    };
}

function hasEmptyField({ name, material, score }) {
    return !name || !material || !score;
}

function clearInputs() {
    productNameInput.value = '';
    materialInput.value = '';
    scoreInput.value = '';
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const text = await response.text();
        productsEl.textContent = text;
    } catch (err) {
        showStatus(`Could not load products: ${err.message}`, true);
    }
}


createBtn.addEventListener('click', async () => {
    const product = getProductInput();
    if (hasEmptyField(product)) {
        showStatus('Please fill in name, material and score before creating.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        const message = await response.text();
        showStatus(message, !response.ok);
        if (response.ok) {
            clearInputs();
            loadProducts();
        }
    } catch (err) {
        showStatus(`Create failed: ${err.message}`, true);
    }
});


appendBtn.addEventListener('click', async () => {
    const product = getProductInput();
    if (hasEmptyField(product)) {
        showStatus('Please fill in name, material and score before appending.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/products/append`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        const message = await response.text();
        showStatus(message, !response.ok);
        if (response.ok) {
            clearInputs();
            loadProducts();
        }
    } catch (err) {
        showStatus(`Append failed: ${err.message}`, true);
    }
});


viewBtn.addEventListener('click', loadProducts);


deleteBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE}/products`, { method: 'DELETE' });
        const message = await response.text();
        showStatus(message, !response.ok);
        if (response.ok) {
            productsEl.textContent = '';
        }
    } catch (err) {
        showStatus(`Delete failed: ${err.message}`, true);
    }
});
