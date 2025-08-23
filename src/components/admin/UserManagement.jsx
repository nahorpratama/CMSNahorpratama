
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Users, Edit, Trash2, Search, Filter } from 'lucide-react';
import { DataCard, MetricCard, StatsGrid } from '@/components/ui/dashboard-card';

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
        <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-500 hover:bg-amber-500/10">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dibuat",
        variant: "default",
      });
      setFormData({ name: '', username: '', email: '', password: '', role: 'project' });
    } else {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdateUser = async (userId, updatedData) => {
    const result = await updateUser(userId, updatedData);
    if (result.success) {
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil diupdate",
        variant: "default",
      });
    } else {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus",
        variant: "default",
      });
    } else {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Filter users berdasarkan search dan role
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Count users by role
  const userCounts = {
    total: allUsers.length,
    admin: allUsers.filter(u => u.role === 'admin').length,
    finance: allUsers.filter(u => u.role === 'finance').length,
    hr: allUsers.filter(u => u.role === 'hr').length,
    project: allUsers.filter(u => u.role === 'project').length,
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      case 'finance':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'hr':
        return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'project':
        return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <>
      <Helmet>
        <title>User Management - Corporate Management System</title>
        <meta name="description" content="Manajemen pengguna sistem dengan role-based access control" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Kelola pengguna sistem dan hak akses berdasarkan role</p>
        </div>

        {/* Metrics Cards */}
        <StatsGrid>
          <MetricCard
            title="Total Pengguna"
            value={userCounts.total.toString()}
            change="+2 dari bulan lalu"
            icon={Users}
            changeType="positive"
            variant="elevated"
          />
          <MetricCard
            title="Admin"
            value={userCounts.admin.toString()}
            change="Full access"
            icon={Users}
            changeType="neutral"
            variant="elevated"
          />
          <MetricCard
            title="Finance"
            value={userCounts.finance.toString()}
            change="Finance access"
            icon={Users}
            changeType="neutral"
            variant="elevated"
          />
          <MetricCard
            title="HR & Project"
            value={(userCounts.hr + userCounts.project).toString()}
            change="Limited access"
            icon={Users}
            changeType="neutral"
            variant="elevated"
          />
        </StatsGrid>

        {/* Create User Form */}
        <DataCard title="Tambah Pengguna Baru" variant="elevated">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Tambah Pengguna
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DataCard>

        {/* Search and Filter */}
        <DataCard title="Daftar Pengguna" variant="elevated">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.username} • {user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <div className="flex gap-2">
                    <EditUserDialog user={user} onSave={handleUpdateUser} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-500 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna "{user.name}"? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </>
  );
};

export default UserManagement;
