// on crée un tableau qui contient des objets de nos produits avec toutes leur informations:
const products = [
    { id: 1, name: "Ipad", description: "iPad Pro 2021", price: 500, img: "/PROJECT-PHOTOS/ipadpro.jfif" },
    { id: 2, name: "MacBook", description: "MacBook Air 2020", price: 600, img: "/PROJECT-PHOTOS/mac.jfif" },
    { id: 3, name: "Iphone", description: "Iphone 16 Pro Max", price: 1000, img: "/PROJECT-PHOTOS/iphone.jfif" },
    { id: 4, name: "Head Phones", description: "AirPods Pro 2", price: 200, img: "/PROJECT-PHOTOS/airpod.jfif" },
    { id: 5, name: "Ipad", description: "iPad Pro 2021", price: 500, img: "/PROJECT-PHOTOS/ipadpro.jfif" },
    { id: 6, name: "Ipad", description: "iPad Pro 2021", price: 500, img: "/PROJECT-PHOTOS/ipadpro.jfif" },
    { id: 7, name: "Ipad", description: "iPad Pro 2021", price: 500, img: "/PROJECT-PHOTOS/ipadpro.jfif" },
    { id: 8, name: "Ipad", description: "iPad Pro 2021", price: 500, img: "/PROJECT-PHOTOS/ipadpro.jfif" }
];

// JS for Image Slider (Ad section)
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');

function changeSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(changeSlide, 3000); // Change image every 5 seconds

// on initialise le panier à vide:
let cart = {};
  
// Fonction pour afficher les produits:
  function displayProducts(filteredProducts = products) {
    // sélectionner l'élément HTML "product-list" pour le remplir dynamiquement:
    const productList = document.getElementById("product-list");
    // on le vide pour éviter les duplications:
    productList.innerHTML = "";
    // on traite chaque élément du tableau (produit) individuellement:
    filteredProducts.forEach(product => {
      // création du div pour le produit:
      const productEl = document.createElement("div");
      // nommage de la classe du produit:
      productEl.className = "product";
      // remplissage avec les informations à partir du tableau des produits:
      productEl.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Prix: ${product.price} €</p>
        <button onclick="addToCart(${product.id})">Ajouter au panier</button>
        ${cart[product.id] ? '<span class="added">Déjà ajouté</span>' : ''}`;
      // l'ajout d'un span qui indique que ce produit est déjà ajouté
      //ajouter l'élément à la liste:
      productList.appendChild(productEl);
    });
  }
  
// Fonction pour ajouter un produit au panier
  function addToCart(productId) {
    // si le produit existe déjà on incrémente juste son nombre d'occurence:
    if (cart[productId]) {
      cart[productId].quantity += 1;
    } else {
    // sinon on rajoute le produit: 
      const product = products.find(p => p.id === productId);
      cart[productId] = { ...product, quantity: 1 };
    }
    // mis à jour du panier:
    updateCart();

    displayProducts();
  }
  
// Fonction pour mettre à jour le panier
  function updateCart() {
    // Récupère l'élément HTML avec l'id: cart-items,qui contient la liste des articles ajoutés au panier:
    const cartItems = document.getElementById("cart-items");
    //  Récupère l'élément HTML avec l'id cart-total,où sera affiché le montant total des articles dans le panier:
    const cartTotal = document.getElementById("cart-total");
    // initialiser la varibale total à 0:
    let total = 0;
    // vider l'élément cartItems:
    cartItems.innerHTML = "";
    //  Récupère un tableau contenant uniquement les valeurs (articles) de l'objet cart en parcourant chaque article du panier:
    Object.values(cart).forEach(item => {
      // Crée un élément HTML <div> pour représenter un produit du panier.
      const itemEl = document.createElement("div");
      // Attribue à cet élément la classe CSS product-summary, qui applique un style particulier:
      itemEl.className = "product-summary";
      // rajouter à cet élément du contenu:
      itemEl.innerHTML = `
        ${item.name} : ${item.quantity} x ${item.price} €
        <button onclick="removeFromCart(${item.id})">Retirer</button>
      `;
      // rajouter l'élément au panier:
      cartItems.appendChild(itemEl);
      // calculer le total:
      total += item.price * item.quantity;
    });
    // rajouter le total:
    cartTotal.textContent = total + " €";
  }
  
// Fonction pour retirer un produit du panier
  function removeFromCart(productId) {
    if (cart[productId]) {
      cart[productId].quantity -= 1;
      if (cart[productId].quantity <= 0) delete cart[productId];
    }
    updateCart();
    displayProducts();
  }
  
// Fonction de recherche des produits
  function filterProducts() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
    displayProducts(filteredProducts);
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


  // Affichage initial
    displayProducts();
  
  document.getElementById('cart-toggle').addEventListener('click', function () {
      const cart = document.getElementById('cart');
      cart.classList.toggle('active');
  });
  
  document.getElementById('cart-close').addEventListener('click', function () {
      const cart = document.getElementById('cart');
      cart.classList.remove('active');
  });