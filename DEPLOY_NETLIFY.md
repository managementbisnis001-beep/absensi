# Deploy ke Netlify DB

Panduan ini sekarang mengikuti stack proyek yang sudah diubah ke:

- Next.js App Router
- Prisma
- NextAuth
- PostgreSQL via Netlify DB / Neon

## 1. Yang berubah dari versi lama

Sebelumnya proyek ini memakai MySQL lokal.

Sekarang Prisma sudah diarahkan ke PostgreSQL:

- runtime memakai `NETLIFY_DATABASE_URL`
- migrasi memakai `NETLIFY_DATABASE_URL_UNPOOLED`

Ini cocok dengan environment variable yang dibuat Netlify DB.

## 2. Database proyek ini sekarang di mana?

Kalau Anda memakai Netlify DB, database-nya sebenarnya adalah PostgreSQL yang ditenagai Neon.

Di Netlify Anda akan melihat minimal 2 variable penting:

- `NETLIFY_DATABASE_URL`
  Dipakai aplikasi saat jalan normal.
- `NETLIFY_DATABASE_URL_UNPOOLED`
  Dipakai Prisma untuk migrasi/schema operation.

## 3. Environment variable yang wajib

Isi yang dibutuhkan aplikasi:

- `NETLIFY_DATABASE_URL`
- `NETLIFY_DATABASE_URL_UNPOOLED`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Template ada di file [.env.example](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/.env.example).

## 4. Cara isi env di Netlify

Masuk ke:

`Project configuration` -> `Environment variables`

Lalu pastikan:

1. `NETLIFY_DATABASE_URL` sudah ada
2. `NETLIFY_DATABASE_URL_UNPOOLED` sudah ada
3. tambahkan `NEXTAUTH_SECRET`
4. tambahkan `NEXTAUTH_URL`

Catatan:

- kalau ada pilihan scope, centang `Builds` dan `Functions`
- jangan simpan secret di file repo
- `NEXTAUTH_URL` harus URL final situs Anda

Contoh:

```env
NEXTAUTH_URL="https://nama-site-anda.netlify.app"
```

## 5. Cara isi env lokal untuk development

Karena Prisma sekarang membaca env Netlify-style, file `.env` lokal Anda juga harus memakai nama yang sama.

Contoh:

```env
NETLIFY_DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"
NETLIFY_DATABASE_URL_UNPOOLED="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="isi-random-panjang"
NEXTAUTH_URL="http://localhost:3000"
```

## 6. Build setting Netlify

File [netlify.toml](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/netlify.toml) sudah disiapkan.

Yang perlu Anda pastikan di dashboard Netlify:

1. jangan pakai `next build && next export`
2. jangan isi publish directory dengan `out`
3. kalau ada setting UI yang bentrok, samakan dengan `netlify.toml`
4. pakai `Private logs`

## 7. Migrasi database PostgreSQL

Setelah env PostgreSQL siap, jalankan migrasi ke database baru.

Urutan aman:

1. isi `.env` lokal dengan `NETLIFY_DATABASE_URL` dan `NETLIFY_DATABASE_URL_UNPOOLED`
2. jalankan:

```bash
bun run db:deploy
```

3. lalu isi admin awal:

```bash
bun run db:seed
```

## 8. Login pertama

Seed default akan membuat akun:

- username: `admin`
- password: `admin123`

Begitu berhasil login, langsung ganti password.

## 9. Urutan deploy paling aman

Ikuti langkah ini:

1. claim/aktifkan Netlify DB Anda
2. pastikan `NETLIFY_DATABASE_URL` dan `NETLIFY_DATABASE_URL_UNPOOLED` ada
3. tambahkan `NEXTAUTH_SECRET`
4. tambahkan `NEXTAUTH_URL`
5. isi `.env` lokal dengan nilai yang sama
6. jalankan `bun run db:deploy`
7. jalankan `bun run db:seed`
8. push perubahan
9. redeploy di Netlify

## 10. Kalau deploy masih gagal

Cek hal berikut:

1. apakah env PostgreSQL terisi
2. apakah `NEXTAUTH_SECRET` sudah ada
3. apakah `NEXTAUTH_URL` sudah sesuai domain final
4. apakah migrasi sudah dijalankan ke database PostgreSQL
5. apakah build command lama `next export` masih tersimpan di UI Netlify

## 11. Catatan penting migrasi

Repo ini sudah diubah dari MySQL ke PostgreSQL.

Artinya:

- migrasi awal sekarang ditujukan untuk PostgreSQL
- database MySQL lama tidak lagi menjadi target utama proyek
- kalau ada data penting di MySQL lama, data itu perlu dipindahkan manual

## 12. Catatan keamanan

Kalau connection string database pernah tampil utuh di screenshot atau log publik:

1. rotate/reset password database
2. update env variable di Netlify
3. update `.env` lokal Anda

## 13. File penting

- Prisma schema: [prisma/schema.prisma](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/prisma/schema.prisma)
- Migration awal PostgreSQL: [prisma/migrations/20260314034924_init/migration.sql](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/prisma/migrations/20260314034924_init/migration.sql)
- Template env: [.env.example](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/.env.example)
