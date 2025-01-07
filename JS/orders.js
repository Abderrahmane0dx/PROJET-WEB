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

// Add these functions to your existing JavaScript file

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

        orders.forEach(order => {
            const tr = document.createElement('tr');
            const statusClass = `status-${order.order_status.toLowerCase()}`;
            const trContent = `
                <td><input type="checkbox" class="order-checkbox" value="${order.order_id}"></td>
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

// Update status button handler
document.querySelector('.update-status').addEventListener('click', async function() {
    const selectedStatus = document.getElementById('statusSelect').value;
    if (!selectedStatus) {
        alert('Please select a status');
        return;
    }

    const selectedOrders = Array.from(document.querySelectorAll('.order-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedOrders.length === 0) {
        alert('Please select at least one order');
        return;
    }

    try {
        const response = await fetch('../PHP/update_order_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderIds: selectedOrders,
                status: selectedStatus
            }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Orders updated successfully!');
            displayOrders(); // Refresh the orders display
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to update orders. Please try again.");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Call the function to display the orders when the page loads
    displayOrders();
});
