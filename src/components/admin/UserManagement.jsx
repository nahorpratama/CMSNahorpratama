
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Shield,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard, DataCard, StatsGrid } from '@/components/ui/dashboard-card';
import { useLanguage } from '@/contexts/LanguageContext';

const UserManagement = () => {
  const { toast } = useToast();
  const { allUsers, createUser, updateUser, deleteUser } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'project',
    category: 'edit'
  });

  // Language-specific content
  const content = {
    id: {
      title: 'Manajemen Pengguna',
      subtitle: 'Kelola akun pengguna, role, dan permission',
      metrics: {
        totalUsers: 'Total Pengguna',
        activeUsers: 'Pengguna Aktif',
        adminUsers: 'Admin',
        projectUsers: 'Project Users',
        hrUsers: 'HR Users',
        financeUsers: 'Finance Users'
      },
      actions: {
        addUser: 'Tambah Pengguna',
        searchUser: 'Cari pengguna...',
        filterRole: 'Filter Role',
        filterCategory: 'Filter Kategori',
        allRoles: 'Semua Role',
        allCategories: 'Semua Kategori',
        admin: 'Admin',
        finance: 'Finance',
        hr: 'HR',
        project: 'Project',
        userEdit: 'User Edit',
        userApproval: 'User Approval'
      },
      data: {
        userList: 'Daftar Pengguna',
        noUsers: 'Belum ada pengguna.',
        noResults: 'Tidak ada hasil yang ditemukan.'
      },
      form: {
        name: 'Nama Lengkap',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        role: 'Role',
        category: 'Kategori',
        save: 'Simpan',
        cancel: 'Batal',
        edit: 'Edit Pengguna',
        create: 'Buat Pengguna Baru'
      },
      messages: {
        userCreated: 'Pengguna berhasil dibuat!',
        userUpdated: 'Pengguna berhasil diperbarui!',
        userDeleted: 'Pengguna berhasil dihapus!',
        confirmDelete: 'Apakah Anda yakin ingin menghapus pengguna "{name}"? Tindakan ini tidak dapat dibatalkan.',
        delete: 'Hapus',
        cancel: 'Batal'
      },
      pageTitle: 'User Management - Corporate Management System',
      pageDesc: 'Manajemen pengguna sistem dengan role-based access control'
    },
    en: {
      title: 'User Management',
      subtitle: 'Manage user accounts, roles, and permissions',
      metrics: {
        totalUsers: 'Total Users',
        activeUsers: 'Active Users',
        adminUsers: 'Admin',
        projectUsers: 'Project Users',
        hrUsers: 'HR Users',
        financeUsers: 'Finance Users'
      },
      actions: {
        addUser: 'Add User',
        searchUser: 'Search users...',
        filterRole: 'Filter Role',
        filterCategory: 'Filter Category',
        allRoles: 'All Roles',
        allCategories: 'All Categories',
        admin: 'Admin',
        finance: 'Finance',
        hr: 'HR',
        project: 'Project',
        userEdit: 'User Edit',
        userApproval: 'User Approval'
      },
      data: {
        userList: 'User List',
        noUsers: 'No users yet.',
        noResults: 'No results found.'
      },
      form: {
        name: 'Full Name',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        role: 'Role',
        category: 'Category',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit User',
        create: 'Create New User'
      },
      messages: {
        userCreated: 'User created successfully!',
        userUpdated: 'User updated successfully!',
        userDeleted: 'User deleted successfully!',
        confirmDelete: 'Are you sure you want to delete user "{name}"? This action cannot be undone.',
        delete: 'Delete',
        cancel: 'Cancel'
      },
      pageTitle: 'User Management - Corporate Management System',
      pageDesc: 'System user management with role-based access control'
    }
  };

  const t = content[language];

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  const handleCreateUser = async () => {
    try {
      const result = await createUser(formData);
      if (result.success) {
        toast({
          title: t.messages.userCreated,
          description: result.message,
        });
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat pengguna.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const result = await updateUser(editingUser.id, updatedData);
      if (result.success) {
        toast({
          title: t.messages.userUpdated,
          description: result.message,
        });
        setEditingUser(null);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui pengguna.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast({
          title: t.messages.userDeleted,
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus pengguna.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'project',
      category: 'edit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      case 'finance':
        return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'hr':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'project':
        return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'edit':
        return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
      case 'approval':
        return 'text-teal-600 bg-teal-500/10 border-teal-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t.actions.admin;
      case 'finance':
        return t.actions.finance;
      case 'hr':
        return t.actions.hr;
      case 'project':
        return t.actions.project;
      default:
        return role;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'edit':
        return t.actions.userEdit;
      case 'approval':
        return t.actions.userApproval;
      default:
        return category;
    }
  };

  // Filter users based on search, role, and category
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesCategory = categoryFilter === 'all' || user.category === categoryFilter;
    return matchesSearch && matchesRole && matchesCategory;
  });

  // Calculate user counts
  const userCounts = {
    total: users.length,
    active: users.filter(u => u.status !== 'inactive').length,
    admin: users.filter(u => u.role === 'admin').length,
    project: users.filter(u => u.role === 'project').length,
    hr: users.filter(u => u.role === 'hr').length,
    finance: users.filter(u => u.role === 'finance').length
  };

  const metrics = [
    {
      title: t.metrics.totalUsers,
      value: userCounts.total.toString(),
      icon: Users,
      changeType: 'neutral'
    },
    {
      title: t.metrics.activeUsers,
      value: userCounts.active.toString(),
      icon: Users,
      changeType: 'positive'
    },
    {
      title: t.metrics.adminUsers,
      value: userCounts.admin.toString(),
      icon: Shield,
      changeType: 'info'
    },
    {
      title: t.metrics.projectUsers,
      value: userCounts.project.toString(),
      icon: Users,
      changeType: 'info'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Metrics */}
        <StatsGrid>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              changeType={metric.changeType}
              variant="elevated"
            />
          ))}
        </StatsGrid>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {t.actions.addUser}
          </Button>
        </div>

        {/* User List */}
        <DataCard title={t.data.userList} variant="elevated">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.actions.searchUser}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.actions.filterRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.actions.allRoles}</SelectItem>
                  <SelectItem value="admin">{t.actions.admin}</SelectItem>
                  <SelectItem value="finance">{t.actions.finance}</SelectItem>
                  <SelectItem value="hr">{t.actions.hr}</SelectItem>
                  <SelectItem value="project">{t.actions.project}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.actions.filterCategory} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.actions.allCategories}</SelectItem>
                  <SelectItem value="edit">{t.actions.userEdit}</SelectItem>
                  <SelectItem value="approval">{t.actions.userApproval}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {users.length === 0 ? t.data.noUsers : t.data.noResults}
            </div>
          ) : (
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
                      {getRoleLabel(user.role)}
                    </span>
                    {/* Show category badge for HR, Finance, and Project roles */}
                    {(user.role === 'hr' || user.role === 'finance' || user.role === 'project') && user.category && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(user.category)}`}>
                        {getCategoryLabel(user.category)}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <EditUserDialog user={user} onSave={handleUpdateUser} t={t} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.form.edit}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t.messages.confirmDelete.replace('{name}', user.name)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.messages.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                              {t.messages.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <span className="hidden">Trigger</span>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.form.create}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t.form.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="username">{t.form.username}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">{t.form.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">{t.form.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">{t.form.role}</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t.actions.admin}</SelectItem>
                    <SelectItem value="finance">{t.actions.finance}</SelectItem>
                    <SelectItem value="hr">{t.actions.hr}</SelectItem>
                    <SelectItem value="project">{t.actions.project}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Show category field for HR, Finance, and Project roles */}
              {(formData.role === 'hr' || formData.role === 'finance' || formData.role === 'project') && (
                <div>
                  <Label htmlFor="category">{t.form.category}</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">{t.actions.userEdit}</SelectItem>
                      <SelectItem value="approval">{t.actions.userApproval}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateUser} className="flex-1">
                  {t.form.save}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  {t.form.cancel}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t.form.edit}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">{t.form.name}</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-username">{t.form.username}</Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">{t.form.email}</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password">{t.form.password}</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder={language === 'id' ? "Kosongkan jika tidak ingin mengubah password" : "Leave empty if you don't want to change password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">{t.form.role}</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t.actions.admin}</SelectItem>
                      <SelectItem value="finance">{t.actions.finance}</SelectItem>
                      <SelectItem value="hr">{t.actions.hr}</SelectItem>
                      <SelectItem value="project">{t.actions.project}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Show category field for HR, Finance, and Project roles */}
                {(formData.role === 'hr' || formData.role === 'finance' || formData.role === 'project') && (
                  <div>
                    <Label htmlFor="edit-category">{t.form.category}</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="edit">{t.actions.userEdit}</SelectItem>
                        <SelectItem value="approval">{t.actions.userApproval}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleUpdateUser(formData)} className="flex-1">
                    {t.form.save}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                    {t.form.cancel}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

// Edit User Dialog Component
const EditUserDialog = ({ user, onSave, t }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    password: '',
    role: user.role || 'project',
    category: user.category || 'edit'
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-500 hover:bg-blue-500/10">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.form.edit}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`edit-${user.id}-name`}>{t.form.name}</Label>
            <Input
              id={`edit-${user.id}-name`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`edit-${user.id}-username`}>{t.form.username}</Label>
            <Input
              id={`edit-${user.id}-username`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`edit-${user.id}-email`}>{t.form.email}</Label>
            <Input
              id={`edit-${user.id}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`edit-${user.id}-password`}>{t.form.password}</Label>
            <Input
              id={`edit-${user.id}-password`}
              type="password"
              placeholder={t.form.password}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`edit-${user.id}-role`}>{t.form.role}</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t.actions.admin}</SelectItem>
                <SelectItem value="finance">{t.actions.finance}</SelectItem>
                <SelectItem value="hr">{t.actions.hr}</SelectItem>
                <SelectItem value="project">{t.actions.project}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Show category field for HR, Finance, and Project roles */}
          {(formData.role === 'hr' || formData.role === 'finance' || formData.role === 'project') && (
            <div>
              <Label htmlFor={`edit-${user.id}-category`}>{t.form.category}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">{t.actions.userEdit}</SelectItem>
                  <SelectItem value="approval">{t.actions.userApproval}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              {t.form.save}
            </Button>
            <Button variant="outline" className="flex-1">
              {t.form.cancel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
