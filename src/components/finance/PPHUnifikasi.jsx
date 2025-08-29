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
  nomor_bp: '',
  tanggal: '',
  jenis_pajak: '',
  kode_objek_pajak: '',
  dpp: '',
  tarif: '',
  pph: '',
  kap_kjs: '',
  objek_pajak: '',
};

const PPHUnifikasi = () => {
  const { toast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [search, setSearch] = useState('');
  const ROWS_PER_PAGE = 20;

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
      .from('pph_unifikasi')
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
    setDialogOpen(true);
  };

  const handleOpenEdit = (row) => {
    setForm({
      employeeid: row.employeeid || '',
      npwp: row.npwp || '',
      nama: row.nama || '',
      nomor_bp: row.nomor_bp || '',
      tanggal: row.tanggal ? row.tanggal.substring(0, 10) : '',
      jenis_pajak: row.jenis_pajak || '',
      kode_objek_pajak: row.kode_objek_pajak || '',
      dpp: row.dpp ?? '',
      tarif: row.tarif ?? '',
      pph: row.pph ?? '',
      kap_kjs: row.kap_kjs || '',
      objek_pajak: row.objek_pajak || '',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (employeeid) => {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await supabase
      .from('pph_unifikasi')
      .delete()
      .eq('employeeid', employeeid);
    if (error) {
      toast({ title: 'Gagal menghapus', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: 'Data terhapus' });
      setRecords((prev) => prev.filter((r) => r.employeeid !== employeeid));
    }
  };

  const toNumberOrNull = (v) => (v === '' ? null : Number(v));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employeeid: String(form.employeeid).trim(),
      npwp: String(form.npwp).trim(),
      nama: String(form.nama).trim(),
      nomor_bp: String(form.nomor_bp).trim(),
      tanggal: form.tanggal ? form.tanggal : null,
      jenis_pajak: String(form.jenis_pajak).trim(),
      kode_objek_pajak: String(form.kode_objek_pajak).trim(),
      dpp: toNumberOrNull(form.dpp),
      tarif: toNumberOrNull(form.tarif),
      pph: toNumberOrNull(form.pph),
      kap_kjs: String(form.kap_kjs).trim(),
      objek_pajak: String(form.objek_pajak).trim(),
    };

    if (!payload.employeeid || !payload.nama) {
      toast({ title: 'Validasi', description: 'Employee ID dan Nama wajib diisi.', variant: 'destructive' });
      return;
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from('pph_unifikasi')
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
        .from('pph_unifikasi')
        .insert(payload)
        .select()
        .single();
      if (error) {
        toast({ title: 'Gagal menambah', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Berhasil', description: 'Data ditambahkan' });
        setRecords((prev) => [data, ...prev]);
        setDialogOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Master Data PPh Unifikasi</h2>
            <p className="text-sm text-muted-foreground">Kelola data PPh Unifikasi (PK: employeeid)</p>
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
        <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex-none min-w-0">
          <Input
            placeholder="Cari nama, employeeid, atau NPWP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground w-auto pt-2 md:pt-0 flex-none">
          Total: {filteredRecords.length}
        </div>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[1600px] table-fixed divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">No</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Employee ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">NPWP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">Nama</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-44">Nomor BP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Tanggal</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Jenis Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Kode Objek Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">DPP (Rp)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Tarif (%)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">PPh</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">KAP-KJS</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">Objek Pajak</th>
                <th className="px-3 py-2 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={14} className="px-3 py-6 text-center text-sm text-muted-foreground">Memuat data...</td>
                </tr>
              )}
              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={14} className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada data</td>
                </tr>
              )}
              {!loading && filteredRecords.slice(0, ROWS_PER_PAGE).map((row, idx) => (
                <tr key={row.employeeid} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 text-sm w-12">{idx + 1}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.employeeid}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.npwp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.nama || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-44">{row.nomor_bp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.jenis_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.kode_objek_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.dpp != null ? currencyId.format(row.dpp) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-28">{row.tarif != null ? `${row.tarif}%` : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.pph != null ? currencyId.format(row.pph) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.kap_kjs || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.objek_pajak || '-'}</td>
                  <td className="px-3 py-2 text-right w-32">
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
        <DialogContent className="sm:max-w-[860px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit PPh Unifikasi' : 'Tambah PPh Unifikasi'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID (NIK)</Label>
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
                <Label>Nomor BP</Label>
                <Input
                  value={form.nomor_bp}
                  onChange={(e) => setForm((p) => ({ ...p, nomor_bp: e.target.value }))}
                  placeholder="Nomor Bukti Potong"
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Jenis Pajak</Label>
                <Input
                  value={form.jenis_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, jenis_pajak: e.target.value }))}
                  placeholder="PPh21 / PPh23 / ..."
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
                <Label>DPP (Rp)</Label>
                <Input
                  type="number"
                  value={form.dpp}
                  onChange={(e) => setForm((p) => ({ ...p, dpp: e.target.value }))}
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
                  placeholder="2.5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph}
                  onChange={(e) => setForm((p) => ({ ...p, pph: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>KAP-KJS</Label>
                <Input
                  value={form.kap_kjs}
                  onChange={(e) => setForm((p) => ({ ...p, kap_kjs: e.target.value }))}
                  placeholder="KAP-KJS"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Objek Pajak</Label>
                <Input
                  value={form.objek_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, objek_pajak: e.target.value }))}
                  placeholder="Objek Pajak"
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

export default PPHUnifikasi;

