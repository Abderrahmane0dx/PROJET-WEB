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

async function displayOrders() {
    try {
        const response = await fetch('../PHP/get_orders.php');
        const data = await response.json();

        if (data.status === 'error') {
            alert(data.message);
            return;
        }

        const orders = data.orders;
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        // Sort orders by date and limit to 5 most recent
        const recentOrders = orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).slice(0, 5);

        recentOrders.forEach(order => {
            const statusClass = `status-${order.order_status.toLowerCase()}`;
            const tr = document.createElement('tr');
            const trContent = `
                <td>${order.username}</td>
                <td>${order.order_date}</td>
                <td>${order.order_time}</td>
                <td>${order.total_price}</td>
                <td class="${statusClass}">${order.order_status}</td>
                <td>${order.delivery_address}</td>
            `;
            tr.innerHTML = trContent;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again.");
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Call the function to display the orders when the page loads
    displayOrders();
});


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
