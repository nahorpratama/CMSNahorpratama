import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

const currencyId = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const initialFormState = {
  employeeid: '',
  npwp: '',
  nama: '',
  kode_objek_pajak: '',
  ptkp: '',
  penghasilan_bruto: '',
  tarif: '',
  pph21: '',
  keterangan: ''
};

const PPH21Monthly = () => {
  const { toast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const term = search.toLowerCase();
    return records.filter((r) =>
      (r.nama || '').toLowerCase().includes(term) ||
      (r.employeeid || '').toLowerCase().includes(term) ||
      (r.npwp || '').toLowerCase().includes(term)
    );
  }, [records, search]);

  const resetForm = () => setForm(initialFormState);

  const loadRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pph21_monthly_summary')
      .select('*')
      .order('nama', { ascending: true });
    if (error) {
      toast({ title: 'Gagal memuat data', description: error.message, variant: 'destructive' });
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleOpenCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateForm(true);
    setDialogOpen(false);
  };

  const handleOpenEdit = (row) => {
    setForm({
      employeeid: row.employeeid || '',
      npwp: row.npwp || '',
      nama: row.nama || '',
      kode_objek_pajak: row.kode_objek_pajak || '',
      ptkp: row.ptkp || '',
      penghasilan_bruto: row.penghasilan_bruto ?? '',
      tarif: row.tarif ?? '',
      pph21: row.pph21 ?? '',
      keterangan: row.keterangan || ''
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (employeeid) => {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await supabase
      .from('pph21_monthly_summary')
      .delete()
      .eq('employeeid', employeeid);
    if (error) {
      toast({ title: 'Gagal menghapus', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: 'Data terhapus' });
      setRecords((prev) => prev.filter((r) => r.employeeid !== employeeid));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employeeid: String(form.employeeid).trim(),
      npwp: String(form.npwp).trim(),
      nama: String(form.nama).trim(),
      kode_objek_pajak: String(form.kode_objek_pajak).trim(),
      ptkp: String(form.ptkp).trim(),
      penghasilan_bruto: form.penghasilan_bruto === '' ? null : Number(form.penghasilan_bruto),
      tarif: form.tarif === '' ? null : Number(form.tarif),
      pph21: form.pph21 === '' ? null : Number(form.pph21),
      keterangan: String(form.keterangan).trim(),
    };

    if (!payload.employeeid || !payload.nama) {
      toast({ title: 'Validasi', description: 'Employee ID dan Nama wajib diisi.', variant: 'destructive' });
      return;
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from('pph21_monthly_summary')
        .update(payload)
        .eq('employeeid', payload.employeeid)
        .select()
        .single();
      if (error) {
        toast({ title: 'Gagal memperbarui', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Berhasil', description: 'Data diperbarui' });
        setRecords((prev) => prev.map((r) => (r.employeeid === payload.employeeid ? data : r)));
        setDialogOpen(false);
      }
    } else {
      const { data, error } = await supabase
        .from('pph21_monthly_summary')
        .insert(payload)
        .select()
        .single();
      if (error) {
        toast({ title: 'Gagal menambah', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Berhasil', description: 'Data ditambahkan' });
        setRecords((prev) => [data, ...prev]);
        setDialogOpen(false);
        setShowCreateForm(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Master Data Summary PPh21 Bulanan</h2>
            <p className="text-sm text-muted-foreground">Kelola data ringkasan PPh21 per karyawan (PK: employeeid)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end flex-wrap">
          <Button variant="outline" onClick={loadRecords} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Muat Ulang
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="w-full md:flex-1 min-w-0">
          <Input
            placeholder="Cari nama, employeeid, atau NPWP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground w-full md:w-auto pt-2 md:pt-0">
          Total: {filteredRecords.length}
        </div>
      </div>

      {showCreateForm && (
        <div className="rounded-md border border-border p-4 bg-card/50 space-y-4">
          <div className="text-sm font-medium">Tambah Data PPh21 Bulanan</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input
                  value={form.employeeid}
                  onChange={(e) => setForm((p) => ({ ...p, employeeid: e.target.value }))}
                  placeholder="EMP001"
                  disabled={isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input
                  value={form.nama}
                  onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                  placeholder="Nama Karyawan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>NPWP</Label>
                <Input
                  value={form.npwp}
                  onChange={(e) => setForm((p) => ({ ...p, npwp: e.target.value }))}
                  placeholder="99.999.999.9-999.999"
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Objek Pajak</Label>
                <Input
                  value={form.kode_objek_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, kode_objek_pajak: e.target.value }))}
                  placeholder="21-100-01"
                />
              </div>
              <div className="space-y-2">
                <Label>PTKP</Label>
                <Input
                  value={form.ptkp}
                  onChange={(e) => setForm((p) => ({ ...p, ptkp: e.target.value }))}
                  placeholder="TK/0 atau jumlah"
                />
              </div>
              <div className="space-y-2">
                <Label>Penghasilan Bruto</Label>
                <Input
                  type="number"
                  value={form.penghasilan_bruto}
                  onChange={(e) => setForm((p) => ({ ...p, penghasilan_bruto: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tarif (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.tarif}
                  onChange={(e) => setForm((p) => ({ ...p, tarif: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh 21</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph21}
                  onChange={(e) => setForm((p) => ({ ...p, pph21: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Keterangan</Label>
                <textarea
                  value={form.keterangan}
                  onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
                  placeholder="Keterangan tambahan (opsional)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { resetForm(); setShowCreateForm(false); }}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md border border-border overflow-hidden">
        <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">Menampilkan 20 baris data</div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">No</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">NPWP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kode Objek Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PTKP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Penghasilan Bruto</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tarif</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PPh 21</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Keterangan</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={11} className="px-3 py-6 text-center text-sm text-muted-foreground">Memuat data...</td>
                </tr>
              )}
              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada data</td>
                </tr>
              )}
              {!loading && filteredRecords.slice(0, 20).map((row, idx) => (
                <tr key={row.employeeid} className="hover:bg-muted/30">
                  <td className="px-3 py-2 text-sm">{idx + 1}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.npwp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.nama || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.employeeid}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.kode_objek_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.ptkp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.penghasilan_bruto != null ? currencyId.format(row.penghasilan_bruto) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.tarif != null ? `${row.tarif}%` : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.pph21 != null ? currencyId.format(row.pph21) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{row.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(row.employeeid)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Data PPh21' : 'Tambah Data PPh21'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input
                  value={form.employeeid}
                  onChange={(e) => setForm((p) => ({ ...p, employeeid: e.target.value }))}
                  placeholder="EMP001"
                  disabled={isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input
                  value={form.nama}
                  onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                  placeholder="Nama Karyawan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>NPWP</Label>
                <Input
                  value={form.npwp}
                  onChange={(e) => setForm((p) => ({ ...p, npwp: e.target.value }))}
                  placeholder="99.999.999.9-999.999"
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Objek Pajak</Label>
                <Input
                  value={form.kode_objek_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, kode_objek_pajak: e.target.value }))}
                  placeholder="21-100-01"
                />
              </div>
              <div className="space-y-2">
                <Label>PTKP</Label>
                <Input
                  value={form.ptkp}
                  onChange={(e) => setForm((p) => ({ ...p, ptkp: e.target.value }))}
                  placeholder="TK/0 atau jumlah"
                />
              </div>
              <div className="space-y-2">
                <Label>Penghasilan Bruto</Label>
                <Input
                  type="number"
                  value={form.penghasilan_bruto}
                  onChange={(e) => setForm((p) => ({ ...p, penghasilan_bruto: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tarif (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.tarif}
                  onChange={(e) => setForm((p) => ({ ...p, tarif: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh 21</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph21}
                  onChange={(e) => setForm((p) => ({ ...p, pph21: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Keterangan</Label>
                <textarea
                  value={form.keterangan}
                  onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
                  placeholder="Keterangan tambahan (opsional)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit">{isEditing ? 'Simpan Perubahan' : 'Simpan'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PPH21Monthly;

