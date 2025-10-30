(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Elementos
  const items = $$('.gallery .item');
  const lightbox = $('#lightbox');
  const lbImage = $('#lb-image');
  const lbCaption = $('#lb-caption');
  const lbClose = $('#lb-close');
  const lbNext = $('#lb-next');
  const lbPrev = $('#lb-prev');

  let current = -1;

  // Abre lightbox no índice i
  function openAt(i) {
    const item = items[i];
    if (!item) return;
    const img = item.querySelector('img');
    const full = item.dataset.full || img.src;
    const title = item.querySelector('.meta h3').textContent;
    const subtitle = item.querySelector('.meta p').textContent;

    lbImage.src = full;
    lbImage.alt = title;
    lbCaption.innerHTML = `<strong>${title}</strong><div class="sub">${subtitle}</div>`;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lbClose.focus();

    current = i;
  }

  function closeLB() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    current = -1;
  }

  function next() { openAt((current + 1) % items.length); }
  function prev() { openAt((current - 1 + items.length) % items.length); }

  // Bind clicks e teclado
  items.forEach((item, idx) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', () => openAt(idx));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') openAt(idx); });
  });

  lbClose.addEventListener('click', closeLB);
  lbNext.addEventListener('click', e => { e.stopPropagation(); next(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLB();
  });

  // Filtros
  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        it.style.display = (f === '*' || it.dataset.category === f) ? '' : 'none';
      });
    });
  });

  // Stagger + animação ao aparecer
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el, i) => {
    el.style.setProperty('--delay', i * 60 + 'ms');
    io.observe(el);
  });
})();
