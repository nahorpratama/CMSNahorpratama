import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/customSupabaseClient';

const CategoryManagement = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  // Language-specific content
  const content = {
    id: {
      title: 'Manajemen Kategori',
      subtitle: 'Kelola kategori pengguna untuk organisasi',
      metrics: {
        totalCategories: 'Total Kategori',
        activeCategories: 'Kategori Aktif',
        inactiveCategories: 'Kategori Nonaktif'
      },
      actions: {
        addCategory: 'Tambah Kategori',
        searchCategory: 'Cari kategori...',
        edit: 'Edit',
        delete: 'Hapus',
        activate: 'Aktifkan',
        deactivate: 'Nonaktifkan'
      },
      data: {
        categoryList: 'Daftar Kategori',
        noCategories: 'Belum ada kategori.',
        noResults: 'Tidak ada hasil yang ditemukan.'
      },
      form: {
        name: 'Nama Kategori',
        description: 'Deskripsi',
        color: 'Warna',
        isActive: 'Status Aktif',
        save: 'Simpan',
        cancel: 'Batal',
        edit: 'Edit Kategori',
        create: 'Buat Kategori Baru'
      },
      messages: {
        categoryCreated: 'Kategori berhasil dibuat!',
        categoryUpdated: 'Kategori berhasil diperbarui!',
        categoryDeleted: 'Kategori berhasil dihapus!',
        categoryActivated: 'Kategori berhasil diaktifkan!',
        categoryDeactivated: 'Kategori berhasil dinonaktifkan!',
        confirmDelete: 'Apakah Anda yakin ingin menghapus kategori "{name}"? Tindakan ini tidak dapat dibatalkan.',
        delete: 'Hapus',
        cancel: 'Batal'
      },
      pageTitle: 'Category Management - Corporate Management System',
      pageDesc: 'Manajemen kategori pengguna sistem'
    },
    en: {
      title: 'Category Management',
      subtitle: 'Manage user categories for organization',
      metrics: {
        totalCategories: 'Total Categories',
        activeCategories: 'Active Categories',
        inactiveCategories: 'Inactive Categories'
      },
      actions: {
        addCategory: 'Add Category',
        searchCategory: 'Search categories...',
        edit: 'Edit',
        delete: 'Delete',
        activate: 'Activate',
        deactivate: 'Deactivate'
      },
      data: {
        categoryList: 'Category List',
        noCategories: 'No categories yet.',
        noResults: 'No results found.'
      },
      form: {
        name: 'Category Name',
        description: 'Description',
        color: 'Color',
        isActive: 'Active Status',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit Category',
        create: 'Create New Category'
      },
      messages: {
        categoryCreated: 'Category created successfully!',
        categoryUpdated: 'Category updated successfully!',
        categoryDeleted: 'Category deleted successfully!',
        categoryActivated: 'Category activated successfully!',
        categoryDeactivated: 'Category deactivated successfully!',
        confirmDelete: 'Are you sure you want to delete category "{name}"? This action cannot be undone.',
        delete: 'Delete',
        cancel: 'Cancel'
      },
      pageTitle: 'Category Management - Corporate Management System',
      pageDesc: 'User category management system'
    }
  };

  const t = content[language] || content.en;

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createCategory = async () => {
    try {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: t.messages.categoryCreated
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  };

  // Update category
  const updateCategory = async () => {
    try {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: t.messages.categoryUpdated
      });

      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };

  // Delete category
  const deleteCategory = async (category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: t.messages.categoryDeleted
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  // Toggle category status
  const toggleCategoryStatus = async (category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: category.is_active 
          ? t.messages.categoryDeactivated 
          : t.messages.categoryActivated
      });

      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      is_active: true
    });
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6',
      is_active: category.is_active
    });
  };

  // Handle create dialog close
  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditingCategory(null);
    resetForm();
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate metrics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.is_active).length;
  const inactiveCategories = totalCategories - activeCategories;

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t.subtitle}
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t.actions.addCategory}
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.metrics.totalCategories}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalCategories}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.metrics.activeCategories}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeCategories}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <EyeOff className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.metrics.inactiveCategories}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {inactiveCategories}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t.actions.searchCategory}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.data.categoryList}
              </h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? t.data.noResults : t.data.noCategories}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className={`text-lg font-medium ${
                            category.is_active 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCategoryStatus(category)}
                          className="flex items-center gap-2"
                        >
                          {category.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {category.is_active ? t.actions.deactivate : t.actions.activate}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          {t.actions.edit}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t.actions.delete}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t.messages.confirmDelete.replace('{name}', category.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.messages.cancel}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategory(category)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t.messages.delete}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="description">{t.form.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="color">{t.form.color}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">{t.form.isActive}</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCreateDialogClose}>
              {t.form.cancel}
            </Button>
            <Button onClick={createCategory}>
              {t.form.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => handleEditDialogClose()}>
        <DialogContent className="sm:max-w-md">
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
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">{t.form.description}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-color">{t.form.color}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-is_active">{t.form.isActive}</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleEditDialogClose}>
              {t.form.cancel}
            </Button>
            <Button onClick={updateCategory}>
              {t.form.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManagement;