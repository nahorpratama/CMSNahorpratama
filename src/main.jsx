
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// Titik masuk utama aplikasi React.
// ReactDOM.createRoot digunakan untuk mengaktifkan fitur-fitur konkuren React 18.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode adalah pembungkus yang memeriksa potensi masalah dalam aplikasi
  // selama pengembangan. Ini tidak akan berjalan di mode produksi.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
