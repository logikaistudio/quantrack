import { useState } from 'react'
import {
    Plus,
    Search,
    Filter,
    ChevronDown,
    ClipboardList,
    Eye,
    Download,
    Printer,
    X,
    Check,
    FileText,
    Package,
    MapPin,
    Calendar,
    User,
    Truck,
    QrCode,
    Globe,
    Plane,
    Send
} from 'lucide-react'
import './Manifest.css'

// Sample manifest data
const manifestData = [
    {
        id: 1,
        kode: 'MNF-2026-0001',
        pengajuanKode: 'PJN-2026-0892',
        jenis: 'Ekspor',
        negaraTujuan: 'Singapura',
        kotaTujuan: 'Singapore Botanic Gardens',
        tanggalBuat: '2026-02-05',
        status: 'verified',
        items: [
            { nama: 'Anggrek Bulan Putih', jumlah: '200 pot', kondisi: 'Baik' },
            { nama: 'Anggrek Bulan Pink', jumlah: '150 pot', kondisi: 'Baik' },
            { nama: 'Anggrek Dendrobium', jumlah: '150 pot', kondisi: 'Baik' }
        ],
        pengirim: 'PT. Flora Export Indonesia',
        penerima: 'Singapore Botanic Gardens'
    },
    {
        id: 2,
        kode: 'MNF-2026-0002',
        pengajuanKode: 'PJN-2026-0893',
        jenis: 'Impor',
        negaraAsal: 'Australia',
        kotaAsal: 'Queensland',
        tanggalBuat: '2026-02-06',
        status: 'pending',
        items: [
            { nama: 'Sapi Brahman Jantan', jumlah: '100 ekor', kondisi: 'Sehat' },
            { nama: 'Sapi Brahman Betina', jumlah: '100 ekor', kondisi: 'Sehat' }
        ],
        pengirim: 'Queensland Cattle Co.',
        penerima: 'PT. Ternak Nusantara'
    },
    {
        id: 3,
        kode: 'MNF-2026-0003',
        pengajuanKode: 'PJN-2026-0891',
        jenis: 'Ekspor',
        negaraTujuan: 'Jepang',
        kotaTujuan: 'Tokyo Aquarium',
        tanggalBuat: '2026-02-04',
        status: 'verified',
        items: [
            { nama: 'Ikan Arwana Silver', jumlah: '30 ekor', kondisi: 'Sehat' },
            { nama: 'Ikan Arwana Golden', jumlah: '20 ekor', kondisi: 'Sehat' }
        ],
        pengirim: 'CV. Tropical Fish',
        penerima: 'Tokyo Aquarium Inc.'
    }
]

function Manifest() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedManifest, setSelectedManifest] = useState(null)

    const filteredData = manifestData.filter(item => {
        const matchSearch = item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pengirim.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === 'all' || item.status === filterStatus
        const matchType = filterType === 'all' || item.jenis === filterType
        return matchSearch && matchStatus && matchType
    })

    const getStatusBadge = (status) => {
        const statusMap = {
            draft: { label: 'Draft', class: 'badge-warning' },
            pending: { label: 'Menunggu Verifikasi', class: 'badge-info' },
            verified: { label: 'Terverifikasi', class: 'badge-success' }
        }
        const mapped = statusMap[status] || { label: status, class: 'badge-primary' }
        return <span className={`badge ${mapped.class}`}>{mapped.label}</span>
    }

    const viewDetail = (item) => {
        setSelectedManifest(item)
        setShowDetailModal(true)
    }

    return (
        <div className="page manifest">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Manifest</h1>
                    <p className="page-subtitle">Dokumen manifest ekspor & impor</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Buat Manifest
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="input-with-icon search-input">
                    <Search size={18} className="input-icon" />
                    <input
                        type="text"
                        className="input"
                        placeholder="Cari kode manifest atau pengirim..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="select-wrapper">
                        <select
                            className="input select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Semua Jenis</option>
                            <option value="Ekspor">Ekspor</option>
                            <option value="Impor">Impor</option>
                        </select>
                        <ChevronDown size={16} className="select-icon" />
                    </div>
                    <div className="select-wrapper">
                        <select
                            className="input select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Menunggu</option>
                            <option value="verified">Terverifikasi</option>
                        </select>
                        <ChevronDown size={16} className="select-icon" />
                    </div>
                </div>
            </div>

            {/* Manifest List */}
            <div className="manifest-list">
                {filteredData.map((item) => (
                    <div key={item.id} className="manifest-card">
                        <div className="card-header">
                            <div className="card-title-row">
                                <span className="card-code">{item.kode}</span>
                                {getStatusBadge(item.status)}
                            </div>
                            <div className="card-badges">
                                <span className={`type-badge ${item.jenis.toLowerCase()}`}>
                                    {item.jenis === 'Ekspor' ? <Send size={12} /> : <Download size={12} />}
                                    {item.jenis}
                                </span>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="manifest-route">
                                {item.jenis === 'Ekspor' ? (
                                    <>
                                        <div className="route-point">
                                            <MapPin size={16} />
                                            <span>Indonesia</span>
                                        </div>
                                        <Plane size={16} className="route-arrow" />
                                        <div className="route-point destination">
                                            <Globe size={16} />
                                            <span>{item.negaraTujuan}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="route-point">
                                            <Globe size={16} />
                                            <span>{item.negaraAsal}</span>
                                        </div>
                                        <Plane size={16} className="route-arrow" />
                                        <div className="route-point destination">
                                            <MapPin size={16} />
                                            <span>Indonesia</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="manifest-summary">
                                <div className="summary-item">
                                    <Package size={16} />
                                    <span>{item.items.length} jenis komoditas</span>
                                </div>
                                <div className="summary-item">
                                    <Calendar size={16} />
                                    <span>{item.tanggalBuat}</span>
                                </div>
                            </div>

                            <div className="manifest-parties">
                                <div className="party">
                                    <span className="party-label">Pengirim</span>
                                    <span className="party-name">{item.pengirim}</span>
                                </div>
                                <div className="party">
                                    <span className="party-label">Penerima</span>
                                    <span className="party-name">{item.penerima}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => viewDetail(item)}
                            >
                                <Eye size={14} />
                                Detail
                            </button>
                            <div className="card-actions">
                                <button className="btn btn-ghost btn-icon btn-sm">
                                    <Download size={14} />
                                </button>
                                <button className="btn btn-ghost btn-icon btn-sm">
                                    <Printer size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="empty-state">
                        <ClipboardList size={48} className="empty-state-icon" />
                        <h3 className="empty-state-title">Tidak ada data</h3>
                        <p className="empty-state-description">Belum ada manifest yang sesuai dengan filter</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedManifest && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowDetailModal(false)} />
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <h2>Detail Manifest</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-header">
                                <div className="detail-code">
                                    <span className="code-label">Kode Manifest</span>
                                    <span className="code-value">{selectedManifest.kode}</span>
                                </div>
                                <div className="detail-badges">
                                    <span className={`type-badge ${selectedManifest.jenis.toLowerCase()}`}>
                                        {selectedManifest.jenis === 'Ekspor' ? <Send size={12} /> : <Download size={12} />}
                                        {selectedManifest.jenis}
                                    </span>
                                    {getStatusBadge(selectedManifest.status)}
                                </div>
                            </div>

                            <div className="detail-sections">
                                <div className="detail-section">
                                    <h4>Rute {selectedManifest.jenis}</h4>
                                    <div className="route-display">
                                        {selectedManifest.jenis === 'Ekspor' ? (
                                            <>
                                                <div className="route-card">
                                                    <MapPin size={20} />
                                                    <div>
                                                        <span className="route-type">Asal</span>
                                                        <strong>Indonesia</strong>
                                                    </div>
                                                </div>
                                                <Plane size={24} className="route-connector" />
                                                <div className="route-card destination">
                                                    <Globe size={20} />
                                                    <div>
                                                        <span className="route-type">Tujuan</span>
                                                        <strong>{selectedManifest.negaraTujuan}</strong>
                                                        <span className="route-detail">{selectedManifest.kotaTujuan}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="route-card">
                                                    <Globe size={20} />
                                                    <div>
                                                        <span className="route-type">Asal</span>
                                                        <strong>{selectedManifest.negaraAsal}</strong>
                                                        <span className="route-detail">{selectedManifest.kotaAsal}</span>
                                                    </div>
                                                </div>
                                                <Plane size={24} className="route-connector" />
                                                <div className="route-card destination">
                                                    <MapPin size={20} />
                                                    <div>
                                                        <span className="route-type">Tujuan</span>
                                                        <strong>Indonesia</strong>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Daftar Komoditas</h4>
                                    <div className="items-table">
                                        <div className="table-header">
                                            <span>Nama Komoditas</span>
                                            <span>Jumlah</span>
                                            <span>Kondisi</span>
                                        </div>
                                        {selectedManifest.items.map((item, idx) => (
                                            <div key={idx} className="table-row">
                                                <span>{item.nama}</span>
                                                <span>{item.jumlah}</span>
                                                <span className="badge badge-success">{item.kondisi}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Pihak Terkait</h4>
                                    <div className="parties-grid">
                                        <div className="party-card">
                                            <User size={20} />
                                            <div>
                                                <span className="party-type">Pengirim</span>
                                                <strong>{selectedManifest.pengirim}</strong>
                                            </div>
                                        </div>
                                        <div className="party-card">
                                            <User size={20} />
                                            <div>
                                                <span className="party-type">Penerima</span>
                                                <strong>{selectedManifest.penerima}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Tutup
                            </button>
                            <button className="btn btn-secondary">
                                <Printer size={18} />
                                Cetak
                            </button>
                            <button className="btn btn-primary">
                                <Download size={18} />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Manifest
