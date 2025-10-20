document.getElementById('productName').addEventListener('input', function() {
      const productName = encodeURIComponent(this.value.trim());
      const whatsappLink = document.getElementById('whatsappLink');
      whatsappLink.href = productName 
        ? `https://wa.me/923291504030?text=Hi, I want to ask about a product: ${productName}`
        : 'https://wa.me/923291504030?text=Hi, I want to ask about a product.';
    });

    function openPrivacy() {
      document.getElementById('privacyModal').style.display = 'flex';
    }
    function closePrivacy() {
      document.getElementById('privacyModal').style.display = 'none';
    }
    function toggleTheme() {
      const body = document.body;
      const btn = document.querySelector('.theme-toggle');
      body.classList.toggle('dark');
      btn.textContent = body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
    }