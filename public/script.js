const STATUS_ORDER = {
  active: 0,
  reserved: 1,
  sold: 2,
};

const PLACEHOLDER_PHOTO = '/hero-main.jpg';

let currentLang = 'en';

// Тексты для трёх языков
const I18N = {
  en: {
    hero: {
      badge: 'Dubai • Exclusive cattery',
      title: 'Premium Sphynx Cats for Sale',
      subtitle:
        'Healthy, friendly and stunning sphynx kittens with perfect temperament and premium care.',
      ctaPrimary: 'View available kittens',
      note: 'Small exclusive litters • Worldwide assistance',
    },
    cats: {
      title: 'Available Sphynx Cats',
      text: 'All kittens are vaccinated, dewormed and fully socialized. The list updates in real time.',
      filterActive: 'Active',
      filterReserved: 'Reserved',
      emptyTitle: 'No kittens are available at the moment.',
      emptyNote:
        'Contact us to join the waiting list for the next premium litter.',
      statusAvailable: 'Available',
      statusReserved: 'Reserved',
      statusSold: 'Sold',
      metaActive: 'Ready for new home',
      metaReserved: 'Reservation confirmed',
      metaSold: 'Placed in loving home',
    },
    about: {
      title: 'Sphynx Cats & Kittens in Dubai (UAE)',
      text: 'Boutique cattery in Dubai, UAE, focused on healthy, well-socialized sphynx kittens with exceptional temperament and type.',
      familyTitle: 'Family raised',
      familyText:
        'All kittens grow in our home, not in cages. They live with us as family members and are used to children, guests and everyday sounds.',
      healthTitle: 'Health & guarantee',
      healthText:
        'Each kitten receives full veterinary care, vaccinations, deworming, and a health book. We provide a clear contract and support.',
      vetTitle: 'Vet supervised',
      vetText:
        'Our breeding program is built around regular vet checks and responsible pairing to support strong immunity and longevity.',
      supportTitle: 'Lifetime support',
      supportText:
        'We stay in touch after you take your sphynx home and are ready to help with care, nutrition and adaptation in a new country.',
    },
    philosophy: {
      title: 'Our breeding philosophy',
      text: 'We breed for health, character and harmony of the sphynx type, not for quantity. Each litter is planned and limited.',
      geneticTitle: 'Genetic care',
      geneticText:
        'Breeding cats are carefully selected and checked to help avoid hereditary issues and support strong, healthy kittens.',
      homeTitle: 'Home environment',
      homeText:
        'Kittens live in a clean, calm home environment with climbing trees, toys and constant human contact from the first weeks.',
      travelTitle: 'Preparation for travel',
      travelText:
        'We help with export documents, microchips and travel carriers, so your sphynx can safely arrive anywhere in the world.',
    },
    contact: {
      title: 'Contact & Reservations',
      text: 'Tell us about your ideal sphynx kitten — we will help you choose the perfect match.',
      note: 'We provide detailed photo & video reports, health documents and support with international transportation if needed.',
      noteAccent:
        'For quick response, please send us a message on WhatsApp or email with your name and preferred kitten type.',
      whButton: 'Write in WhatsApp',
      whHint:
        'We answer the fastest in WhatsApp. Tap the button and send us a short message about the kitten you are looking for.',
    },
    footer: {
      brand: 'Premium Sphynx Dubai',
      tagline: 'Exclusive sphynx kittens • Boutique cattery',
    },
    lang: {
      label: 'Language',
    },
  },
  ru: {
    hero: {
      badge: 'Дубай • Бутік-питомник',
      title: 'Премиальные сфинксы на продажу',
      subtitle:
        'Здоровые, контактные и очень красивые котята сфинкса с идеальным темпераментом и уходом.',
      ctaPrimary: 'Смотреть доступных котят',
      note: 'Небольшие эксклюзивные помёты • Помощь с доставкой по миру',
    },
    cats: {
      title: 'Доступные коты и котята сфинкса',
      text: 'Все котята привиты, обработаны и социализированы. Список обновляется в реальном времени.',
      filterActive: 'Активные',
      filterReserved: 'В резерве',
      emptyTitle: 'Сейчас нет доступных котят.',
      emptyNote:
        'Напишите нам, чтобы попасть в лист ожидания на следующий помёт.',
      statusAvailable: 'Доступен',
      statusReserved: 'В резерве',
      statusSold: 'Продан',
      metaActive: 'Готов к переезду в новый дом',
      metaReserved: 'Бронирование подтверждено',
      metaSold: 'Уже живёт в любящей семье',
    },
    about: {
      title: 'Сфинксы и котята сфинкса в Дубае (ОАЭ)',
      text: 'Бутик-питомник в Дубае, который специализируется на здоровых, хорошо социализированных сфинксах с идеальным характером.',
      familyTitle: 'В семье, а не в клетках',
      familyText:
        'Все котята растут у нас дома, а не в клетках. Они привыкли к детям, гостям и обычным бытовым звукам.',
      healthTitle: 'Здоровье и гарантии',
      healthText:
        'Каждый котёнок проходит ветеринарный осмотр, получает прививки, обработку от паразитов и ветеринарный паспорт.',
      vetTitle: 'Под контролем ветеринара',
      vetText:
        'Племенная программа строится вокруг регулярных проверок здоровья и аккуратного подбора пар.',
      supportTitle: 'Поддержка на всю жизнь',
      supportText:
        'Мы остаёмся на связи после переезда котёнка и помогаем с уходом, питанием и адаптацией.',
    },
    philosophy: {
      title: 'Наша племенная философия',
      text: 'Мы разводим сфинксов не количеством, а качеством — здоровье, характер и породный тип. Каждый помёт планируется заранее.',
      geneticTitle: 'Генетическое здоровье',
      geneticText:
        'Производители тщательно отбираются и проверяются, чтобы минимизировать наследственные риски.',
      homeTitle: 'Домашняя среда',
      homeText:
        'Котята растут в спокойной, чистой домашней обстановке, с когтеточками, игрушками и постоянным общением.',
      travelTitle: 'Подготовка к переезду',
      travelText:
        'Помогаем с документами для экспорта, чипами и переносками, чтобы перелёт прошёл максимально комфортно.',
    },
    contact: {
      title: 'Контакты и бронь котят',
      text: 'Расскажите, какого сфинкса вы ищете — мы подберём идеального котёнка под ваш запрос.',
      note: 'Мы отправляем подробные фото и видео-отчёты, готовим все медицинские документы и помогаем с транспортировкой.',
      noteAccent:
        'Для быстрого ответа напишите нам в WhatsApp, указав своё имя и желаемый тип котёнка.',
      whButton: 'Написать в WhatsApp',
      whHint:
        'Мы быстрее всего отвечаем в WhatsApp. Нажмите на кнопку и отправьте нам короткое сообщение о том, какого котёнка вы ищете.',
    },
    footer: {
      brand: 'Premium Sphynx Dubai',
      tagline: 'Эксклюзивные сфинксы • Бутик-питомник',
    },
    lang: {
      label: 'Язык',
    },
  },
  ar: {
    hero: {
      badge: 'دبي • مزرعة سفنكس حصرية',
      title: 'قطط سفنكس فاخرة للبيع',
      subtitle:
        'قطط وكِتَن سفنكس صحية وحنونة وجميلة، مع عناية خاصة وطباع هادئة.',
      ctaPrimary: 'عرض الكِتَن المتاحة',
      note: 'فترات تزاوج محدودة • مساعدة في الشحن الدولي',
    },
    cats: {
      title: 'قطط سفنكس المتوفرة',
      text: 'جميع الكِتَن مُطعّمة ومُجتمعة جيدًا، ويتم تحديث القائمة بشكل مستمر.',
      filterActive: 'متاحة',
      filterReserved: 'محجوزة',
      emptyTitle: 'لا توجد كِتَن متاحة حاليًا.',
      emptyNote:
        'تواصل معنا لإضافتك إلى قائمة الانتظار للولادة القادمة.',
      statusAvailable: 'متاح',
      statusReserved: 'محجوز',
      statusSold: 'تم البيع',
      metaActive: 'جاهز للانتقال إلى منزل جديد',
      metaReserved: 'تم تأكيد الحجز',
      metaSold: 'في منزل محب بالفعل',
    },
    about: {
      title: 'قطط سفنكس وكتن في دبي (الإمارات)',
      text: 'مزرعة بوتيك في دبي متخصصة في تربية قطط سفنكس صحية ومُجتمعة بطباع ممتازة.',
      familyTitle: 'تربى داخل المنزل',
      familyText:
        'تعيش جميع الكِتَن معنا في المنزل، وليست في أقفاص، ومعتادة على الأطفال والضيوف وأصوات الحياة اليومية.',
      healthTitle: 'الصحة والضمان',
      healthText:
        'تحصل كل قِطّة على رعاية بيطرية كاملة، وتطعيمات وفحوصات ووثائق صحية واضحة.',
      vetTitle: 'إشراف بيطري',
      vetText:
        'برنامج التربية مبني على فحوصات منتظمة واختيار حذر للأزواج من أجل مناعة قوية.',
      supportTitle: 'دعم مدى الحياة',
      supportText:
        'نبقى على تواصل بعد انتقال القطة إلى منزلها الجديد ونساعد في العناية والتغذية والتأقلم.',
    },
    philosophy: {
      title: 'فلسفة التربية لدينا',
      text: 'نركز على الصحة والطباع وشكل سفنكس المميز بدلاً من الكمية. يتم التخطيط لكل ولادة بعناية.',
      geneticTitle: 'العناية الجينية',
      geneticText:
        'يتم اختيار القطط البالغة بعناية مع فحوصات جينية لتقليل الأمراض الوراثية.',
      homeTitle: 'بيئة منزلية',
      homeText:
        'تنمو الكِتَن في بيئة منزلية نظيفة وهادئة مع ألعاب وتسلق وتفاعل مستمر.',
      travelTitle: 'التحضير للسفر',
      travelText:
        'نساعد في تجهيز الوثائق والشرائح الإلكترونية وصناديق النقل ليصل القط بأمان إلى أي دولة.',
    },
    contact: {
      title: 'التواصل والحجز',
      text: 'أخبرنا بنوع قط سفنكس الذي تفضّله وسنساعدك في اختيار القِط المثالي لعائلتك.',
      note: 'نرسل صورًا ومقاطع فيديو تفصيلية، مع تقارير طبية كاملة ومساعدة في النقل الدولي.',
      noteAccent:
        'للحصول على رد سريع، راسلنا عبر واتساب مع اسمك ونوع القط الذي تفضله.',
      whButton: 'راسلنا عبر واتساب',
      whHint:
        'نجيب بأسرع ما يمكن عبر واتساب. اضغط على الزر وأرسل لنا رسالة قصيرة عن القِط الذي تبحث عنه.',
    },
    footer: {
      brand: 'بريميوم سفنكس دبي',
      tagline: 'قطط سفنكس فاخرة • مزرعة بوتيك',
    },
    lang: {
      label: 'اللغة',
    },
  },
};

function t(path) {
  const parts = path.split('.');
  let obj = I18N[currentLang];
  for (const p of parts) {
    if (!obj || typeof obj !== 'object') return '';
    obj = obj[p];
  }
  return typeof obj === 'string' ? obj : '';
}

function formatPrice(price) {
  if (!price) return '';
  const cleaned = String(price).trim().replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  if (/^\d+(\.\d+)?$/.test(normalized)) {
    const value = Number(normalized);
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `AED ${formatted}`;
  }
  return `AED ${cleaned}`;
}

function createCatCard(cat) {
  const status = (cat.status || 'active').toLowerCase();
  const wrapper = document.createElement('article');
  wrapper.className = `cat-card ${status}`;

  const inner = document.createElement('div');
  inner.className = 'cat-card-inner';

  const photoWrapper = document.createElement('div');
  photoWrapper.className = 'cat-photo-wrapper';

  const img = document.createElement('img');
  img.className = 'cat-photo';
  img.alt = cat.name || 'Sphynx cat';
  img.loading = 'lazy';

  img.src =
    (Array.isArray(cat.photos) && cat.photos[0]) || PLACEHOLDER_PHOTO;

  photoWrapper.appendChild(img);

  const statusPill = document.createElement('div');
  statusPill.className = 'cat-status-pill';

  if (status === 'active') {
    statusPill.classList.add('cat-status-active');
    statusPill.textContent = t('cats.statusAvailable') || 'Available';
  } else if (status === 'reserved') {
    statusPill.classList.add('cat-status-reserved');
    statusPill.textContent = t('cats.statusReserved') || 'Reserved';
  } else {
    statusPill.classList.add('cat-status-sold');
    statusPill.textContent = t('cats.statusSold') || 'Sold';
  }
  photoWrapper.appendChild(statusPill);

  if (status === 'reserved' || status === 'sold') {
    const overlay = document.createElement('div');
    overlay.className = 'cat-status-overlay ' + status;
    overlay.textContent =
      status === 'reserved'
        ? t('cats.statusReserved') || 'Reserved'
        : t('cats.statusSold') || 'Sold';
    photoWrapper.appendChild(overlay);
  }

  const body = document.createElement('div');
  body.className = 'cat-body';

  const topRow = document.createElement('div');
  topRow.className = 'cat-row-top';

  const titleBox = document.createElement('div');
  const nameEl = document.createElement('h3');
  nameEl.className = 'cat-name';
  nameEl.textContent = cat.name || 'Sphynx Kitten';
  const ageEl = document.createElement('div');
  ageEl.className = 'cat-age';
  ageEl.textContent = cat.age || 'Age on request';

  titleBox.appendChild(nameEl);
  titleBox.appendChild(ageEl);

  const priceEl = document.createElement('div');
  priceEl.className = 'cat-price';
  priceEl.textContent = formatPrice(cat.price);

  topRow.appendChild(titleBox);
  topRow.appendChild(priceEl);

  const descEl = document.createElement('p');
  descEl.className = 'cat-description';
  descEl.textContent =
    cat.description ||
    'Elegant sphynx kitten with velvet skin, expressive eyes and balanced temperament.';

  const metaRow = document.createElement('div');
  metaRow.className = 'cat-meta-row';

  const statusMeta = document.createElement('span');
  statusMeta.className = 'cat-meta-pill';

  const dot = document.createElement('span');
  dot.className = 'cat-status-dot';

  statusMeta.appendChild(dot);
  statusMeta.append(
    status === 'active'
      ? t('cats.metaActive') || 'Ready for new home'
      : status === 'reserved'
      ? t('cats.metaReserved') || 'Reservation confirmed'
      : t('cats.metaSold') || 'Placed in loving home'
  );

  metaRow.appendChild(statusMeta);

  // TABBY label в каждой карточке
  const tabbyEl = document.createElement('span');
  tabbyEl.className = 'cat-tabby-label';
  tabbyEl.textContent = 'TABBY';
  metaRow.appendChild(tabbyEl);

  body.appendChild(topRow);
  body.appendChild(descEl);
  body.appendChild(metaRow);

  // Кнопка WhatsApp только для активных котов
  if (status === 'active') {
    const waBtn = document.createElement('a');
    waBtn.href = 'https://wa.me/971556503070';
    waBtn.target = '_blank';
    waBtn.rel = 'noreferrer';
    waBtn.className = 'btn btn-wa cat-wa-btn';
    waBtn.textContent = t('contact.whButton') || 'WhatsApp';
    body.appendChild(waBtn);
  }

  inner.appendChild(photoWrapper);
  inner.appendChild(body);
  wrapper.appendChild(inner);

  wrapper.addEventListener('click', () => openCatModal(cat));

  return wrapper;
}

let catModal;
let catModalOverlay;
let catModalCloseBtn;
let catModalMainPhoto;
let catModalThumbs;
let catModalVideo;
let catModalName;
let catModalStatus;
let catModalAge;
let catModalPrice;
let catModalDescription;

function initCatModal() {
  catModal = document.getElementById('catModal');
  if (!catModal) return;

  catModalOverlay = catModal.querySelector('.cat-modal-overlay');
  catModalCloseBtn = document.getElementById('catModalClose');
  catModalMainPhoto = document.getElementById('catModalMainPhoto');
  catModalThumbs = document.getElementById('catModalThumbs');
  catModalVideo = document.getElementById('catModalVideo');
  catModalName = document.getElementById('catModalName');
  catModalStatus = document.getElementById('catModalStatus');
  catModalAge = document.getElementById('catModalAge');
  catModalPrice = document.getElementById('catModalPrice');
  catModalDescription = document.getElementById('catModalDescription');

  if (catModalOverlay) {
    catModalOverlay.addEventListener('click', closeCatModal);
  }
  if (catModalCloseBtn) {
    catModalCloseBtn.addEventListener('click', closeCatModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCatModal();
    }
  });
}

function openCatModal(cat) {
  if (!catModal) return;

  const status = (cat.status || 'active').toLowerCase();
  const photos =
    Array.isArray(cat.photos) && cat.photos.length > 0
      ? cat.photos
      : [PLACEHOLDER_PHOTO];
  const videos = Array.isArray(cat.videos) ? cat.videos : [];

  if (catModalName) {
    catModalName.textContent = cat.name || 'Sphynx kitten';
  }

  if (catModalStatus) {
    catModalStatus.className = 'cat-modal-status-pill';
    catModalStatus.classList.add(status);
    catModalStatus.textContent =
      status === 'reserved'
        ? t('cats.statusReserved') || 'Reserved'
        : status === 'sold'
        ? t('cats.statusSold') || 'Sold'
        : t('cats.statusAvailable') || 'Available';
  }

  if (catModalAge) {
    catModalAge.textContent = cat.age || 'Age on request';
  }

  if (catModalPrice) {
    catModalPrice.textContent = formatPrice(cat.price);
  }

  if (catModalDescription) {
    catModalDescription.textContent =
      cat.description ||
      'Elegant sphynx kitten with velvet skin, expressive eyes and balanced temperament.';
  }

  if (catModalMainPhoto) {
    catModalMainPhoto.src = photos[0];
    catModalMainPhoto.alt = cat.name || 'Sphynx cat';
  }

  if (catModalThumbs) {
    catModalThumbs.innerHTML = '';
    photos.forEach((src, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'cat-modal-thumb';
      if (index === 0) thumb.classList.add('active');
      const img = document.createElement('img');
      img.src = src;
      img.alt = cat.name || 'Sphynx cat';
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', () => {
        if (catModalMainPhoto) {
          catModalMainPhoto.src = src;
        }
        Array.from(
          catModalThumbs.querySelectorAll('.cat-modal-thumb')
        ).forEach((el) => el.classList.remove('active'));
        thumb.classList.add('active');
      });
      catModalThumbs.appendChild(thumb);
    });
  }

  if (catModalVideo) {
    catModalVideo.innerHTML = '';
    if (videos.length > 0) {
      const video = document.createElement('video');
      video.className = 'cat-modal-video-player';
      video.src = videos[0];
      video.controls = true;
      video.playsInline = true;
      catModalVideo.appendChild(video);
    }
  }

  // Кнопка WhatsApp в модалке только для активных котов
  const waBtn = document.getElementById('catModalWa');
  if (waBtn) {
    if (status === 'active') {
      waBtn.style.display = 'inline-flex';
      waBtn.onclick = () =>
        window.open('https://wa.me/971556503070', '_blank', 'noreferrer');
    } else {
      waBtn.style.display = 'none';
      waBtn.onclick = null;
    }
  }

  catModal.classList.remove('hidden');
  catModal.setAttribute('aria-hidden', 'false');
}

function closeCatModal() {
  if (!catModal) return;
  catModal.classList.add('hidden');
  catModal.setAttribute('aria-hidden', 'true');
}

async function loadCats() {
  const grid = document.getElementById('cats-grid');
  const emptyState = document.getElementById('cats-empty');
  if (!grid || !emptyState) return;

  grid.innerHTML = '';

  try {
    const response = await fetch('/api/cats');
    if (!response.ok) {
      throw new Error('Failed to load cats');
    }
    const cats = await response.json();

    if (!Array.isArray(cats) || cats.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    const sorted = [...cats].sort((a, b) => {
      const sa = STATUS_ORDER[(a.status || 'active').toLowerCase()] ?? 0;
      const sb = STATUS_ORDER[(b.status || 'active').toLowerCase()] ?? 0;
      if (sa !== sb) return sa - sb;
      return (a.name || '').localeCompare(b.name || '');
    });

    sorted.forEach((cat) => {
      const card = createCatCard(cat);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    emptyState.classList.remove('hidden');
    emptyState.textContent =
      'Unable to load kittens at the moment. Please try again later.';
  }
}

function applyTranslations() {
  const root = document.documentElement;
  root.lang = currentLang;
  root.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  const label = document.querySelector('.lang-label');
  if (label) {
    label.textContent = t('lang.label') || 'Language';
  }

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (value) el.textContent = value;
  });
}

function initLangSwitcher() {
  const switcher = document.getElementById('langSwitcher');
  if (!switcher) return;

  switcher.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (!lang || !I18N[lang]) return;
    currentLang = lang;

    Array.from(switcher.querySelectorAll('.lang-btn')).forEach((b) =>
      b.classList.toggle('lang-active', b === btn)
    );

    applyTranslations();
    loadCats();
  });
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initCatModal();
  applyTranslations();
  initLangSwitcher();
  loadCats();
});


