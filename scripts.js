function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage() {
  window.location.href = "index.html";
}

function searchPage() {
  alert("Search functionality not implemented yet!");
}

document.addEventListener("DOMContentLoaded", function() {
  
  document.getElementById("sale").addEventListener("click", function() {
      changeBannerBackground("images/sale.png");
  });

  document.getElementById("bestseller").addEventListener("click", function() {
      changeBannerBackground("images/limited.webp");
  });

  document.getElementById("new").addEventListener("click", function() {
      changeBannerBackground("images/new.png");
  });

  document.getElementById('applyFilter').addEventListener('click', function() {
      filterProducts();
      updateHeading();
  });
});

function changeBannerBackground(imageUrl) {
  document.querySelector(".banner").style.backgroundImage = `url(${imageUrl})`;
}

function toggleAccordion(element) {
  var content = element.nextElementSibling;
  content.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function() {
  
  document.getElementById('applyFilterButton').addEventListener('click', function() {
      filterProducts();
  });

  const filters = document.querySelectorAll('.filter');
  filters.forEach(filter => {
      filter.addEventListener('change', function() {
          document.getElementById('applyFilterButton').disabled = false;
      });
  });

  function filterProducts() {
      const selectedTypes = Array.from(document.querySelectorAll('input[data-filter="type"]:checked'))
          .map(cb => cb.dataset.value);
      const selectedMaterial = Array.from(document.querySelectorAll('input[name="material"]:checked'))
          .map(cb => cb.dataset.value)[0];
      const selectedSpecial = Array.from(document.querySelectorAll('input[data-filter="special"]:checked'))
          .map(cb => cb.dataset.value);
      
      const items = document.querySelectorAll('.shop-item');
      items.forEach(item => {
          const itemType = item.getAttribute('data-type');
          const itemMaterial = item.getAttribute('data-material');
          const itemSpecial = item.getAttribute('data-special');
          
          if ((selectedTypes.length === 0 || selectedTypes.includes(itemType)) &&
              (selectedMaterial === undefined || itemMaterial === selectedMaterial) &&
              (selectedSpecial.length === 0 || selectedSpecial.includes(itemSpecial))
          ) {
              item.classList.remove('hidden');
          } else {
              item.classList.add('hidden');
          }
      });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
          const productId = button.getAttribute('data-id');
          const productName = button.closest('.product-details').querySelector('h1').textContent;
          const productPrice = parseFloat(button.closest('.product-details').querySelector('.product-price').textContent.replace('$', ''));
          addToCart(productId, productName, productPrice);
      });
  });

  // Add to Cart function
  function addToCart(productId, productName, productPrice) {
      const productInCart = cart.find(item => item.id === productId);
      if (productInCart) {
          productInCart.quantity += 1;
      } else {
          cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart!');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTableBody = document.querySelector('.cart-table tbody');
  const subtotalElement = document.querySelector('.subtotal');

  if (cart.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="4">Your cart is empty!</td></tr>';
  } else {
      let subtotal = 0;
      cart.forEach(item => {
          const total = item.price * item.quantity;
          subtotal += total;

          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.name}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>$${total.toFixed(2)}</td>
              <td><button class="remove" data-index="${cart.indexOf(item)}">Remove</button></td>
          `;
          cartTableBody.appendChild(row);
      });
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const cartTableBody = document.querySelector('.cart-table tbody');
    
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Display cart items
    updateCartDisplay();

    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.closest('.product-details').querySelector('h1').textContent;
            const productPrice = parseFloat(button.closest('.product-details').querySelector('.product-price').textContent.replace('$', ''));
            addToCart(productId, productName, productPrice);
        });
    });

    // Add to Cart function
    function addToCart(productId, productName, productPrice) {
        const productInCart = cart.find(item => item.id === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    // Update cart display
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTableBody = document.querySelector('.cart-table tbody');
        const subtotalElement = document.querySelector('.subtotal');

        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="4">Your cart is empty!</td></tr>';
        } else {
            let subtotal = 0;
            cart.forEach((item, index) => {
                const total = item.price * item.quantity;
                subtotal += total;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="quantity-btn decrement" data-index="${index}">-</button>
                        ${item.quantity}
                        <button class="quantity-btn increment" data-index="${index}">+</button>
                    </td>
                    <td>$${total.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(row);
            });
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

            // Remove item if quantity is zero
            cart.forEach((item, index) => {
                if (item.quantity <= 0) {
                    removeFromCart(index);
                }
            });
        }
    }

    // Update item quantity
    cartTableBody.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        const action = event.target.classList.contains('remove') ? 'remove' :
                      event.target.classList.contains('increment') ? 'increment' :
                      event.target.classList.contains('decrement') ? 'decrement' : null;

        if (action === 'remove') {
            removeFromCart(index);
        } else if (action === 'increment') {
            updateQuantity(index, 1);
        } else if (action === 'decrement') {
            updateQuantity(index, -1);
        }
    });

    // Update quantity function
    function updateQuantity(index, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart[index];

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(index); // Remove item if quantity is 0 or less
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }

    // Remove item from cart
    function removeFromCart(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove the item from the array
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
});
