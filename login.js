document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm'); 
    const usernameInput = document.getElementById('username'); 
    const passwordInput = document.getElementById('password'); 
    const adminModeRadio = document.getElementById('adminMode'); 

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'oldd';

    const USER_USERNAME = localStorage.getItem('registeredUsername') || 'admin';
    const USER_PASSWORD = localStorage.getItem('registeredPassword') || '123456';

    if (adminModeRadio) {
        adminModeRadio.addEventListener('change', function() {
            if (this.checked) {
                usernameInput.value = ADMIN_USERNAME;
                passwordInput.value = ADMIN_PASSWORD;
            } else {
                usernameInput.value = '';
                passwordInput.value = '';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const currentUsername = usernameInput.value;
            const currentPassword = passwordInput.value;
            let success = false;
            let targetURL = 'index.html';
            let userRole = 'user'; 

            if (currentUsername === ADMIN_USERNAME && currentPassword === ADMIN_PASSWORD) {
                success = true;
                targetURL = 'admin.html'; 
                userRole = 'admin';
            } 

            if (!success) {
                if (currentUsername === USER_USERNAME && currentPassword === USER_PASSWORD) { 
                    success = true;
                    targetURL = 'index.html';
                    userRole = 'user';
                }
            }


            if (success) { 
                alert(`Đăng nhập thành công! Vai trò: ${userRole.toUpperCase()}`);

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', userRole); 

                window.location.href = targetURL; 
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
            }
        });
    } else {
        console.error("Lỗi: Không tìm thấy form với ID 'loginForm'.");
    }
});