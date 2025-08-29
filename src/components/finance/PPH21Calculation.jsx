import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

const currencyId = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const initialFormState = {
  employeeid: '',
  name: '',
  gender: '',
  occupation: '',
  alamat: '',
  npwp: '',
  marital_status: '',
  kategori_ter: '',
  salary: '',
  bpjs_tk_company: '',
  bpjs_kesehatan_company: '',
  bpjs_tk_personal: '',
  bpjs_kesehatan_personal: '',
  tunjangan_lapangan: '',
  tunjangan_kendaraan: '',
  tunjangan_transportasi: '',
  tunjangan_kehadiran_ho: '',
  tunjangan_kehadiran_proyek: '',
  lain_lain: '',
  kasbon: '',
  absen: '',
  take_home: '',
  tunjangan_pph21: '',
  objek_pajak: '',
  tarif_ter: '',
  pph_masa: '',
  pph21_npwp: '',
};

const PPH21Calculation = () => {
  const { toast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const ROWS_PER_PAGE = 20;

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const term = search.toLowerCase();
    return records.filter((r) =>
      (r.name || '').toLowerCase().includes(term) ||
      (r.employeeid || '').toLowerCase().includes(term) ||
      (r.npwp || '').toLowerCase().includes(term)
    );
  }, [records, search]);

  const resetForm = () => setForm(initialFormState);

  const loadRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pph21_calculation')
      .select('*')
      .order('name', { ascending: true });
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
      name: row.name || '',
      gender: row.gender || '',
      occupation: row.occupation || '',
      alamat: row.alamat || '',
      npwp: row.npwp || '',
      marital_status: row.marital_status || '',
      kategori_ter: row.kategori_ter || '',
      salary: row.salary ?? '',
      bpjs_tk_company: row.bpjs_tk_company ?? '',
      bpjs_kesehatan_company: row.bpjs_kesehatan_company ?? '',
      bpjs_tk_personal: row.bpjs_tk_personal ?? '',
      bpjs_kesehatan_personal: row.bpjs_kesehatan_personal ?? '',
      tunjangan_lapangan: row.tunjangan_lapangan ?? '',
      tunjangan_kendaraan: row.tunjangan_kendaraan ?? '',
      tunjangan_transportasi: row.tunjangan_transportasi ?? '',
      tunjangan_kehadiran_ho: row.tunjangan_kehadiran_ho ?? '',
      tunjangan_kehadiran_proyek: row.tunjangan_kehadiran_proyek ?? '',
      lain_lain: row.lain_lain ?? '',
      kasbon: row.kasbon ?? '',
      absen: row.absen ?? '',
      take_home: row.take_home ?? '',
      tunjangan_pph21: row.tunjangan_pph21 ?? '',
      objek_pajak: row.objek_pajak || '',
      tarif_ter: row.tarif_ter ?? '',
      pph_masa: row.pph_masa ?? '',
      pph21_npwp: row.pph21_npwp ?? '',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (employeeid) => {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await supabase
      .from('pph21_calculation')
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
      name: String(form.name).trim(),
      gender: String(form.gender).trim(),
      occupation: String(form.occupation).trim(),
      alamat: String(form.alamat).trim(),
      npwp: String(form.npwp).trim(),
      marital_status: String(form.marital_status).trim(),
      kategori_ter: String(form.kategori_ter).trim(),
      salary: toNumberOrNull(form.salary),
      bpjs_tk_company: toNumberOrNull(form.bpjs_tk_company),
      bpjs_kesehatan_company: toNumberOrNull(form.bpjs_kesehatan_company),
      bpjs_tk_personal: toNumberOrNull(form.bpjs_tk_personal),
      bpjs_kesehatan_personal: toNumberOrNull(form.bpjs_kesehatan_personal),
      tunjangan_lapangan: toNumberOrNull(form.tunjangan_lapangan),
      tunjangan_kendaraan: toNumberOrNull(form.tunjangan_kendaraan),
      tunjangan_transportasi: toNumberOrNull(form.tunjangan_transportasi),
      tunjangan_kehadiran_ho: toNumberOrNull(form.tunjangan_kehadiran_ho),
      tunjangan_kehadiran_proyek: toNumberOrNull(form.tunjangan_kehadiran_proyek),
      lain_lain: toNumberOrNull(form.lain_lain),
      kasbon: toNumberOrNull(form.kasbon),
      absen: toNumberOrNull(form.absen),
      take_home: toNumberOrNull(form.take_home),
      tunjangan_pph21: toNumberOrNull(form.tunjangan_pph21),
      objek_pajak: String(form.objek_pajak).trim(),
      tarif_ter: toNumberOrNull(form.tarif_ter),
      pph_masa: toNumberOrNull(form.pph_masa),
      pph21_npwp: toNumberOrNull(form.pph21_npwp),
    };

    if (!payload.employeeid || !payload.name) {
      toast({ title: 'Validasi', description: 'Employee ID dan Name wajib diisi.', variant: 'destructive' });
      return;
    }

    if (isEditing) {
      const { data, error } = await supabase
        .from('pph21_calculation')
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
        .from('pph21_calculation')
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
          <PieChart className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Master Data Perhitungan PPh21</h2>
            <p className="text-sm text-muted-foreground">Kelola data perhitungan PPh21 (PK: employeeid)</p>
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
            placeholder="Cari name, employeeid, atau NPWP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground w-auto pt-2 md:pt-0 flex-none">
          Total: {filteredRecords.length}
        </div>
      </div>

      {showCreateForm && (
        <div className="rounded-md border border-border p-4 bg-card/50 space-y-4">
          <div className="text-sm font-medium">Tambah Perhitungan PPh21</div>
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
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nama Karyawan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input
                  value={form.gender}
                  onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                  placeholder="Laki-laki / Perempuan"
                />
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={form.occupation}
                  onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                  placeholder="Jabatan"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Alamat</Label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => setForm((p) => ({ ...p, alamat: e.target.value }))}
                  placeholder="Alamat lengkap"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
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
                <Label>Marital Status</Label>
                <Input
                  value={form.marital_status}
                  onChange={(e) => setForm((p) => ({ ...p, marital_status: e.target.value }))}
                  placeholder="TK/0, K/1, dst"
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori TER</Label>
                <Input
                  value={form.kategori_ter}
                  onChange={(e) => setForm((p) => ({ ...p, kategori_ter: e.target.value }))}
                  placeholder="Kategori TER"
                />
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS TK - Paid by Company</Label>
                <Input
                  type="number"
                  value={form.bpjs_tk_company}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_tk_company: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS Kesehatan - Paid by Company</Label>
                <Input
                  type="number"
                  value={form.bpjs_kesehatan_company}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_kesehatan_company: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS TK - Paid by Personal</Label>
                <Input
                  type="number"
                  value={form.bpjs_tk_personal}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_tk_personal: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS Kesehatan - Paid by Personal</Label>
                <Input
                  type="number"
                  value={form.bpjs_kesehatan_personal}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_kesehatan_personal: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Lapangan</Label>
                <Input
                  type="number"
                  value={form.tunjangan_lapangan}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_lapangan: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kendaraan</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kendaraan}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kendaraan: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Transportasi</Label>
                <Input
                  type="number"
                  value={form.tunjangan_transportasi}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_transportasi: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kehadiran di HO</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kehadiran_ho}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kehadiran_ho: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kehadiran di Proyek</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kehadiran_proyek}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kehadiran_proyek: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Lain-Lain</Label>
                <Input
                  type="number"
                  value={form.lain_lain}
                  onChange={(e) => setForm((p) => ({ ...p, lain_lain: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Kasbon</Label>
                <Input
                  type="number"
                  value={form.kasbon}
                  onChange={(e) => setForm((p) => ({ ...p, kasbon: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Absen</Label>
                <Input
                  type="number"
                  value={form.absen}
                  onChange={(e) => setForm((p) => ({ ...p, absen: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Take Home</Label>
                <Input
                  type="number"
                  value={form.take_home}
                  onChange={(e) => setForm((p) => ({ ...p, take_home: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan PPh 21</Label>
                <Input
                  type="number"
                  value={form.tunjangan_pph21}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_pph21: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Objek Pajak</Label>
                <Input
                  value={form.objek_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, objek_pajak: e.target.value }))}
                  placeholder="Kode/Objek Pajak"
                />
              </div>
              <div className="space-y-2">
                <Label>Tarif TER (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.tarif_ter}
                  onChange={(e) => setForm((p) => ({ ...p, tarif_ter: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh Masa/Bulanan</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph_masa}
                  onChange={(e) => setForm((p) => ({ ...p, pph_masa: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh 21 NPWP</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph21_npwp}
                  onChange={(e) => setForm((p) => ({ ...p, pph21_npwp: e.target.value }))}
                  placeholder="0"
                  min="0"
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
        <div className="table-container w-full">
          <table className="min-w-[2000px] table-fixed divide-y divide-border">
            <thead className="bg-muted/50">
              <tr className="sticky top-0 bg-muted/70 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">No</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Gender</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Occupation</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Employee ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-72">Alamat</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">NPWP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Marital Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Kategori TER</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Salary</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">BPJS TK (Company)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">BPJS Kes (Company)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">BPJS TK (Personal)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">BPJS Kes (Personal)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Tunj. Lapangan</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Tunj. Kendaraan</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">Tunj. Transportasi</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Kehadiran HO</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-44">Kehadiran Proyek</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Lain-Lain</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Kasbon</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Absen</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Take Home</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">Tunj. PPh21</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">Objek Pajak</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Tarif TER</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">PPh Masa/Bulanan</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">PPh21 NPWP</th>
                <th className="px-3 py-2 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={29} className="px-3 py-6 text-center text-sm text-muted-foreground">Memuat data...</td>
                </tr>
              )}
              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={29} className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada data</td>
                </tr>
              )}
              {!loading && filteredRecords.slice(0, ROWS_PER_PAGE).map((row, idx) => (
                <tr key={row.employeeid} className="hover:bg-primary/5 transition-colors">
                  <td className="px-3 py-2 text-sm w-12">{idx + 1}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.name || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-24">{row.gender || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.occupation || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.employeeid}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-72 max-w-[288px] truncate" title={row.alamat || ''}>{row.alamat || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.npwp || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.marital_status || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.kategori_ter || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.salary != null ? currencyId.format(row.salary) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.bpjs_tk_company != null ? currencyId.format(row.bpjs_tk_company) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.bpjs_kesehatan_company != null ? currencyId.format(row.bpjs_kesehatan_company) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.bpjs_tk_personal != null ? currencyId.format(row.bpjs_tk_personal) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.bpjs_kesehatan_personal != null ? currencyId.format(row.bpjs_kesehatan_personal) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.tunjangan_lapangan != null ? currencyId.format(row.tunjangan_lapangan) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.tunjangan_kendaraan != null ? currencyId.format(row.tunjangan_kendaraan) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.tunjangan_transportasi != null ? currencyId.format(row.tunjangan_transportasi) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.tunjangan_kehadiran_ho != null ? currencyId.format(row.tunjangan_kehadiran_ho) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-44">{row.tunjangan_kehadiran_proyek != null ? currencyId.format(row.tunjangan_kehadiran_proyek) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.lain_lain != null ? currencyId.format(row.lain_lain) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-32">{row.kasbon != null ? currencyId.format(row.kasbon) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-28">{row.absen != null ? row.absen : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.take_home != null ? currencyId.format(row.take_home) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-40">{row.tunjangan_pph21 != null ? currencyId.format(row.tunjangan_pph21) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-36">{row.objek_pajak || '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-28">{row.tarif_ter != null ? `${row.tarif_ter}%` : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.pph_masa != null ? currencyId.format(row.pph_masa) : '-'}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap w-48">{row.pph21_npwp != null ? currencyId.format(row.pph21_npwp) : '-'}</td>
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
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Perhitungan PPh21' : 'Tambah Perhitungan PPh21'}</DialogTitle>
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
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nama Karyawan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input
                  value={form.gender}
                  onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                  placeholder="Laki-laki / Perempuan"
                />
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={form.occupation}
                  onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                  placeholder="Jabatan"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Alamat</Label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => setForm((p) => ({ ...p, alamat: e.target.value }))}
                  placeholder="Alamat lengkap"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
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
                <Label>Marital Status</Label>
                <Input
                  value={form.marital_status}
                  onChange={(e) => setForm((p) => ({ ...p, marital_status: e.target.value }))}
                  placeholder="TK/0, K/1, dst"
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori TER</Label>
                <Input
                  value={form.kategori_ter}
                  onChange={(e) => setForm((p) => ({ ...p, kategori_ter: e.target.value }))}
                  placeholder="Kategori TER"
                />
              </div>

              <div className="space-y-2">
                <Label>Salary</Label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS TK - Paid by Company</Label>
                <Input
                  type="number"
                  value={form.bpjs_tk_company}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_tk_company: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS Kesehatan - Paid by Company</Label>
                <Input
                  type="number"
                  value={form.bpjs_kesehatan_company}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_kesehatan_company: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS TK - Paid by Personal</Label>
                <Input
                  type="number"
                  value={form.bpjs_tk_personal}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_tk_personal: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>BPJS Kesehatan - Paid by Personal</Label>
                <Input
                  type="number"
                  value={form.bpjs_kesehatan_personal}
                  onChange={(e) => setForm((p) => ({ ...p, bpjs_kesehatan_personal: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Tunjangan Lapangan</Label>
                <Input
                  type="number"
                  value={form.tunjangan_lapangan}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_lapangan: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kendaraan</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kendaraan}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kendaraan: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Transportasi</Label>
                <Input
                  type="number"
                  value={form.tunjangan_transportasi}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_transportasi: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kehadiran di HO</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kehadiran_ho}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kehadiran_ho: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan Kehadiran di Proyek</Label>
                <Input
                  type="number"
                  value={form.tunjangan_kehadiran_proyek}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_kehadiran_proyek: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Lain-Lain</Label>
                <Input
                  type="number"
                  value={form.lain_lain}
                  onChange={(e) => setForm((p) => ({ ...p, lain_lain: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Kasbon</Label>
                <Input
                  type="number"
                  value={form.kasbon}
                  onChange={(e) => setForm((p) => ({ ...p, kasbon: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Absen</Label>
                <Input
                  type="number"
                  value={form.absen}
                  onChange={(e) => setForm((p) => ({ ...p, absen: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Take Home</Label>
                <Input
                  type="number"
                  value={form.take_home}
                  onChange={(e) => setForm((p) => ({ ...p, take_home: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Tunjangan PPh 21</Label>
                <Input
                  type="number"
                  value={form.tunjangan_pph21}
                  onChange={(e) => setForm((p) => ({ ...p, tunjangan_pph21: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Objek Pajak</Label>
                <Input
                  value={form.objek_pajak}
                  onChange={(e) => setForm((p) => ({ ...p, objek_pajak: e.target.value }))}
                  placeholder="Kode/Objek Pajak"
                />
              </div>
              <div className="space-y-2">
                <Label>Tarif TER (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.tarif_ter}
                  onChange={(e) => setForm((p) => ({ ...p, tarif_ter: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh Masa/Bulanan</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph_masa}
                  onChange={(e) => setForm((p) => ({ ...p, pph_masa: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>PPh 21 NPWP</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pph21_npwp}
                  onChange={(e) => setForm((p) => ({ ...p, pph21_npwp: e.target.value }))}
                  placeholder="0"
                  min="0"
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

export default PPH21Calculation;

