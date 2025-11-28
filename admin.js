function formatCurrency(number) {
    if (typeof number !== 'number') return '0đ';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
}

function getProductData() {
    let snapshotData = JSON.parse(localStorage.getItem('PRODUCT_SNAPSHOT') || '[]');
    let adminData = JSON.parse(localStorage.getItem('ADMIN_PRODUCT_DATA'));
    
    if (!adminData || adminData.length === 0) {
        if (snapshotData.length > 0) {
            localStorage.setItem('ADMIN_PRODUCT_DATA', JSON.stringify(snapshotData));
            adminData = snapshotData;
        } else {
            adminData = [];
        }
    }
    
    return adminData.map(p => ({
        ...p,
        img: p.img.startsWith('/') ? p.img : '/' + p.img.replace(/(\.\.\/)+/g, '')
    }));
}

function saveProductData(products) {
    localStorage.setItem('ADMIN_PRODUCT_DATA', JSON.stringify(products));
}

function getCustomerData() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const customers = {};
    orders.forEach(order => {
        const name = localStorage.getItem('profileName') || 'Khách Vãng Lai';
        const phone = localStorage.getItem('profilePhone') || 'N/A';
        const email = localStorage.getItem('profileEmail') || 'N/A';
        const customerKey = email !== 'N/A' ? email : phone;

        if (!customers[customerKey]) {
            customers[customerKey] = { key: customerKey, name: name, email: email, phone: phone, ordersCount: 0, totalSpent: 0 };
        }
        customers[customerKey].ordersCount++;
        customers[customerKey].totalSpent += order.total;
    });

    return Object.values(customers);
}



function deleteProduct(productId) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${productId}?`)) {
        let products = getProductData();
        products = products.filter(p => p.id !== productId);
        saveProductData(products);
        renderProductList();
        calculateRevenue();
    }
}

function deleteOrder(orderId) {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderId}?`)) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        renderOrderList(orders);
        calculateRevenue();
    }
}

function deleteCustomer(customerKey) {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng (${customerKey}) và THÔNG TIN PROFILE LIÊN QUAN?`)) {
        const currentEmail = localStorage.getItem('profileEmail');
        const currentPhone = localStorage.getItem('profilePhone');
        
        if (customerKey === currentEmail || customerKey === currentPhone) {
             localStorage.removeItem('profileName');
             localStorage.removeItem('profileAddress');
             localStorage.removeItem('profilePhone');
             localStorage.removeItem('profileEmail');

             localStorage.removeItem('orders');
             
             alert(`Đã xóa profile khách hàng và toàn bộ lịch sử đơn hàng.`);
        } else {
             alert(`Không thể xóa khách hàng này. Thao tác này chỉ có thể xóa profile hiện tại.`);
        }

        renderCustomerList();
        calculateRevenue();
    }
}


function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.sidebar li[onclick="showSection('${sectionId}')"]`).classList.add('active');

    if (sectionId === 'dashboard') calculateRevenue();
    if (sectionId === 'products') renderProductList();
    if (sectionId === 'customers') renderCustomerList();
    if (sectionId === 'orders') renderOrderList();
}


function calculateRevenue() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const products = getProductData();

    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-products').textContent = products.length;

}

function renderOrderList(orders = JSON.parse(localStorage.getItem('orders') || '[]')) {
    const container = document.getElementById('order-list-container');
    if (!container) return;

    let html = '<table><thead><tr><th>Mã Đơn</th><th>Tổng Tiền</th><th>Ngày</th><th>Trạng thái</th><th style="width: 150px;">Hành động</th></tr></thead><tbody>';
    
    if (orders.length === 0) {
        html += '<tr><td colspan="5" style="text-align: center;">Chưa có đơn hàng nào.</td></tr>';
    } else {
        orders.forEach(order => {
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.totalFormatted}</td>
                    <td>${order.date}</td>
                    <td>${order.status}</td>
                    <td>
                        <button class="btn-primary" style="background-color: #007bff; margin-bottom: 5px;" onclick="alert('Chi tiết Đơn hàng: ${order.id}\\n Tổng: ${order.totalFormatted}')">Xem chi tiết</button>
                        <button onclick="deleteOrder('${order.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderCustomerList() {
    const container = document.getElementById('customer-list-container');
    if (!container) return;

    const customers = getCustomerData();
    
    let html = '<table><thead><tr><th>Tên Khách hàng</th><th>Email</th><th>SĐT</th><th>Số Đơn</th><th>Tổng Chi tiêu</th><th style="width: 80px;">Hành động</th></tr></thead><tbody>';
    
    if (customers.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center;">Chưa có dữ liệu khách hàng.</td></tr>';
    } else {
        customers.forEach(customer => {
            html += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.ordersCount}</td>
                    <td>${formatCurrency(customer.totalSpent)}</td>
                    <td>
                        <button onclick="deleteCustomer('${customer.key}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


function renderProductList() {
    const container = document.getElementById('product-list-container');
    if (!container) return;

    const products = getProductData();
    
    let html = '<table><thead><tr><th>ID</th><th>Ảnh</th><th>Tên Sản phẩm</th><th>Giá</th><th>SL Tồn</th><th style="width: 150px;">Hành động</th></tr></thead><tbody>';
    
    if (products.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center;">Chưa có sản phẩm nào.</td></tr>';
    } else {
        products.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td><img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain;"></td>
                    <td>${product.name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>${product.quantity || 0}</td>
                    <td>
                        <button class="btn-primary" onclick="openProductModal('edit', '${product.id}')" style="margin-bottom: 5px;">Sửa</button>
                        <button onclick="deleteProduct('${product.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


function openProductModal(mode, productId = '') {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.textContent = mode === 'add' ? '➕ Thêm Sản phẩm mới' : '✏️ Sửa Sản phẩm';
    document.getElementById('product-id').value = productId;

    if (mode === 'edit') {
        const products = getProductData();
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-img').value = product.img;
            document.getElementById('product-quantity').value = product.quantity || 0;
        }
    } else {
        form.reset();
        document.getElementById('product-quantity').value = 0;
    }
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const img = document.getElementById('product-img').value;
    const quantity = parseInt(document.getElementById('product-quantity').value);

    let products = getProductData();

    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
            products[index] = { ...products[index], name, price, img, quantity };
            alert('Sửa sản phẩm thành công!');
        }
    } else {
        const namePart = name.replace(/\s/g, '').toUpperCase().substring(0, 4);
        const timePart = Date.now().toString().slice(-4);
        const newId = namePart + timePart;

        products.unshift({ id: newId, name, price, img, specs: 'N/A', quantity: quantity }); 
        alert('Thêm sản phẩm mới thành công!');
    }

    saveProductData(products);
    closeProductModal();
    renderProductList();
    calculateRevenue();
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    if (form && !document.getElementById('product-quantity')) {
        const imgInput = document.getElementById('product-img');
        const quantityLabel = document.createElement('label');
        quantityLabel.htmlFor = 'product-quantity';
        quantityLabel.textContent = 'Số lượng tồn kho';
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'product-quantity';
        quantityInput.value = 0;
        quantityInput.required = true;

        imgInput.parentNode.insertBefore(quantityLabel, imgInput.nextSibling);
        imgInput.parentNode.insertBefore(quantityInput, quantityLabel.nextSibling);
    }

    window.showSection = showSection;
    window.openProductModal = openProductModal;
    window.closeProductModal = closeProductModal;
    window.deleteProduct = deleteProduct;
    window.deleteOrder = deleteOrder;
    window.deleteCustomer = deleteCustomer;

    showSection('dashboard');
});