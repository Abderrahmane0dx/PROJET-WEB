
document.addEventListener('DOMContentLoaded', () =>{

  //****************PRODUCT-CARDS-DISPLAY****************//

  //****************VARIABALES****************//
  let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
  let productCardWidth = 260;
  let productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
  let marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
  let lastElement = productCardsPerRow - 1;
  let productCards;
  let productSections = document.querySelectorAll('.product-section');


  productSections.forEach((section) =>{
    productCards = section.querySelectorAll('.product-card');
    for(let i = 0; i < productCardsPerRow; i++){
       productCards[i].classList.add('active');
       if(i === lastElement){
        productCards[i].style.marginRight = '0px';
       }else{
        productCards[i].style.marginRight = `${marginSpacing}px`;
       }
    }
  })

  //****************ADDING-ITEMS-TO-THE-WISH-LIST****************//
  let wishlistCount = document.querySelector('#wishlist-link span');
  let heartbutton = document.querySelectorAll('.heart-button');
  heartbutton.forEach((button) => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        wishlistCount.innerHTML = document.querySelectorAll('.heart-button.active').length;
    });
  })
  

  
})