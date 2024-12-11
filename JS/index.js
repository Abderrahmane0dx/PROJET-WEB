const sideMenu = document.querySelector("aside");
const menubtn = document.querySelector("#menu-btn");
const closebtn = document.querySelector("#closebtn");
const themeToggler = document.querySelector(".theme-toggler");

menubtn.addEventListener('click',()=>{
    sideMenu.style.display = 'block';
})

closebtn.addEventListener('click',()=>{
    sideMenu.style.display = 'none';
})

// change Theme:

themeToggler.addEventListener('click', () =>{
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})

// fill orders in the table:

Orders.forEach(order =>{
    const tr = document.createElement('tr');
    const trcontent = `
                        <td>${order.productName}</td>
                        <td>${order.productNumber}</td>
                        <td>${order.paymentStatus}</td>
                        <td class="${order.Shipping === 'Declined' ? 'danger':
                                     order.Shipping === 'Pending' ? 'warning':
                                     'primary'}">${order.Shipping}</td>
                        <td class="primary>Details</td>
                        `;
    tr.innerHTML = trcontent;
    document.querySelector('table tbody').appendChild(tr);
})