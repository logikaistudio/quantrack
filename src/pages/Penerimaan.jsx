import { useState } from 'react'
import { Search, Lock, Unlock, MapPin, Camera, User, Clock, Check, X } from 'lucide-react'
import { ModernTable } from '../components/ModernTable'
import { penerimaanData as initialData } from '../data/sampleData'
import './Penerimaan.css'

function Penerimaan() {
    const [searchQuery, setSearchQuery] = useState('')
    const [penerimaanData, setPenerimaanData] = useState(initialData)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showUnlockModal, setShowUnlockModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [unlockData, setUnlockData] = useState({
        namaPenerima: '',
        fotoSegel: null,
        koordinat: null,
        waktuPenerimaan: ''
    })
    const [photoPreview, setPhotoPreview] = useState(null)
    const [gpsStatus, setGpsStatus] = useState('checking')

    const columns = [
        {
            header: 'Kode RO',
            field: 'kode',
            width: '130px',
            render: (row) => <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>{row.kode}</strong>
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
            header: 'Pengirim',
            field: 'pengirim',
            width: '180px',
            render: (row) => <span style={{ fontSize: '12px' }}>{row.pengirim}</span>
        },
        {
            header: 'Penerima',
            field: 'penerima',
            width: '200px',
            render: (row) => <span style={{ fontSize: '13px' }}>{row.penerima}</span>
        },
        {
            header: 'ETA',
            field: 'eta',
            width: '140px',
            render: (row) => <span style={{ fontSize: '12px' }}>{row.eta}</span>
        },
        {
            header: 'Status Segel',
            field: 'status',
            width: '140px',
            render: (row) => {
                const statusMap = {
                    locked: { label: 'Terkunci', class: 'badge-danger', icon: <Lock size={12} /> },
                    unlocked: { label: 'Dibuka', class: 'badge-success', icon: <Unlock size={12} /> }
                }
                const status = statusMap[row.status]
                return (
                    <span className={`badge ${status.class}`} style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        {status.icon} {status.label}
                    </span>
                )
            }
        },
        {
            header: 'Aksi',
            field: 'actions',
            width: '120px',
            render: (row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    {row.status === 'locked' ? (
                        <button
                            className="btn-sm btn-primary"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleStartUnlock(row)
                            }}
                        >
                            <Unlock size={14} /> Buka Segel
                        </button>
                    ) : (
                        <button
                            className="btn-sm btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetail(row)
                            }}
                        >
                            Lihat Detail
                        </button>
                    )}
                </div>
            )
        }
    ]

    const filteredData = penerimaanData.filter(item =>
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.penerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.komoditas.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const lockedCount = penerimaanData.filter(item => item.status === 'locked').length
    const unlockedCount = penerimaanData.filter(item => item.status === 'unlocked').length

    const handleStartUnlock = (item) => {
        setSelectedItem(item)
        setShowUnlockModal(true)
        setUnlockData({
            namaPenerima: '',
            fotoSegel: null,
            koordinat: null,
            waktuPenerimaan: new Date().toISOString().slice(0, 16)
        })
        setPhotoPreview(null)

        // Simulate GPS check
        setGpsStatus('checking')
        setTimeout(() => {
            // Simulate GPS success (in real app, use navigator.geolocation)
            setGpsStatus('success')
            setUnlockData(prev => ({
                ...prev,
                koordinat: { lat: -6.2088, lng: 106.8456 } // Simulated current location
            }))
        }, 1500)
    }

    const handleViewDetail = (item) => {
        setSelectedItem(item)
        setShowDetailModal(true)
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
                setUnlockData(prev => ({ ...prev, fotoSegel: file }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUnlockSubmit = (e) => {
        e.preventDefault()

        // Update data
        const updatedData = penerimaanData.map(item => {
            if (item.id === selectedItem.id) {
                return {
                    ...item,
                    status: 'unlocked',
                    unlockedAt: unlockData.waktuPenerimaan,
                    unlockedBy: unlockData.namaPenerima,
                    koordinatUnlock: unlockData.koordinat,
                    fotoSegel: photoPreview
                }
            }
            return item
        })

        setPenerimaanData(updatedData)
        alert(`Segel ${selectedItem.segel} berhasil dibuka!`)
        setShowUnlockModal(false)
    }

    return (
        <div className="page penerimaan-table">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Penerimaan & Buka Segel</h1>
                    <p className="page-subtitle">Verifikasi penerimaan barang oleh pemilik</p>
                </div>
            </div>

            <div className="stats-mini">
                <div className="stat-mini locked">
                    <Lock size={24} />
                    <span className="stat-mini-value">{lockedCount}</span>
                    <span className="stat-mini-label">Segel Terkunci</span>
                </div>
                <div className="stat-mini unlocked">
                    <Unlock size={24} />
                    <span className="stat-mini-value">{unlockedCount}</span>
                    <span className="stat-mini-label">Segel Dibuka</span>
                </div>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari kode, penerima, atau komoditas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <ModernTable
                columns={columns}
                data={filteredData}
                emptyMessage="Tidak ada data penerimaan"
            />

            {/* Unlock Modal */}
            {showUnlockModal && selectedItem && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowUnlockModal(false)} />
                    <div className="modal modal-unlock">
                        <div className="modal-header">
                            <h2>Buka Segel - {selectedItem.kode}</h2>
                            <button className="btn-icon" onClick={() => setShowUnlockModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUnlockSubmit}>
                            <div className="modal-body">
                                {/* Item Info */}
                                <div className="unlock-info">
                                    <h4>{selectedItem.komoditas} - {selectedItem.jumlah}</h4>
                                    <p>Kode Segel: <strong>{selectedItem.segel}</strong></p>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{selectedItem.tujuan}</p>
                                </div>

                                {/* GPS Status */}
                                <div className={`gps-status ${gpsStatus}`}>
                                    <MapPin size={20} />
                                    <div>
                                        {gpsStatus === 'checking' && <p>Memeriksa lokasi GPS...</p>}
                                        {gpsStatus === 'success' && (
                                            <>
                                                <p><strong>Lokasi Terverifikasi ✓</strong></p>
                                                <p style={{ fontSize: '11px' }}>
                                                    Lat: {unlockData.koordinat?.lat}, Lng: {unlockData.koordinat?.lng}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="unlock-form">
                                    <div className="input-group">
                                        <label><User size={16} /> Nama Penerima *</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={unlockData.namaPenerima}
                                            onChange={(e) => setUnlockData({ ...unlockData, namaPenerima: e.target.value })}
                                            placeholder="Nama lengkap penerima"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label><Clock size={16} /> Waktu Penerimaan *</label>
                                        <input
                                            type="datetime-local"
                                            className="input"
                                            required
                                            value={unlockData.waktuPenerimaan}
                                            onChange={(e) => setUnlockData({ ...unlockData, waktuPenerimaan: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label><Camera size={16} /> Foto Segel (Sebelum Dibuka) *</label>
                                        <div className="photo-upload">
                                            {photoPreview ? (
                                                <div className="photo-preview">
                                                    <img src={photoPreview} alt="Preview" />
                                                    <button
                                                        type="button"
                                                        className="btn-remove-photo"
                                                        onClick={() => {
                                                            setPhotoPreview(null)
                                                            setUnlockData(prev => ({ ...prev, fotoSegel: null }))
                                                        }}
                                                    >
                                                        <X size={16} /> Hapus
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="upload-photo-btn">
                                                    <Camera size={32} />
                                                    <span>Ambil/Upload Foto</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        onChange={handlePhotoUpload}
                                                        required
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <p className="upload-hint">Foto harus menunjukkan segel dalam kondisi utuh</p>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUnlockModal(false)}>
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={gpsStatus !== 'success' || !photoPreview}
                                >
                                    <Check size={16} /> Verifikasi & Buka Segel
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedItem && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowDetailModal(false)} />
                    <div className="modal modal-detail">
                        <div className="modal-header">
                            <h2>Detail Penerimaan - {selectedItem.kode}</h2>
                            <button className="btn-icon" onClick={() => setShowDetailModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-grid-2">
                                <div className="detail-field">
                                    <label>Kode Release Order</label>
                                    <div className="detail-value">{selectedItem.kode}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Kode Segel</label>
                                    <div className="detail-value">{selectedItem.segel}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Komoditas</label>
                                    <div className="detail-value">{selectedItem.komoditas}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Jumlah</label>
                                    <div className="detail-value">{selectedItem.jumlah}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Penerima</label>
                                    <div className="detail-value">{selectedItem.penerima}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Dibuka Oleh</label>
                                    <div className="detail-value">{selectedItem.unlockedBy || '-'}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Waktu Dibuka</label>
                                    <div className="detail-value">{selectedItem.unlockedAt || '-'}</div>
                                </div>
                                <div className="detail-field">
                                    <label>Koordinat</label>
                                    <div className="detail-value">
                                        {selectedItem.koordinatUnlock ?
                                            `${selectedItem.koordinatUnlock.lat}, ${selectedItem.koordinatUnlock.lng}` : '-'}
                                    </div>
                                </div>
                            </div>

                            {selectedItem.fotoSegel && (
                                <div className="detail-photo">
                                    <label>Foto Segel</label>
                                    <img src={selectedItem.fotoSegel} alt="Foto Segel" />
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Tutup
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Penerimaan
