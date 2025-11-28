function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function normalizePath(path) {
    if (path) {
        return path.replace(/(\.\.\/)+/g, ''); 
    }
    return '';
}

function addToCart(product) {
    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    product.img = normalizePath(product.img); 

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
    renderCart(); 
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart(); 
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-dropdown-menu .cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    let cart = getCart();

    const displayCart = cart.slice(0, 4); 
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartItemsContainer) { 
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Giỏ hàng trống.</p>';
        } else {
            displayCart.forEach(item => {
            
                const cartItemHTML = `
                    <div class="cart-dropdown-item" data-id="${item.id}">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <p class="item-name">${item.name}</p>
                            <p class="item-price-quantity">${formatCurrency(item.price)} x ${item.quantity}</p>
                        </div>
                        <button class="remove-from-dropdown-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            });

            if (cart.length > 4) {
                cartItemsContainer.insertAdjacentHTML('beforeend', `<p class="more-items-message">Và ${cart.length - 4} sản phẩm khác...</p>`);
            }
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = formatCurrency(total);
    }

    document.querySelectorAll('.remove-from-dropdown-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); 
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const allAddToCartButtons = document.querySelectorAll('.add-to-cart-btn, .buy-now-button');
    const checkoutAllButton = document.querySelector('.btn-checkout-all'); 
    const cartDropdownMenu = document.getElementById('cart-dropdown-menu'); 

    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            let product;
            
            if (button.closest('.product-info-container')) {
                const container = button.closest('.product-info-container');
                const productName = container.querySelector('.product-name h1').textContent.trim();
                const priceText = container.querySelector('.product-price h3').textContent.replace(/[^\d]/g, ''); 
                const productPrice = parseInt(priceText);

                const productImageSrc = container.querySelector('.product-image img').getAttribute('src');
                
                const productId = productName.replace(/\s/g, '').toUpperCase(); 

                product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImageSrc
                };
            } else {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = parseInt(this.getAttribute('data-price')); 
                const productImg = this.getAttribute('data-img');

                product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg 
                };
            }
            
            addToCart(product);

            if (this.classList.contains('buy-now-button')) {
                if (cartDropdownMenu) {
                    cartDropdownMenu.style.display = 'block';

                    const userSubMenu = document.querySelector('.user-menu-container .sub-menu');
                    if (userSubMenu) userSubMenu.style.display = 'none';
                }
            }
        });
    });

    if (checkoutAllButton) {
        checkoutAllButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            const cart = getCart();
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.');
                return;
            }

            let path = 'confirm.html';
            if (window.location.pathname.includes('/product/')) {
                 path = '../../confirm.html'; 
            }
            
            window.location.href = path;
        });
    }

    renderCart();
});