// Variables globales para el carrito
let cart = [];
let cartTotal = 0;
let currentProduct = null;
const formatCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

// Base de datos de productos
const productos = {
  "Tom Ford Black Orchid": {
    nombre: "Tom Ford Black Orchid",
    precio: 20000,
    imagen: "../biblioteca/sauvage_dior.png", // Placeholder
    descripcion: "Una fragancia oriental intensa y misteriosa que combina notas de trufa negra, orquídea negra y sándalo.",
    categoria: "Unisex",
    concentracion: "Eau de Parfum",
    duracion: "8-12 horas",
    notas: "Trufa negra, Orquídea, Sándalo"
  },
  "Creed Aventus": {
    nombre: "Creed Aventus",
    precio: 20000,
    imagen: "../biblioteca/bleu_de_chanel.png", // Placeholder
    descripcion: "Una fragancia legendaria que evoca poder y éxito con notas de piña, bergamota y musgo de roble.",
    categoria: "Masculino",
    concentracion: "Eau de Parfum",
    duracion: "10-14 horas",
    notas: "Piña, Bergamota, Musgo de roble"
  },
  "Chanel No. 5": {
    nombre: "Chanel No. 5",
    precio: 20000,
    imagen: "../biblioteca/yara_candy.png", // Placeholder
    descripcion: "El perfume más icónico del mundo, una composición floral aldehídica que define la elegancia.",
    categoria: "Femenino",
    concentracion: "Eau de Parfum",
    duracion: "8-10 horas",
    notas: "Rosa, Jazmín, Aldehídos"
  },
  "Dior J'adore": {
    nombre: "Dior J'adore",
    precio: 20000,
    imagen: "../biblioteca/asad_de_lataffa.png", // Placeholder
    descripcion: "Una fragancia floral dorada que celebra la feminidad con notas de rosa, jazmín y vainilla.",
    categoria: "Femenino",
    concentracion: "Eau de Parfum",
    duracion: "8-12 horas",
    notas: "Rosa, Jazmín, Vainilla"
  },
  "Sauvage Dior": {
    nombre: "Sauvage Dior",
    precio: 20000,
    imagen: "../biblioteca/sauvage_dior.png",
    descripcion: "Poder, Nobleza y Misterio. Aroma fresco, ámbar y especiado que evoca la libertad salvaje.",
    categoria: "Masculino",
    concentracion: "Eau de Toilette",
    duracion: "6-8 horas",
    notas: "Bergamota, Pimienta, Ámbar"
  },
  "Bleu De Chanel": {
    nombre: "Bleu De Chanel",
    precio: 20000,
    imagen: "../biblioteca/bleu_de_chanel.png",
    descripcion: "Elegancia y Carácter. Aroma amaderado, fresco y especiado que define la sofisticación masculina.",
    categoria: "Masculino",
    concentracion: "Eau de Parfum",
    duracion: "8-10 horas",
    notas: "Bergamota, Cedro, Sándalo"
  },
  "Yara Candy": {
    nombre: "Yara Candy",
    precio: 20000,
    imagen: "../biblioteca/yara_candy.png",
    descripcion: "Frescura, Dulzura y Sensualidad. Aroma intenso, afrutado y cremoso que despierta los sentidos.",
    categoria: "Femenino",
    concentracion: "Eau de Parfum",
    duracion: "6-8 horas",
    notas: "Frutas, Vainilla, Almizcle"
  },
  "Asad De Lataffa": {
    nombre: "Asad De Lataffa",
    precio: 20000,
    imagen: "../biblioteca/asad_de_lataffa.png",
    descripcion: "Poder, Fuerza y Lealtad. Aroma oriental, amaderado y especiado que transmite autoridad.",
    categoria: "Masculino",
    concentracion: "Eau de Parfum",
    duracion: "10-12 horas",
    notas: "Oud, Sándalo, Especias"
  },
  "Bade'e Al Oud Sublime De Lataffa": {
    nombre: "Bade'e Al Oud Sublime De Lataffa",
    precio: 20000,
    imagen: "../biblioteca/badee_al_oud_sublime_de_lataffa.png",
    descripcion: "Moderna y Cautivadora. Aroma fresco y cítrico que combina tradición con innovación.",
    categoria: "Unisex",
    concentracion: "Eau de Parfum",
    duracion: "8-10 horas",
    notas: "Oud, Cítricos, Flores"
  },
  "Club de Nuite Intense": {
    nombre: "Club de Nuite Intense",
    precio: 20000,
    imagen: "../biblioteca/club_de_nuite_intense.png",
    descripcion: "Elegancia y Masculinidad. Aroma fresco, especiado y amaderado para el hombre moderno.",
    categoria: "Masculino",
    concentracion: "Eau de Parfum",
    duracion: "8-12 horas",
    notas: "Bergamota, Lavanda, Sándalo"
  }
};

// Cargar carrito desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  updateCartCount();
  
  // Script mejorado para el slider de imágenes
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 0) {
      let currentSlide = 0;
      slides[currentSlide].classList.add('active');
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 5000);
  }

  // Función para mostrar/ocultar lista de productos
  window.toggleProductDropdown = function() {
    const dropdown = document.getElementById('productDropdown');
    dropdown.classList.toggle('active');
  }

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('productDropdown');
    const toggle = document.querySelector('[data-role="product-dropdown-toggle"]');
    const clickedInsideDropdown = dropdown && dropdown.contains(event.target);
    const clickedOnToggle = toggle && toggle.contains(event.target);
    if (!clickedInsideDropdown && !clickedOnToggle) {
      dropdown && dropdown.classList.remove('active');
    }
  });

  // Scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });

  // Smooth scrolling para navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Header background on scroll
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      header.style.background = 'rgba(12, 31, 63, 0.95)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = 'var(--gradient-primary)';
      header.style.backdropFilter = 'blur(10px)';
    }
  });

  // Toggle navegación móvil
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  function setNav(open) {
    primaryNav.classList.toggle('open', open);
    const expanded = !!open;
    navToggle.setAttribute('aria-expanded', expanded);
    primaryNav.setAttribute('aria-hidden', !expanded);
  }
  if (navToggle && primaryNav) {
    primaryNav.setAttribute('aria-hidden', 'true');
    navToggle.style.display = 'inline-flex';
    navToggle.addEventListener('click', () => setNav(!primaryNav.classList.contains('open')));
  }
  
    // Cargar mapa bajo demanda
  const loadMapBtn = document.getElementById('loadMapBtn');
  const mapContainer = document.getElementById('mapContainer');
  if (loadMapBtn && mapContainer) {
    loadMapBtn.addEventListener('click', function() {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d490.5175565810568!2d-75.51262138529934!3d10.410417703334641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sco!4v1747278859941!5m2!1ses-419!2sco';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapContainer.innerHTML = '';
      mapContainer.appendChild(iframe);
    });
  }

});

// Funciones del carrito
function addToCart(event, name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
    showToast(`Se agregó otra unidad de ${name}`);
  } else {
    cart.push({ id: Date.now(), name, price, image, quantity: 1 });
    showToast(`${name} agregado al carrito`);
  }
  
  if (event && event.target) {
    const button = event.target.closest('.btn');
    if (button) {
      button.classList.add('bounce');
      setTimeout(() => button.classList.remove('bounce'), 600);
    }
  }
  
  saveCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
  showToast('Producto eliminado del carrito');
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartCount();
      renderCart();
    }
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.add('active');
  } else {
    cartCount.classList.remove('active');
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h4>Tu carrito está vacío</h4>
        <p>Agrega algunos productos para comenzar</p>
      </div>
    `;
    cartTotalElement.textContent = '$0';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCOP.format(item.price * item.quantity)}</div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
          <button onclick="updateQuantity(${item.id}, -1)" style="background: var(--primary-color); color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
          <span style="font-weight: 600;">${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)" style="background: var(--accent-color); color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  const total = calculateTotal();
  cartTotalElement.textContent = formatCOP.format(total);
}

function openCart() {
  renderCart();
  document.getElementById('cartModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function sendToWhatsApp() {
  if (cart.length === 0) {
    showToast('Agrega productos al carrito primero');
    return;
  }
  
  const total = calculateTotal();
  const items = cart.map(item => 
    `• ${item.name} - ${formatCOP.format(item.price * item.quantity)} (${item.quantity} unidad${item.quantity > 1 ? 'es' : ''})`
  ).join('\n');
  
  const message = `🛍️ *Nuevo Pedido - ECO Perfumería*\n\n*Productos seleccionados:*\n${items}\n\n      *Total: ${formatCOP.format(total)}*\n\n📍 *Envío a domicilio disponible (valor domicilio sujeto a la ubicación)*\n📞 *Tel:* +57 317 633 9319\n🏪 *Dirección:* Calle 32b # 40-20, Cartagena-Bolívar, Colombia\n\n¿Deseas proceder con la compra?`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/573176339319?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
  
  cart = [];
  saveCart();
  updateCartCount();
  closeCart();
  showToast('¡Pedido enviado a WhatsApp!');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    closeCart();
  }
  const productModal = document.getElementById('productModal');
  if (event.target === productModal) {
    closeProductModal();
  }
});

// Cerrar modal con ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeCart();
    closeProductModal();
  }
});

// Abrir carrito automáticamente si viene desde el catálogo
(function(){
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openCart') === '1') {
        openCart();
      }
    } catch (e) { /* silencioso */ }})();

// Funciones del modal de producto
function showProductModal(productName) {
  const producto = productos[productName];
  if (!producto) {
    showToast('Producto no encontrado');
    return;
  }
  currentProduct = producto;
  document.getElementById('modalProductName').textContent = producto.nombre;
  document.getElementById('modalProductPrice').textContent = formatCOP.format(producto.precio);
  document.getElementById('modalProductDescription').textContent = producto.descripcion;
  document.getElementById('modalProductImage').src = producto.imagen;
  document.getElementById('modalProductImage').alt = producto.nombre;
  document.getElementById('modalProductCategory').textContent = producto.categoria;
  document.getElementById('modalProductConcentration').textContent = producto.concentracion;
  document.getElementById('modalProductDuration').textContent = producto.duracion;
  document.getElementById('modalProductNotes').textContent = producto.notas;
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = 'auto';
  currentProduct = null;
}

function addToCartFromModal() {
  if (!currentProduct) {
    showToast('Error: No hay producto seleccionado');
    return;
  }
  const existingItem = cart.find(item => item.name === currentProduct.nombre);
  if (existingItem) {
    existingItem.quantity += 1;
    showToast(`Se agregó otra unidad de ${currentProduct.nombre}`);
  } else {
    cart.push({ id: Date.now(), name: currentProduct.nombre, price: currentProduct.precio, image: currentProduct.imagen, quantity: 1 });
    showToast(`${currentProduct.nombre} agregado al carrito`);
  }
  saveCart();
  updateCartCount();
  closeProductModal();
}

function showSimilarProducts() {
  if (!currentProduct) return;
  closeProductModal();
  const dropdown = document.getElementById('productDropdown');
  dropdown.classList.add('active');
  const catalogoSection = document.getElementById('catalogo');
  if (catalogoSection) {
    catalogoSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function selectProductFromDropdown(productName) {
  showProductModal(productName);
}
