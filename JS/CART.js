// Global variables
let cart = {};
let wishlistProducts = [];

async function displayProducts() {
    const productList = document.getElementById("product-list");
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    try {
        if (wishlistProducts.length === 0) {
            const response = await fetch("../PHP/get_products.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === "success") {
                    wishlistProducts = result.products.filter(product =>
                        wishlist.includes(product.id.toString())
                    );
                } else {
                    console.error("Error fetching products:", result.message);
                    return;
                }
            } else {
                console.error("Request failed:", response.statusText);
                return;
            }
        }
        filterProducts();
    } catch (error) {
        console.error("Error:", error);
    }
}

function filterProducts() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const filteredWishlist = wishlistProducts.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (filteredWishlist.length === 0) {
        productList.innerHTML = "<p>No products match your search.</p>";
        return;
    }

    filteredWishlist.forEach(product => {
        const productEl = document.createElement("div");
        productEl.className = "product";
        productEl.id = `product-${product.id}`; // Add consistent product ID
        
        productEl.innerHTML = `
            <div class="product-image-container">
                <img src="${product.photo_url}" alt="${product.name}">
            </div>
            <div class="product-text-container">
                <h3>${product.name}</h3>
                <p>${product.device_type}</p>
                <p>${product.price} €</p>
                <button class="blue-button add-to-cart-button" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>`;
        
        productList.appendChild(productEl);
    });
}

async function populateCart() {
    const username = localStorage.getItem('username'); // Get the logged-in user's username
    if (!username) {
        console.error("Username not found in localStorage");
        return;
    }

    try {
        // Fetch the cart data from the backend
        const response = await fetch("../PHP/get_cart.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === "success") {
                const productIds = result.product_ids || [];
                
                // Fetch all products details for the cart
                const allProductsResponse = await fetch("../PHP/get_products.php", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (allProductsResponse.ok) {
                    const productsResult = await allProductsResponse.json();
                    if (productsResult.status === "success") {
                        const allProducts = productsResult.products;
                        
                        // Populate the cart with the products matching the product IDs from the cart table
                        productIds.forEach(productId => {
                            const product = allProducts.find(p => p.id.toString() === productId);
                            if (product) {
                                if (cart[productId]) {
                                    cart[productId].quantity += 1;
                                } else {
                                    cart[productId] = { ...product, quantity: 1 };
                                }
                            }
                        });
                        updateCart();
                    } else {
                        console.error("Error fetching all products:", productsResult.message);
                    }
                } else {
                    console.error("Failed to fetch products:", allProductsResponse.statusText);
                }
            } else {
                console.error("Error fetching cart data:", result.message);
            }
        } else {
            console.error("Request failed:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



function addToCart(productId) {
    // Search for the product in wishlistProducts instead of allProducts
    const product = wishlistProducts.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found in the wishlist.`);
        return;
    }

    // Add to cart or increment quantity
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = { ...product, quantity: 1 };
    }
    updateCart();
}


function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let total = 0;

    cartItems.innerHTML = "";

    Object.values(cart).forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "product-summary";
        itemEl.innerHTML = `
            ${item.name} : ${item.quantity} x ${item.price} €
            <button onclick="removeFromCart(${item.id})">Remove</button>`;
        cartItems.appendChild(itemEl);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total + " €";
}

function removeFromCart(productId) {
    if (cart[productId]) {
        cart[productId].quantity -= 1;
        if (cart[productId].quantity <= 0) delete cart[productId];
    }
    updateCart();
}

// Confirmation de l'achat
function confirmPurchase() {
    if (Object.keys(cart).length === 0) {
      alert("Votre panier est vide !");
      return;
    }
    alert("Merci pour votre achat !");
    cart = {};  // Réinitialiser le panier
    updateCart();
    displayProducts();
}

document.addEventListener("DOMContentLoaded", async () => {
    await displayProducts();
    await populateCart();
});



// Sidebar toggle
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
});