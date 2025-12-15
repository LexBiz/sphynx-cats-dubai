let ADMIN_PASSWORD = null;

const STATUS_ORDER = {
  active: 0,
  reserved: 1,
  sold: 2,
};

const MAX_PHOTO_FILES = 5;
const MAX_VIDEO_FILES = 2;
// Must be <= server multer limit
const MAX_VIDEO_MB = 200;
const MAX_PHOTO_MB = 20;

function setFormMessage(message) {
  const msg = document.getElementById('formMessage');
  if (!msg) return;
  msg.textContent = message || '';
  if (message) {
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function setFormBusy(isBusy, message) {
  const form = document.getElementById('catForm');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select, textarea, button');
  inputs.forEach((el) => {
    if (el === submitBtn) return;
    el.disabled = Boolean(isBusy);
  });
  if (submitBtn) {
    submitBtn.disabled = Boolean(isBusy);
    submitBtn.textContent = isBusy ? 'Завантаження…' : 'Зберегти кота';
  }
  if (typeof message === 'string') setFormMessage(message);
}

function validateSelectedFiles(photoFiles, videoFiles) {
  const errors = [];

  if (photoFiles && photoFiles.length > MAX_PHOTO_FILES) {
    errors.push(`Фото: максимум ${MAX_PHOTO_FILES} файлів.`);
  }
  if (videoFiles && videoFiles.length > MAX_VIDEO_FILES) {
    errors.push(`Відео: максимум ${MAX_VIDEO_FILES} файлів.`);
  }

  if (photoFiles) {
    for (const f of Array.from(photoFiles)) {
      if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
        errors.push(`Фото "${f.name}" завелике (>${MAX_PHOTO_MB}MB).`);
      }
    }
  }

  if (videoFiles) {
    for (const f of Array.from(videoFiles)) {
      if (f.size > MAX_VIDEO_MB * 1024 * 1024) {
        errors.push(`Відео "${f.name}" завелике (>${MAX_VIDEO_MB}MB).`);
      }
    }
  }

  return errors;
}

function setLoggedIn(loggedIn) {
  const loginSection = document.getElementById('loginSection');
  const adminSection = document.getElementById('adminSection');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!loginSection || !adminSection || !logoutBtn) return;

  if (loggedIn) {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loadCats();
  } else {
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    ADMIN_PASSWORD = null;
    sessionStorage.removeItem('adminPassword');
  }
}

async function login(password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Login failed');
  }

  return res.json();
}

async function apiFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    'x-admin-password': ADMIN_PASSWORD || '',
  };
  return fetch(url, { ...options, headers });
}

function renderCatsTable(cats) {
  const tbody = document.getElementById('catsTableBody');
  const empty = document.getElementById('catsTableEmpty');
  if (!tbody || !empty) return;

  tbody.innerHTML = '';

  if (!Array.isArray(cats) || cats.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  const sorted = [...cats].sort((a, b) => {
    const sa = STATUS_ORDER[(a.status || 'active').toLowerCase()] ?? 0;
    const sb = STATUS_ORDER[(b.status || 'active').toLowerCase()] ?? 0;
    if (sa !== sb) return sa - sb;
    return (a.name || '').localeCompare(b.name || '');
  });

  for (const cat of sorted) {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.textContent = cat.name || '—';

    const ageTd = document.createElement('td');
    ageTd.textContent = cat.age || '—';

    const priceTd = document.createElement('td');
    priceTd.textContent = cat.price || '—';

    const statusTd = document.createElement('td');
    const sp = document.createElement('span');
    const status = (cat.status || 'active').toLowerCase();
    sp.className = `status-pill ${status}`;
    sp.textContent =
      status === 'reserved'
        ? 'Зарезервований'
        : status === 'sold'
        ? 'Проданий'
        : 'Активний';
    statusTd.appendChild(sp);

    const photosTd = document.createElement('td');
    const count = Array.isArray(cat.photos) ? cat.photos.length : 0;
    const span = document.createElement('span');
    span.className = 'photos-count';
    span.textContent = `${count} фото`;
    photosTd.appendChild(span);

    const actionsTd = document.createElement('td');
    actionsTd.className = 'row-actions';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn-ghost small';
    editBtn.textContent = 'Редагувати';
    editBtn.addEventListener('click', () => fillForm(cat));
    actionsTd.appendChild(editBtn);

    tr.appendChild(nameTd);
    tr.appendChild(ageTd);
    tr.appendChild(priceTd);
    tr.appendChild(statusTd);
    tr.appendChild(photosTd);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  }
}

async function loadCats() {
  try {
    const res = await apiFetch('/api/cats');
    if (!res.ok) throw new Error('Failed to load cats');
    const data = await res.json();
    renderCatsTable(data);
  } catch (err) {
    console.error(err);
  }
}

function clearForm() {
  const form = document.getElementById('catForm');
  const formTitle = document.getElementById('formTitle');
  const deleteBtn = document.getElementById('deleteBtn');
  const msg = document.getElementById('formMessage');
  const preview = document.getElementById('photoPreview');
  if (!form || !formTitle || !deleteBtn || !msg || !preview) return;

  form.reset();
  formTitle.textContent = 'Створити / Редагувати кота';
  deleteBtn.classList.add('hidden');
  msg.textContent = '';
  preview.innerHTML = '';
  document.getElementById('catId').value = '';
}

function fillForm(cat) {
  const formTitle = document.getElementById('formTitle');
  const deleteBtn = document.getElementById('deleteBtn');
  const preview = document.getElementById('photoPreview');
  if (!formTitle || !deleteBtn || !preview) return;

  document.getElementById('catId').value = cat.id || '';
  document.getElementById('name').value = cat.name || '';
  document.getElementById('age').value = cat.age || '';
  document.getElementById('price').value = cat.price || '';
  document.getElementById('status').value = (cat.status || 'active').toLowerCase();
  document.getElementById('description').value = cat.description || '';

  formTitle.textContent = `Редагувати: ${cat.name || 'Кіт'}`;
  deleteBtn.classList.remove('hidden');

  preview.innerHTML = '';
  if (Array.isArray(cat.photos)) {
    cat.photos.forEach((src) => {
      const div = document.createElement('div');
      div.className = 'photo-thumb';
      const img = document.createElement('img');
      img.src = src;
      img.alt = cat.name || 'Cat photo';
      img.loading = 'lazy';
      div.appendChild(img);
      preview.appendChild(div);
    });
  }
}

async function uploadMedia(photoFiles, videoFiles) {
  const havePhotos = photoFiles && photoFiles.length > 0;
  const haveVideos = videoFiles && videoFiles.length > 0;

  if (!havePhotos && !haveVideos) {
    return { photos: [], videos: [] };
  }

  const validationErrors = validateSelectedFiles(photoFiles, videoFiles);
  if (validationErrors.length) {
    throw new Error(validationErrors.join(' '));
  }

  const formData = new FormData();

  if (havePhotos) {
    Array.from(photoFiles)
      .slice(0, MAX_PHOTO_FILES)
      .forEach((file) => formData.append('photos', file));
  }

  if (haveVideos) {
    Array.from(videoFiles)
      .slice(0, MAX_VIDEO_FILES)
      .forEach((file) => formData.append('videos', file));
  }

  const res = await apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let message = `Помилка завантаження файлів (HTTP ${res.status}).`;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      message = data.message || message;
    } else {
      const text = await res.text().catch(() => '');
      if (text && text.trim()) {
        message = `${message} ${text.trim().slice(0, 160)}`;
      }
    }
    throw new Error(message);
  }

  const data = await res.json();
  return {
    photos: data.photos || [],
    videos: data.videos || [],
  };
}

async function saveCat() {
  const id = document.getElementById('catId').value || null;
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const price = document.getElementById('price').value.trim();
  const status = document.getElementById('status').value;
  const description = document.getElementById('description').value.trim();
  const photosInput = document.getElementById('photos');
  const videosInput = document.getElementById('videos');

  setFormMessage('');

  if (!name || !age || !price) {
    setFormMessage('Заповніть обовʼязкові поля: імʼя, вік, ціна.');
    return;
  }
  // server.js requires description (empty string treated as missing)
  if (!description) {
    setFormMessage('Опис є обовʼязковим полем.');
    return;
  }

  const payload = {
    name,
    age,
    price,
    description,
    status,
  };

  try {
    setFormBusy(true, 'Підготовка…');

    const havePhotos = photosInput && photosInput.files && photosInput.files.length > 0;
    const haveVideos = videosInput && videosInput.files && videosInput.files.length > 0;

    if (havePhotos || haveVideos) {
      setFormMessage('Завантаження файлів… (це може зайняти 10–60 сек)');
      const media = await uploadMedia(
        havePhotos ? photosInput.files : null,
        haveVideos ? videosInput.files : null
      );
      if (media.photos.length) payload.photos = media.photos;
      if (media.videos.length) payload.videos = media.videos;
    }

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/cats/${encodeURIComponent(id)}` : '/api/cats';

    setFormMessage('Збереження…');
    const res = await apiFetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Не вдалося зберегти кота');
    }

    await res.json();
    setFormMessage('Успішно збережено.');
    photosInput.value = '';
    if (videosInput) videosInput.value = '';
    await loadCats();
  } catch (err) {
    console.error(err);
    setFormMessage(err.message || 'Помилка під час збереження кота.');
  } finally {
    setFormBusy(false);
  }
}

async function deleteCat() {
  const id = document.getElementById('catId').value || null;
  const msg = document.getElementById('formMessage');
  if (!id) {
    msg.textContent = 'Кіт не вибраний.';
    return;
  }

  if (!confirm('Видалити цього кота назавжди?')) return;

  try {
    const res = await apiFetch(`/api/cats/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Не вдалося видалити кота');
    }
    await res.json();
    msg.textContent = 'Видалено.';
    clearForm();
    await loadCats();
  } catch (err) {
    console.error(err);
    msg.textContent = err.message || 'Помилка під час видалення кота.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedPassword = sessionStorage.getItem('adminPassword');
  if (savedPassword) {
    ADMIN_PASSWORD = savedPassword;
    setLoggedIn(true);
  } else {
    setLoggedIn(false);
  }

  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const catForm = document.getElementById('catForm');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const pwdInput = document.getElementById('adminPassword');
      const password = pwdInput.value.trim();
      if (!password) {
        loginError.textContent = 'Пароль є обовʼязковим.';
        return;
      }

      try {
        await login(password);
        ADMIN_PASSWORD = password;
        sessionStorage.setItem('adminPassword', password);
        setLoggedIn(true);
      } catch (err) {
        console.error(err);
        loginError.textContent = err.message || 'Невірний пароль.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setLoggedIn(false);
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadCats());
  }

  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCat();
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => clearForm());
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => deleteCat());
  }
});


