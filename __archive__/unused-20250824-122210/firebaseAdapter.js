
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy,
  getDocs,
  where,
  writeBatch,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Adapter untuk semua interaksi dengan Firebase.
 * Ini mengisolasi logika Firebase dari seluruh aplikasi.
 */
const firebaseAdapter = {
  /**
   * Melakukan login pengguna menggunakan email atau username.
   * Fungsi ini HANYA menangani autentikasi. Pengambilan data pengguna
   * ditangani oleh onAuthStateChanged untuk menghindari race condition.
   * @param {string} credential - Email atau username pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<{success: boolean, error?: string}>} Objek yang menandakan keberhasilan atau kegagalan login.
   */
  login: async (credential, password) => {
    let email;
    const isEmail = credential.includes('@');

    if (isEmail) {
      email = credential.toLowerCase();
    } else {
      try {
        const username = credential.toLowerCase();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username)); 
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return { success: false, error: "Username tidak ditemukan." };
        }
        
        email = querySnapshot.docs[0].data().email;
        if (!email) {
          return { success: false, error: "Data email untuk pengguna ini tidak ditemukan." };
        }
      } catch (error) {
        console.error("Error fetching user by username:", error);
        return { success: false, error: "Gagal mencari pengguna. Pastikan Aturan Keamanan Firebase benar." };
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login berhasil. Data pengguna akan diambil oleh onAuthStateChanged.
      return { success: true };
    } catch (error) {
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = "Username atau password salah.";
      }
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Melakukan logout pengguna yang sedang aktif.
   * @returns {Promise<void>}
   */
  logout: async () => {
    await signOut(auth);
  },

  /**
   * Menyiapkan listener untuk perubahan status autentikasi.
   * Ini adalah satu-satunya sumber kebenaran (Single Source of Truth) untuk data pengguna.
   * @param {function} callback - Fungsi yang akan dipanggil dengan data pengguna (atau null) saat status berubah.
   * @returns {import("firebase/auth").Unsubscribe} Fungsi untuk berhenti mendengarkan.
   */
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Jika Firebase Auth mengembalikan objek pengguna, ambil data profilnya dari Firestore.
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Gabungkan data dari Auth dan Firestore, lalu kirim ke context.
            callback({ uid: user.uid, ...userDoc.data() });
          } else {
            // Ini adalah kasus kritis: pengguna terautentikasi tetapi tidak memiliki profil di database.
            // Kita logout pengguna untuk mencegah aplikasi berada dalam state yang tidak valid.
            console.error("User authenticated but no data in Firestore. Logging out.");
            await signOut(auth); // Logout paksa
            callback(null);
          }
        } catch (error) {
          console.error("Error fetching user data on auth state change:", error);
          await signOut(auth); // Logout jika ada error lain
          callback(null);
        }
      } else {
        // Jika tidak ada pengguna (logout atau sesi berakhir), kirim null.
        callback(null);
      }
    });
  },

  /**
   * Mengambil semua data pengguna dari Firestore.
   * @returns {Promise<Array<object>>} Array berisi objek data semua pengguna.
   */
  getAllUsers: async () => {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Menyiapkan listener real-time untuk pesan dalam sebuah chat.
   * @param {string | null} chatId - ID dari chat (untuk personal/grup) atau null (untuk global).
   * @param {'global' | 'personal' | 'group'} type - Tipe chat.
   * @param {function} callback - Fungsi yang akan dipanggil dengan array pesan baru.
   * @returns {import("firebase/firestore").Unsubscribe} Fungsi untuk berhenti mendengarkan.
   */
  listenToMessages: (chatId, type, callback) => {
    let messagesCol;
    if (type === 'global') {
      messagesCol = collection(db, "global_messages");
    } else if (type === 'personal') {
      messagesCol = collection(db, "chats", chatId, "messages");
    } else if (type === 'group') {
      messagesCol = collection(db, "groups", chatId, "messages");
    } else {
      return () => {}; // Return fungsi kosong jika tipe tidak valid
    }
    
    const q = query(messagesCol, orderBy("timestamp", "asc"));
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },

  /**
   * Mengirim pesan baru ke sebuah chat.
   * @param {string | null} chatId - ID chat atau null untuk global.
   * @param {'global' | 'personal' | 'group'} type - Tipe chat.
   * @param {object} message - Objek pesan yang akan dikirim.
   * @returns {Promise<void>}
   */
  sendMessage: async (chatId, type, message) => {
    let messagesCol;
    if (type === 'global') {
      messagesCol = collection(db, "global_messages");
    } else if (type === 'personal') {
      messagesCol = collection(db, "chats", chatId, "messages");
    } else if (type === 'group') {
      messagesCol = collection(db, "groups", chatId, "messages");
    } else {
      throw new Error("Invalid chat type");
    }
    
    await addDoc(messagesCol, {
      ...message,
      timestamp: serverTimestamp(),
    });
  },

  /**
   * Menghapus sebuah pesan.
   * @param {string} chatId - ID chat tempat pesan berada.
   * @param {string} messageId - ID pesan yang akan dihapus.
   * @param {'personal' | 'group'} type - Tipe chat.
   * @returns {Promise<void>}
   */
  deleteMessage: async (chatId, messageId, type) => {
    if (type === 'global') {
        throw new Error("Pesan di chat global tidak dapat dihapus.");
    }
    let messageRef;
    if (type === 'personal') {
        messageRef = doc(db, "chats", chatId, "messages", messageId);
    } else if (type === 'group') {
        messageRef = doc(db, "groups", chatId, "messages", messageId);
    } else {
        throw new Error("Invalid chat type");
    }

    const messageDoc = await getDoc(messageRef);
    // Validasi di sisi klien (keamanan utama tetap di Firestore Rules)
    if (!auth.currentUser || !messageDoc.exists() || messageDoc.data().senderId !== auth.currentUser.uid) {
        throw new Error("Anda tidak memiliki izin untuk menghapus pesan ini.");
    }

    await deleteDoc(messageRef);
  },

  /**
   * Membuat grup chat baru.
   * @param {string} name - Nama grup.
   * @param {Array<string>} memberIds - Array berisi ID semua anggota grup.
   * @returns {Promise<object>} Data grup yang baru dibuat.
   */
  createGroupChat: async (name, memberIds) => {
    if (!auth.currentUser) throw new Error("Pengguna tidak terautentikasi.");
    const newGroupRef = doc(collection(db, "groups"));
    const batch = writeBatch(db);

    const groupData = {
      id: newGroupRef.id,
      name,
      members: memberIds,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser.uid,
    };
    batch.set(newGroupRef, groupData);

    // Tambahkan referensi grup ke setiap dokumen pengguna
    memberIds.forEach(memberId => {
      const userGroupRef = doc(db, "users", memberId, "groups", newGroupRef.id);
      batch.set(userGroupRef, { groupId: newGroupRef.id, name: name });
    });

    await batch.commit();
    return groupData;
  },

  /**
   * Menyiapkan listener untuk daftar grup yang diikuti oleh pengguna.
   * @param {string} userId - ID pengguna.
   * @param {function} callback - Fungsi yang akan dipanggil dengan array data grup.
   * @returns {import("firebase/firestore").Unsubscribe} Fungsi untuk berhenti mendengarkan.
   */
  listenToUserGroups: (userId, callback) => {
    const userGroupsCol = collection(db, "users", userId, "groups");
    return onSnapshot(userGroupsCol, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(groups);
    }, (error) => {
        console.error("Error listening to user groups:", error);
    });
  },
};

export default firebaseAdapter;
