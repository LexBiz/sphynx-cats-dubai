## Hetzner deploy (no rollbacks)

### Golden rule
**Never edit site files on the server manually** (except Nginx configs).  
Only deploy via `git pull` from the `hetzner` branch and restart PM2.

### Why rollbacks happen
- You deployed another branch/commit by mistake
- Browser cache kept old `styles.css`/`script.js` (we use `?v=` to bust cache)
- Manual edits on the server were overwritten by the next `git pull`

### Safe deploy steps
On the server:

```bash
cd /var/www/sphynx-cats
git fetch origin
git checkout hetzner
git reset --hard origin/hetzner
npm ci --omit=dev
pm2 restart sphynx-cats
```

### Check what is running (debug)
```bash
cd /var/www/sphynx-cats
git rev-parse --short HEAD
pm2 status
pm2 logs sphynx-cats --lines 50
```


