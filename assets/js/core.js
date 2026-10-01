/* Ядро демо-магазина: корзина, оформление заказа, оплата (заготовка под эквайринг),
   обратный звонок, анимации появления и счётчики. Разметка корзины и модалок
   создаётся здесь, а внешний вид задаёт CSS конкретного дизайна. */
(function () {
  var D = window.MS_DATA, fmt = window.MS_fmt;
  var KEY = 'ms_cart_v1';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function byId(id) { return D.products.find(function (p) { return p.id == id; }); }
  function img(p) { return 'assets/img/products/' + p.img + '.webp'; }

  /* ---------- состояние корзины ---------- */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (id) { if (!byId(id)) delete cart[id]; });

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (s, id) { return s + byId(id).price * cart[id]; }, 0); }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 99);
    save(); render();
  }
  function add(id, q) { setQty(id, (cart[id] || 0) + (q || 1)); }

  /* ---------- разметка ---------- */
  var payHtml = D.payments.map(function (m, i) {
    return '<label class="co-pay-opt"><input type="radio" name="pay" value="' + m.id + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<span class="co-pay-tile"><b>' + m.title + '</b><small>' + m.note + '</small></span></label>';
  }).join('');

  var ui = document.createElement('div');
  ui.className = 'ms-ui';
  ui.innerHTML =
    '<div class="cart-overlay" data-ui-close></div>' +
    '<aside class="cart-drawer" aria-label="Корзина" aria-hidden="true">' +
      '<header class="cart-head"><h3>Корзина <sup class="cart-head-count"></sup></h3><button class="cart-x" data-ui-close aria-label="Закрыть">&times;</button></header>' +
      '<div class="cart-items"></div>' +
      '<footer class="cart-foot">' +
        '<div class="cart-sum"><span>Итого</span><b class="cart-total"></b></div>' +
        '<button class="cart-checkout" type="button">Оформить заказ</button>' +
        '<p class="cart-note">Онлайн-оплата: Payme · Click · Uzum · UzCard · HUMO · Visa</p>' +
      '</footer>' +
    '</aside>' +
    '<div class="co-modal" aria-hidden="true"><div class="co-backdrop" data-ui-close></div>' +
      '<div class="co-box" role="dialog" aria-modal="true" aria-label="Оформление заказа">' +
        '<button class="co-x" data-ui-close aria-label="Закрыть">&times;</button>' +
        '<div class="co-step" data-step="1">' +
          '<h3>Оформление заказа</h3>' +
          '<div class="co-summary"></div>' +
          '<form class="co-form" novalidate>' +
            '<div class="co-row"><label>Имя<input name="name" autocomplete="name" placeholder="Как к вам обращаться"></label>' +
            '<label>Телефон<input name="phone" inputmode="tel" autocomplete="tel" placeholder="+998 (__) ___-__-__"></label></div>' +
            '<div class="co-label">Получение</div>' +
            '<div class="co-seg">' +
              '<label><input type="radio" name="ship" value="pickup" checked><span>Самовывоз из шоурума</span></label>' +
              '<label><input type="radio" name="ship" value="tashkent"><span>Доставка по Ташкенту</span></label>' +
              '<label><input type="radio" name="ship" value="region"><span>Доставка в регионы</span></label>' +
            '</div>' +
            '<div class="co-label">Способ оплаты</div>' +
            '<div class="co-pay">' + payHtml + '</div>' +
            '<p class="co-error" hidden></p>' +
            '<button class="co-submit" type="submit">Оплатить <span class="co-submit-sum"></span></button>' +
            '<p class="co-secure">🔒 Данные карты вводятся на защищённой странице платёжной системы — магазин их не хранит.</p>' +
          '</form>' +
        '</div>' +
        '<div class="co-step" data-step="2" hidden><div class="co-spinner"></div><h3 class="co-proc-title">Создаём счёт…</h3><p class="co-proc-text"></p></div>' +
        '<div class="co-step" data-step="3" hidden><div class="co-ok">✓</div><h3 class="co-ok-title"></h3><p class="co-ok-text"></p><button class="co-done" type="button" data-ui-close>Вернуться в каталог</button></div>' +
      '</div></div>' +
    '<div class="cb-modal" aria-hidden="true"><div class="co-backdrop" data-ui-close></div>' +
      '<div class="co-box cb-box" role="dialog" aria-modal="true" aria-label="Обратный звонок">' +
        '<button class="co-x" data-ui-close aria-label="Закрыть">&times;</button>' +
        '<div class="cb-form-wrap"><h3 class="cb-title">Заказать звонок</h3><p class="cb-sub">Перезвоним в течение 15 минут в рабочее время</p>' +
        '<form class="cb-form" novalidate><label>Имя<input name="name" placeholder="Ваше имя"></label>' +
        '<label>Телефон<input name="phone" inputmode="tel" placeholder="+998 (__) ___-__-__"></label>' +
        '<label>Комментарий<textarea name="msg" rows="3" placeholder="Например: нужен комплект 9.00 R20 на самосвал"></textarea></label>' +
        '<p class="co-error" hidden></p><button class="co-submit" type="submit">Жду звонка</button></form></div>' +
        '<div class="cb-ok" hidden><div class="co-ok">✓</div><h3>Заявка отправлена</h3><p>Менеджер свяжется с вами в ближайшее время. В демо-версии заявка никуда не уходит.</p></div>' +
      '</div></div>' +
    '<div class="ms-toast" role="status" aria-live="polite"></div>';
  document.body.appendChild(ui);

  var $ = function (s, r) { return (r || ui).querySelector(s); };
  var drawer = $('.cart-drawer'), overlay = $('.cart-overlay'), co = $('.co-modal'), cb = $('.cb-modal');

  /* ---------- отрисовка корзины ---------- */
  function render() {
    var ids = Object.keys(cart), n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n; el.classList.toggle('is-empty', n === 0);
    });
    document.querySelectorAll('[data-add]').forEach(function (b) {
      b.classList.toggle('in-cart', !!cart[b.getAttribute('data-add')]);
    });
    $('.cart-head-count').textContent = n ? n : '';
    $('.cart-total').textContent = fmt(total());
    $('.cart-checkout').disabled = n === 0;
    $('.cart-items').innerHTML = ids.length ? ids.map(function (id) {
      var p = byId(id);
      return '<div class="cart-item" data-id="' + id + '">' +
        '<div class="ci-img"><img src="' + img(p) + '" alt="" loading="lazy"></div>' +
        '<div class="ci-info"><b>' + p.name + '</b><span>' + p.size + '</span>' +
        '<div class="ci-qty"><button type="button" data-q="-1" aria-label="Меньше">−</button><output>' + cart[id] + '</output><button type="button" data-q="1" aria-label="Больше">+</button></div></div>' +
        '<div class="ci-right"><b>' + fmt(p.price * cart[id]) + '</b><button type="button" class="ci-del" data-del aria-label="Удалить">Удалить</button></div></div>';
    }).join('') : '<div class="cart-empty"><div class="cart-empty-ico"></div><b>Корзина пуста</b><p>Добавьте шины, диски или запчасти из каталога</p></div>';
    document.dispatchEvent(new CustomEvent('ms:cart', { detail: { count: n, cart: cart } }));
  }

  $('.cart-items').addEventListener('click', function (e) {
    var row = e.target.closest('.cart-item'); if (!row) return;
    var id = row.getAttribute('data-id');
    var q = e.target.closest('[data-q]');
    if (q) setQty(id, cart[id] + Number(q.getAttribute('data-q')));
    if (e.target.closest('[data-del]')) setQty(id, 0);
  });

  /* ---------- открытие/закрытие ---------- */
  function lock(on) { document.documentElement.classList.toggle('ms-lock', on); }
  function openCart() { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); lock(true); }
  function closeAll() {
    [drawer, overlay, co, cb].forEach(function (el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    lock(false);
  }
  ui.addEventListener('click', function (e) { if (e.target.closest('[data-ui-close]')) closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  function showStep(n) {
    co.querySelectorAll('.co-step').forEach(function (s) { s.hidden = s.getAttribute('data-step') != n; });
  }
  function openCheckout() {
    if (!count()) return;
    drawer.classList.remove('open'); overlay.classList.remove('open');
    var ids = Object.keys(cart);
    $('.co-summary').innerHTML = ids.map(function (id) {
      var p = byId(id);
      return '<div class="co-line"><img src="' + img(p) + '" alt=""><span>' + p.name + ' · ' + p.size + ' <i>× ' + cart[id] + '</i></span><b>' + fmt(p.price * cart[id]) + '</b></div>';
    }).join('') + '<div class="co-line co-total"><span>К оплате</span><b>' + fmt(total()) + '</b></div>';
    $('.co-submit-sum').textContent = fmt(total());
    $('.co-error', co).hidden = true;
    showStep(1);
    co.classList.add('open'); co.setAttribute('aria-hidden', 'false'); lock(true);
  }
  function openCallback(title) {
    $('.cb-title').textContent = title || 'Заказать звонок';
    $('.cb-form-wrap').hidden = false; $('.cb-ok').hidden = true;
    cb.classList.add('open'); cb.setAttribute('aria-hidden', 'false'); lock(true);
  }
  $('.cart-checkout').addEventListener('click', openCheckout);

  /* ---------- маска телефона +998 ---------- */
  function phoneDigits(v) { var d = v.replace(/\D/g, ''); if (d.indexOf('998') === 0) d = d.slice(3); return d.slice(0, 9); }
  function maskPhone(input) {
    input.addEventListener('input', function () {
      var d = phoneDigits(input.value), o = '+998';
      if (d.length) o += ' (' + d.slice(0, 2);
      if (d.length >= 2) o += ')';
      if (d.length > 2) o += ' ' + d.slice(2, 5);
      if (d.length > 5) o += '-' + d.slice(5, 7);
      if (d.length > 7) o += '-' + d.slice(7, 9);
      input.value = o;
    });
  }
  ui.querySelectorAll('input[name="phone"]').forEach(maskPhone);
  document.querySelectorAll('input[data-phone]').forEach(maskPhone);

  function validate(form) {
    var name = form.elements.name.value.trim(), phone = phoneDigits(form.elements.phone.value);
    var err = form.querySelector('.co-error');
    if (name.length < 2) { err.textContent = 'Укажите имя'; err.hidden = false; return false; }
    if (phone.length !== 9) { err.textContent = 'Укажите телефон полностью: +998 (XX) XXX-XX-XX'; err.hidden = false; return false; }
    err.hidden = true; return true;
  }

  /* ---------- оплата ----------
     Точка интеграции эквайринга. В рабочей версии здесь запрос к backend:
     он создаёт счёт в Payme / Click / Uzum и возвращает URL платёжной страницы,
     куда перенаправляем покупателя. Сейчас — имитация для демонстрации. */
  function startPayment(order) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ ok: true, demo: true, orderId: order.id }); }, 1700);
    });
  }

  $('.co-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target; if (!validate(f)) return;
    var method = D.payments.find(function (m) { return m.id === f.elements.pay.value; });
    var order = { id: 'MS-' + String(Date.now()).slice(-6), items: Object.assign({}, cart), total: total(), method: method.id, ship: f.elements.ship.value };
    showStep(2);
    $('.co-proc-title').textContent = method.id === 'cash' ? 'Оформляем заказ…' : 'Создаём счёт в ' + method.title + '…';
    $('.co-proc-text').textContent = 'Заказ ' + order.id + ' на сумму ' + fmt(order.total);
    startPayment(order).then(function (res) {
      cart = {}; save(); render(); f.reset();
      showStep(3);
      $('.co-ok-title').textContent = 'Заказ ' + res.orderId + ' оформлен!';
      $('.co-ok-text').textContent = method.id === 'cash'
        ? 'Менеджер перезвонит для подтверждения. Оплата — при получении в шоуруме.'
        : 'В рабочей версии здесь откроется защищённая страница оплаты ' + method.title + '. Это демо — деньги не списываются.';
    });
  });

  $('.cb-form').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(e.target)) return;
    e.target.reset(); $('.cb-form-wrap').hidden = true; $('.cb-ok').hidden = false;
  });

  /* ---------- тост и «полёт в корзину» ---------- */
  var toastEl = $('.ms-toast'), toastT;
  function toast(html) {
    toastEl.innerHTML = html; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }
  function visibleCartBtn() {
    return Array.prototype.find.call(document.querySelectorAll('[data-cart-open]'), function (el) { return el.offsetParent !== null; });
  }
  function fly(fromImg) {
    var target = visibleCartBtn();
    if (!fromImg || !target || reduced || !fromImg.animate) return;
    var a = fromImg.getBoundingClientRect(), b = target.getBoundingClientRect();
    var c = fromImg.cloneNode(); c.className = 'ms-fly'; c.removeAttribute('loading');
    Object.assign(c.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', zIndex: 9999, pointerEvents: 'none', objectFit: 'contain', margin: 0 });
    document.body.appendChild(c);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 120) + 'px) scale(.55) rotate(200deg)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.1) rotate(400deg)', opacity: 0.4 }
    ], { duration: 850, easing: 'cubic-bezier(.5,0,.6,1)' }).onfinish = function () {
      c.remove();
      target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
    };
  }

  /* ---------- делегирование кликов на странице ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) {
      e.preventDefault();
      var p = byId(t.getAttribute('data-add'));
      add(p.id);
      var card = t.closest('[data-card]');
      fly(card && card.querySelector('img'));
      toast('<b>Добавлено в корзину</b><span>' + p.name + ' · ' + p.size + '</span>');
      document.dispatchEvent(new CustomEvent('ms:added', { detail: { product: p, button: t } }));
    } else if ((t = e.target.closest('[data-buy]'))) {
      e.preventDefault();
      var id = t.getAttribute('data-buy'); if (!cart[id]) add(id);
      openCheckout();
    } else if ((t = e.target.closest('[data-cart-open]'))) {
      e.preventDefault(); openCart();
    } else if ((t = e.target.closest('[data-callback]'))) {
      e.preventDefault(); openCallback(t.getAttribute('data-callback'));
    }
  });

  /* ---------- появление при скролле и счётчики ---------- */
  function reveal(root) {
    var els = (root || document).querySelectorAll('[data-reveal]:not(.is-in)');
    if (!('IntersectionObserver' in window) || reduced) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, d = el.getAttribute('data-delay');
        if (d) el.style.transitionDelay = d + 'ms';
        el.classList.add('is-in'); io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function counters() {
    var els = document.querySelectorAll('[data-count]');
    var run = function (el) {
      var to = parseFloat(el.getAttribute('data-count')), dec = (String(to).split('.')[1] || '').length;
      var t0 = null, dur = 1600;
      if (reduced) { el.textContent = to.toLocaleString('ru-RU'); return; }
      (function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min((ts - t0) / dur, 1), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU');
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  window.MS = {
    data: D, fmt: fmt, byId: byId, img: img, add: add, cart: function () { return cart; },
    openCart: openCart, openCheckout: openCheckout, openCallback: openCallback,
    toast: toast, reveal: reveal, counters: counters, maskPhone: maskPhone, reduced: reduced, render: render
  };

  document.addEventListener('DOMContentLoaded', function () { render(); reveal(); counters(); });
  if (document.readyState !== 'loading') { render(); }
})();
