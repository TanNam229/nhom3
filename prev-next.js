const carousels = document.querySelectorAll('.product-carousel-container');

carousels.forEach(carousel => {
    const listProduct = carousel.querySelector('.list-product');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const productView = carousel.querySelector('.product-view'); 
    
    let scrollPosition = 0;
    let scrollDistance = 0;

    function calculateScrollDistance() {
        const firstItem = carousel.querySelector('.product-item');
        if (firstItem) {
            scrollDistance = firstItem.offsetWidth + 20; 
        }
    }

    calculateScrollDistance();
    window.addEventListener('resize', calculateScrollDistance); 

    nextBtn.addEventListener('click', () => {
        if (scrollDistance === 0) return;

        const listWidth = listProduct.scrollWidth;
        const viewWidth = productView.offsetWidth;
        const maxScroll = listWidth - viewWidth;
        
        let nextScrollPosition = scrollPosition + scrollDistance;
        
        if (nextScrollPosition > maxScroll) {
            scrollPosition = maxScroll; 
            
        } else {
            scrollPosition = nextScrollPosition;
        }

        if (scrollPosition < 0) {
            scrollPosition = 0;
        }


        listProduct.style.transform = `translateX(-${scrollPosition}px)`;
    });

    prevBtn.addEventListener('click', () => {
        if (scrollDistance === 0) return;

        scrollPosition -= scrollDistance;

        if (scrollPosition < 0) {
            scrollPosition = 0;
        }
        
        listProduct.style.transform = `translateX(-${scrollPosition}px)`;
    });
});