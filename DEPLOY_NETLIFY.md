# Deploy ke Netlify

Panduan ini dibuat untuk proyek ini apa adanya: Next.js App Router + Prisma + NextAuth + MySQL.

## 1. Pahami dulu kenapa deploy Anda gagal

Ada 3 penyebab utama:

1. Netlify Anda masih menjalankan `next build && next export`.
2. Proyek ini punya API route dan auth, jadi tidak bisa dipasang sebagai static export.
3. `DATABASE_URL` Anda masih menunjuk ke `localhost`, padahal Netlify tidak bisa mengakses database di laptop Anda.

## 2. Database proyek ini ada di mana?

Saat ini database Anda ada di mesin lokal sendiri, karena file `.env` memakai `localhost`.

Contoh saat ini:

```env
DATABASE_URL="mysql://root@localhost:3306/absensi"
```

Artinya:

- `mysql`
  Jenis database yang dipakai adalah MySQL.
- `localhost:3306`
  Database ada di komputer Anda sendiri.
- `absensi`
  Nama databasenya.

Kalau aplikasi mau online di Netlify, database harus dipindahkan ke layanan MySQL yang bisa diakses dari internet. Netlify tidak menyediakan database MySQL internal untuk aplikasi ini.

## 3. Rekomendasi bentuk database production

Untuk proyek ini, pilih database **MySQL managed/hosted**. Jangan ganti provider dulu kalau Anda masih pemula, karena schema Prisma proyek ini memang sudah memakai `mysql`.

Yang Anda butuhkan hanyalah 1 hal:

- connection string MySQL production, formatnya seperti ini:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/NAMA_DATABASE"
```

## 4. Environment variable yang wajib

Masukkan variable ini di Netlify:

- `DATABASE_URL`
  Isi dengan URL database MySQL online Anda.
- `NEXTAUTH_SECRET`
  Isi dengan string random panjang.
- `NEXTAUTH_URL`
  Isi dengan URL final situs Anda, misalnya `https://nama-site-anda.netlify.app`

Template ada di file [.env.example](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/.env.example).

## 5. Cara isi Environment Variables di Netlify

Masuk ke:

`Project configuration` -> `Environment variables`

Lalu tambahkan 3 variable tadi satu per satu.

Catatan penting:

- kalau Netlify menampilkan pilihan scope, centang `Builds` dan `Functions`
- jangan simpan secret di `netlify.toml`
- simpan secret hanya di UI Netlify
- kalau password database punya karakter aneh seperti `@`, `:`, atau `/`, biasanya harus di-URL-encode

## 6. Setting Netlify yang benar

File [netlify.toml](/c:/Users/AKUN%20PT%20MISCOMPUTERS/Downloads/workspace-90e77287-b70c-4373-b0b5-d4e2f3332867%20(1)/netlify.toml) sudah saya tambahkan.

Isi utamanya:

- build command: `npx prisma generate && npx next build`
- Prisma client dibawa ke serverless function Netlify

Di dashboard Netlify, ubah juga setting lama Anda:

1. Hapus build command lama `next build && next export`
2. Jangan pakai `out` sebagai publish directory untuk proyek ini
3. Kalau ada setting lama di UI yang bentrok, samakan dengan file `netlify.toml`
4. Ubah deploy log visibility ke `Private logs`

## 7. Migrasi database production

Setelah Anda punya database MySQL online, jalankan migrasi ke database tersebut.

Langkah aman:

1. Salin dulu connection string database production
2. Ganti sementara `DATABASE_URL` lokal Anda ke URL production
3. Jalankan:

```bash
bun run db:deploy
```

4. Lalu isi data admin awal:

```bash
bun run db:seed
```

5. Setelah selesai, deploy ulang ke Netlify

## 8. Login pertama

File seed akan membuat akun default:

- username: `admin`
- password: `admin123`

Segera ganti password setelah login pertama.

## 9. Urutan deploy paling aman untuk pemula

Ikuti urutan ini:

1. Siapkan database MySQL online
2. Ambil `DATABASE_URL`
3. Isi `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL` di Netlify
4. Jalankan `bun run db:deploy`
5. Jalankan `bun run db:seed`
6. Push/commit perubahan terbaru
7. Redeploy di Netlify

## 10. Kalau deploy masih gagal

Cek 5 hal ini:

1. Apakah build command masih `next export`
2. Apakah `DATABASE_URL` masih `localhost`
3. Apakah `NEXTAUTH_SECRET` sudah ada
4. Apakah migrasi production sudah dijalankan
5. Apakah Netlify masih memakai log publik

## 11. Catatan keamanan penting

Sebelum deploy, proyek ini sudah saya perbaiki agar:

- route API tidak bisa lagi dipanggil tanpa login
- route manajemen user/data master dibatasi ke admin
- kredensial default tidak tampil di halaman login saat production
- debug log login sensitif tidak ikut tercetak

Kalau Anda mau, langkah berikutnya saya bisa bantu sampai tuntas untuk:

1. memilih database hosting yang paling cocok
2. menyiapkan environment variable satu per satu
3. membersihkan file `.env` Anda
4. membuat checklist deploy final sampai benar-benar live
