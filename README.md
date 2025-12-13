## Premium Sphynx Cats Landing (Node.js + Admin)

Одностраничный премиальный сайт для продажи котов породы сфинкс с админкой, JSON-хранилищем и загрузкой фото.

### 1. Установка

```bash
npm install
```

Создайте файл `.env` в корне проекта:

```bash
PORT=3000
ADMIN_PASSWORD=your_strong_password_here
```

### 2. Запуск

```bash
# development (c авто‑перезапуском)
npm run dev

# production
npm start
```

Сервер поднимется на `http://localhost:3000`.

- Публичный сайт: `http://localhost:3000/`
- Админка: `http://localhost:3000/admin/`

### 2.1. Быстрый деплой на Render

В репозиторий уже добавлен файл `render.yaml`, который описывает веб‑сервис.

1. Закоммитьте код в GitHub.
2. На `render.com` выберите **"New" → "Blueprint"** и укажите ссылку на репозиторий.
3. Render прочитает `render.yaml` и создаст сервис:
   - build: `npm install`
   - start: `npm start`
4. В настройках сервиса добавьте переменную окружения:
   - `ADMIN_PASSWORD` → ваш пароль админа.
5. После деплоя:
   - публичный сайт: `https://ВАШ-СЕРВИС.onrender.com/`
   - админка: `https://ВАШ-СЕРВИС.onrender.com/admin/`

### 3. Структура проекта

- `public/` — публичный фронтенд (одностраничник, стили, JS, загруженные фото)
- `admin/` — админ‑панель (HTML + JS + стили)
- `data/cats.json` — JSON‑база с котами
- `server.js` — Node.js + Express сервер, API и статика

### 4. Авторизация в админке

- Пароль хранится в `.env` (`ADMIN_PASSWORD`).
- В админке введите этот пароль — он будет отправлен на `/api/admin/login`.
- Все CRUD и загрузка фото требуют заголовок `x-admin-password` (ставится автоматически после логина).

### 5. API

- `GET /api/cats` — список котов (чтение `data/cats.json`)
- `POST /api/cats` — создать кота (тело JSON, требуется админ)
- `PUT /api/cats/:id` — обновить кота (тело JSON, требуется админ)
- `DELETE /api/cats/:id` — удалить кота (требуется админ)
- `POST /api/upload` — загрузка до 5 фото (поле `photos`, multipart/form-data, требуется админ). Файлы кладутся в `public/uploads/`, путь вида `/uploads/xxx.jpg`.

Статус кота: `active | reserved | sold`. Порядок вывода на главной: Active → Reserved → Sold.


