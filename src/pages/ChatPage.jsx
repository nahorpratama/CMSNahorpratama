
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, FileText, FileImage as ImageIcon, Film, Music, Archive, File as FileIcon, Loader2, Users, PlusCircle, MessageSquare, Trash2, Search } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AddChatModal from '@/components/chat/AddChatModal';
import GroupManageModal from '@/components/chat/GroupManageModal';
import { useLocation } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/**
 * Fungsi utilitas untuk mendapatkan ikon file berdasarkan tipe MIME.
 * @param {string} fileType - Tipe MIME dari file.
 * @returns {JSX.Element} - Komponen ikon yang sesuai.
 */
const getFileIcon = (fileType) => {
  if (!fileType) return <FileIcon className="w-6 h-6" />;
  if (fileType.startsWith('image/')) return <ImageIcon className="w-6 h-6 text-pink-400" />;
  if (fileType.startsWith('video/')) return <Film className="w-6 h-6 text-purple-400" />;
  if (fileType.startsWith('audio/')) return <Music className="w-6 h-6 text-sky-400" />;
  if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-400" />;
  if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="w-6 h-6 text-yellow-400" />;
  return <FileIcon className="w-6 h-6 text-gray-400" />;
};

/**
 * Komponen utama untuk halaman Chat.
 * Menampilkan daftar percakapan dan jendela chat aktif.
 */
const ChatPage = () => {
  const { user } = useAuth();
  const { personalContacts, groupChats, chatMode, activeChat, selectPersonalChat, selectGroupChat, selectGlobalChat, messages, loadingMessages, sendMessage, sendFile, uploadingFile, deleteMessage, unreadChats } = useChat();
  const location = useLocation();
  
  // State lokal komponen
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupManageModalOpen, setIsGroupManageModalOpen] = useState(false);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  
  // Ref untuk elemen DOM
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Deep-link handling: select chat from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const id = params.get('id');
    if (!type) return;
    if (type === 'global') {
      selectGlobalChat();
    } else if (type === 'group' && id) {
      const group = groupChats.find(g => g.id === id);
      if (group) selectGroupChat(group);
    } else if (type === 'personal' && id) {
      const recipient = personalContacts.find(u => u.id === id) || { id, name: 'Pengguna' };
      selectPersonalChat(recipient);
    }
  }, [location.search, groupChats, personalContacts, selectGlobalChat, selectGroupChat, selectPersonalChat]);

  // Fungsi untuk scroll otomatis ke pesan terakhir
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efek untuk scroll ke bawah setiap kali ada pesan baru
  useEffect(scrollToBottom, [messages]);

  // Handler untuk mengirim pesan teks
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Handler untuk memilih dan mengirim file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendFile(file);
    }
    e.target.value = null; // Reset input file
  };

  // Fungsi untuk mendapatkan judul chat yang sedang aktif
  const getChatTitle = () => {
    if (chatMode === 'global') return 'Chat Global';
    if (chatMode === 'personal' && activeChat) return activeChat.recipient.name;
    if (chatMode === 'group' && activeChat) return activeChat.groupInfo.name;
    return 'Pilih Percakapan';
  };
  
  // Memoized list untuk kontak personal yang difilter
  const filteredPersonalContacts = useMemo(() => 
    personalContacts.filter(u => u.name.toLowerCase().includes(chatSearchTerm.toLowerCase())),
    [personalContacts, chatSearchTerm]
  );
  
  // Memoized list untuk grup chat yang difilter
  const filteredGroupChats = useMemo(() =>
    groupChats.filter(g => g.name.toLowerCase().includes(chatSearchTerm.toLowerCase())),
    [groupChats, chatSearchTerm]
  );

  return (
    <>
      <Helmet>
        <title>Chat - Corporate Management System</title>
        <meta name="description" content="Fitur chat global, personal, dan grup untuk semua pengguna." />
      </Helmet>
      <AddChatModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <GroupManageModal open={isGroupManageModalOpen} onOpenChange={setIsGroupManageModalOpen} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-[calc(100vh-120px)]"
      >
        {/* Sidebar Daftar Percakapan */}
        <div className="w-1/3 max-w-xs glass-effect border-r border-white/20 flex flex-col">
          <div className="p-4 border-b border-white/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Percakapan</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} title="Mulai chat baru">
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="p-2 border-b border-white/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Cari chat..."
                value={chatSearchTerm}
                onChange={(e) => setChatSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-700 pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {/* Item Chat Global */}
            <div 
              className={cn("flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors mb-2", chatMode === 'global' && !activeChat && "bg-blue-500/30")}
              onClick={selectGlobalChat}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0"><MessageSquare className="w-5 h-5 text-white" /></div>
              <div><p className="font-medium text-sm">Chat Global</p></div>
            </div>
            
            {/* Daftar Grup Chat */}
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase">Grup</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsGroupManageModalOpen(true)}
                className="text-xs text-gray-400 hover:text-white"
                title="Kelola grup"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            {filteredGroupChats.map((group) => (
              <div key={group.id} className={cn("relative flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors", activeChat?.id === group.id && "bg-blue-500/30")} onClick={() => selectGroupChat(group)}>
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0"><Users className="w-5 h-5 text-white" /></div>
                <div><p className="font-medium text-sm">{group.name}</p></div>
                {unreadChats[group.id] && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
              </div>
            ))}

            {/* Daftar Chat Personal */}
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Personal</p>
            {filteredPersonalContacts.map((u) => {
              const chatId = [user.id, u.id].sort().join('_');
              return (
              <div key={u.id} className={cn("relative flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors", chatMode === 'personal' && activeChat?.recipient.id === u.id && "bg-blue-500/30")} onClick={() => selectPersonalChat(u)}>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm font-semibold text-white">{u.name.charAt(0)}</span></div>
                <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-gray-400 capitalize">{u.role}</p></div>
                {unreadChats[chatId] && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
              </div>
            )})}
          </div>
        </div>

        {/* Jendela Chat Utama */}
        <div className="flex-1 flex flex-col bg-black/20">
          <AnimatePresence mode="wait">
            {activeChat || chatMode === 'global' ? (
              <motion.div key={activeChat?.id || 'global'} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex-1 flex flex-col">
                <div className="p-4 border-b border-white/20 flex items-center justify-between"><h2 className="text-lg font-semibold">{getChatTitle()}</h2></div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {loadingMessages ? <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div> : (
                    messages.map((msg) => (
                      <div key={msg.id} className={cn("group flex items-end gap-3 max-w-lg", msg.senderId === user.id ? "ml-auto flex-row-reverse" : "")}>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xs font-semibold text-white">{msg.senderName.charAt(0)}</span></div>
                        <div className={cn("relative p-3 rounded-lg", msg.senderId === user.id ? "bg-blue-600 rounded-br-none" : "bg-slate-700 rounded-bl-none")}>
                          {(chatMode === 'global' || chatMode === 'group') && msg.senderId !== user.id && <p className="text-xs font-bold text-cyan-300 mb-1">{msg.senderName}</p>}
                          {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                          {msg.file && (
                            <a 
                              href={msg.file.url} 
                              download={msg.file.name} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-3 bg-black/20 p-2 rounded-md hover:bg-black/40 transition-colors"
                            >
                              {getFileIcon(msg.file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{msg.file.name}</p>
                                <p className="text-xs text-gray-400">Klik untuk mengunduh</p>
                              </div>
                            </a>
                          )}
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {msg.timestamp && typeof msg.timestamp.toDate === 'function' 
                              ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                              : ''
                            }
                          </p>
                           {msg.senderId === user.id && chatMode !== 'global' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn("absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity", msg.senderId === user.id ? "-left-2" : "-right-2")}>
                                  <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin ingin menghapus pesan ini?</AlertDialogTitle>
                                  <AlertDialogDescription>Tindakan ini tidak dapat diurungkan. Pesan akan dihapus secara permanen.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMessage(msg.id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                           )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/20">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect} 
                      className="hidden"
                      accept="*/*"
                      title="Upload file maksimal 25MB"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => fileInputRef.current.click()} 
                      disabled={uploadingFile}
                      title="Upload file (maksimal 25MB)"
                    >
                      {uploadingFile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </Button>
                    <Input type="text" placeholder="Ketik pesan Anda..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="bg-slate-800 border-slate-600 focus:border-blue-500" disabled={uploadingFile} />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={uploadingFile || !newMessage.trim()}><Send className="w-4 h-4 mr-2" />Kirim</Button>
                  </form>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    💡 Tip: Ukuran file maksimal 25MB
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <img  alt="Team collaboration illustration" className="w-64 h-64 mb-4" src="https://images.unsplash.com/photo-1676276376927-3e0f559491aa" />
                <h2 className="text-2xl font-bold">Selamat Datang di Ruang Obrolan</h2>
                <p className="text-gray-400 mt-2 max-w-md">Pilih percakapan dari daftar di sebelah kiri atau buat yang baru menggunakan tombol (+).</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default ChatPage;
