import { useState } from 'react'
import { Plus, Search, Filter, X, FileText, Package, Edit2, Trash2 } from 'lucide-react'
import { ModernTable } from '../components/ModernTable'
import { pengajuanData as initialData } from '../data/sampleData'
import './Pengajuan.css'

function Pengajuan() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pengajuanData, setPengajuanData] = useState(initialData)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [formData, setFormData] = useState({
        pemohon: '',
        komoditas: '',
        jenisAset: 'Hewan',
        jumlah: '',
        negaraAsal: 'Indonesia',
        negaraTujuan: '',
        dokumenBeaCukai: '',
        dokumenKarantina: '',
        dokumenAsal: '',
        packingList: ''
    })

    const columns = [
        {
            header: 'Kode',
            field: 'kode',
            width: '140px',
            render: (row) => <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>{row.kode}</strong>
        },
        {
            header: 'Tanggal',
            field: 'tanggal',
            width: '100px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.tanggal}</span>
        },
        {
            header: 'Pemohon',
            field: 'pemohon',
            width: '220px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.pemohon}</span>
        },
        {
            header: 'Komoditas',
            field: 'komoditas',
            width: '180px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.komoditas}</span>
        },
        {
            header: 'Jumlah',
            field: 'jumlah',
            width: '100px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.jumlah}</span>
        },
        {
            header: 'Asal → Tujuan',
            field: 'negaraTujuan',
            width: '160px',
            render: (row) => <span style={{ fontSize: '12px' }}>{row.negaraAsal} → {row.negaraTujuan}</span>
        },
        {
            header: 'Dokumen',
            field: 'dokumenLengkap',
            width: '100px',
            render: (row) => row.dokumenLengkap ?
                <span className="badge badge-success" style={{ fontSize: '10px' }}>Lengkap</span> :
                <span className="badge badge-warning" style={{ fontSize: '10px' }}>Pending</span>
        },
        {
            header: 'Status',
            field: 'status',
            width: '110px',
            render: (row) => {
                const statusMap = {
                    pending: { label: 'Menunggu', class: 'badge-warning' },
                    processing: { label: 'Diproses', class: 'badge-info' },
                    approved: { label: 'Disetujui', class: 'badge-success' }
                }
                const status = statusMap[row.status]
                return <span className={`badge ${status.class}`} style={{ fontSize: '10px' }}>{status.label}</span>
            }
        }
    ]

    const filteredData = pengajuanData.filter(item =>
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.komoditas.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRowClick = (row) => {
        setSelectedItem(row)
        setShowDetailModal(true)
    }

    const handleEdit = (item) => {
        setSelectedItem(item)
        setFormData({
            pemohon: item.pemohon,
            komoditas: item.komoditas,
            jenisAset: item.jenisAset,
            jumlah: item.jumlah,
            negaraAsal: item.negaraAsal,
            negaraTujuan: item.negaraTujuan,
            dokumenBeaCukai: item.dokumen.beaCukai,
            dokumenKarantina: item.dokumen.sertifikatKarantina,
            dokumenAsal: item.dokumen.sertifikatAsal,
            packingList: item.dokumen.packingList
        })
        setShowDetailModal(false)
        setShowEditModal(true)
    }

    const handleDelete = (item) => {
        if (confirm(`Hapus pengajuan ${item.kode}?`)) {
            setPengajuanData(pengajuanData.filter(p => p.id !== item.id))
            setShowDetailModal(false)
            alert('Pengajuan berhasil dihapus!')
        }
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault()
        const newId = Math.max(...pengajuanData.map(p => p.id)) + 1
        const newPengajuan = {
            id: newId,
            kode: `PJN-2026-${String(newId).padStart(4, '0')}`,
            tanggal: new Date().toISOString().slice(0, 10),
            pemohon: formData.pemohon,
            komoditas: formData.komoditas,
            jenisAset: formData.jenisAset,
            jumlah: formData.jumlah,
            negaraAsal: formData.negaraAsal,
            negaraTujuan: formData.negaraTujuan,
            status: 'pending',
            dokumenLengkap: true,
            dokumen: {
                beaCukai: formData.dokumenBeaCukai,
                sertifikatKarantina: formData.dokumenKarantina,
                sertifikatAsal: formData.dokumenAsal,
                packingList: formData.packingList
            },
            manifest: []
        }
        setPengajuanData([...pengajuanData, newPengajuan])
        alert('Pengajuan berhasil dibuat!')
        setShowCreateModal(false)
        resetForm()
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()
        const updatedData = pengajuanData.map(item => {
            if (item.id === selectedItem.id) {
                return {
                    ...item,
                    pemohon: formData.pemohon,
                    komoditas: formData.komoditas,
                    jenisAset: formData.jenisAset,
                    jumlah: formData.jumlah,
                    negaraAsal: formData.negaraAsal,
                    negaraTujuan: formData.negaraTujuan,
                    dokumen: {
                        beaCukai: formData.dokumenBeaCukai,
                        sertifikatKarantina: formData.dokumenKarantina,
                        sertifikatAsal: formData.dokumenAsal,
                        packingList: formData.packingList
                    }
                }
            }
            return item
        })
        setPengajuanData(updatedData)
        alert('Pengajuan berhasil diupdate!')
        setShowEditModal(false)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            pemohon: '',
            komoditas: '',
            jenisAset: 'Hewan',
            jumlah: '',
            negaraAsal: 'Indonesia',
            negaraTujuan: '',
            dokumenBeaCukai: '',
            dokumenKarantina: '',
            dokumenAsal: '',
            packingList: ''
        })
    }

    return (
        <div className="page pengajuan-table">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pengajuan Karantina</h1>
                    <p className="page-subtitle">Daftar pengajuan izin ekspor/impor</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} /> Buat Pengajuan
                </button>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari kode, pemohon, atau komoditas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button className="btn btn-secondary">
                    <Filter size={18} /> Filter
                </button>
            </div>

            <ModernTable
                columns={columns}
                data={filteredData}
                onRowClick={handleRowClick}
                emptyMessage="Tidak ada pengajuan ditemukan"
            />

            {/* Detail Modal with Manifest */}
            {showDetailModal && selectedItem && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowDetailModal(false)} />
                    <div className="modal modal-detail-large">
                        <div className="modal-header">
                            <h2>Detail Pengajuan - {selectedItem.kode}</h2>
                            <button className="btn-icon" onClick={() => setShowDetailModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Info Umum */}
                            <div className="detail-section">
                                <h4><FileText size={16} /> Informasi Umum</h4>
                                <div className="detail-grid-3">
                                    <div className="detail-field">
                                        <label>Kode Pengajuan</label>
                                        <div className="detail-value">{selectedItem.kode}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Tanggal</label>
                                        <div className="detail-value">{selectedItem.tanggal}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Status</label>
                                        <div className="detail-value">
                                            {selectedItem.status === 'approved' ? 'Disetujui' :
                                                selectedItem.status === 'processing' ? 'Diproses' : 'Menunggu'}
                                        </div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Pemohon</label>
                                        <div className="detail-value">{selectedItem.pemohon}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Komoditas</label>
                                        <div className="detail-value">{selectedItem.komoditas}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Jenis Aset</label>
                                        <div className="detail-value">{selectedItem.jenisAset}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen Pendukung */}
                            <div className="detail-section">
                                <h4><FileText size={16} /> Dokumen Pendukung</h4>
                                <div className="detail-grid-2">
                                    <div className="detail-field">
                                        <label>Bea Cukai (BC)</label>
                                        <div className="detail-value">{selectedItem.dokumen.beaCukai}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Sertifikat Karantina (KT-9)</label>
                                        <div className="detail-value">{selectedItem.dokumen.sertifikatKarantina}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Sertifikat Asal (CO)</label>
                                        <div className="detail-value">{selectedItem.dokumen.sertifikatAsal}</div>
                                    </div>
                                    <div className="detail-field">
                                        <label>Packing List</label>
                                        <div className="detail-value">{selectedItem.dokumen.packingList}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Manifest Detail */}
                            {selectedItem.manifest && selectedItem.manifest.length > 0 && (
                                <div className="detail-section">
                                    <h4><Package size={16} /> Manifest Pengiriman</h4>
                                    <div className="manifest-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Item</th>
                                                    <th>Jumlah</th>
                                                    <th>Satuan</th>
                                                    <th>Berat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedItem.manifest.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td>{item.item}</td>
                                                        <td>{item.qty}</td>
                                                        <td>{item.satuan}</td>
                                                        <td>{item.berat}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Tutup
                            </button>
                            <button className="btn btn-primary" onClick={() => handleEdit(selectedItem)}>
                                <Edit2 size={16} /> Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(selectedItem)}>
                                <Trash2 size={16} /> Hapus
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
                <>
                    <div className="modal-backdrop" onClick={() => { setShowCreateModal(false); setShowEditModal(false) }} />
                    <div className="modal modal-create">
                        <div className="modal-header">
                            <h2>{showEditModal ? `Edit Pengajuan - ${selectedItem.kode}` : 'Buat Pengajuan Baru'}</h2>
                            <button className="btn-icon" onClick={() => { setShowCreateModal(false); setShowEditModal(false) }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit}>
                            <div className="modal-body">
                                <div className="form-section">
                                    <h4>Informasi Pemohon & Komoditas</h4>
                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Nama Pemohon *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.pemohon}
                                                onChange={(e) => setFormData({ ...formData, pemohon: e.target.value })}
                                                placeholder="PT. Nama Perusahaan"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Komoditas *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.komoditas}
                                                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                                                placeholder="Nama komoditas"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Jenis Aset *</label>
                                            <select
                                                className="input"
                                                value={formData.jenisAset}
                                                onChange={(e) => setFormData({ ...formData, jenisAset: e.target.value })}
                                            >
                                                <option value="Hewan">Hewan</option>
                                                <option value="Tumbuhan">Tumbuhan</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>Jumlah *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.jumlah}
                                                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                                                placeholder="500 ekor / 1000 pot"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Negara Asal *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.negaraAsal}
                                                onChange={(e) => setFormData({ ...formData, negaraAsal: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Negara Tujuan *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.negaraTujuan}
                                                onChange={(e) => setFormData({ ...formData, negaraTujuan: e.target.value })}
                                                placeholder="Singapura, Jepang, dll"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>Nomor Dokumen Pendukung</h4>
                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Nomor Bea Cukai (BC) *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.dokumenBeaCukai}
                                                onChange={(e) => setFormData({ ...formData, dokumenBeaCukai: e.target.value })}
                                                placeholder="BC-001/2026"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Sertifikat Karantina (KT-9) *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.dokumenKarantina}
                                                onChange={(e) => setFormData({ ...formData, dokumenKarantina: e.target.value })}
                                                placeholder="KT-9-001/2026"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Sertifikat Asal (CO) *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.dokumenAsal}
                                                onChange={(e) => setFormData({ ...formData, dokumenAsal: e.target.value })}
                                                placeholder="CO-001/2026"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Packing List *</label>
                                            <input
                                                type="text"
                                                className="input"
                                                required
                                                value={formData.packingList}
                                                onChange={(e) => setFormData({ ...formData, packingList: e.target.value })}
                                                placeholder="PL-001/2026"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateModal(false); setShowEditModal(false); resetForm() }}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {showEditModal ? <><Edit2 size={16} /> Update</> : <><Plus size={16} /> Buat Pengajuan</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}

export default Pengajuan
