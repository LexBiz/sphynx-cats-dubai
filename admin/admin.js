let ADMIN_PASSWORD = null;

const STATUS_ORDER = {
  active: 0,
  reserved: 1,
  sold: 2,
};

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
  const form = document.getElementById('catForm');
  const formTitle = document.getElementById('formTitle');
  const deleteBtn = document.getElementById('deleteBtn');
  const preview = document.getElementById('photoPreview');
  if (!form || !formTitle || !deleteBtn || !preview) return;

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

  // На телефонах переносим фокус к форме, чтобы было видно, что кот выбран
  try {
    setTimeout(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  } catch (_) {
    // ignore
  }
}

async function uploadMedia(photoFiles, videoFiles) {
  if ((!photoFiles || photoFiles.length === 0) && (!videoFiles || videoFiles.length === 0)) {
    return { photos: [], videos: [] };
  }

  const formData = new FormData();
  Array.from(photoFiles || [])
    .slice(0, 5)
    .forEach((file) => formData.append('photos', file));
  Array.from(videoFiles || [])
    .slice(0, 2)
    .forEach((file) => formData.append('videos', file));

  const res = await apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Помилка завантаження файлів');
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
  const msg = document.getElementById('formMessage');

  msg.textContent = '';

  if (!name || !age || !price) {
    msg.textContent = 'Заповніть обовʼязкові поля: імʼя, вік, ціна.';
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
    let uploadedPhotos = [];
    let uploadedVideos = [];
    if (
      (photosInput.files && photosInput.files.length > 0) ||
      (videosInput && videosInput.files && videosInput.files.length > 0)
    ) {
      const media = await uploadMedia(photosInput.files, videosInput ? videosInput.files : null);
      uploadedPhotos = media.photos;
      uploadedVideos = media.videos;
      if (uploadedPhotos.length) {
        payload.photos = uploadedPhotos;
      }
      if (uploadedVideos.length) {
        payload.videos = uploadedVideos;
      }
    }

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/cats/${encodeURIComponent(id)}` : '/api/cats';

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
    msg.textContent = 'Успішно збережено.';
    photosInput.value = '';
    if (videosInput) videosInput.value = '';
    await loadCats();
  } catch (err) {
    console.error(err);
    msg.textContent = err.message || 'Помилка під час збереження кота.';
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


