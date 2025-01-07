const sideMenu = document.querySelector("aside");
const menubtn = document.querySelector("#menu-btn");
const closebtn = document.querySelector("#closebtn");
const themeToggler = document.querySelector(".theme-toggler");

// Check for saved theme preference when page loads
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
        themeToggler.querySelector('span:nth-child(2)').classList.add('active');
    }
});

menubtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

// Modified theme toggler with localStorage
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    
    // Update theme icons
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    
    // Save theme preference
    const isDark = document.body.classList.contains('dark-theme-variables');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


document.addEventListener('DOMContentLoaded', () => {
    // Display all products in the table when the page loads
    displayProducts();

    // Add event listener for the update button
    document.querySelector('.updateproduct').addEventListener('click', updateProduct);

    // Add event listener for the delete button
    document.querySelector('.deleteproduct').addEventListener('click', deleteProduct);
});

async function displayProducts() {
    try {
        const response = await fetch('../PHP/get_products.php');
        const data = await response.json();

        if (data.status === 'error') {
            alert(data.message);
            return;
        }

        const products = data.products;
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            const trContent = `
                <td><img src="${product.photo_url}" alt="${product.name}" style="width: 50px; height: auto;"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.device_type}</td>
                <td>${product.quantity}</td>
                <td>${product.description}</td>
                <td><input type="radio" name="selectedProduct" class="product-radio" value="${product.id}"></td>
            `;
            tr.innerHTML = trContent;
            tableBody.appendChild(tr);
        });

        // Add event listener to auto-fill input fields when a product is selected
        document.querySelectorAll('.product-radio').forEach(radio => {
            radio.addEventListener('change', fillProductDetails);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again.");
    }
}

function fillProductDetails() {
    const selectedProduct = this.value; // Get selected product ID
    const row = this.closest('tr'); // Get the corresponding table row

    // Fill input fields with product details
    document.querySelector('input[name="name"]').value = row.children[1].textContent;
    document.querySelector('input[name="price"]').value = row.children[2].textContent;
    document.querySelector('input[name="quantity"]').value = row.children[4].textContent;
    document.querySelector('input[name="device_type"]').value = row.children[3].textContent;
    document.querySelector('input[name="photo_url"]').value = row.children[0].querySelector('img').src;
    document.querySelector('textarea[name="description"]').value = row.children[5].textContent;

    // Store the selected product ID for update or delete actions
    document.querySelector('#productForm').dataset.selectedProductId = selectedProduct;
}

async function updateProduct() {
    const productId = document.querySelector('#productForm').dataset.selectedProductId;

    if (!productId) {
        alert('Please select a product to update.');
        return;
    }

    const productData = {
        id: productId,
        name: document.querySelector('input[name="name"]').value,
        price: document.querySelector('input[name="price"]').value,
        quantity: document.querySelector('input[name="quantity"]').value,
        device_type: document.querySelector('input[name="device_type"]').value,
        photo_url: document.querySelector('input[name="photo_url"]').value,
        description: document.querySelector('textarea[name="description"]').value,
    };

    // Check if the data was modified
    const originalData = document.querySelector('table tbody').querySelector(`input[value="${productId}"]`).closest('tr');
    const originalName = originalData.children[1].textContent;
    const originalPrice = originalData.children[2].textContent;
    const originalQuantity = originalData.children[4].textContent;
    const originalDeviceType = originalData.children[3].textContent;
    const originalDescription = originalData.children[5].textContent;

    if (
        productData.name === originalName &&
        productData.price === originalPrice &&
        productData.quantity === originalQuantity &&
        productData.device_type === originalDeviceType &&
        productData.description === originalDescription
    ) {
        alert("No changes made to the product.");
        return;
    }

    try {
        const response = await fetch('../PHP/update_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Product updated successfully!');
            displayProducts(); // Refresh the product table
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update the product. Please try again.");
    }
}

async function deleteProduct() {
    const productId = document.querySelector('#productForm').dataset.selectedProductId;

    if (!productId) {
        alert('Please select a product to delete.');
        return;
    }

    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch('../PHP/delete_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productId }),
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Product deleted successfully!');
            displayProducts(); // Refresh the product table
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product. Please try again.");
    }
}

// Add Product Form Handler
const productForm = document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.name.value,
            price: this.price.value,
            description: this.description.value,
            quantity: this.quantity.value,
            photo_url: this.photo_url.value,
            device_type: this.device_type.value
        };

        // Here you would typically send this data to your server
        console.log('Product Data:', formData);
        
        // Clear form after submission
        this.reset();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the button that adds the product
    const addProductButton = document.querySelector(".item.addproduct");

    addProductButton.addEventListener("click", async function() {
        const form = document.getElementById("productForm");

        // Get values from the form elements
        const name = form.querySelector("[name='name']").value.trim();
        const price = parseFloat(form.querySelector("[name='price']").value);
        const description = form.querySelector("[name='description']").value.trim();
        const quantity = parseInt(form.querySelector("[name='quantity']").value);
        const photo_url = form.querySelector("[name='photo_url']").value.trim();
        const device_type = form.querySelector("[name='device_type']").value.trim();

        // Validation
        if (!name || name.length < 3) {
            alert("Product name is required and should be at least 3 characters.");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert("Quantity must be a positive number.");
            return;
        }

        if (!photo_url || !isValidURL(photo_url)) {
            alert("Please provide a valid photo URL.");
            return;
        }

        // Prepare data to be sent to PHP
        const productData = {
            name,
            price,
            description,
            quantity,
            photo_url,
            device_type
        };

        // Send data to the backend
        try {
            const response = await fetch('../PHP/add_product.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert("Product added successfully!");
                form.reset(); // Optionally reset the form after success
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add product. Please try again.");
        }
    });
});

// Function to check if URL is valid
function isValidURL(url) {
    const pattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return pattern.test(url);
}
