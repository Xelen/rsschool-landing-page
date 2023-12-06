document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('image-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    const intervalDuration = 5000;
    let intervalId;
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    function showImage(index) {
        const translateValue = -index * 100 + '%';
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = 'translateX(' + translateValue + ')';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % carousel.childElementCount;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + carousel.childElementCount) % carousel.childElementCount;
        showImage(currentIndex);
    }

    function startCarousel() {
        intervalId = setInterval(nextImage, intervalDuration);
    }

    function stopCarousel() {
        clearInterval(intervalId);
    }

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        isSwiping = true;
    }

    function handleTouchMove(event) {
        if (!isSwiping) return;
        touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (!isSwiping) return;

        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }

        isSwiping = false;
    }

    nextBtn.addEventListener('click', function () {
        nextImage();
        stopCarousel();
        startCarousel();
    });

    prevBtn.addEventListener('click', function () {
        prevImage();
        stopCarousel();
        startCarousel();
    });

    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);

    startCarousel();
});
