//****************VARIABALES****************//
let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
let productCardWidth = 260;
let productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 10));
let marginSpacing = ((productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1)) - 5;
let lastElement = productCardsPerRow - 1;
let productCards;
let productSections = document.querySelectorAll('.product-section');

document.addEventListener('DOMContentLoaded', () =>{

  //****************PRODUCT-CARDS-DISPLAY****************//
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
