document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch products asynchronously
        const response = await fetch("../PHP/get_products.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const result = await response.json(); // Parse JSON response

            if (result.status === "success") {
                const products = result.products;

                // List of sections and their corresponding types
                const sections = [
                    { id: "headphonecard", type: "Headphone" },
                    { id: "phonecard", type: "Phone" },
                    { id: "tabletcard", type: "Tablet" },
                    { id: "smartwatchcard", type: "Smartwatch" },
                    { id: "laptopcard", type: "Laptop" },
                ];

                // Iterate through each section to display the corresponding products
                sections.forEach(section => {
                    const productContainer = document.querySelector(`#${section.id} ul`);

                    if (!productContainer) {
                        console.warn(`Section with ID ${section.id} not found.`);
                        return;
                    }

                    // Filter products by type
                    const filteredProducts = products.filter(product => product.device_type === section.type);

                    // Clear existing content
                    productContainer.innerHTML = "";

                    filteredProducts.forEach(product => {
                        const productId = product.id; // Assuming each product has a unique 'id'
                        const productCard = 
                        `<li class="product-card" id="product-${productId}">
                            <div class="product-image-container">
                                <img src="${product.photo_url}" alt="${product.name}">
                                <button class="heart-button">
                                    <svg viewBox="0 0 24 24" width="22px" height="22px" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="product-text-container">
                                <h1>${product.name}</h1>
                                <p>$${product.price}</p>
                                <button class="blue-button add-to-cart-button">Add To Cart</button>
                            </div>
                        </li>`;
                        productContainer.insertAdjacentHTML("beforeend", productCard);
                        displayProductCards();
                    });
                });

                initializeWishlist();
                initializeCart();
            } else {
                console.error("Error fetching products:", result.message);
            }
        } else {
            console.error("Request failed:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

//****************VARIABLES****************//
let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
let productCardWidth = 260;
let productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
let marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
let lastElement = productCardsPerRow - 1;
let productCards;
let productSections = document.querySelectorAll('.product-section');

function displayProductCards() {
    const productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
    const productCardWidth = 260;
    const productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
    const marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
    const lastElement = productCardsPerRow - 1;
    const productSections = document.querySelectorAll('.product-section');

    productSections.forEach((section) => {
        const productCards = section.querySelectorAll('.product-card');
        for (let i = 0; i < productCardsPerRow; i++) {
            if (productCards[i]) {
                productCards[i].classList.add('active');
                if (i === lastElement) {
                    productCards[i].style.marginRight = '0px';
                } else {
                    productCards[i].style.marginRight = `${marginSpacing}px`;
                }
            }
        }
    });
}

function initializeWishlist() {
    const username = localStorage.getItem('username');

    if (username) {
        fetchWishlistFromServer(username);
    } else {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        updateWishlistCount(wishlist.length);
        setWishlistButtonsState(wishlist);
    }

    let heartButtons = document.querySelectorAll('.heart-button');

    heartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.id.replace('product-', '');

        button.addEventListener('click', () => {
            button.classList.toggle('active');

            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (button.classList.contains('active')) {
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                }
            } else {
                wishlist = wishlist.filter(id => id !== productId);
            }

            updateWishlistCount(wishlist.length);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            if (username) {
                updateWishlistOnServer(wishlist);
            }
        });
    });
}

function updateWishlistCount(count) {
    const wishlistCount = document.querySelector('#wishlist-link span');
    wishlistCount.innerHTML = count;
}

function setWishlistButtonsState(wishlist) {
    let heartButtons = document.querySelectorAll('.heart-button');

    heartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.id.replace('product-', '');

        if (wishlist.includes(productId)) {
            button.classList.add('active');
        }
    });
}

async function fetchWishlistFromServer(username) {
    try {
        const response = await fetch('../PHP/get_wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            const wishlist = result.wishlist || [];
            updateWishlistCount(wishlist.length);
            setWishlistButtonsState(wishlist);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } else {
            console.error('Error fetching wishlist:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to send the updated wishlist to the backend
async function updateWishlistOnServer(wishlist) {
    const username = localStorage.getItem('username');  // Get the logged-in username

    // If no username is found, return (e.g., user is not logged in)
    if (!username) return;

    try {
        const response = await fetch('../PHP/update_wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                wishlist,
            }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Wishlist updated on server.');
        } else {
            console.error('Error updating wishlist:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



//SLIDSHOWPART:
let slideshowButtons = document.querySelectorAll('.slideshow-buttons');
slideshowButtons.forEach((button) => {
   button.addEventListener('click',() =>{
    let slideshowSection = button.parentElement.dataset.slideshow;
    console.log(slideshowSection);
    let slideshowContainer = document.querySelector(`#product-section-${slideshowSection}`)
    console.log(slideshowContainer);
    let productCards = slideshowContainer.querySelectorAll('.product-card');
    console.log(slideshowContainer);

    if(button.classList.contains('prev-button')){
      if(lastElement <= (productCardsPerRow - 1)){
        lastElement = productCards.length - 1;
      }
      else{
        lastElement--
      }
    }
    else if (button.classList.contains('next-button')){
      if(lastElement === (productCards.length - 1)){
        lastElement = productCardsPerRow - 1;
      }
      else{
        lastElement++
      }
    }
    else{
        console.log("SlideShow: ERROR Occured");
    }

    for(let i=0; i<productCards.length; i++){
        if((i <= lastElement) && (i >=(lastElement-(productCardsPerRow - 1)))){
            productCards[i].classList.add('active');

            if(i === lastElement){
                productCards[i].style.marginRight = '0px'
            }
            else{
                productCards[i].style.marginRight = `${marginSpacing}px`
            }
        }
        else{
            productCards[i].classList.remove('active');
            productCards[i].style.marginRight = '0px'
        }
    }
   })
})


// Add these functions to your existing JavaScript file

function initializeCart() {
    const username = localStorage.getItem('username');
    
    if (username) {
        // Fetch cart from server if user is logged in
        fetchCartFromServer(username);
    } else {
        // For guest users, load cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount(cart.length);
    }

    // Add click event listeners to all "Add To Cart" buttons
    let cartButtons = document.querySelectorAll('.blue-button');
    cartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.id.replace('product-', '');

        button.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (!cart.includes(productId)) {
                cart.push(productId);
                button.textContent = 'Remove from Cart';
                button.classList.add('in-cart');
            } else {
                cart = cart.filter(id => id !== productId);
                button.textContent = 'Add To Cart';
                button.classList.remove('in-cart');
            }

            // Update cart count and save to localStorage
            updateCartCount(cart.length);
            localStorage.setItem('cart', JSON.stringify(cart));

            // If user is logged in, update cart on server
            if (username) {
                updateCartOnServer(cart);
            }
        });
    });
}

function updateCartCount(count) {
    const cartCount = document.querySelector('#cart-link span');
    cartCount.innerHTML = count;
}

function setCartButtonsState(cart) {
    let cartButtons = document.querySelectorAll('.blue-button');
    
    cartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.id.replace('product-', '');

        if (cart.includes(productId)) {
            button.textContent = 'Remove from Cart';
            button.classList.add('in-cart');
        } else {
            button.textContent = 'Add To Cart';
            button.classList.remove('in-cart');
        }
    });
}

async function fetchCartFromServer(username) {
    try {
        const response = await fetch('../PHP/get_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            const cart = result.product_ids || [];
            updateCartCount(cart.length);
            setCartButtonsState(cart);
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            console.error('Error fetching cart:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateCartOnServer(cart) {
    const username = localStorage.getItem('username');
    
    if (!username) return;

    try {
        const response = await fetch('../PHP/update_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                product_ids: cart,
            }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Cart updated on server.');
        } else {
            console.error('Error updating cart:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}