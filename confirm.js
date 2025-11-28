function generateOrderId() {
    return 'OLDD' + Math.floor(Math.random() * 90000 + 10000);
}

function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
}

document.addEventListener('DOMContentLoaded', function() {
    const confirmButton = document.querySelector('.confirm-btn');

    if (confirmButton) {
        confirmButton.addEventListener('click', function(event) {
            event.preventDefault();

            const name = document.querySelector('.confirm-name').value.trim();
            const address = document.querySelector('.confirm-address').value.trim();
            const phone = document.querySelector('.confirm-phone').value.trim();
            const email = document.querySelector('.confirm-email').value.trim();

            if (!name || !address || !phone || !email) {
                alert('Vui lòng điền đầy đủ thông tin giao hàng.');
                return;
            }

            localStorage.setItem('profileName', name);
            localStorage.setItem('profileAddress', address);
            localStorage.setItem('profilePhone', phone);
            localStorage.setItem('profileEmail', email);

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (cart.length === 0) {
                alert('Không có sản phẩm nào trong giỏ hàng để đặt.');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const newOrder = {
                id: generateOrderId(),
                items: cart,
                total: total,
                totalFormatted: formatCurrency(total),
                date: new Date().toLocaleDateString('vi-VN'),
                status: 'Đang giao hàng' 
            };

            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            existingOrders.unshift(newOrder); 
            localStorage.setItem('orders', JSON.stringify(existingOrders));

            localStorage.removeItem('cart'); 

            alert('Đặt hàng thành công! Đơn hàng của bạn sẽ sớm được xử lý. Cảm ơn quý khách!');

            window.location.href = 'index.html'; 
        });
    }
});