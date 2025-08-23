# Setup Database - Corporate Management System

## Langkah 1: Setup Supabase Project

1. Buka [Supabase](https://supabase.com)
2. Login atau buat akun baru
3. Klik "New Project"
4. Pilih organization
5. Masukkan nama project: `cms-nahorpratama`
6. Masukkan database password (simpan password ini!)
7. Pilih region terdekat (Asia Southeast)
8. Klik "Create new project"
9. Tunggu project selesai dibuat (5-10 menit)

## Langkah 2: Setup Authentication

1. Di Supabase Dashboard, buka tab "Authentication"
2. Klik "Settings"
3. Di bagian "Site URL", masukkan: `http://localhost:5173`
4. Di bagian "Redirect URLs", tambahkan:
   - `http://localhost:5173/dashboard`
   - `http://localhost:5173/login`
5. Klik "Save"

## Langkah 3: Setup Database Schema

### 3.1 Jalankan SQL untuk Profiles Table

1. Buka tab "SQL Editor" di Supabase
2. Copy dan paste isi file `supabase_profiles_schema.sql`
3. Klik "Run" untuk menjalankan script

### 3.2 Jalankan SQL untuk Chat System

1. Copy dan paste isi file `supabase_chat_schema.sql`
2. Klik "Run" untuk menjalankan script

### 3.3 Verifikasi Tables

1. Buka tab "Table Editor"
2. Pastikan tabel berikut sudah dibuat:
   - `profiles`
   - `equipment`
   - `group_chats`
   - `group_members`
   - `messages`

## Langkah 4: Setup Storage

1. Buka tab "Storage"
2. Pastikan bucket `chat-files` sudah dibuat
3. Jika belum, buat bucket baru dengan nama `chat-files`
4. Set bucket sebagai public

## Langkah 5: Setup RLS Policies

### 5.1 Profiles Table Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 5.2 Equipment Table Policies

```sql
-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Everyone can view equipment
CREATE POLICY "Everyone can view equipment" ON equipment
  FOR SELECT USING (true);

-- Only admins and project managers can modify equipment
CREATE POLICY "Admins and project managers can modify equipment" ON equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'project')
    )
  );
```

## Langkah 6: Create Test Users

### 6.1 Create Users via Supabase Auth

1. Buka tab "Authentication" → "Users"
2. Klik "Add User"
3. Buat user dengan email berikut:

#### Admin User
- Email: `admin@nahorpratama.com`
- Password: `admin123`
- User Metadata: `{"full_name": "Administrator"}`

#### Finance User
- Email: `finance@nahorpratama.com`
- Password: `finance123`
- User Metadata: `{"full_name": "Finance Manager"}`

#### HR User
- Email: `hr@nahorpratama.com`
- Password: `hr123`
- User Metadata: `{"full_name": "HR Manager"}`

#### Project User
- Email: `project@nahorpratama.com`
- Password: `project123`
- User Metadata: `{"full_name": "Project Manager"}`

### 6.2 Insert User Profiles

Setelah user dibuat, jalankan SQL berikut untuk insert profiles:

```sql
-- Insert admin profile
INSERT INTO profiles (id, username, name, role, permissions) 
SELECT 
  id, 
  'admin', 
  'Administrator', 
  'admin', 
  ARRAY['all']
FROM auth.users 
WHERE email = 'admin@nahorpratama.com';

-- Insert finance profile
INSERT INTO profiles (id, username, name, role, permissions) 
SELECT 
  id, 
  'finance', 
  'Finance Manager', 
  'finance', 
  ARRAY['finance_reports', 'finance_transactions', 'chat']
FROM auth.users 
WHERE email = 'finance@nahorpratama.com';

-- Insert HR profile
INSERT INTO profiles (id, username, name, role, permissions) 
SELECT 
  id, 
  'hr', 
  'HR Manager', 
  'hr', 
  ARRAY['hr_management', 'recruitment', 'chat']
FROM auth.users 
WHERE email = 'hr@nahorpratama.com';

-- Insert project profile
INSERT INTO profiles (id, username, name, role, permissions) 
SELECT 
  id, 
  'project', 
  'Project Manager', 
  'project', 
  ARRAY['project_management', 'tasks', 'project_transactions', 'procurement_management', 'chat']
FROM auth.users 
WHERE email = 'project@nahorpratama.com';
```

## Langkah 7: Update Environment Variables

1. Copy Supabase URL dari project settings
2. Copy Supabase Anon Key dari project settings
3. Update file `src/lib/customSupabaseClient.js`:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

## Langkah 8: Test Database Connection

1. Jalankan aplikasi: `npm run dev`
2. Buka browser dan buka `http://localhost:5173`
3. Coba login dengan salah satu user test
4. Periksa console browser untuk error
5. Periksa Network tab untuk API calls

## Langkah 9: Troubleshooting

### Error: "relation 'profiles' does not exist"
- Pastikan SQL script sudah dijalankan
- Periksa nama tabel di SQL Editor

### Error: "permission denied"
- Periksa RLS policies
- Pastikan user sudah login
- Periksa role user di database

### Error: "invalid email or password"
- Periksa email dan password user
- Periksa tabel profiles

### Error: "network error"
- Periksa Supabase URL dan API Key
- Periksa internet connection
- Periksa Supabase project status

## Langkah 10: Verification

Setelah setup selesai, pastikan:

1. ✅ Aplikasi bisa diakses di `http://localhost:5173`
2. ✅ Login berfungsi dengan semua user test
3. ✅ Redirect ke dashboard berfungsi
4. ✅ Menu sesuai role user
5. ✅ Tidak ada error di console
6. ✅ Database connection berfungsi
7. ✅ RLS policies berfungsi

## Notes

- Simpan semua password dan credentials dengan aman
- Jangan commit credentials ke Git
- Gunakan environment variables untuk production
- Backup database secara berkala
- Monitor usage dan performance di Supabase dashboard