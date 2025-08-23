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

### 5. Update Supabase Edge Functions

Supabase Edge Functions telah diupdate untuk menangani field `category`:

**File yang dibuat:**
- `supabase-functions/create-user/index.ts` - Function untuk create user
- `supabase-functions/update-user/index.ts` - Function untuk update user

**Deploy functions:**
```bash
# Install Supabase CLI jika belum ada
npm install -g supabase

# Login ke Supabase
supabase login

# Deploy functions
./deploy-functions.sh
```

### 6. Cara Penggunaan

1. **Jalankan script SQL** di Supabase untuk menambah kolom
2. **Deploy Edge Functions** untuk create/update user
3. **Restart aplikasi** agar perubahan ter-load
4. **Tambah user baru** dengan role HR, Finance, atau Project ✅
5. **Edit user existing** dengan role tersebut ✅
6. **Pilih category** dari dropdown (edit/approval)
7. **Simpan** - sekarang akan berhasil tersimpan ke database

## Testing

Setelah implementasi, test dengan:
1. **Buat user baru** dengan role HR/Finance/Project dan pilih category ✅
2. **Edit user existing** dengan role tersebut dan ubah category ✅
3. **Pastikan field category tersimpan** dan ter-load dengan benar
4. **Verifikasi di database** bahwa field category tersimpan

## File Implementasi

### Database Schema
- `add_category_column.sql` - Script untuk tambah kolom category
- `supabase_chat_schema.sql` - Schema lengkap (updated)

### Supabase Edge Functions  
- `supabase-functions/create-user/index.ts` - Create user dengan category
- `supabase-functions/update-user/index.ts` - Update user dengan category
- `deploy-functions.sh` - Script deploy functions

### Frontend Updates
- `src/services/supabaseAdapter.js` - Updated untuk field category

## Catatan

- Field `category` hanya relevan untuk role HR, Finance, dan Project
- Role Admin tidak memerlukan category
- Jika category kosong, akan di-set default ke 'edit'
- Perubahan ini backward compatible dengan data existing