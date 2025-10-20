
  function openPrivacy() {
    document.getElementById('privacyModal').style.display = 'flex';
  }
  function closePrivacy() {
    document.getElementById('privacyModal').style.display = 'none';
  }

  /**************************
   *  Utils & State
   **************************/
  const PHONE_NUMBER = '923291504030'; // seller WhatsApp
  let cart = JSON.parse(localStorage.getItem('samo_cart') || '[]'); // [{sku,title,price,qty,image}]
  let currentCarousel = {images:[],index:0,sku:''};

  /* -------------------- Dark mode -------------------- */
  function applyTheme(theme){
    if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('samo_theme', theme);
    document.getElementById('darkToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  function toggleDark(){
    const current = localStorage.getItem('samo_theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  } 
  /* -------------------- Typing welcome -------------------- */
  const message = "Welcome to Samo1596 – Stylish shopping starts here! ✨";
  let idx = 0;
  function typeWriter(){ if(idx < message.length){ document.getElementById("welcome-text").innerHTML += message.charAt(idx); idx++; setTimeout(typeWriter,40);} }

  /* -------------------- Show/hide order form -------------------- */
  function showAddressForm(button) {
    const form = button.parentElement.parentElement.querySelector('.address-form');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    if(form.style.display === 'block') form.scrollIntoView({behavior:'smooth', block:'center'});
  }

  /* -------------------- Send order (WhatsApp) -------------------- */
  function sendOrder(button, productName, price) {
    const form = button.closest('.address-form');
    const name = form.querySelector('.name-input').value.trim();
    const phone = form.querySelector('.phone-input').value.trim();
    const phone2 = form.querySelector('.second-phone-input').value.trim();
    const address = form.querySelector('.address-input').value.trim();
    const landmark = form.querySelector('.landmark-input').value.trim();
    const quantity = form.querySelector('.quantity-input').value.trim();
    const sizeInput = form.querySelector('.size-input');
    const size = sizeInput ? sizeInput.value.trim() : '';

    const productEl = button.closest('.product');
    const productImageEl = productEl.querySelector('img');
    const productImage = productImageEl ? (location.origin + '/' + productImageEl.getAttribute('src')) : '';

    if (!name || !phone || !quantity || !address) {
      alert("Please fill in Name, Phone, Address, and Quantity before placing the order.");
      return;
    }
    const total = Number(price) * Number(quantity);

    const message = `*Order Details:*\n\n*Product*: ${productName}\n*Price*: Rs. ${price}\n*Quantity*: ${quantity}\n*Total*: Rs. ${total}${size ? `\n*Size*: ${size}` : ''}\n\n*Name*: ${name}\n*Phone*: ${phone}\n*Alt Phone*: ${phone2}\n*Address*: ${address}\n*Landmark*: ${landmark}\n\n*Payment Method:* Cash on Delivery\n\n*Product Image*: ${productImage}`;

    const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');

    const confirmationBox = form.querySelector('.confirmation-message');
    confirmationBox.style.display = 'block';
    confirmationBox.innerHTML = `
      <strong>✅ Order Confirmed!</strong><br>
      <b>Product:</b> ${productName}<br>
      <b>Quantity:</b> ${quantity}<br>
      <b>Total:</b> Rs. ${total}<br><br>
      We will contact you on WhatsApp to confirm delivery time. Estimated delivery: <strong>3 to 6 working days</strong>.<br>
      Thank you for shopping with Samo1596! 💖
    `;

    // update cart counter visually
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = Number(cartCount.textContent || 0) + Number(quantity);
  }

  /* -------------------- Filter Products -------------------- */
  function filterProducts(category) {
    const products = document.querySelectorAll('.product');
    let matchFound = false;
    products.forEach(product => {
      const productCategory = product.getAttribute('data-category') || '';
      if (category === 'all' || productCategory === category) {
        product.style.display = 'flex'; matchFound = true;
      } else { product.style.display = 'none'; }
    });
    // active button toggle
    document.querySelectorAll('.filters button').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase() === (category === 'all' ? 'all' : category));
    });
    document.getElementById('no-results').style.display = matchFound ? 'none' : 'block';
  }

  /* -------------------- Description toggle -------------------- */
  function toggleDescription(toggleBtn) {
    const descriptionDiv = toggleBtn.nextElementSibling;
    if (!descriptionDiv) return;
    if (descriptionDiv.style.display === "block") {
      descriptionDiv.style.display = "none"; toggleBtn.innerHTML = `<span>Show Details</span> 🔽`;
    } else {
      descriptionDiv.style.display = "block"; toggleBtn.innerHTML = `<span>Hide Details</span> 🔼`;
    }
  }

  /* -------------------- Quick View Modal + Carousel -------------------- */
  function openQuickView(imgEl){
    const product = imgEl.closest('.product');
    const imagesAttr = product.getAttribute('data-images');
    const images = imagesAttr ? imagesAttr.split(',').map(s => s.trim()) : [imgEl.src];
    const title = product.querySelector('h3').innerText;
    const price = product.querySelector('.price').innerText.replace(/[^\d]/g,'') || '0';
    const desc = (product.querySelector('.product-description')||{innerText:''}).innerText;

    currentCarousel.images = images;
    currentCarousel.index = 0;
    currentCarousel.sku = product.getAttribute('data-sku') || '';

    document.getElementById('carouselMain').src = images[0];
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = 'Rs. ' + price;
    document.getElementById('modalDesc').innerText = desc;

    // build thumbs
    const thumbs = document.getElementById('carouselThumbs');
    thumbs.innerHTML = '';
    images.forEach((img, i) => {
      const t = document.createElement('img');
      t.src = img;
      t.dataset.index = i;
      t.onclick = () => { setCarousel(i); };
      if(i===0) t.classList.add('active');
      thumbs.appendChild(t);
    });

    // buttons
    document.getElementById('modalOrderBtn').onclick = () => {
      // open small order form flow using whatsapp with minimal info
      const message = `Hi! I want to order: ${title} - Price: Rs. ${price}. Please confirm availability.`;
      window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };
    document.getElementById('modalAddCartBtn').onclick = () => {
      addToCartFromQuickView(title, price, images[0], currentCarousel.sku);
    };

    document.getElementById('quickViewModal').style.display = 'flex';
  }
  function setCarousel(i){
    currentCarousel.index = i;
    document.getElementById('carouselMain').src = currentCarousel.images[i];
    const thumbs = document.querySelectorAll('#carouselThumbs img');
    thumbs.forEach(t => t.classList.toggle('active', Number(t.dataset.index) === i));
  }
  function prevCarousel(){ setCarousel((currentCarousel.index - 1 + currentCarousel.images.length) % currentCarousel.images.length); }
  function nextCarousel(){ setCarousel((currentCarousel.index + 1) % currentCarousel.images.length); }
  function closeQuickView(e){ if(e && e.target && e.target.id === 'quickViewModal'){ document.getElementById('quickViewModal').style.display='none'; } else document.getElementById('quickViewModal').style.display='none'; }

  /* -------------------- Mini Cart -------------------- */
  function saveCart(){ localStorage.setItem('samo_cart', JSON.stringify(cart)); renderCart(); }
  function loadCart(){ cart = JSON.parse(localStorage.getItem('samo_cart') || '[]'); renderCart(); }

  function addToCart(btn){
    const productEl = btn.closest('.product');
    const sku = productEl.getAttribute('data-sku') || productEl.querySelector('h3').innerText;
    const title = productEl.querySelector('h3').innerText;
    const priceText = productEl.querySelector('.price').innerText || '';
    const price = Number((priceText.match(/\d+/g)||[]).join('')) || 0;
    const img = productEl.querySelector('img').getAttribute('src');

    const existing = cart.find(i => i.sku === sku);
    if(existing){ existing.qty = Number(existing.qty) + 1; }
    else { cart.push({sku,title,price,qty:1,image:img}); }

    saveCart();
    showCartToast(`${title} added to cart`);
  }

  function addToCartFromQuickView(title, price, image, sku){
    const numericPrice = Number((String(price).match(/\d+/g)||[]).join('')) || Number(price) || 0;
    const existing = cart.find(i => i.sku === sku);
    if(existing) existing.qty = Number(existing.qty) + 1;
    else cart.push({sku:sku || title, title, price: numericPrice, qty:1, image});
    saveCart();
    showCartToast(`${title} added to cart`);
  }

  function renderCart(){
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="meta">
          <b>${item.title}</b>
          <div>Rs. ${item.price} x <input type="number" min="1" value="${item.qty}" style="width:56px" onchange="updateQty(${idx}, this.value)"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:center">
          <button class="btn btn-cart" onclick="removeCartItem(${idx})">Remove</button>
        </div>
      `;
      container.appendChild(div);
    });
    document.getElementById('cartTotal').innerText = 'Rs. ' + total;
    document.getElementById('cartCount').textContent = cart.reduce((s,i) => s + Number(i.qty), 0);
  }

  function updateQty(index, val){
    cart[index].qty = Number(val);
    saveCart();
  }

  function removeCartItem(index){
    cart.splice(index,1);
    saveCart();
  }

  function clearCart(){
    if(!confirm('Clear cart items?')) return;
    cart = [];
    saveCart();
  }

  function toggleMiniCart(){
    const el = document.getElementById('miniCart');
    el.classList.toggle('open');
    el.setAttribute('aria-hidden', el.classList.contains('open') ? 'false' : 'true');
  }

  /* -------------------- Checkout Cart via WhatsApp -------------------- */
  function checkoutCart(){
    if(cart.length === 0){ alert('Your cart is empty.'); return; }
    // Build message
    let lines = ['*Order from Samo1596*', ''];
    let total = 0;
    cart.forEach(i => {
      lines.push(`${i.title} — Rs. ${i.price} x ${i.qty} = Rs. ${i.price * i.qty}`);
      total += i.price * i.qty;
    });
    lines.push('', `*Total*: Rs. ${total}`, '', 'Please deliver to: (Enter name, phone, address after opening chat)');
    const message = lines.join('\n');
    const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  }

  /* -------------------- Search -------------------- */
  function searchFromNavbar(){ const q = document.getElementById('mainSearch').value.trim().toLowerCase(); searchProducts(q); }
  function searchProducts(q){ const query = (q !== undefined) ? q : document.getElementById('mainSearch').value.toLowerCase(); const products = document.querySelectorAll('.product'); let match=false; products.forEach(p=>{ const name = p.querySelector('h3').innerText.toLowerCase(); if(name.includes(query) || query===''){ p.style.display='flex'; match=true } else p.style.display='none'; }); document.getElementById('no-results').style.display = match ? 'none' : 'block'; }

  /* -------------------- Basic Image modal fallback -------------------- */
  function openModal(imgElement) { var modal = document.getElementById("imgModal"); var modalImg = document.getElementById("modalImage"); var caption = document.getElementById("caption"); modal.style.display = "flex"; modalImg.src = imgElement.src; caption.innerHTML = imgElement.alt; }
  function closeModal() { var modal = document.getElementById("imgModal"); modal.style.display = "none"; }

  /* -------------------- Init -------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // theme
    const savedTheme = localStorage.getItem('samo_theme') || 'light';
    applyTheme(savedTheme);

    // typing
    typeWriter();

    // init cart
    loadCart();

    // live search
    document.getElementById('mainSearch').addEventListener('input', (e) => searchProducts(e.target.value.toLowerCase()) );

    // initial show all
    filterProducts('all');
  });

  /* -------------------- small toast message for cart add -------------------- */
  function showCartToast(text){
    const t = document.createElement('div');
    t.style.position='fixed'; t.style.bottom='24px'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.background='#111'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.zIndex=4000; t.style.opacity='0'; t.style.transition='opacity .2s';
    t.innerText = text;
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity='1',10);
    setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>document.body.removeChild(t),220); },1600);
  }





  document.addEventListener('click', function(e) {
  const btn = e.target.closest('.confirm-btn');
  if (!btn) return;
  const name = btn.dataset.name;
  const price = Number(btn.dataset.price) || 0;
  sendOrder(btn, name, price);
});




                          // 🌟 Feedback system
 
  // EmailJS init
  emailjs.init("i6zHB83S5kioYvDlm"); // <-- tumhara public key

  // Star rating click
  let selectedRating = 0;
  const stars = document.querySelectorAll("#starRating span");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = star.getAttribute("data-value");
      stars.forEach(s => s.style.color = "#ccc");
      for(let i=0;i<selectedRating;i++) stars[i].style.color = "#ff9900";
    });
  });

  // Feedback counter using localStorage
  let feedbackCounter = localStorage.getItem("feedbackCounter") ? parseInt(localStorage.getItem("feedbackCounter")) : 0;
  document.getElementById("feedbackCount").innerText = feedbackCounter;

  function sendFeedback() {
    const name = document.getElementById("fbName").value;
    const email = document.getElementById("fbEmail").value;
    const message = document.getElementById("fbMessage").value;

    if(!name || !email || !message || selectedRating == 0){
      alert("Please fill all fields and select a rating ⭐");
      return;
    }

    const templateParams = {
      from_name: name,
      email: email,
      message: message,
      rating: selectedRating
    };

    emailjs.send("service_e7old8c","template_3wshciv",templateParams)
      .then(function(response){
        console.log('SUCCESS!', response.status, response.text);
        document.getElementById("feedbackMsg").style.display = "block";
        document.getElementById("feedbackForm").reset();
        selectedRating = 0;
        stars.forEach(s => s.style.color = "#ccc");

        // Update counter
        feedbackCounter++;
        localStorage.setItem("feedbackCounter", feedbackCounter);
        document.getElementById("feedbackCount").innerText = feedbackCounter;
      }, function(error){
        console.log('FAILED...', error);
        alert("Oops! Something went wrong. Please try again.");
      });
  }
 