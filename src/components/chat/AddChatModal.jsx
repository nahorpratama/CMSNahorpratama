import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users, User, X, Plus, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

/**
 * Komponen modal untuk memulai percakapan baru, baik personal maupun grup.
 * @param {object} props - Properti komponen.
 * @param {boolean} props.open - Status apakah modal terbuka atau tertutup.
 * @param {function} props.onOpenChange - Fungsi untuk mengubah status modal.
 */
const AddChatModal = ({ open, onOpenChange }) => {
  const { user, allUsers } = useAuth();
  const { selectPersonalChat, createGroupChat, groupChats, loadGroupChats } = useChat();
  const dbService = useDatabase();
  const { toast } = useToast();

  // State untuk pengguna yang dipilih, nama grup, dan term pencarian
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [isCreating, setIsCreating] = useState(false);

  // Memoized list pengguna lain (selain pengguna saat ini)
  const otherUsers = useMemo(() => {
    return allUsers.filter(u => u.id !== user.id);
  }, [allUsers, user]);

  // Memoized list pengguna yang sudah difilter berdasarkan pencarian
  const filteredUsers = useMemo(() => {
    return otherUsers.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [otherUsers, searchTerm]);

  /**
   * Menangani toggle pemilihan pengguna.
   * @param {string} userId - ID pengguna yang dipilih atau batal dipilih.
   */
  const handleUserToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  /**
   * Menangani submit form, baik untuk memulai chat personal maupun membuat grup.
   */
  const handleSubmit = () => {
    if (selectedUsers.length === 0) {
      toast({ variant: 'destructive', title: 'Pilih Pengguna', description: 'Anda harus memilih setidaknya satu pengguna.' });
      return;
    }

    // Jika hanya satu pengguna dipilih, mulai chat personal
    if (selectedUsers.length === 1) {
      const recipient = allUsers.find(u => u.id === selectedUsers[0]);
      selectPersonalChat(recipient);
    } else { // Jika lebih dari satu, buat grup chat
      if (!groupName.trim()) {
        toast({ variant: 'destructive', title: 'Nama Grup Diperlukan', description: 'Silakan masukkan nama untuk grup chat Anda.' });
        return;
      }
      createGroupChat(groupName, selectedUsers);
    }

    resetAndClose();
  };

  /**
   * Mereset state dan menutup modal.
   */
  const resetAndClose = () => {
    setSelectedUsers([]);
    setGroupName('');
    setSearchTerm('');
    onOpenChange(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({ title: "Error", description: "Nama grup harus diisi.", variant: "destructive" });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({ title: "Error", description: "Pilih minimal satu anggota grup.", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      await createGroupChat(groupName.trim(), selectedUsers);
      setGroupName('');
      setSelectedUsers([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const result = await dbService.deleteGroupChat(groupId, user.id);
      if (result.success) {
        toast({ title: "Berhasil", description: "Grup berhasil dihapus." });
        loadGroupChats?.();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus grup.", variant: "destructive" });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const result = await dbService.leaveGroupChat(groupId, user.id);
      if (result.success) {
        toast({ title: "Berhasil", description: "Berhasil keluar dari grup." });
        loadGroupChats?.();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal keluar dari grup.", variant: "destructive" });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Mulai Percakapan Baru</DialogTitle>
          <DialogDescription>
            Pilih satu pengguna untuk chat personal, atau beberapa untuk membuat grup.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg mb-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={cn("flex-1 py-2 px-4 text-sm rounded-md transition-all", activeTab === 'personal' ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white")}
            >
              <User className="w-4 h-4 inline mr-2" />
              Personal
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={cn("flex-1 py-2 px-4 text-sm rounded-md transition-all", activeTab === 'group' ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white")}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Grup Baru
            </button>
          </div>

          {activeTab === 'personal' && (
            <>
              <Input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-600"
              />
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-800">
                    <Checkbox
                      id={`user-${u.id}`}
                      checked={selectedUsers.includes(u.id)}
                      onCheckedChange={() => handleUserToggle(u.id)}
                    />
                    <Label htmlFor={`user-${u.id}`} className="flex-1 cursor-pointer">
                      {u.name} <span className="text-slate-400">({u.role})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'group' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nama Grup</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Masukkan nama grup..."
                  className="bg-slate-800 border-slate-600"
                />
              </div>

              <div>
                <Label>Pilih Anggota ({selectedUsers.length} dipilih)</Label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari pengguna..."
                  className="bg-slate-800 border-slate-600 mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-600 rounded-md p-2 bg-slate-800">
                  {filteredUsers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-slate-700 rounded">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedUsers.includes(member.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(prev => [...prev, member.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== member.id));
                          }
                        }}
                      />
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCreateGroup}
                disabled={isCreating || !groupName.trim() || selectedUsers.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Membuat Grup...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Grup
                  </>
                )}
              </Button>
            </motion.div>
          )}

          
        </div>
        <DialogFooter>
          {activeTab === 'personal' && (
            <Button onClick={handleSubmit} disabled={selectedUsers.length === 0} className="bg-blue-600 hover:bg-blue-700">
              Mulai Chat
            </Button>
          )}
          {/* Tombol untuk membuat grup sudah ada di dalam tab 'group' */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddChatModal;