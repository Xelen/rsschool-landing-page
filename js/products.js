document.addEventListener('DOMContentLoaded', function () {
    let visibleCategory = null;

    function handleScreenResize() {
        const screenWidth = window.innerWidth;


        if (screenWidth < 769) {
            hideRefProducts(visibleCategory);
            showRefreshIcon(visibleCategory);
        } else {
            showRefProducts(visibleCategory);
            hideRefreshIcon(visibleCategory);
        }
    }

    window.addEventListener('resize', handleScreenResize);

    // fetch products from JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            // group products by category
            const groupedProducts = groupBy(data, 'category');

            // generate product cards for categories
            Object.keys(groupedProducts).forEach(category => {
                const block = document.querySelector(`.menu-block-${category}`);
                const products = groupedProducts[category];
                products.forEach((product, index) => {
                    const card = generateProductCard(product, category, index + 1);
                    block.appendChild(card);
                });

                // add refresh button if more than 4 products
                if (products.length > 4) {
                    const refreshIconBlock = document.createElement('div');
                    refreshIconBlock.classList.add('refresh-icon', category);
                    refreshIconBlock.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8"
                                        stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#403F3D"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                `;
                    block.appendChild(refreshIconBlock);
                    // hide products with class 'ref'
                    const refProducts = block.querySelectorAll('.item.ref');
                    refProducts.forEach(refProduct => {
                        refProduct.classList.add('hidden');
                    });

                    // click event listener to the refresh icon
                    refreshIconBlock.addEventListener('click', function () {
                        toggleProductsVisibility(category);

                        const areAllRefProductsVisible = Array.from(refProducts).every(refProduct => !refProduct.classList.contains('hidden'));

                        // hide refresh icon if all ref products are visible
                        if (areAllRefProductsVisible) {
                            refreshIconBlock.style.display = 'none';
                        }
                    });
                }
            });
            // event listener for tab clicks using event delegation
            const menuTabs = document.querySelector('.menu-tabs');
            menuTabs.addEventListener('click', function (event) {
                const clickedTab = event.target.closest('li');

                if (clickedTab && menuTabs.contains(clickedTab)) {
                    const tabs = document.querySelectorAll('.menu-tabs li');
                    tabs.forEach(t => t.classList.remove('active'));
                    clickedTab.classList.add('active');

                    const selectedCategory = clickedTab.textContent.toLowerCase();
                    showProductsForCategory(selectedCategory);

                    if (visibleCategory && visibleCategory !== selectedCategory) {
                        hideProductsForCategory(visibleCategory);
                    }

                    visibleCategory = selectedCategory;

                    // show refresh icon if ref products hidden
                    const refProducts = document.querySelectorAll(`.menu-block-${selectedCategory} .item.ref`);
                    const areRefProductsHidden = Array.from(refProducts).every(refProduct => refProduct.classList.contains('hidden'));
                    const refreshIconBlock = document.querySelector(`.menu-block-${selectedCategory} .refresh-icon`);

                    if (refreshIconBlock) {
                        refreshIconBlock.style.display = areRefProductsHidden ? 'inherit' : 'none';
                    }
                }
                handleScreenResize();
            });

            document.querySelector('.menu-tabs li').click();

        })
        .catch(error => console.error('Error fetching products:', error));
    // hide products for a specific category
    function hideProductsForCategory(category) {
        const refProducts = document.querySelectorAll(`.menu-block-${category} .item.ref`);
        refProducts.forEach(refProduct => {
            refProduct.classList.add('hidden');
        });
    }
    // event for sizes and additives
    document.addEventListener('change', function (event) {
        const target = event.target;

        // if the change event on a radio button or checkbox update price
        if (target.type === 'radio' || target.type === 'checkbox') {
            updatePrice(target);
        }
    });

    window.updatePrice = function (selectedElement) {
        const productCard = selectedElement.closest('.item');

        // check if productCard is null
        if (!productCard) {
            return;
        }

        let basePrice = parseFloat(productCard.dataset.price);

        // update price of selected sizes
        const selectedSizes = productCard.querySelectorAll('input[type=radio]:checked');
        selectedSizes.forEach(size => {
            const sizeKey = size.value;
            const sizeAddPrice = parseFloat(size.dataset.addPrice);
            basePrice += sizeAddPrice;
        });

        // update price of selected additives
        const selectedAdditives = productCard.querySelectorAll('input[type=checkbox]:checked');
        selectedAdditives.forEach(additive => {
            const additiveAddPrice = parseFloat(additive.dataset.addPrice);
            basePrice += additiveAddPrice;
        });

        // display updated price
        const priceElement = productCard.querySelector('.price h3');
        priceElement.textContent = `$${basePrice.toFixed(2)}`;
    }

    // group products by category
    function groupBy(array, key) {
        return array.reduce((result, product) => {
            (result[product[key]] = result[product[key]] || []).push(product);
            return result;
        }, {});
    }

    // generate HTML for sizes
    function generateSizesHTML(sizes) {
        let sizesHTML = '<div class="sizes"><p>Size</p><div>';
        Object.keys(sizes).forEach(sizeKey => {
            const size = sizes[sizeKey];
            sizesHTML += `
            <label class="button">
                    <input class="hidden" type="radio" name="size" value="${sizeKey}" data-add-price="${size['add-price']}">
                    <span class="key">${sizeKey.toUpperCase()}</span><span class="select-option">${size.size}</span><span class="hidden">(+$${size['add-price']})</span>
                </label>
            `;
        });
        sizesHTML += '</div></div>';
        return sizesHTML;
    }

    // generate HTML for additives
    function generateAdditivesHTML(additives) {
        let additivesHTML = '<div class="additives"><p>Additives</p><div>';
        additives.forEach((additive, index) => {
            const additiveIndex = index + 1;  // Start numbering from 1
            additivesHTML += `
                <label class="button">
                    <input class="hidden" type="checkbox" name="additive-${additive.name}" value="${additive.name}" data-add-price="${additive['add-price']}">
                    <span class="key">${additiveIndex}</span><span class="select-option">${additive.name}</span><span class="hidden">(+$${additive['add-price']})</span>
                </label>
            `;
        });
        additivesHTML += '</div></div>';
        return additivesHTML;
    }

    // generate product card HTML
    function generateProductCard(product, category, index) {
        const card = document.createElement('div');
        card.classList.add('item');
        card.dataset.category = category;
        card.dataset.price = product.price;

        if (index >= 5) {
            card.classList.add('ref');
        }

        const sizesHTML = generateSizesHTML(product.sizes);
        const additivesHTML = generateAdditivesHTML(product.additives);

        card.innerHTML = `
        <div class="product-thumb">
            <div class="image"><img src="img/products/${category}-${index}.jpg" alt="${product.name}"></div>
            <div class="img-caption">
                <div class="name">
                    <h3>${product.name}</h3>
                </div>
                <div class="description">${product.description}</div>
                ${sizesHTML}
                ${additivesHTML}
                <div class="price">
                    <h3>$${product.price}</h3>
                </div>
            </div>
        </div>
    `;

        return card;
    }

    // show products in specific category
    function showProductsForCategory(category) {
        const blocks = document.querySelectorAll('.products > div');
        blocks.forEach(block => {
            block.style.display = block.classList.contains(`menu-block-${category}`) ? 'flex' : 'none';
        });
    }

    // visibility of products in specific category
    function toggleProductsVisibility(category) {
        const refProducts = document.querySelectorAll(`.menu-block-${category} .item.ref`);
        refProducts.forEach(refProduct => {
            refProduct.classList.toggle('hidden');
        });
    }

    function showRefreshIcon(category) {
        const refreshIconBlock = document.querySelector(`.menu-block-${category} .refresh-icon`);
        if (refreshIconBlock) {
            refreshIconBlock.style.display = 'block';
        }
    }


    function hideRefreshIcon(category) {
        const refreshIconBlock = document.querySelector(`.menu-block-${category} .refresh-icon`);
        if (refreshIconBlock) {
            refreshIconBlock.style.display = 'none';
        }
    }

    function showRefProducts(category) {
        const refProducts = document.querySelectorAll(`.menu-block-${category} .item.ref`);
        refProducts.forEach(refProduct => {
            refProduct.classList.remove('hidden');
        });
    }

    // Скрыть элементы с классом "ref" для конкретной категории
    function hideRefProducts(category) {
        const refProducts = document.querySelectorAll(`.menu-block-${category} .item.ref`);
        refProducts.forEach(refProduct => {
            refProduct.classList.add('hidden');
        });
    }

});
