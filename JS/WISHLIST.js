// Global variables
let cart = {};
let wishlistProducts = [];

async function getCartProducts(username) {
    try {
        const response = await fetch("../PHP/get_cart.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            if (result.status === "success") {
                return result.product_ids || [];
            } else {
                console.error("Error fetching cart data:", result.message);
                return [];
            }
        } else {
            console.error("Request failed:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

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

        // Fetch the cart data and mark products that are in the cart
        const username = localStorage.getItem('username');
        const cartProducts = await getCartProducts(username); // Fetch cart products (ID + quantity)

        // Loop through wishlist and mark those already in the cart
        wishlistProducts.forEach(product => {
            // Check if the product is in the cart using its ID
            if (cartProducts.hasOwnProperty(product.id.toString())) {
                product.isInCart = true;  // Mark product as already added to cart
                product.cartQuantity = cartProducts[product.id.toString()]; // Get quantity of the product in the cart
            }
        });

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
            <div class="product-content">
                <div class="product-image-container">
                    <img src="${product.photo_url}" alt="${product.name}">
                </div>
                <div class="product-text-container">
                    <h3>${product.name}</h3>
                    <p>${product.device_type}</p>
                    <p>${product.price} €</p>
                </div>
                <div class="product-button-container">
                    <button class="add-to-cart-button" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>`;

        // If the product is already in the cart, add the "Already Added" badge
        if (product.isInCart) {
            const badgeElement = document.createElement("span");
            badgeElement.className = "added-to-cart";
            badgeElement.textContent = "Already Added";
            productEl.querySelector(".product-image-container").appendChild(badgeElement);
        }

        productList.appendChild(productEl);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await displayProducts();
});

async function updateCartDatabase(username, newProductIds) {
    try {
        // Fetch the current cart to preserve the existing items
        const existingCart = await getCartProducts(username);  // This should return an object like {productId: quantity}

        // If there's no existing cart, initialize an empty object
        const updatedCart = { ...existingCart };  // Create a copy of the existing cart

        // Iterate through the new product IDs and update their quantities in the cart
        newProductIds.forEach(productId => {
            if (updatedCart[productId]) {
                updatedCart[productId] += 1;  // Increase the quantity if the product is already in the cart
            } else {
                updatedCart[productId] = 1;  // Add the product with quantity 1 if it's not in the cart
            }
        });

        // Send the updated cart data to the server
        const response = await fetch("../PHP/update_cart.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                product_ids: updatedCart,  // Send the updated cart object
            }),
        });

        const result = await response.json();
        if (result.status === "success") {
            console.log("Cart updated in the database successfully.");
        } else {
            console.error("Error updating cart in the database:", result.error);
        }
    } catch (error) {
        console.error("Error updating cart in the database:", error);
    }
}

async function addToCart(productId) {
    const username = localStorage.getItem('username');
    if (!username) {
        console.error("Username not found in localStorage");
        return;
    }

    // Search for the product in wishlistProducts instead of allProducts
    const product = wishlistProducts.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found in the wishlist.`);
        return;
    }

    // If product is already in the cart, increase its quantity, otherwise, add it to cart
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = { ...product, quantity: 1 };
    }

    // Update the cart in the database
    const productIds = Object.keys(cart);
    await updateCartDatabase(username, productIds);

    // Update the UI for the product
    updateProductUI(productId);
}

// Function to update the product UI dynamically after adding/removing from the cart
function updateProductUI(productId) {
    const productElement = document.getElementById(`product-${productId}`);
    const isProductInCart = cart.hasOwnProperty(productId);

    // If the product is in the cart, add the "Added to Cart" badge, else remove it
    const badge = productElement.querySelector(".added-to-cart");
    if (isProductInCart) {
        if (!badge) {
            const badgeElement = document.createElement("span");
            badgeElement.className = "added-to-cart";
            badgeElement.textContent = "Already Added";
            productElement.querySelector(".product-image-container").appendChild(badgeElement);
        }
    } else {
        if (badge) {
            badge.remove();
        }
    }
}

// Sidebar toggle
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
});
