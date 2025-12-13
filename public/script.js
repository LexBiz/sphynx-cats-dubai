const STATUS_ORDER = {
  active: 0,
  reserved: 1,
  sold: 2,
};

const PLACEHOLDER_PHOTO =
  'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800';

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
    statusPill.textContent = 'Available';
  } else if (status === 'reserved') {
    statusPill.classList.add('cat-status-reserved');
    statusPill.textContent = 'Reserved';
  } else {
    statusPill.classList.add('cat-status-sold');
    statusPill.textContent = 'Sold';
  }
  photoWrapper.appendChild(statusPill);

  if (status === 'reserved' || status === 'sold') {
    const overlay = document.createElement('div');
    overlay.className = 'cat-status-overlay ' + status;
    overlay.textContent = status === 'reserved' ? 'Reserved' : 'Sold';
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
      ? 'Ready for new home'
      : status === 'reserved'
      ? 'Reservation confirmed'
      : 'Placed in loving home'
  );

  metaRow.appendChild(statusMeta);

  body.appendChild(topRow);
  body.appendChild(descEl);
  body.appendChild(metaRow);

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
        ? 'Reserved'
        : status === 'sold'
        ? 'Sold'
        : 'Available';
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
    // Показываем всех котов (active + reserved + sold)
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

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initCatModal();
  loadCats();
});


