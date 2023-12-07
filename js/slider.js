document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('image-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    const intervalDuration = 7000; // Интервал в миллисекундах (7 секунд)
    let intervalId; // Хранит идентификатор интервала
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let lastSwipeTime = 0;
    let timeSinceLastSwipe = 0;

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
        intervalId = setInterval(() => {
            if (!isSwiping) {
                nextImage();
            }
            timeSinceLastSwipe += intervalDuration;
            if (timeSinceLastSwipe >= intervalDuration) {
                timeSinceLastSwipe = 0;
            }
        }, intervalDuration);
    }

    function stopCarousel() {
        clearInterval(intervalId);
    }

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        isSwiping = true;
        lastSwipeTime = Date.now();
    }

    function handleTouchMove(event) {
        if (!isSwiping) return;
        touchEndX = event.touches[0].clientX;
        event.preventDefault(); // Предотвращаем прокрутку страницы
    }

    function handleTouchEnd() {
        if (!isSwiping) return;

        const swipeDistance = touchStartX - touchEndX;
        const elapsedTime = Date.now() - lastSwipeTime;

        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }

        isSwiping = false;

        // Устанавливаем таймер для автоматической прокрутки
        const remainingTime = intervalDuration - elapsedTime;
        if (remainingTime > 0) {
            setTimeout(startCarousel, remainingTime);
        } else {
            startCarousel();
        }
    }

    nextBtn.addEventListener('click', function () {
        nextImage();
        stopCarousel();
        timeSinceLastSwipe = 0; // Сбрасываем время после кнопки
        startCarousel();
    });

    prevBtn.addEventListener('click', function () {
        prevImage();
        stopCarousel();
        timeSinceLastSwipe = 0; // Сбрасываем время после кнопки
        startCarousel();
    });

    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);

    startCarousel(); // Запускаем автоматическую прокрутку при загрузке страницы
});
