# Corporate Management System (CMS)

Sistem manajemen korporat terpadu dengan role-based access control untuk admin, keuangan, HR, dan proyek.

## Fitur Utama

- **Role-based Access Control**: Admin, Finance, HR, dan Project Manager
- **Dashboard Terpisah**: Setiap role memiliki dashboard khusus
- **Manajemen Pengguna**: Admin dapat mengelola semua user
- **Sistem Chat**: Komunikasi real-time antar user
- **Procurement Management**: Manajemen peralatan dan pengadaan
- **Responsive Design**: Mendukung desktop dan mobile

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Routing**: React Router DOM

## Setup dan Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd corporate-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Supabase
1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan Anon Key dari project settings
3. Update file `src/lib/customSupabaseClient.js` dengan credentials Anda

### 4. Setup Database
Jalankan SQL scripts berikut di Supabase SQL Editor:

1. **Profiles Table**: `supabase_profiles_schema.sql`
2. **Chat System**: `supabase_chat_schema.sql`

### 5. Jalankan Development Server
```bash
npm run dev
```

## Struktur Database

### Tabel Utama

#### `profiles`
- `id`: UUID (referensi ke auth.users)
- `username`: VARCHAR(50) UNIQUE
- `name`: VARCHAR(255)
- `role`: ENUM('admin', 'finance', 'hr', 'project')
- `permissions`: TEXT[]

#### `equipment`
- `id`: UUID PRIMARY KEY
- `name`: VARCHAR(255)
- `description`: TEXT
- `quantity`: INTEGER
- `status`: VARCHAR(50)
- `created_at`: TIMESTAMP

#### `messages`
- `id`: UUID PRIMARY KEY
- `chat_id`: VARCHAR(255)
- `chat_type`: ENUM('global', 'personal', 'group')
- `text`: TEXT
- `user_id`: UUID (referensi ke auth.users)
- `created_at`: TIMESTAMP

## Role dan Permission

### Admin
- Akses ke semua fitur
- Manajemen user
- Procurement management
- Dashboard admin

### Finance
- Laporan keuangan
- Transaksi keuangan
- Chat system
- Dashboard finance

### HR
- Manajemen karyawan
- Rekrutmen
- Chat system
- Dashboard HR

### Project Manager
- Manajemen proyek
- Task management
- Procurement management
- Chat system
- Dashboard project

## Testing Login

### User Test (sesuaikan dengan data di database Anda)

#### Admin
- Username: `admin`
- Password: `password123`

#### Finance
- Username: `finance`
- Password: `password123`

#### HR
- Username: `hr`
- Password: `password123`

#### Project Manager
- Username: `project`
- Password: `password123`

## Troubleshooting

### Login Tidak Bisa Masuk Dashboard
1. Periksa console browser untuk error
2. Pastikan tabel `profiles` sudah dibuat
3. Periksa RLS policies di Supabase
4. Pastikan user sudah terdaftar di tabel `profiles`

### Menu Tidak Muncul
1. Periksa role user di database
2. Pastikan permission sudah benar
3. Periksa `hasPermission` function di AuthContext

### Database Connection Error
1. Periksa Supabase URL dan API Key
2. Pastikan project Supabase aktif
3. Periksa RLS policies

## Development

### Scripts
- `npm run dev`: Development server
- `npm run build`: Build production
- `npm run preview`: Preview build

### File Structure
```
src/
├── components/     # Reusable components
├── contexts/      # React contexts
├── lib/          # Utilities and configs
├── pages/        # Page components
├── services/     # API services
└── utils/        # Helper functions
```

## Deployment

### Build untuk Production
```bash
npm run build
```

### Deploy ke Vercel/Netlify
1. Push code ke GitHub
2. Connect repository ke Vercel/Netlify
3. Set environment variables untuk Supabase
4. Deploy

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License - lihat file LICENSE untuk detail.