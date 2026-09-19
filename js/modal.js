document.addEventListener('DOMContentLoaded', function () {

    // event (sizes and additives)
    document.addEventListener('change', function (event) {
        const target = event.target;

        // radio button or checkbox
        if (target.type === 'radio' || target.type === 'checkbox') {
            // Check if updatePrice is defined
            if (typeof updatePrice === 'function') {
                updatePrice(target);
            } else {
                console.log('updatePrice is not defined. Skipping update.');
            }
        }
    });

    // product card clicks
    document.addEventListener('click', function (event) {
        const target = event.target;

        // Check click event on a product card
        if (target.closest('.product-thumb')) {
            const productCard = target.closest('.item');
            displayModal(productCard);
        }
    });

    // display modal with product details
    function displayModal(productCard) {
        const modal = document.getElementById('productModal');
        const modalContent = modal.querySelector('.modal-content');

        // extract product details
        const productName = productCard.querySelector('.name h3').textContent;
        const productDescription = productCard.querySelector('.description').textContent;
        const productImageSrc = productCard.querySelector('.image img').src;
        const productSizes = productCard.querySelector('.sizes');
        const productAdditives = productCard.querySelector('.additives');
        const productBasePrice = parseFloat(productCard.dataset.price);

        // HTML to the modal content
        const modalHTML = `
        <div class="product-details">
            <div class="image"><img src="${productImageSrc}" alt="${productName}"></div>
            <div class="modal-info-wrapper">
            <div class="name">
                <h3>${productName}</h3>
            </div>
            <div class="description">${productDescription}</div>
            ${productSizes ? productSizes.outerHTML : ''}
            ${productAdditives ? productAdditives.outerHTML : ''}
            <div class="total-price"><div><h3>Total:</h3></div><div><h3>$${productBasePrice.toFixed(2)}</h3></div></div>
            <div class="caption">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</div>
            <div class="close button">Close</div>
            </div>
        </div>
    `;

        // update modal content
        modalContent.innerHTML = modalHTML;


        // first radio button checked
        const firstSizeRadioButton = modalContent.querySelector('.sizes input[type=radio]');
        if (firstSizeRadioButton) {
            firstSizeRadioButton.checked = true;

            // checked attribute to the generated HTML
            const firstSizeRadioInput = modalContent.querySelector('.sizes input[type=radio]:checked');
            if (firstSizeRadioInput) {
                firstSizeRadioInput.setAttribute('checked', 'checked');
                const firstSizeParent = firstSizeRadioInput.parentElement;
                firstSizeParent.classList.add('checked');
            }

        }

        // display modal
        modal.style.display = 'block';


        // body scrolling off
        document.body.classList.add('modal-open');

        // click outside of the modal, close it
        window.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            }
        };

        const closeButton = modal.querySelector('.close');
        closeButton.addEventListener('click', closeModal);

        // changes in sizes and additives
        const sizesRadioButtons = modalContent.querySelectorAll('.sizes input[type=radio]');
        const additivesCheckboxes = modalContent.querySelectorAll('.additives input[type=checkbox]');

        const updateTotal = () => {
            updateTotalPrice(productBasePrice, sizesRadioButtons, additivesCheckboxes, modalContent);
        };

        sizesRadioButtons.forEach(size => size.addEventListener('change', updateTotal));
        additivesCheckboxes.forEach(additive => additive.addEventListener('change', updateTotal));
    }

    // update the total price
    function updateTotalPrice(basePrice, sizes, additives, modalContent) {
        let totalPrice = basePrice;

        // update price based on sizes
        sizes.forEach(size => {
            const sizeParent = size.parentElement;
            if (size.checked) {
                const sizeAddPrice = parseFloat(size.dataset.addPrice);
                totalPrice += sizeAddPrice;
                size.setAttribute('checked', 'checked');
                sizeParent.classList.add('checked');
            } else {
                size.removeAttribute('checked');
                sizeParent.classList.remove('checked');
            }
        });

        // update price based on additives
        additives.forEach(additive => {
            const additiveParent = additive.parentElement;
            if (additive.checked) {
                const additiveAddPrice = parseFloat(additive.dataset.addPrice);
                totalPrice += additiveAddPrice;
                additive.setAttribute('checked', 'checked');
                additiveParent.classList.add('checked');
            } else {
                additive.removeAttribute('checked');
                additiveParent.classList.remove('checked');
            }
        });

        // display updated total price
        const totalPriceElement = modalContent.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.innerHTML = `
            <div><h3>Total:</h3></div>
            <div><h3>$${totalPrice.toFixed(2)}</h3>
        </div>`;
        }
    }

    function closeModal() {
        const modal = document.getElementById('productModal');
        const modalContent = modal.querySelector('.modal-content');

        // fade-out effect
        modal.style.transition = 'opacity 0.3s ease-in-out';
        modal.style.opacity = '0';

        // hide the modal and reset styles
        setTimeout(function () {
            modal.style.display = 'none';
            modal.style.transition = '';
            modal.style.opacity = '';
            modalContent.innerHTML = '';
        }, 500);

        // body scrolling on
        document.body.classList.remove('modal-open');
    }

});
