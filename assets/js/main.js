/* Демо «TURBO»: слайдер, подбор, каталог, эффекты */
(function () {
  var D = MS.data, fmt = MS.fmt;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- шапка, прогресс скролла ---------- */
  var header = $('.header'), bar = $('.progress');
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 10);
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  }
  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; onScroll(); });
  }, { passive: true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var mnav = $('.mnav');
  function menu(open) { mnav.classList.toggle('open', open); mnav.setAttribute('aria-hidden', String(!open)); document.documentElement.classList.toggle('ms-lock', open); }
  $('.burger').addEventListener('click', function () { menu(true); });
  $('.mnav-x').addEventListener('click', function () { menu(false); });
  $$('.mnav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

  /* ---------- HERO-слайдер ---------- */
  var slides = $$('.slide'), dots = $$('.hero-dots button'), hero = $('.hero'), cur = 0, timer;
  var DUR = 6500;
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === cur); });
    dots.forEach(function (d, i) {
      d.classList.remove('is-active');
      if (i === cur) { void d.offsetWidth; d.classList.add('is-active'); }
    });
    clearTimeout(timer); timer = setTimeout(function () { go(cur + 1); }, DUR);
  }
  dots.forEach(function (d) { d.addEventListener('click', function () { go(+d.getAttribute('data-go')); }); });
  $('[data-prev]').addEventListener('click', function () { go(cur - 1); });
  $('[data-next]').addEventListener('click', function () { go(cur + 1); });
  hero.style.setProperty('--dur', DUR + 'ms');
  var tx = null;
  hero.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
  });
  if (!MS.reduced) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('.slide-visual', hero).forEach(function (v) { v.style.setProperty('--px', (x * -30) + 'px'); v.style.setProperty('--py', (y * -24) + 'px'); });
    });
  }
  go(0);

  /* ---------- каталог ---------- */
  var state = { cat: 'all', diam: '', axle: '', brand: '', size: '', sort: 'pop', all: false };
  var grid = $('[data-grid]'), more = $('[data-more]'), af = $('.active-filters');
  var catTitle = {}; D.categories.forEach(function (c) { catTitle[c.id] = c.short; });

  function stars(r) { return '<span class="card-rate"><svg class="i"><use href="#i-star"/></svg>' + r.toFixed(1).replace('.', ',') + '</span>'; }
  function card(p, i) {
    var tag = p.tag ? '<span class="card-tag ' + (p.tag === 'Новинка' ? 't-new' : p.tag === 'Скидка' ? 't-sale' : '') + '">' + p.tag + '</span>' : '';
    return '<article class="card" data-card data-reveal data-delay="' + (i % 4) * 70 + '">' +
      '<div class="card-media">' + tag + '<img src="' + MS.img(p) + '" alt="' + p.name + ' ' + p.size + '" loading="lazy"><span class="card-size">' + p.size + '</span></div>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span class="card-brand">' + p.brand + '</span>' + stars(p.rating).replace('</span>', ' <small>(' + p.reviews + ')</small></span>') + '</div>' +
        '<h3 class="card-title">' + p.name + '</h3>' +
        '<p class="card-axle">' + p.axle + (p.diam ? ' · ' + p.diam : '') + '</p>' +
        '<div class="card-stock"><i></i>В наличии ' + p.stock + ' шт</div>' +
        '<div class="card-price"><b>' + fmt(p.price) + '</b>' + (p.old ? '<s>' + fmt(p.old) + '</s>' : '') + '</div>' +
        '<div class="card-actions"><button type="button" class="btn-cart" data-add="' + p.id + '"><svg class="i"><use href="#i-cart"/></svg><span class="lbl">В корзину</span></button>' +
        '<button type="button" class="btn-1click" data-buy="' + p.id + '">В 1 клик</button></div>' +
      '</div></article>';
  }

  function filtered() {
    var list = D.products.filter(function (p) {
      return (state.cat === 'all' || p.cat === state.cat) &&
        (!state.diam || p.diam === state.diam) && (!state.axle || p.axle === state.axle) &&
        (!state.brand || p.brand === state.brand) && (!state.size || p.size === state.size);
    });
    var pop = function (p) { return (p.tag === 'Хит' ? 1000 : 0) + p.reviews; };
    list.sort(function (a, b) {
      return state.sort === 'cheap' ? a.price - b.price : state.sort === 'exp' ? b.price - a.price : pop(b) - pop(a);
    });
    return list;
  }

  function renderGrid() {
    var list = filtered(), limit = (state.cat === 'all' && !state.all && !hasFilters()) ? 8 : list.length;
    grid.innerHTML = list.length ? list.slice(0, limit).map(card).join('') :
      '<div class="grid-empty"><b>Ничего не нашли</b>Такого размера сейчас нет на складе — оставьте заявку, привезём под заказ.<br><br><button type="button" class="btn btn-fire" data-callback="Заказ шины под размер"><span>Оставить заявку</span></button></div>';
    more.parentNode.hidden = list.length <= limit;
    $$('.tabs button').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-tab') === state.cat); });
    renderChips();
    MS.render(); MS.reveal(grid); tilt();
  }
  function hasFilters() { return !!(state.diam || state.axle || state.brand || state.size); }
  function renderChips() {
    var chips = [];
    ['size', 'diam', 'axle', 'brand'].forEach(function (k) { if (state[k]) chips.push('<button type="button" data-unset="' + k + '">' + state[k] + '</button>'); });
    af.hidden = !chips.length;
    af.innerHTML = chips.join('') + (chips.length ? '<button type="button" class="af-reset" data-unset="all">Сбросить всё</button>' : '');
  }
  af.addEventListener('click', function (e) {
    var b = e.target.closest('[data-unset]'); if (!b) return;
    var k = b.getAttribute('data-unset');
    if (k === 'all') { state.diam = state.axle = state.brand = state.size = ''; } else state[k] = '';
    renderGrid();
  });
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () { state.cat = b.getAttribute('data-tab'); state.all = false; renderGrid(); });
  });
  $('[data-sort]').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });
  more.addEventListener('click', function () { state.all = true; renderGrid(); });

  // ссылки вида data-filter="rims" — открыть категорию в каталоге
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-filter]'); if (!a) return;
    state.cat = a.getAttribute('data-filter'); state.diam = state.axle = state.brand = state.size = ''; state.all = false;
    renderGrid();
  });

  /* ---------- подбор ---------- */
  var fCat = 'truck', form = $('.finder-form');
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }
  function opts(sel, values, any) {
    sel.innerHTML = '<option value="">' + any + '</option>' + values.map(function (v) { return '<option>' + v + '</option>'; }).join('');
  }
  function fillFinder() {
    var ps = D.products.filter(function (p) { return p.cat === fCat; });
    var diams = uniq(ps.map(function (p) { return p.diam; }));
    opts(form.elements.diam, diams, diams.length ? 'Любой' : '—');
    form.elements.diam.disabled = !diams.length;
    opts(form.elements.axle, uniq(ps.map(function (p) { return p.axle; })), 'Любое');
    opts(form.elements.brand, uniq(ps.map(function (p) { return p.brand; })), 'Любой');
  }
  $$('.finder-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      fCat = b.getAttribute('data-cat');
      $$('.finder-tabs button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      fillFinder();
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    state.cat = fCat; state.diam = form.elements.diam.value; state.axle = form.elements.axle.value; state.brand = form.elements.brand.value; state.size = ''; state.all = true;
    renderGrid(); $('#catalog').scrollIntoView({ behavior: 'smooth' });
  });
  $$('.finder-quick [data-size]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.cat = 'all'; state.diam = state.axle = state.brand = ''; state.size = b.getAttribute('data-size'); state.all = true;
      renderGrid(); $('#catalog').scrollIntoView({ behavior: 'smooth' });
    });
  });
  fillFinder();

  /* ---------- 3D-наклон карточек ---------- */
  function tilt() {
    if (MS.reduced || matchMedia('(hover: none)').matches) return;
    $$('.card', grid).forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + y * -8 + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ---------- подсветка карточек преимуществ за курсором ---------- */
  $$('.feat').forEach(function (f) {
    f.addEventListener('mousemove', function (e) {
      var r = f.getBoundingClientRect();
      f.style.setProperty('--mx', e.clientX - r.left + 'px'); f.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* ---------- отзывы и шоурумы ---------- */
  $('[data-reviews]').innerHTML = D.reviews.map(function (r, i) {
    return '<article class="review" data-reveal data-delay="' + i * 100 + '"><span class="stars">' + '★★★★★'.slice(0, r.rating) + '</span><p>' + r.text + '</p>' +
      '<div class="review-who"><span class="review-ava">' + r.name[0] + '</span><div><b>' + r.name + '</b><small>' + r.role + '</small></div></div></article>';
  }).join('');
  $('[data-shops]').innerHTML = D.company.showrooms.map(function (s, i) {
    return '<div class="shop" data-reveal data-delay="' + i * 80 + '"><svg class="i"><use href="#i-pin"/></svg><div><b>' + s.title + '</b><span>' + s.address + '</span><small>' + s.hours + '</small></div></div>';
  }).join('');

  renderGrid();
  MS.reveal();
})();
