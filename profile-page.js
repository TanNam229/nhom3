document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const NO_DATA = 'Chưa có'; 

    const registeredUsername = localStorage.getItem('registeredUsername');
    const registeredName = localStorage.getItem('userName');
    const registeredAddress = localStorage.getItem('userAddress');
    const registeredPhone = localStorage.getItem('userPhone');

    const confirmedName = localStorage.getItem('profileName');
    const confirmedAddress = localStorage.getItem('profileAddress');
    const confirmedPhone = localStorage.getItem('profilePhone');
    const confirmedEmail = localStorage.getItem('profileEmail');

    const finalName = confirmedName || registeredName || NO_DATA;
    const finalAddress = confirmedAddress || registeredAddress || NO_DATA;
    const finalPhone = confirmedPhone || registeredPhone || NO_DATA;
    
  
    let finalEmail = confirmedEmail;
    if (!finalEmail && registeredUsername) {
        finalEmail = `${registeredUsername.toLowerCase()}@example.com`;
    }
    if (!finalEmail) {
        finalEmail = NO_DATA;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Bạn cần đăng nhập để xem thông tin tài khoản.');
        window.location.href = 'login.html'; 
        return; 
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabContents.forEach(content => { content.classList.remove('active'); });
            navButtons.forEach(btn => { btn.classList.remove('active'); });
            
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');

            if (tabId === 'orders') {
                loadOrders(); 
            }
        });
    });

    function loadUserInfo() {
        const displayName = document.getElementById('display-name');
        const displayPhone = document.getElementById('display-phone');
        const displayAddress = document.getElementById('display-address');
        const displayEmail = document.getElementById('display-email');
        const greetingHeader = document.querySelector('.profile-header .user-greeting-title');
        if (greetingHeader) {
            const nameToDisplay = localStorage.getItem('userName') || 'Người dùng mới';
            greetingHeader.textContent = `Chào, ${nameToDisplay}`; 
        }

        if (displayName) displayName.textContent = finalName;
        if (displayPhone) displayPhone.textContent = finalPhone;
        if (displayAddress) displayAddress.textContent = finalAddress;
        if (displayEmail) displayEmail.textContent = finalEmail;
        
    }

    
    function loadOrders() {
        const orderListContainer = document.querySelector('#orders .order-list');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        orderListContainer.innerHTML = '';
        
        if (orders.length === 0) {
            orderListContainer.innerHTML = '<p style="text-align: center; color: #888;">Bạn chưa có đơn hàng nào.</p>';
            return;
        }

        orders.forEach(order => {
            const firstItem = order.items[0]; 
            const statusClass = order.status.includes('Đang giao') ? 'status-shipping' : 'status-delivered';
            
            const totalDisplay = order.totalFormatted || order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';

            const orderHtml = `
                <div class="order-item">
                    <div class="product-image-placeholder">
                        <img src="${firstItem.img || '/img/placeholder.png'}" alt="${firstItem.name}" style="width:100px; height:100px; object-fit:contain; background-color: white;"/>
                    </div>
                    <div class="order-details">
                        <p class="product-name">${firstItem.name} ${order.items.length > 1 ? `và ${order.items.length - 1} sản phẩm khác` : ''}</p>
                        <p class="order-id">Mã đơn: #${order.id}</p>
                        <p class="order-price">Tổng giá: <strong>${totalDisplay}</strong></p>
                        <p class="order-status">Trạng thái: <span class="${statusClass}">${order.status}</span></p>
                        <p class="order-date">Ngày đặt: ${order.date}</p>
                    </div>
                </div>
            `;
            orderListContainer.insertAdjacentHTML('beforeend', orderHtml);
        });
    }

    const editButton = document.querySelector('.edit-btn');
    if (editButton) {
        editButton.addEventListener('click', function() {
            alert('Chức năng chỉnh sửa đang được phát triển. Vui lòng thử lại sau.');
        });
    }

    loadUserInfo();
    
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');
    
    if (targetTab === 'orders') {
        document.querySelector('.nav-button[data-tab="orders"]').click();
    } else {
        document.querySelector('.nav-button[data-tab="info"]').click();
    }
});