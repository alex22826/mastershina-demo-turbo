/* Демо-данные каталога MASTERSHINA.
   Цены указаны для демонстрации — перед запуском заменить на реальные (или подтягивать из API/1С). */
window.MS_DATA = {
  company: {
    name: 'MASTERSHINA',
    since: 2010,
    phoneShort: '555 111 777',
    phone: '+998 (99) 857-99-11',
    phoneHref: 'tel:+998998579911',
    email: 'info@mastershina.uz',
    telegram: 'https://t.me/AUTO777CENTERuz',
    instagram: 'https://instagram.com/auto777center.uz',
    facebook: 'https://facebook.com/auto777center.uz',
    showrooms: [
      { title: 'Шоурум + склад', address: 'Ташкент, Сергелийский р-н, ул. Узумзор, 37', hours: 'Пн–Пт 09:00–20:00' },
      { title: 'Шоурум', address: 'Ташкент, Сергелийский р-н, ул. Янги Сергели, 44А', hours: 'Пн–Пт 09:00–19:00' },
      { title: 'Шоурум', address: 'Ташкент, Сергелийский р-н, ул. Янги Сергели, 23', hours: 'Пн–Пт 09:00–19:00' }
    ]
  },

  categories: [
    { id: 'truck',   title: 'Грузовые шины',      short: 'Грузовые' },
    { id: 'special', title: 'Шины для спецтехники', short: 'Спецтехника' },
    { id: 'rims',    title: 'Диски',              short: 'Диски' },
    { id: 'parts',   title: 'Запчасти и масла',   short: 'Запчасти' }
  ],

  brands: ['ROADONE', 'CETROC', 'KAPSEN', 'ADVANCE', 'PROTYRE', 'HENGTAR', 'SULTAN', 'BEITER'],
  partsFor: ['HOWO', 'SHACMAN', 'XCMG', 'Zoomlion', 'MAN'],

  products: [
    { id: 1,  cat: 'truck', brand: 'ROADONE', model: 'GD800', name: 'ROADONE GD800 Карьер', size: '9.00 R20', diam: 'R20', axle: 'Ведущая', img: 'gd800', price: 2950000, old: 3250000, stock: 48, rating: 4.9, reviews: 37, tag: 'Хит', desc: 'Карьерная ведущая шина с глубоким блочным протектором' },
    { id: 2,  cat: 'truck', brand: 'ROADONE', model: 'RA85',  name: 'ROADONE RA85',         size: '9.00 R20', diam: 'R20', axle: 'Универсальная', img: 'ra85', price: 2750000, stock: 64, rating: 4.8, reviews: 29, tag: '', desc: 'Универсальная шина для смешанной эксплуатации' },
    { id: 3,  cat: 'truck', brand: 'ROADONE', model: 'GD08',  name: 'ROADONE GD08',         size: '9.00 R20', diam: 'R20', axle: 'Ведущая', img: 'gd08', price: 2850000, stock: 31, rating: 4.9, reviews: 41, tag: 'Хит', desc: 'Ведущая ось, усиленный каркас, высокая износостойкость' },
    { id: 4,  cat: 'truck', brand: 'ROADONE', model: 'RF02',  name: 'ROADONE RF02',         size: '8.25 R16LT', diam: 'R16', axle: 'Рулевая', img: 'rf02', price: 1650000, stock: 80, rating: 4.7, reviews: 18, tag: '', desc: 'Рулевая шина для лёгких грузовиков, тихая и экономичная' },
    { id: 5,  cat: 'truck', brand: 'ROADONE', model: 'RF62',  name: 'ROADONE RF62/61',      size: '7.50 R16LT', diam: 'R16', axle: 'Рулевая', img: 'rf62', price: 1450000, old: 1590000, stock: 22, rating: 4.8, reviews: 12, tag: 'Скидка', desc: 'Магистральная шина с продольным рисунком протектора' },
    { id: 6,  cat: 'truck', brand: 'ROADONE', model: 'GD08',  name: 'ROADONE GD08 LT',      size: '8.25 R16LT', diam: 'R16', axle: 'Ведущая', img: 'gd08', price: 1720000, stock: 40, rating: 4.8, reviews: 9, tag: 'Новинка', desc: 'Ведущая шина для среднетоннажных грузовиков' },

    { id: 7,  cat: 'special', brand: 'HENGTAR', model: 'H818',  name: 'HENGTAR H818 TTF',     size: '7.00-12', diam: 'R12', axle: 'Погрузчик', img: 'h818', price: 1250000, stock: 26, rating: 4.7, reviews: 14, tag: '', desc: 'Пневматическая шина для вилочных погрузчиков' },
    { id: 8,  cat: 'special', brand: 'HENGTAR', model: 'HD101', name: 'HENGTAR HD101 Solid',  size: '16.6-8', diam: 'R8', axle: 'Цельнолитая', img: 'hd101', price: 1900000, stock: 12, rating: 5.0, reviews: 7, tag: 'Хит', desc: 'Цельнолитая шина — не боится проколов' },
    { id: 9,  cat: 'special', brand: 'HENGTAR', model: 'R4-3',  name: 'HENGTAR R4-3 TL',      size: '10.5/80-18', diam: 'R18', axle: 'Экскаватор-погрузчик', img: 'r43', price: 2100000, stock: 18, rating: 4.8, reviews: 11, tag: '', desc: 'Индустриальный протектор R4 для экскаваторов-погрузчиков' },
    { id: 10, cat: 'special', brand: 'HENGTAR', model: 'E3/L3A', name: 'HENGTAR E3/L3A TTF',  size: '16/70-20', diam: 'R20', axle: 'Фронтальный погрузчик', img: 'e3l3', price: 3400000, stock: 9, rating: 4.9, reviews: 6, tag: 'Новинка', desc: 'Карьерная шина E3/L3 для фронтальных погрузчиков' },
    { id: 11, cat: 'special', brand: 'HENGTAR', model: 'R4-2',  name: 'HENGTAR R4-2 TL',      size: '19.5L-24', diam: 'R24', axle: 'Экскаватор-погрузчик', img: 'r42', price: 4600000, stock: 7, rating: 4.8, reviews: 5, tag: '', desc: 'Крупногабаритная шина для тяжёлой техники' },

    { id: 12, cat: 'rims', brand: 'SULTAN', model: '11.75', name: 'Диск SULTAN',           size: '11.75 R22.5', diam: 'R22.5', axle: 'Бескамерный', img: 'sultan1175', price: 1850000, stock: 35, rating: 4.9, reviews: 16, tag: 'Хит', desc: 'Стальной диск для бескамерных шин, 10 отверстий' },
    { id: 13, cat: 'rims', brand: 'SULTAN', model: '9.00',  name: 'Диск SULTAN',           size: '9.00 R22.5', diam: 'R22.5', axle: 'Бескамерный', img: 'sultan900', price: 1550000, stock: 42, rating: 4.8, reviews: 10, tag: '', desc: 'Надёжный стальной диск для грузовиков и прицепов' },
    { id: 14, cat: 'rims', brand: 'BEITER', model: '12.00', name: 'Диск BEITER',           size: '12.00 R20', diam: 'R20', axle: 'Камерный', img: 'beiter1200', price: 1700000, stock: 20, rating: 4.7, reviews: 8, tag: '', desc: 'Усиленный диск для самосвалов, 10 отверстий' },

    { id: 15, cat: 'parts', brand: 'Castrol', model: 'Vecton', name: 'Масло Castrol Vecton Long Drain 10W-40', size: '20 л', diam: '', axle: 'Моторное масло', img: 'castrol', price: 1350000, stock: 60, rating: 4.9, reviews: 22, tag: '', desc: 'Для дизельных двигателей Euro 6, увеличенный интервал замены' },
    { id: 16, cat: 'parts', brand: 'ATLANT', model: '6СТ-190', name: 'Аккумулятор ATLANT 6СТ-190', size: '190 Ач', diam: '', axle: 'АКБ', img: 'atlant', price: 2400000, stock: 15, rating: 4.8, reviews: 13, tag: '', desc: 'Пусковой ток для тяжёлых грузовиков и спецтехники' },
    { id: 17, cat: 'parts', brand: 'HOWO', model: 'A7', name: 'Амортизатор кабины HOWO A7', size: 'WG1664440068', diam: '', axle: 'Подвеска кабины', img: 'amort', price: 420000, stock: 28, rating: 4.7, reviews: 9, tag: 'Новинка', desc: 'Задний амортизатор кабины, оригинальный артикул' }
  ],

  services: [
    { id: 'tire',  title: 'Шиномонтаж грузовых шин', text: 'Монтаж, балансировка и ремонт шин любых размеров — от погрузчика до карьерного самосвала.', img: 'mechanic' },
    { id: 'oil',   title: 'Замена масла',             text: 'Сертифицированные масла по допускам производителя, минимальный простой техники.', img: 'oil' },
    { id: 'repair', title: 'Ремонт и подвеска',       text: 'Мелкий и крупный ремонт прицепов, кранов, замена деталей подвески и тормозной системы.', img: 'mechanic' },
    { id: 'weld',  title: 'Покраска и сварка',        text: 'Восстановление кузова коммерческого транспорта на качественных материалах.', img: 'welding' }
  ],

  /* Платёжные методы для будущего эквайринга */
  payments: [
    { id: 'payme', title: 'Payme', note: 'Оплата картой через Payme' },
    { id: 'click', title: 'Click', note: 'Оплата через Click Up' },
    { id: 'uzum',  title: 'Uzum Bank', note: 'Оплата и рассрочка Uzum' },
    { id: 'card',  title: 'UzCard / HUMO / Visa', note: 'Банковская карта' },
    { id: 'cash',  title: 'При получении', note: 'Наличными или картой в шоуруме' }
  ],

  reviews: [
    { name: 'Азиз Т.', role: 'Автопарк, 14 самосвалов', text: 'Берём ROADONE GD800 на весь парк — ходят по карьеру дольше, чем шины, которые брали раньше. Всегда в наличии, отгрузка в день заявки.', rating: 5 },
    { name: 'Шерзод К.', role: 'Логистическая компания', text: 'Взяли комплект рулевых и ведущих шин в рассрочку. Оформили быстро, сразу же поставили на сервисе. Удобно, что всё в одном месте.', rating: 5 },
    { name: 'Дилшод Р.', role: 'Строительная техника', text: 'Цельнолитые HENGTAR на погрузчики — проколов больше нет. Менеджер подсказал правильный размер по фото старой шины.', rating: 5 }
  ]
};

/* Формат цены в сумах: 2950000 -> "2 950 000 сум" */
window.MS_fmt = function (n) {
  return n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' сум';
};
