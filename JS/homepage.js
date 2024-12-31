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

                    // Add product cards for this section
                    filteredProducts.forEach(product => {
                        const productCard = 
                        `<li class="product-card">
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
                                <button class="blue-button">Add To Cart</button>
                            </div>
                        </li>`;
                        productContainer.insertAdjacentHTML("beforeend", productCard);
                        displayProductCards();
                        
                    });
                });
                initializeWishlist();
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

//****************VARIABALES****************//
let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
let productCardWidth = 260;
let productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
let marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
let lastElement = productCardsPerRow - 1;
let productCards;
let productSections = document.querySelectorAll('.product-section');

function displayProductCards() {
    //****************VARIABLES****************//
    const productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
    const productCardWidth = 260;
    const productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
    const marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
    const lastElement = productCardsPerRow - 1;
    const productSections = document.querySelectorAll('.product-section');

    //****************PRODUCT-CARDS-DISPLAY****************//
    productSections.forEach((section) => {
        const productCards = section.querySelectorAll('.product-card');
        for (let i = 0; i < productCardsPerRow; i++) {
            if (productCards[i]) { // Check to ensure the index exists
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
    //****************ADDING-ITEMS-TO-THE-WISH-LIST****************//
    let wishlistCount = document.querySelector('#wishlist-link span');
    let heartbutton = document.querySelectorAll('.heart-button');
    
    heartbutton.forEach((button) => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
        wishlistCount.innerHTML = document.querySelectorAll('.heart-button.active').length;
      });
    });
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
