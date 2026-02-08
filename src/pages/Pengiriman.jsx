import { useState } from 'react'
import { Plus, Search, CheckCircle, Printer, Lock } from 'lucide-react'
import { ModernTable } from '../components/ModernTable'
import { QRCodeSVG } from 'qrcode.react'
import { pengajuanData, pengirimanData as initialPengirimanData } from '../data/sampleData'
import './Pengiriman.css'

// Filter approved pengajuan only
const approvedPengajuan = pengajuanData.filter(p => p.status === 'approved')

function Pengiriman() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pengirimanData, setPengirimanData] = useState(initialPengirimanData)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [selectedPengajuan, setSelectedPengajuan] = useState(null)
    const [selectedRO, setSelectedRO] = useState(null)
    const [approvalPIN, setApprovalPIN] = useState('')
    const [formData, setFormData] = useState({
        lokasiTujuan: '',
        kendaraan: '',
        sopir: ''
    })

    const columns = [
        {
            header: 'Release Order',
            field: 'kode',
            width: '130px',
            render: (row) => <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>{row.kode}</strong>
        },
        {
            header: 'Ref. Pengajuan',
            field: 'pengajuanKode',
            width: '140px',
            render: (row) => <span style={{ fontSize: '12px', color: '#6b7280' }}>{row.pengajuanKode}</span>
        },
        {
            header: 'Pemilik',
            field: 'pemilik',
            width: '200px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.pemilik}</span>
        },
        {
            header: 'Komoditas',
            field: 'komoditas',
            width: '150px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.komoditas}</span>
        },
        {
            header: 'Jumlah',
            field: 'jumlah',
            width: '110px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.jumlah}</span>
        },
        {
            header: 'Tujuan',
            field: 'lokasiTujuan',
            width: '200px',
            render: (row) => <span style={{ fontSize: '12px' }}>{row.lokasiTujuan}</span>
        },
        {
            header: 'Status',
            field: 'status',
            width: '150px',
            render: (row) => {
                const statusMap = {
                    pending_approval: { label: 'Menunggu Approval', class: 'badge-warning' },
                    approved: { label: 'Disetujui', class: 'badge-success' },
                    released: { label: 'Telah Keluar', class: 'badge-info' }
                }
                const status = statusMap[row.status]
                return <span className={`badge ${status.class}`} style={{ fontSize: '10px' }}>{status.label}</span>
            }
        },
        {
            header: 'Aksi',
            field: 'actions',
            width: '180px',
            render: (row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    {row.status === 'pending_approval' && (
                        <button
                            className="btn-sm btn-primary"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRO(row)
                                setShowApprovalModal(true)
                            }}
                        >
                            <CheckCircle size={14} /> Approve
                        </button>
                    )}
                    {row.status === 'approved' && (
                        <button
                            className="btn-sm btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRO(row)
                                setShowPrintModal(true)
                            }}
                        >
                            <Printer size={14} /> Cetak
                        </button>
                    )}
                </div>
            )
        }
    ]

    const filteredData = pengirimanData.filter(item =>
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.komoditas.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateRO = (pengajuan) => {
        setSelectedPengajuan(pengajuan)
        setFormData({
            lokasiTujuan: '',
            kendaraan: '',
            sopir: ''
        })
        setShowCreateModal(true)
    }

    const handleSubmitRO = (e) => {
        e.preventDefault()

        // Generate new RO
        const newId = Math.max(...pengirimanData.map(p => p.id), 0) + 1
        const newRO = {
            id: newId,
            kode: `RO-2026-${String(newId).padStart(3, '0')}`,
            pengajuanKode: selectedPengajuan.kode,
            pemilik: selectedPengajuan.pemohon,
            komoditas: selectedPengajuan.komoditas,
            jumlah: selectedPengajuan.jumlah,
            lokasiTujuan: formData.lokasiTujuan,
            koordinatTujuan: { lat: -6.2088, lng: 106.8456 }, // Simulated
            kendaraan: formData.kendaraan,
            sopir: formData.sopir,
            status: 'pending_approval',
            approvedBy: null,
            approvedAt: null,
            segel: `SEAL-2026-${String(newId).padStart(4, '0')}`,
            dokumen: {
                beaCukai: selectedPengajuan.dokumen.beaCukai,
                karantina: selectedPengajuan.dokumen.sertifikatKarantina
            }
        }

        // Add to state
        setPengirimanData([...pengirimanData, newRO])

        alert(`Release Order berhasil dibuat!\nKode: ${newRO.kode}\nSegel: ${newRO.segel}`)
        setShowCreateModal(false)
        setFormData({ lokasiTujuan: '', kendaraan: '', sopir: '' })
    }

    const handleApproval = (e) => {
        e.preventDefault()
        if (approvalPIN === '123456') {
            // Update RO status
            const updatedData = pengirimanData.map(item => {
                if (item.id === selectedRO.id) {
                    return {
                        ...item,
                        status: 'approved',
                        approvedBy: 'Drh. Ahmad Yani',
                        approvedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                    }
                }
                return item
            })

            setPengirimanData(updatedData)
            alert(`Release Order ${selectedRO.kode} telah disetujui!`)
            setShowApprovalModal(false)
            setApprovalPIN('')
        } else {
            alert('PIN salah! Gunakan: 123456')
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="page pengiriman-table">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pelepasan Karantina (Release Order)</h1>
                    <p className="page-subtitle">Otorisasi pengeluaran barang dari karantina</p>
                </div>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari kode, pemilik, atau komoditas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Approved Pengajuan List */}
            <div className="approved-section">
                <h3 className="section-title">Pengajuan Siap Diproses (Approved)</h3>
                <div className="approved-grid">
                    {approvedPengajuan.map(item => (
                        <div key={item.id} className="approved-card">
                            <div className="approved-header">
                                <strong>{item.kode}</strong>
                                <span className="badge badge-success" style={{ fontSize: '10px' }}>Approved</span>
                            </div>
                            <div className="approved-body">
                                <p><strong>{item.pemohon}</strong></p>
                                <p>{item.komoditas} - {item.jumlah}</p>
                                <p style={{ fontSize: '11px', color: '#6b7280' }}>
                                    BC: {item.dokumen.beaCukai} | KT-9: {item.dokumen.karantina}
                                </p>
                            </div>
                            <button
                                className="btn btn-primary full-width"
                                onClick={() => handleCreateRO(item)}
                            >
                                <Plus size={16} /> Buat Release Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RO List */}
            <div style={{ marginTop: '32px' }}>
                <h3 className="section-title">Daftar Release Order</h3>
                <ModernTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="Tidak ada release order"
                />
            </div>

            {/* Create RO Modal */}
            {showCreateModal && selectedPengajuan && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
                    <div className="modal modal-create">
                        <div className="modal-header">
                            <h2>Buat Release Order</h2>
                            <button className="btn-icon" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmitRO}>
                            <div className="modal-body">
                                <div className="info-box">
                                    <strong>Pengajuan: {selectedPengajuan.kode}</strong>
                                    <p>{selectedPengajuan.pemohon} - {selectedPengajuan.komoditas} ({selectedPengajuan.jumlah})</p>
                                </div>

                                <div className="form-grid-2" style={{ marginTop: '20px' }}>
                                    <div className="input-group">
                                        <label>Lokasi Tujuan *</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={formData.lokasiTujuan}
                                            onChange={(e) => setFormData({ ...formData, lokasiTujuan: e.target.value })}
                                            placeholder="Alamat lengkap tujuan"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Nomor Kendaraan *</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={formData.kendaraan}
                                            onChange={(e) => setFormData({ ...formData, kendaraan: e.target.value })}
                                            placeholder="B 1234 XYZ"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Nama Sopir *</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={formData.sopir}
                                            onChange={(e) => setFormData({ ...formData, sopir: e.target.value })}
                                            placeholder="Nama lengkap sopir"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={16} /> Buat RO
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Approval Modal */}
            {showApprovalModal && selectedRO && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowApprovalModal(false)} />
                    <div className="modal modal-sm">
                        <div className="modal-header">
                            <h2>Approval Release Order</h2>
                            <button className="btn-icon" onClick={() => setShowApprovalModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleApproval}>
                            <div className="modal-body">
                                <div className="approval-info">
                                    <Lock size={48} style={{ color: '#f59e0b', margin: '0 auto 16px' }} />
                                    <h3>{selectedRO.kode}</h3>
                                    <p>{selectedRO.komoditas} - {selectedRO.jumlah}</p>
                                    <p style={{ fontSize: '13px', color: '#6b7280' }}>Tujuan: {selectedRO.lokasiTujuan}</p>
                                </div>

                                <div className="input-group" style={{ marginTop: '24px' }}>
                                    <label>PIN Pejabat Berwenang *</label>
                                    <input
                                        type="password"
                                        className="input"
                                        required
                                        value={approvalPIN}
                                        onChange={(e) => setApprovalPIN(e.target.value)}
                                        placeholder="Masukkan PIN (Demo: 123456)"
                                        style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowApprovalModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <CheckCircle size={16} /> Setujui
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Print Modal */}
            {showPrintModal && selectedRO && (
                <>
                    <div className="modal-backdrop no-print" onClick={() => setShowPrintModal(false)} />
                    <div className="modal modal-print">
                        <div className="modal-header no-print">
                            <h2>Cetak Dokumen</h2>
                            <button className="btn-icon" onClick={() => setShowPrintModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            {/* Print Header */}
                            <div className="print-header">
                                <h2>KEMENTERIAN PERTANIAN</h2>
                                <h3>BADAN KARANTINA INDONESIA</h3>
                                <p>Jl. Harsono RM No.3, Ragunan, Jakarta Selatan 12550</p>
                                <hr />
                                <h1>SURAT PELEPASAN BARANG KARANTINA</h1>
                                <p>Release Order: <strong>{selectedRO.kode}</strong></p>
                            </div>

                            {/* Document Content */}
                            <div className="print-content">
                                <table className="print-table">
                                    <tr>
                                        <td width="30%"><strong>Nomor Release Order</strong></td>
                                        <td>: {selectedRO.kode}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Referensi Pengajuan</strong></td>
                                        <td>: {selectedRO.pengajuanKode}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Pemilik Barang</strong></td>
                                        <td>: {selectedRO.pemilik}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Komoditas</strong></td>
                                        <td>: {selectedRO.komoditas}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Jumlah</strong></td>
                                        <td>: {selectedRO.jumlah}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Lokasi Tujuan</strong></td>
                                        <td>: {selectedRO.lokasiTujuan}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Nomor Bea Cukai</strong></td>
                                        <td>: {selectedRO.dokumen.beaCukai}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Sertifikat Karantina</strong></td>
                                        <td>: {selectedRO.dokumen.karantina}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Kode Segel</strong></td>
                                        <td>: <strong style={{ color: '#dc2626' }}>{selectedRO.segel}</strong></td>
                                    </tr>
                                </table>

                                {/* Barcode */}
                                <div className="barcode-section">
                                    <h4>BARCODE SEGEL RESMI</h4>
                                    <div className="barcode-box">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                ro: selectedRO.kode,
                                                seal: selectedRO.segel,
                                                dest: selectedRO.lokasiTujuan
                                            })}
                                            size={180}
                                            level="H"
                                        />
                                        <p><strong>{selectedRO.segel}</strong></p>
                                        <p style={{ fontSize: '11px' }}>Scan barcode ini untuk membuka segel</p>
                                    </div>
                                </div>

                                {/* Signature */}
                                <div className="signature-section">
                                    <div className="signature-box">
                                        <p>Pemilik Barang</p>
                                        <div className="signature-line"></div>
                                        <p>({selectedRO.pemilik})</p>
                                    </div>
                                    <div className="signature-box">
                                        <p>Pejabat Karantina</p>
                                        <div className="signature-line"></div>
                                        <p>({selectedRO.approvedBy})</p>
                                        <p style={{ fontSize: '11px' }}>{selectedRO.approvedAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer no-print">
                            <button className="btn btn-secondary" onClick={() => setShowPrintModal(false)}>
                                Tutup
                            </button>
                            <button className="btn btn-primary" onClick={handlePrint}>
                                <Printer size={16} /> Cetak Dokumen
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Pengiriman
