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
  npwp: '',
  employeeid: '',
  nama: '',
  nomor_faktur: '',
  tanggal_faktur: '',
  masa_ppn: '',
  tahun_ppn: '',
  status_faktur: '',
  dpp: '',
  ppn: '',
  ppnbm: '',
  keterangan: '',
  pph_persen: '',
  bukti_potong: '',
  no_bukti_potong: '',
  nilai_bukti_potong: '',
  masa_pajak: '',
  tahun_pajak: '',
  keterangan_bukti_potong: '',
};

const WithholdingTaxSlip = () => {
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
      .from('withholding_tax_slip')
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
      npwp: row.npwp || '',
      employeeid: row.employeeid || '',
      nama: row.nama || '',
      nomor_faktur: row.nomor_faktur || '',
      tanggal_faktur: row.tanggal_faktur ? row.tanggal_faktur.substring(0, 10) : '',
      masa_ppn: row.masa_ppn || '',
      tahun_ppn: row.tahun_ppn || '',
      status_faktur: row.status_faktur || '',
      dpp: row.dpp ?? '',
      ppn: row.ppn ?? '',
      ppnbm: row.ppnbm ?? '',
      keterangan: row.keterangan || '',
      pph_persen: row.pph_persen ?? '',
      bukti_potong: row.bukti_potong || '',
      no_bukti_potong: row.no_bukti_potong || '',
      nilai_bukti_potong: row.nilai_bukti_potong ?? '',
      masa_pajak: row.masa_pajak || '',
      tahun_pajak: row.tahun_pajak || '',
      keterangan_bukti_potong: row.keterangan_bukti_potong || '',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (employeeid) => {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await supabase
      .from('withholding_tax_slip')
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
      npwp: String(form.npwp).trim(),
      employeeid: String(form.employeeid).trim(),
      nama: String(form.nama).trim(),
      nomor_faktur: String(form.nomor_faktur).trim(),
      tanggal_faktur: form.tanggal_faktur ? form.tanggal_faktur : null,
      masa_ppn: String(form.masa_ppn).trim(),
      tahun_ppn: String(form.tahun_ppn).trim(),
      status_faktur: String(form.status_faktur).trim(),
      dpp: toNumberOrNull(form.dpp),
      ppn: toNumberOrNull(form.ppn),
      ppnbm: toNumberOrNull(form.ppnbm),
      keterangan: String(form.keterangan).trim(),
      pph_persen: toNumberOrNull(form.pph_persen),
      bukti_potong: String(form.bukti_potong).trim(),
      no_bukti_potong: String(form.no_bukti_potong).trim(),
      nilai_bukti_potong: toNumberOrNull(form.nilai_bukti_potong),
      masa_pajak: String(form.masa_pajak).trim(),
      tahun_pajak: String(form.tahun_pajak).trim(),
      keterangan_bukti_potong: String(form.keterangan_bukti_potong).trim(),
    };

    if (!payload.employeeid || !payload.nama) {
      toast({ title: 'Validasi', description: 'Employee ID dan Nama wajib diisi.', variant: 'destructive' });
      return;
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from('withholding_tax_slip')
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
        .from('withholding_tax_slip')
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
            <h2 className="text-xl font-semibold">Master Data Withholding Tax Slip</h2>
            <p className="text-sm text-muted-foreground">Kelola Withholding Tax Slip (PK: employeeid)</p>
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
        <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">Menampilkan 20 baris data</div>
        <div className="table-container w-full">
          <table className="min-w-[1800px] table-fixed divide-y divide-border">
            <thead className="bg-muted/50">
              <tr className="sticky top-0 bg-muted/70 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">No</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">NPWP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Employee ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">Nama</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-44">Nomor Faktur</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Tanggal Faktur</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Masa (PPN)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Tahun (PPN)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Status Faktur</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">DPP (Rp)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">PPN</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">PPnBM</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-64">Keterangan</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">PPh (%)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Bukti Potong</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-44">No Bukti Potong</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-44">Nilai Bukti Potong</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Masa Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Tahun Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-64">Keterangan Bukti Potong</th>
                <th className="px-3 py-2 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={21} className="px-3 py-6 text-center text-sm text-muted-foreground">Memuat data...</td>
                </tr>
              )}
              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={21} className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada data</td>
                </tr>
              )}
              {!loading && filteredRecords.slice(0, ROWS_PER_PAGE).map((row, idx) => (
                <tr key={row.employeeid} className="hover:bg-primary/5 transition-colors">
                  <td className="px-3 py-2 text-sm w-12">{idx + 1}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.npwp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.employeeid}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.nama || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-44">{row.nomor_faktur || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.tanggal_faktur ? new Date(row.tanggal_faktur).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.masa_ppn || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.tahun_ppn || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.status_faktur || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.dpp != null ? currencyId.format(row.dpp) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.ppn != null ? currencyId.format(row.ppn) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.ppnbm != null ? currencyId.format(row.ppnbm) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-64 truncate" title={row.keterangan || ''}>{row.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-28">{row.pph_persen != null ? `${row.pph_persen}%` : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.bukti_potong || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-44">{row.no_bukti_potong || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-44">{row.nilai_bukti_potong != null ? currencyId.format(row.nilai_bukti_potong) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.masa_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.tahun_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-64 truncate" title={row.keterangan_bukti_potong || ''}>{row.keterangan_bukti_potong || '-'}</td>
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
        <DialogContent className="sm:max-w-[980px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Withholding Tax Slip' : 'Tambah Withholding Tax Slip'}</DialogTitle>
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
                <Label>Nomor Faktur</Label>
                <Input
                  value={form.nomor_faktur}
                  onChange={(e) => setForm((p) => ({ ...p, nomor_faktur: e.target.value }))}
                  placeholder="Nomor Faktur"
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Faktur</Label>
                <Input
                  type="date"
                  value={form.tanggal_faktur}
                  onChange={(e) => setForm((p) => ({ ...p, tanggal_faktur: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Masa (PPN)</Label>
                <Input
                  value={form.masa_ppn}
                  onChange={(e) => setForm((p) => ({ ...p, masa_ppn: e.target.value }))}
                  placeholder="01..12"
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun (PPN)</Label>
                <Input
                  value={form.tahun_ppn}
                  onChange={(e) => setForm((p) => ({ ...p, tahun_ppn: e.target.value }))}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Status Faktur</Label>
                <Input
                  value={form.status_faktur}
                  onChange={(e) => setForm((p) => ({ ...p, status_faktur: e.target.value }))}
                  placeholder="Normal / Pengganti / ..."
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
                <Label>PPN</Label>
                <Input
                  type="number"
                  value={form.ppn}
                  onChange={(e) => setForm((p) => ({ ...p, ppn: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPnBM</Label>
                <Input
                  type="number"
                  value={form.ppnbm}
                  onChange={(e) => setForm((p) => ({ ...p, ppnbm: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Keterangan</Label>
                <Input
                  value={form.keterangan}
                  onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
                  placeholder="Keterangan"
                />
              </div>

              <div className="space-y-2">
                <Label>PPh (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph_persen}
                  onChange={(e) => setForm((p) => ({ ...p, pph_persen: e.target.value }))}
                  placeholder="2.5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Bukti Potong</Label>
                <Input
                  value={form.bukti_potong}
                  onChange={(e) => setForm((p) => ({ ...p, bukti_potong: e.target.value }))}
                  placeholder="Jenis Bukti Potong"
                />
              </div>
              <div className="space-y-2">
                <Label>No Bukti Potong</Label>
                <Input
                  value={form.no_bukti_potong}
                  onChange={(e) => setForm((p) => ({ ...p, no_bukti_potong: e.target.value }))}
                  placeholder="Nomor Bukti Potong"
                />
              </div>
              <div className="space-y-2">
                <Label>Nilai Bukti Potong</Label>
                <Input
                  type="number"
                  value={form.nilai_bukti_potong}
                  onChange={(e) => setForm((p) => ({ ...p, nilai_bukti_potong: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Masa Pajak</Label>
                <Input
                  value={form.masa_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, masa_pajak: e.target.value }))}
                  placeholder="01..12"
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun Pajak</Label>
                <Input
                  value={form.tahun_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, tahun_pajak: e.target.value }))}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Keterangan Bukti Potong</Label>
                <Input
                  value={form.keterangan_bukti_potong}
                  onChange={(e) => setForm((p) => ({ ...p, keterangan_bukti_potong: e.target.value }))}
                  placeholder="Keterangan Bukti Potong"
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

export default WithholdingTaxSlip;

