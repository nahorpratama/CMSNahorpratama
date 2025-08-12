
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Users, Edit, Trash2 } from 'lucide-react';

const EditUserDialog = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    role: user.role,
  });
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSave = async () => {
    await onSave(user.id, formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">Username</Label>
            <Input id="username" value={formData.username} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Select onValueChange={handleRoleChange} value={formData.role}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserManagement = () => {
  const { user: currentUser, createUser, allUsers, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', role: 'project' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await createUser(formData);
    if (result.success) {
      toast({ title: 'Pengguna Berhasil Dibuat', description: `Pengguna ${formData.name} telah ditambahkan.` });
      setFormData({ name: '', username: '', email: '', password: '', role: 'project' });
    } else {
      toast({ title: 'Gagal Membuat Pengguna', description: result.error, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleUpdateUser = async (userId, userData) => {
    const result = await updateUser(userId, userData);
    if (result.success) {
      toast({ title: 'Pengguna Berhasil Diperbarui', description: `Data untuk ${userData.name} telah disimpan.` });
    } else {
      toast({ title: 'Gagal Memperbarui Pengguna', description: result.error, variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast({ title: 'Pengguna Berhasil Dihapus' });
    } else {
      toast({ title: 'Gagal Menghapus Pengguna', description: result.error, variant: 'destructive' });
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <Helmet>
        <title>Manajemen Pengguna - Corporate Management System</title>
        <meta name="description" content="Tambah, edit, dan kelola pengguna sistem." />
      </Helmet>
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold gradient-text mb-2">Manajemen Pengguna</h1>
          <p className="text-gray-400">Tambah, edit, dan kelola akun pengguna dalam sistem.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <Card className="glass-effect h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-400" />Tambah Pengguna Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={formData.username} onChange={handleInputChange} placeholder="johndoe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="user@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={handleRoleChange} value={formData.role}>
                      <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? 'Menambahkan...' : 'Tambah Pengguna'}</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="glass-effect h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" />Daftar Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{user.role}</span>
                        {currentUser?.id !== user.id && (
                          <>
                            <EditUserDialog user={user} onSave={handleUpdateUser} />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass-effect">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna secara permanen dari sistem.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default UserManagement;
