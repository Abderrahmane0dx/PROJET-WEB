let cart = {};
let wishlistProducts = []; // Global variable for wishlist products

async function displayProducts() {
    const productList = document.getElementById("product-list");
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    try {
        if (wishlistProducts.length === 0) {
            // Fetch all products and filter for the wishlist only once
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

        // Call the filterProducts function to handle display based on search input
        filterProducts();
    } catch (error) {
        console.error("Error:", error);
    }
}

function filterProducts() {
    const searchValue = document.getElementById("search").value.toLowerCase();

    // Filter the wishlist products based on the search input
    const filteredWishlist = wishlistProducts.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );

    // Display the filtered products
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear existing content

    if (filteredWishlist.length === 0) {
        productList.innerHTML = "<p>No products match your search.</p>";
        return;
    }

    filteredWishlist.forEach(product => {
        const productEl = document.createElement("div");
        productEl.className = "product";

        productEl.innerHTML = `
            <img src="${product.photo_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.device_type}</p>
            <p>${product.price} €</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>`;
        
        productList.appendChild(productEl);
    });
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

document.addEventListener("DOMContentLoaded", displayProducts);


const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
});
