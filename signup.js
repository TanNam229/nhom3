document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');

    function clearPreviousUserData() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('orders');
        localStorage.removeItem('cart');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profileAddress');
        localStorage.removeItem('profilePhone');
        localStorage.removeItem('profileEmail');
    }


    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
                return; 
            }

            if (!newUsername || !newPassword) {
                alert('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
                return;
            }
            
            clearPreviousUserData();

            localStorage.setItem('registeredUsername', newUsername);
            localStorage.setItem('registeredPassword', newPassword);
            
            localStorage.setItem('userName', 'Người dùng mới');
            localStorage.setItem('userPhone', '0901234567');
            localStorage.setItem('userAddress', 'Số 99, Đường Nguyễn X, Quận Y, TP.HCM');
            
            alert('Đăng ký thành công! Vui lòng đăng nhập.');

            window.location.href = 'login.html';
        });
    }
});
