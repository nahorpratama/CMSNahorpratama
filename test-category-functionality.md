# Testing Guide: Category User Management

## Prerequisites
1. Pastikan aplikasi sudah running
2. Pastikan database Supabase sudah terhubung
3. Pastikan kolom `category` sudah ada di tabel `profiles`

## Test Cases

### Test Case 1: Edit User Category
**Objective**: Memverifikasi bahwa field category dapat diupdate dan dialog tertutup setelah simpan

**Steps**:
1. Buka halaman User Management
2. Cari user dengan role HR, Finance, atau Project
3. Klik tombol edit (ikon pensil)
4. Ubah category dari "edit" ke "approval" atau sebaliknya
5. Klik tombol "Simpan"

**Expected Results**:
- ✅ Dialog edit user tertutup otomatis
- ✅ Category user berubah di tabel
- ✅ Badge category terupdate dengan warna yang sesuai
- ✅ Toast notification muncul dengan pesan "Pengguna berhasil diperbarui!"

**Actual Results**:
- [ ] Dialog tertutup
- [ ] Category terupdate
- [ ] Badge terupdate
- [ ] Toast notification muncul

### Test Case 2: Create User dengan Category
**Objective**: Memverifikasi bahwa user baru dapat dibuat dengan category yang benar

**Steps**:
1. Klik tombol "Tambah Pengguna"
2. Isi form dengan data berikut:
   - Nama: "Test User Category"
   - Username: "testcategory"
   - Email: "testcategory@example.com"
   - Password: "password123"
   - Role: "HR" (atau Finance/Project)
   - Category: "approval"
3. Klik tombol "Simpan"

**Expected Results**:
- ✅ Dialog create user tertutup
- ✅ User baru muncul di tabel dengan category "approval"
- ✅ Badge category ditampilkan dengan warna yang sesuai
- ✅ Toast notification muncul dengan pesan "Pengguna berhasil dibuat!"

**Actual Results**:
- [ ] Dialog tertutup
- [ ] User baru muncul
- [ ] Category badge ditampilkan
- [ ] Toast notification muncul

### Test Case 3: Filter User berdasarkan Category
**Objective**: Memverifikasi bahwa filter category berfungsi dengan baik

**Steps**:
1. Di halaman User Management, lihat dropdown filter category
2. Pilih "User Approval" dari dropdown
3. Verifikasi hanya user dengan category "approval" yang ditampilkan
4. Pilih "User Edit" dari dropdown
5. Verifikasi hanya user dengan category "edit" yang ditampilkan
6. Pilih "Semua Kategori" untuk menampilkan semua user

**Expected Results**:
- ✅ Filter "User Approval" menampilkan user dengan category "approval"
- ✅ Filter "User Edit" menampilkan user dengan category "edit"
- ✅ Filter "Semua Kategori" menampilkan semua user

**Actual Results**:
- [ ] Filter approval berfungsi
- [ ] Filter edit berfungsi
- [ ] Filter semua kategori berfungsi

### Test Case 4: Category Badge Rendering
**Objective**: Memverifikasi bahwa category badge ditampilkan dengan benar

**Steps**:
1. Periksa tabel user di User Management
2. Identifikasi user dengan role HR, Finance, atau Project
3. Verifikasi category badge ditampilkan
4. Periksa warna badge sesuai dengan category

**Expected Results**:
- ✅ User dengan role HR/Finance/Project menampilkan category badge
- ✅ User dengan role Admin tidak menampilkan category badge
- ✅ Badge "User Edit" berwarna orange
- ✅ Badge "User Approval" berwarna teal

**Actual Results**:
- [ ] Badge ditampilkan untuk role yang sesuai
- [ ] Badge tidak ditampilkan untuk role admin
- [ ] Warna badge sesuai dengan design

## Error Scenarios

### Error Case 1: Category Update Gagal
**Steps**:
1. Coba update user dengan data yang tidak valid
2. Periksa console browser untuk error
3. Periksa network tab untuk response dari API

**Expected Results**:
- ✅ Error message ditampilkan dengan jelas
- ✅ Dialog tidak tertutup jika update gagal
- ✅ Form data tidak hilang

### Error Case 2: Database Connection Error
**Steps**:
1. Matikan koneksi internet
2. Coba update user category
3. Periksa error handling

**Expected Results**:
- ✅ Error message yang informatif
- ✅ User tidak kehilangan data yang sudah diinput

## Performance Testing

### Performance Case 1: Load Time
**Objective**: Memverifikasi bahwa halaman User Management load dengan cepat

**Steps**:
1. Buka halaman User Management
2. Catat waktu loading
3. Periksa apakah ada delay yang signifikan

**Expected Results**:
- ✅ Halaman load dalam waktu < 3 detik
- ✅ Tidak ada delay yang signifikan

### Performance Case 2: Update Response Time
**Objective**: Memverifikasi bahwa update user category berlangsung cepat

**Steps**:
1. Edit user category
2. Klik simpan
3. Catat waktu response

**Expected Results**:
- ✅ Update berlangsung dalam waktu < 2 detik
- ✅ Feedback visual yang responsif

## Browser Compatibility

### Test di Browser Berbeda:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Responsiveness

### Test di Device Berbeda:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Notes
- Catat semua hasil testing di kolom "Actual Results"
- Jika ada error, screenshot dan catat detail errornya
- Test di environment yang berbeda (development, staging, production)
- Verifikasi bahwa semua perubahan tersimpan di database