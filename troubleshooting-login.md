# Troubleshooting: Login Berhasil Tapi Tidak Redirect ke Dashboard

## 🚨 Masalah yang Ditemukan

**Gejala**: 
- Login berhasil (muncul popup "Login Berhasil")
- Toast notification muncul
- Tapi tidak redirect ke dashboard
- Tetap di halaman login

## 🔍 Diagnosa Masalah

### 1. Periksa Console Browser
1. Buka Developer Tools (F12)
2. Buka tab Console
3. Coba login dan lihat log yang muncul
4. Cari error atau warning

### 2. Periksa Network Tab
1. Buka tab Network di Developer Tools
2. Coba login
3. Lihat apakah ada request ke Supabase
4. Periksa response dari API

### 3. Periksa Application Tab
1. Buka tab Application
2. Lihat Local Storage
3. Lihat Session Storage
4. Periksa apakah ada data user

## 🛠️ Solusi yang Sudah Diimplementasi

### 1. Manual Redirect dengan Timeout
```javascript
// Setelah login berhasil, tunggu 2 detik lalu redirect
setTimeout(() => {
  const dashboardPath = getRoleDashboardPath(role);
  window.location.href = dashboardPath; // Force navigation
}, 2000);
```

### 2. Immediate User State Update
```javascript
// Update user state langsung setelah login berhasil
if (result.success && result.user) {
  const profile = await dbService.getUserProfile(result.user.id);
  setUser(userData); // Set user state immediately
}
```

### 3. Fallback Navigation
```javascript
// Gunakan window.location.href sebagai fallback
window.location.href = dashboardPath;
```

## 🧪 Testing Database Connection

### 1. Test Manual di Console
```javascript
// Copy dan paste di browser console
// Test koneksi Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@nahorpratama.com',
  password: 'admin123'
});

console.log('Login result:', { data, error });
```

### 2. Test Profiles Table
```javascript
// Test akses ke tabel profiles
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(1);

console.log('Profiles result:', { data, error });
```

### 3. Test User Profile
```javascript
// Test getUserProfile function
const profile = await supabaseAdapter.getUserProfile(userId);
console.log('User profile:', profile);
```

## 🔧 Langkah Troubleshooting

### Langkah 1: Verifikasi Database
1. Pastikan Supabase project aktif
2. Jalankan SQL scripts:
   ```sql
   -- Jalankan di Supabase SQL Editor
   \i supabase_profiles_schema.sql
   \i supabase_chat_schema.sql
   ```

### Langkah 2: Verifikasi User Test
1. Buat user test di Supabase Auth
2. Insert profile di tabel profiles
3. Pastikan role dan permissions benar

### Langkah 3: Test Login Step by Step
1. Buka aplikasi di browser
2. Buka Developer Tools
3. Coba login dengan user test
4. Monitor console dan network
5. Lihat apakah ada error

### Langkah 4: Debug AuthContext
1. Tambah console.log di AuthContext
2. Monitor state changes
3. Lihat apakah user state ter-update

## 🐛 Common Issues & Solutions

### Issue 1: "relation 'profiles' does not exist"
**Solution**: Jalankan SQL script untuk membuat tabel profiles

### Issue 2: "permission denied"
**Solution**: Periksa RLS policies dan pastikan user sudah login

### Issue 3: "invalid email or password"
**Solution**: Periksa credentials user di Supabase Auth

### Issue 4: "network error"
**Solution**: Periksa Supabase URL dan API Key

### Issue 5: "user authenticated but no profile found"
**Solution**: Pastikan user ada di tabel profiles

## 📋 Checklist Troubleshooting

### ✅ Environment
- [ ] Supabase project aktif
- [ ] Environment variables diset
- [ ] Aplikasi bisa diakses

### ✅ Database
- [ ] Tabel profiles sudah dibuat
- [ ] User test sudah dibuat
- [ ] RLS policies sudah diset

### ✅ Authentication
- [ ] Login berhasil
- [ ] User state ter-update
- [ ] Profile bisa di-fetch

### ✅ Navigation
- [ ] Route protection berfungsi
- [ ] Redirect logic berfungsi
- [ ] Dashboard bisa diakses

## 🚀 Quick Fix

Jika semua troubleshooting tidak berhasil, coba:

1. **Force Refresh**: `Ctrl + F5` atau `Cmd + Shift + R`
2. **Clear Browser Data**: Clear cookies dan local storage
3. **Test di Browser Lain**: Chrome, Firefox, Safari
4. **Test di Incognito Mode**: Pastikan tidak ada cache

## 📞 Support

Jika masalah masih berlanjut:

1. **Check Console**: Lihat error di console browser
2. **Check Network**: Lihat request/response di network tab
3. **Check Supabase**: Lihat logs di Supabase dashboard
4. **Create Issue**: Buat issue dengan detail error

## 🔍 Debug Commands

### Test di Console Browser
```javascript
// Test semua fitur
testDBConnection.runAllTests();

// Test spesifik
testDBConnection.testAuth();
testDBConnection.testProfilesTable();
testDBConnection.testRLSPolicies();
```

### Monitor State Changes
```javascript
// Monitor user state
console.log('Current user:', window.authContext?.user);
console.log('Current loading:', window.authContext?.loading);
```

## 📝 Log Template

Saat melaporkan masalah, sertakan:

```
**Browser**: Chrome/Firefox/Safari
**Version**: XX.XX.XX
**OS**: Windows/Mac/Linux
**Error Message**: [Copy dari console]
**Steps to Reproduce**: [Detail langkah]
**Expected Behavior**: [Yang seharusnya terjadi]
**Actual Behavior**: [Yang sebenarnya terjadi]
**Console Logs**: [Copy semua log dari console]
**Network Logs**: [Copy request/response yang relevan]
```