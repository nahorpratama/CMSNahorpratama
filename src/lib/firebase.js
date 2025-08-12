
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase untuk proyek Anda.
// Kunci API dan detail lainnya di sini aman untuk diekspos di sisi klien.
// Keamanan data diatur melalui Aturan Keamanan (Security Rules) di konsol Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCdwfZwJboonwG-_a_3A75q_wEvfdxQuIU",
  authDomain: "corporate-manager-e4203.firebaseapp.com",
  projectId: "corporate-manager-e4203",
  storageBucket: "corporate-manager-e4203.appspot.com",
  messagingSenderId: "1049669136074",
  appId: "1:1049669136074:web:c20d078973c5d80a374e33"
};

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);

// Dapatkan instance layanan Firebase Authentication
const auth = getAuth(app);

// Dapatkan instance layanan Firestore Database
const db = getFirestore(app);

// Ekspor instance untuk digunakan di seluruh aplikasi
export { auth, db };
