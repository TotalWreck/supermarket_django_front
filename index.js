const MY_SERVER = "https://django-supermarket.onrender.com/";

const cart = [];
let products = [];

function loadLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart.splice(0);
        const parsedCart = JSON.parse(storedCart);
        cart.push(...parsedCart);
        updateCartUI();
    }
}

function loadProducts() {
    axios.get(MY_SERVER + 'products/')
        .then(function (response) {
            products = response.data;
            const productList = document.getElementById('product-list');

            products.forEach(function (product) {
                const price = parseFloat(product.price);
                const formattedPrice = isNaN(price) ? 'N/A' : '$' + price.toFixed(2);

                const productCard = document.createElement('div');
                productCard.className = 'col-md-3 mb-4';

                productCard.innerHTML = `
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.description}">
                        <div class="card-body">
                            <h5 class="card-title">${product.description}</h5>
                            <p class="card-text">Price: ${formattedPrice}</p>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary" type="button" onclick="decrementQuantity(${product.id})">-</button>
                                </div>
                                <input type="tel" class="form-control" id="quantity-${product.id}" value="1">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onclick="incrementQuantity(${product.id})">+</button>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-2" onclick="addToCart(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                `;

                productList.appendChild(productCard);
            });
        })
        .catch(function (error) {
            console.error('Error loading products:', error);
        });
}

function incrementQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityInput.value) || 0;
    currentQuantity++;
    quantityInput.value = currentQuantity;
}

function decrementQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityInput.value) || 0;
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
    }
}

const addToCart = (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;

    const product = products.find(item => item.id === productId);
    if (product) {
        const existingCartItem = cart.find(item => item.id === product.id);

        if (existingCartItem) {
            existingCartItem.amount += quantity;
        } else {
            const price = parseFloat(product.price);
            if (!isNaN(price)) {
                cart.push({
                    id: product.id,
                    description: product.description,
                    price: price,
                    img: product.image,
                    category: product.category,
                    amount: quantity
                });
            }
        }

        updateCartUI();

        quantityInput.value = 1;
    }
}

function emptyCart() {
}

function updateCartUI() {
    const myCart = document.getElementById('myCart');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');

    myCart.style.display = 'block';
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.amount;
        total += itemTotal;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <span class="badge badge-primary badge-pill">${item.amount}</span>
            ${item.description} - $${item.price.toFixed(2)}
            
            <span class="float-right">$${itemTotal.toFixed(2)}</span>
        `;
        cartList.appendChild(listItem);
    });

    cartTotal.textContent = total.toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = function () {
    loadLocalStorage();
    loadProducts();
};