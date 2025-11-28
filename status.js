document.addEventListener('DOMContentLoaded', function() {
    const loggedOutNav = document.getElementById('logged-out-nav');
    const loggedInNav = document.getElementById('logged-in-nav');
    const logoutLink = document.getElementById('logout-link');

    const searchContainer = document.getElementById('search-container'); 

    function clearUserData() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('orders');
        localStorage.removeItem('cart');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profileAddress');
        localStorage.removeItem('profilePhone');
        localStorage.removeItem('profileEmail');
    }

    function updateNavStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            if (loggedOutNav) loggedOutNav.style.display = 'none';
            if (loggedInNav) loggedInNav.style.display = 'flex'; 
            
            if (searchContainer) searchContainer.classList.remove('hidden');
        } else {
            if (loggedOutNav) loggedOutNav.style.display = 'flex'; 
            if (loggedInNav) loggedInNav.style.display = 'none';
            
            if (searchContainer) searchContainer.classList.add('hidden');
        }
    }

    updateNavStatus();

    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();

            clearUserData(); 
            
            alert('Bạn đã đăng xuất thành công.');

            updateNavStatus(); 

            document.body.classList.remove('search-active');
            const searchResultsSection = document.getElementById('search-results-section');
            if (searchResultsSection) searchResultsSection.style.display = 'none';
        });
    }

    const userIcon = document.querySelector('.user-icon');
    const userSubMenu = document.querySelector('.user-menu-container .sub-menu');

    if (userIcon && userSubMenu) {
        userIcon.addEventListener('click', function(event) {
            event.stopPropagation(); 

            const cartMenu = document.getElementById('cart-dropdown-menu');
            if (cartMenu) cartMenu.style.display = 'none';

            if (userSubMenu.style.display === 'block') {
                userSubMenu.style.display = 'none';
            } else {
                userSubMenu.style.display = 'block';
            }
        });

        document.addEventListener('click', function(e) {
            if (userSubMenu && userSubMenu.style.display === 'block') {
                userSubMenu.style.display = 'none';
            }
        });

        userSubMenu.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    const cartIcon = document.getElementById('cart-icon');
    const cartMenu = document.getElementById('cart-dropdown-menu');

    if (cartIcon && cartMenu) {
        cartIcon.addEventListener('click', function(event) {
            event.stopPropagation(); 

            if (userSubMenu) userSubMenu.style.display = 'none';
            if (typeof renderCart === 'function') {
                renderCart();
            }
            if (cartMenu.style.display === 'block') {
                cartMenu.style.display = 'none';
            } else {
                cartMenu.style.display = 'block';
            }
        });
        document.addEventListener('click', function(event) {
            if (cartMenu && cartMenu.style.display === 'block' && !cartIcon.contains(event.target)) {
                 cartMenu.style.display = 'none';
            }
        });
        cartMenu.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const banners = document.querySelectorAll('.banner-container .banner');
    let currentBannerIndex = 0;
    const intervalTime = 4000; 

    if (banners.length === 0) return;

    function showNextBanner() {
        banners[currentBannerIndex].classList.remove('active');

        currentBannerIndex = (currentBannerIndex + 1) % banners.length;

        banners[currentBannerIndex].classList.add('active');
    }

    setInterval(showNextBanner, intervalTime);
});


document.addEventListener('DOMContentLoaded', function() {
    const productsMap = new Map();

    document.querySelectorAll('.product-carousel-container .add-to-cart-btn').forEach(button => {
        const id = button.getAttribute('data-id');

        if (!productsMap.has(id)) {
             const product = {
                id: id,
                name: button.getAttribute('data-name'),
                price: parseInt(button.getAttribute('data-price')),
                img: button.getAttribute('data-img'),
                quantity: 20 
            };
            
            let imgPath = product.img.replace(/(\.\.\/)+/g, ''); 
            product.img = imgPath.startsWith('/') ? imgPath : '/' + imgPath;
            
            productsMap.set(id, product);
        }
    });

    const allProducts = Array.from(productsMap.values());
    
    if (allProducts.length > 0) {
        localStorage.setItem('PRODUCT_SNAPSHOT', JSON.stringify(allProducts));
        
        if (!localStorage.getItem('ADMIN_PRODUCT_DATA')) {
            localStorage.setItem('ADMIN_PRODUCT_DATA', JSON.stringify(allProducts));
        }
    }
});