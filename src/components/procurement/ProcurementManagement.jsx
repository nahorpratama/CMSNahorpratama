
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Truck, PlusCircle, Edit, Trash2, Upload, Filter, Search } from 'lucide-react';

const EquipmentForm = ({ equipment, onSave, onFinished }) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    code: equipment?.code || '',
    type: equipment?.type || 'light',
    status: equipment?.status || 'available',
    purchase_date: equipment?.purchase_date || '',
    last_maintenance_date: equipment?.last_maintenance_date || '',
    notes: equipment?.notes || '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onFinished();
  };

  return (
    <form onSubmit={handleSave} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Alat</Label>
          <Input id="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="code">Kode Alat</Label>
          <Input id="code" value={formData.code} onChange={handleInputChange} disabled={!!equipment} required />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipe</Label>
          <Select onValueChange={(v) => handleSelectChange('type', v)} value={formData.type}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="heavy">Alat Berat</SelectItem>
              <SelectItem value="light">Alat Ringan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(v) => handleSelectChange('status', v)} value={formData.status}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Tersedia</SelectItem>
              <SelectItem value="in_use">Digunakan</SelectItem>
              <SelectItem value="maintenance">Perawatan</SelectItem>
              <SelectItem value="broken">Rusak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchase_date">Tanggal Pembelian</Label>
            <Input id="purchase_date" type="date" value={formData.purchase_date} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="last_maintenance_date">Perawatan Terakhir</Label>
            <Input id="last_maintenance_date" type="date" value={formData.last_maintenance_date} onChange={handleInputChange} />
          </div>
      </div>
      <div>
        <Label htmlFor="notes">Catatan</Label>
        <Input id="notes" value={formData.notes} onChange={handleInputChange} />
      </div>
      <DialogFooter>
        <Button type="submit">Simpan</Button>
      </DialogFooter>
    </form>
  );
};

const ProcurementManagement = () => {
  const { equipment, loadingEquipment, createEquipment, updateEquipment, deleteEquipment, batchUploadEquipment } = useDatabase();
  const { user } = useAuth();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [loadingUpload, setLoadingUpload] = useState(false);

  const isAdmin = user.role === 'admin';

  const handleCreate = async (data) => {
    const result = await createEquipment(data);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Peralatan baru berhasil ditambahkan.' });
    } else {
      toast({ title: 'Gagal', description: result.error, variant: 'destructive' });
    }
  };

  const handleUpdate = async (id, data) => {
    const result = await updateEquipment(id, data);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Data peralatan berhasil diperbarui.' });
    } else {
      toast({ title: 'Gagal', description: result.error, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteEquipment(id);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Peralatan berhasil dihapus.' });
    } else {
      toast({ title: 'Gagal', description: result.error, variant: 'destructive' });
    }
  };
  
  const handleFileUpload = (event) => {
    setLoadingUpload(true);
    const file = event.target.files[0];
    if (!file) {
      setLoadingUpload(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = json.map(row => ({
          name: row.name,
          code: String(row.code),
          type: row.type,
          status: row.status,
          purchase_date: row.purchase_date,
          last_maintenance_date: row.last_maintenance_date,
          notes: row.notes
        }));

        const result = await batchUploadEquipment(formattedData);
        if (result.success) {
          toast({ title: 'Sukses', description: `${result.count} data berhasil diunggah.` });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({ title: 'Gagal Mengunggah', description: error.message, variant: 'destructive' });
      } finally {
        setLoadingUpload(false);
        event.target.value = null; // Reset file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filters.type === 'all' || item.type === filters.type;
      const statusMatch = filters.status === 'all' || item.status === filters.status;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [equipment, searchTerm, filters]);
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <Helmet>
        <title>Manajemen Procurement - Corporate Management System</title>
        <meta name="description" content="Kelola inventaris dan pengadaan alat berat dan ringan perusahaan." />
      </Helmet>
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold gradient-text mb-2">Manajemen Procurement</h1>
          <p className="text-gray-400">Kelola inventaris dan pengadaan alat berat dan ringan perusahaan.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2"><Filter />Filter & Aksi</CardTitle>
                <div className="flex gap-2">
                  {isAdmin && (<>
                    <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                      <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" />Tambah Alat</Button>
                      </DialogTrigger>
                      <DialogContent className="glass-effect"><DialogHeader><DialogTitle>Tambah Peralatan Baru</DialogTitle></DialogHeader><EquipmentForm onSave={handleCreate} onFinished={() => setOpenAddDialog(false)}/></DialogContent>
                    </Dialog>
                    <Button asChild variant="outline">
                      <Label htmlFor="excel-upload">
                        {loadingUpload ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span> : <Upload className="mr-2 h-4 w-4" />}
                        Unggah Excel
                        <Input id="excel-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" disabled={loadingUpload} />
                      </Label>
                    </Button>
                  </>)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Cari nama atau kode alat..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <Select value={filters.type} onValueChange={(v) => setFilters(p => ({...p, type: v}))}>
                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        <SelectItem value="heavy">Alat Berat</SelectItem>
                        <SelectItem value="light">Alat Ringan</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v) => setFilters(p => ({...p, status: v}))}>
                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="available">Tersedia</SelectItem>
                        <SelectItem value="in_use">Digunakan</SelectItem>
                        <SelectItem value="maintenance">Perawatan</SelectItem>
                        <SelectItem value="broken">Rusak</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-effect">
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck />Daftar Peralatan</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-3">Nama Alat</th>
                      <th className="p-3">Kode</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Tgl Pembelian</th>
                      <th className="p-3">Perawatan Terakhir</th>
                      {isAdmin && <th className="p-3 text-right">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                  {loadingEquipment ? (
                      <tr><td colSpan={isAdmin ? 7 : 6} className="text-center p-6">Memuat data...</td></tr>
                  ) : filteredEquipment.length > 0 ? (
                    filteredEquipment.map(item => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-gray-400">{item.code}</td>
                        <td className="p-3 capitalize text-gray-300">{item.type === 'heavy' ? 'Alat Berat' : 'Alat Ringan'}</td>
                        <td className="p-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">{item.status}</span></td>
                        <td className="p-3 text-gray-400">{item.purchase_date}</td>
                        <td className="p-3 text-gray-400">{item.last_maintenance_date}</td>
                        {isAdmin && <td className="p-3 text-right">
                          <Dialog><DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300"><Edit className="h-4 w-4" /></Button>
                          </DialogTrigger><DialogContent className="glass-effect">
                            <DialogHeader><DialogTitle>Edit Peralatan</DialogTitle></DialogHeader>
                            <EquipmentForm equipment={item} onSave={(data) => handleUpdate(item.id, data)} onFinished={() => document.querySelector('[data-state="open"]')?.click()} />
                          </DialogContent></Dialog>
                          <AlertDialog><AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger><AlertDialogContent className="glass-effect">
                            <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data peralatan secara permanen.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent></AlertDialog>
                        </td>}
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={isAdmin ? 7 : 6} className="text-center p-6 text-gray-400">Tidak ada data yang cocok dengan filter.</td></tr>
                  )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProcurementManagement;
