document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsSection = document.getElementById('search-results-section');
    const searchResultsList = document.getElementById('search-results-list');
    const noResultsMessage = document.getElementById('no-results-message');

    const allProductContainers = document.querySelectorAll('.list-product .product-item'); 

    allProductContainers.forEach(container => {
        const nameElement = container.querySelector('.name strong');
        if (nameElement) {
            const productName = nameElement.textContent.trim();
            container.setAttribute('data-name', productName);
        }
    });

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' || searchInput.value.trim() === '') {
                handleSearch();
            }
        });
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const results = [];

        if (searchTerm === "") {
            document.body.classList.remove('search-active');
            searchResultsSection.style.display = 'none'; 
            return;
        }
        
        document.body.classList.add('search-active');

        // Lọc sản phẩm
        allProductContainers.forEach(container => {
            const productName = container.getAttribute('data-name')?.toLowerCase() || ""; 
            
            if (productName.includes(searchTerm)) {
                results.push(container.outerHTML);
            }
        });

        renderSearchResults(results, searchTerm);
    }

    function renderSearchResults(resultsHtml, searchTerm) {
        searchResultsList.innerHTML = ''; 
        searchResultsSection.style.display = 'block'; 

        if (resultsHtml.length > 0) {
            noResultsMessage.style.display = 'none';

            document.getElementById('search-results-title').textContent = 
                `Kết quả tìm kiếm cho: "${searchTerm}" (${resultsHtml.length} sản phẩm)`;
            
            resultsHtml.forEach(html => {
                searchResultsList.insertAdjacentHTML('beforeend', html);
            });

            attachAddToCartListeners(searchResultsList);

        } else {
            document.getElementById('search-results-title').textContent = `Kết quả tìm kiếm cho: "${searchTerm}"`;
            noResultsMessage.style.display = 'block';
        }
    }

    function attachAddToCartListeners(container) {
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                
                const product = {
                    id: this.getAttribute('data-id'),
                    name: this.getAttribute('data-name'),
                    price: parseInt(this.getAttribute('data-price')), 
                    img: this.getAttribute('data-img')
                };
                
                if (typeof addToCart === 'function') {
                    addToCart(product);
                }
            });
        });
    }
});