# Solusi Masalah Category pada User Management

## Masalah
Pada UserManagement component saat ini, ketika edit user dengan role HR, Finance, dan Project tidak dapat disimpan ke database Supabase karena field `category` belum ada di tabel `profiles`.

## Solusi yang Diterapkan

### 1. Menambahkan Kolom Category ke Tabel Profiles

Jalankan script SQL berikut di Supabase SQL Editor:

```sql
-- Tambahkan kolom category jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'category'
    ) THEN
        ALTER TABLE profiles ADD COLUMN category VARCHAR(50);
        RAISE NOTICE 'Kolom category berhasil ditambahkan ke tabel profiles';
    ELSE
        RAISE NOTICE 'Kolom category sudah ada di tabel profiles';
    END IF;
END $$;

-- Update user yang sudah ada dengan category default
UPDATE profiles 
SET category = 'edit' 
WHERE role IN ('hr', 'finance', 'project') 
  AND (category IS NULL OR category = '');
```

### 2. Update Supabase Adapter

File `src/services/supabaseAdapter.js` telah diupdate untuk:
- Mengambil field `category` saat `getAllUsers()`
- Mengambil field `category` saat `getUserProfile()`

### 3. Struktur Data

Setelah update, struktur tabel `profiles` akan menjadi:
```sql
profiles (
  id UUID PRIMARY KEY,
  username VARCHAR,
  name VARCHAR,
  role VARCHAR,
  permissions TEXT[],
  category VARCHAR(50),  -- Kolom baru
  -- kolom lainnya...
)
```

### 4. Nilai Category yang Didukung

Saat ini sistem mendukung 2 nilai category:
- `'edit'` - User dengan permission edit
- `'approval'` - User dengan permission approval

### 5. Cara Penggunaan

1. **Jalankan script SQL** di Supabase untuk menambah kolom
2. **Restart aplikasi** agar perubahan ter-load
3. **Edit user** dengan role HR, Finance, atau Project
4. **Pilih category** dari dropdown (edit/approval)
5. **Simpan** - sekarang akan berhasil tersimpan ke database

## Testing

Setelah implementasi, test dengan:
1. Buat user baru dengan role HR/Finance/Project
2. Edit user existing dengan role tersebut
3. Pastikan field category tersimpan dan ter-load dengan benar

## Catatan

- Field `category` hanya relevan untuk role HR, Finance, dan Project
- Role Admin tidak memerlukan category
- Jika category kosong, akan di-set default ke 'edit'
- Perubahan ini backward compatible dengan data existing