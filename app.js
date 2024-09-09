
const cart = [];
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const openCartButton = document.getElementById('openCart');
const checkoutButton = document.getElementById('checkoutButton');
const clearCartButton = document.getElementById('clearCartButton');

// abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar el modal 
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}

// Manejar la apertura del modal con el carrito
openCartButton.addEventListener('click', () => {
    updateCart();
    openModal('cartModal');
});

// Realizar la compra
checkoutButton.addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
    cart.length = 0;
    updateCart();
    closeModal('cartModal');
});

// eliminar todo del carrito
clearCartButton.addEventListener('click', () => {
    cart.length = 0;
    updateCart();
    closeModal('cartModal');
});


// Cambiar la cantidad de un producto en el carrito
function changeQuantity(productId, amount) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            const index = cart.indexOf(product);
            if (index > -1) {
                cart.splice(index, 1);
            }
        }
        updateCart();
    }
}

// Cargar productos desde el archivo JSON
document.addEventListener('DOMContentLoaded', function () {
    fetch('product.json')
        .then(response => response.product.json)
        .then(products => {
            const productGrid = document.getElementById('product-grid');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.dataset.id = product.id;
                productDiv.dataset.price = product.price;

                productDiv.innerHTML = `
                    <div class="galeria">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="info">
                            <p class="texto">${product.name}</p>
                            <p class="precio">$${product.price}</p>
                        </div>
                    </div>
                    <button class="add-to-cart">Añadir al carrito</button>
                `;
                productGrid.appendChild(productDiv);
            });

            // Reasignar el evento click para los botones de añadir al carrito
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productElement = e.target.parentElement;
                    const productId = productElement.getAttribute('data-id');
                    const productPrice = parseFloat(productElement.getAttribute('data-price'));
                    const existingProduct = cart.find(item => item.id === productId);

                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        cart.push({ id: productId, price: productPrice, quantity: 1 });
                    }

                    updateCart();
                });
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

// Actualizar el contenido del carrito en el modal
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>Producto ID: ${item.id}</span>
                <div>
                    <button onclick="changeQuantity('${item.id}', -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    totalAmount.textContent = total.toFixed(2);
}

console.log('Cart:', cart); // Verifica el estado del carrito
        updateCart(); // Actualizar el carrito