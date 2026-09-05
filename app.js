document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for nav
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const tar = document.querySelector(a.getAttribute('href'));
      if(tar) tar.scrollIntoView({behavior:'smooth', block:'start'});
    })
  });

  // Product filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // Reset all to inactive
      filterBtns.forEach(b=>{
        b.classList.remove('bg-[#0066B2]','text-white');
        b.classList.add('bg-white','border','border-slate-200','text-slate-600');
        b.setAttribute('aria-selected', 'false');
      });
      // Activate clicked
      btn.classList.remove('bg-white','border','border-slate-200','text-slate-600');
      btn.classList.add('bg-[#0066B2]','text-white');
      btn.setAttribute('aria-selected', 'true');

      const cat = btn.dataset.filter;
      products.forEach(p=>{
        const visible = cat === 'all' || p.dataset.category === cat;
        p.classList.toggle('is-filtered-out', !visible);
        p.setAttribute('aria-hidden', String(!visible));
      });
    })
  });

  // Inquiry modal
  const inquiryModal = document.getElementById('inquiryModal');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const dealerBtn = document.getElementById('dealerBtn');
  const dealerBtnTop = document.getElementById('dealerBtnTop');
  const inquiryForm = document.getElementById('inquiryForm');

  function openModal(productName){
    if(productName) inquiryModal.dataset.product = productName;
    inquiryModal.classList.remove('hidden'); inquiryModal.classList.add('flex');
  }
  function closeModal(){ inquiryModal.classList.add('hidden'); inquiryModal.classList.remove('flex'); }

  window.openInquiryModal = openModal;

  document.querySelectorAll('.inquire-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{ openModal(); });
  });
  if(dealerBtn) dealerBtn.addEventListener('click', openModal);
  if(dealerBtnTop) dealerBtnTop.addEventListener('click', openModal);
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalCancel) modalCancel.addEventListener('click', closeModal);
  inquiryModal.addEventListener('click', e=>{ if(e.target===inquiryModal) closeModal(); });

  // Validate the form, then pass the inquiry details to WhatsApp.
  inquiryForm.addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const mobile = form.mobile.value.trim();
    const mobileOk = /^[0-9]{10,15}$/.test(mobile);
    if(!mobileOk){ alert('Enter a valid mobile number (10-15 digits).'); return; }

    const selectedProduct = inquiryModal.dataset.product;
    const message = [
      'New Dealer / Distributor Inquiry',
      `Name: ${form.name.value.trim()}`,
      `State: ${form.state.value.trim()}`,
      `District: ${form.district.value.trim()}`,
      `Mobile: ${mobile}`,
      `Seed Category: ${form.category.value}`,
      selectedProduct ? `Product: ${selectedProduct}` : ''
    ].filter(Boolean).join('\n');

    window.location.href = `https://wa.me/917013267292?text=${encodeURIComponent(message)}`;
  });


  // Testimonial track population and controls
  const track = document.getElementById('testimonial-track');
  const tpl = document.getElementById('testimonialTpl');
  const testimonials = [
    ['Deepa Sharma','Rajasthan','Maize','+25%'],
    ['Ramesh Kumar','Telangana','Maize','+28%'],
    ['Sita Devi','Uttar Pradesh','Cauliflower','+34%'],
    ['Ajay Reddy','Andhra Pradesh','Chilli','+22%']
  ];
  if(track && tpl){
    testimonials.forEach(t=>{
      const el = tpl.content.cloneNode(true);
      const card = el.querySelector('div');
      const nameEl = card.querySelector('.font-bold');
      const metaEl = card.querySelector('.text-xs');
      if(nameEl) nameEl.textContent = t[0];
      if(metaEl) metaEl.textContent = `${t[1]} • ${t[2]} • ${t[3]} yield`;
      track.appendChild(el);
    });

    // Carousel controls: scroll by 340px
    const prev = document.getElementById('carouselPrev');
    const next = document.getElementById('carouselNext');
    if(prev) prev.addEventListener('click', ()=>{ track.scrollBy({left:-340, behavior:'smooth'}); });
    if(next) next.addEventListener('click', ()=>{ track.scrollBy({left:340, behavior:'smooth'}); });

    // Basic keyboard accessibility for carousel
    track.addEventListener('keydown', e=>{
      if(e.key==='ArrowRight') track.scrollBy({left:280, behavior:'smooth'});
      if(e.key==='ArrowLeft') track.scrollBy({left:-280, behavior:'smooth'});
    });
  }

  // Mobile menu drawer
  const mobileBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mobileDealerBtn = document.getElementById('dealerBtnMobile');

  function openMobileMenu(){
    if(!mobileMenu || !menuBackdrop) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBackdrop.classList.remove('hidden');
    requestAnimationFrame(()=>menuBackdrop.classList.add('opacity-100'));
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileMenu(){
    if(!mobileMenu || !menuBackdrop) return;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBackdrop.classList.remove('opacity-100');
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
    setTimeout(()=>menuBackdrop.classList.add('hidden'), 300);
  }

  mobileBtn && mobileBtn.addEventListener('click', openMobileMenu);
  menuCloseBtn && menuCloseBtn.addEventListener('click', closeMobileMenu);
  menuBackdrop && menuBackdrop.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-menu-link').forEach(link=>link.addEventListener('click', closeMobileMenu));
  mobileDealerBtn && mobileDealerBtn.addEventListener('click', ()=>{
    closeMobileMenu();
    openModal();
  });
});
