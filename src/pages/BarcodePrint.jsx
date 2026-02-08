import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
    Printer,
    Download,
    Plus,
    Trash2,
    Settings,
    Eye,
    X,
    Package,
    Check,
    FileText,
    ChevronDown,
    Copy
} from 'lucide-react'
import './BarcodePrint.css'

// Sample asset data for barcode generation
const availableAssets = [
    {
        id: 1,
        kode: 'QRT-2026-0892-A001',
        nama: 'Sapi Potong #001',
        pergerakan: 'MVT-2026-0001',
        jenisAset: 'Hewan'
    },
    {
        id: 2,
        kode: 'QRT-2026-0892-A002',
        nama: 'Sapi Potong #002',
        pergerakan: 'MVT-2026-0001',
        jenisAset: 'Hewan'
    },
    {
        id: 3,
        kode: 'QRT-2026-0893-A001',
        nama: 'Anggrek Bulan #001',
        pergerakan: 'MVT-2026-0002',
        jenisAset: 'Tumbuhan'
    },
    {
        id: 4,
        kode: 'QRT-2026-0893-A002',
        nama: 'Anggrek Bulan #002',
        pergerakan: 'MVT-2026-0002',
        jenisAset: 'Tumbuhan'
    },
    {
        id: 5,
        kode: 'QRT-2026-0893-A003',
        nama: 'Anggrek Dendrobium #001',
        pergerakan: 'MVT-2026-0002',
        jenisAset: 'Tumbuhan'
    }
]

function BarcodePrint() {
    const [selectedAssets, setSelectedAssets] = useState([])
    const [printLayout, setPrintLayout] = useState('2x2') // 2x2, 3x3, 1x1
    const [showLabels, setShowLabels] = useState(true)
    const [showPreview, setShowPreview] = useState(false)
    const [barcodeSize, setBarcodeSize] = useState('medium') // small, medium, large

    const sizeMap = {
        small: 80,
        medium: 120,
        large: 160
    }

    const layoutColumns = {
        '1x1': 1,
        '2x2': 2,
        '3x3': 3
    }

    const toggleAsset = (asset) => {
        setSelectedAssets(prev => {
            const exists = prev.find(a => a.id === asset.id)
            if (exists) {
                return prev.filter(a => a.id !== asset.id)
            }
            return [...prev, asset]
        })
    }

    const selectAll = () => {
        setSelectedAssets(availableAssets)
    }

    const clearAll = () => {
        setSelectedAssets([])
    }

    const handlePrint = () => {
        window.print()
    }

    const copyCode = (code) => {
        navigator.clipboard.writeText(code)
        // Could add toast notification here
    }

    const generateBarcodeData = (asset) => {
        return JSON.stringify({
            code: asset.kode,
            name: asset.nama,
            movement: asset.pergerakan,
            timestamp: new Date().toISOString()
        })
    }

    return (
        <div className="page barcode-print">
            <div className="page-header no-print">
                <div className="header-content">
                    <h1 className="page-title">Cetak Barcode</h1>
                    <p className="page-subtitle">Generate dan cetak barcode untuk aset</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowPreview(true)}
                        disabled={selectedAssets.length === 0}
                    >
                        <Eye size={18} />
                        Preview
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handlePrint}
                        disabled={selectedAssets.length === 0}
                    >
                        <Printer size={18} />
                        Cetak
                    </button>
                </div>
            </div>

            <div className="barcode-container no-print">
                {/* Settings Panel */}
                <div className="settings-panel">
                    <div className="panel-header">
                        <Settings size={20} />
                        <h2>Pengaturan Cetak</h2>
                    </div>
                    <div className="panel-content">
                        <div className="setting-group">
                            <label className="setting-label">Layout</label>
                            <div className="layout-options">
                                {['1x1', '2x2', '3x3'].map(layout => (
                                    <button
                                        key={layout}
                                        className={`layout-btn ${printLayout === layout ? 'active' : ''}`}
                                        onClick={() => setPrintLayout(layout)}
                                    >
                                        <div className={`layout-preview layout-${layout}`}>
                                            {Array(parseInt(layout[0]) * parseInt(layout[0])).fill(0).map((_, i) => (
                                                <div key={i} className="layout-cell"></div>
                                            ))}
                                        </div>
                                        <span>{layout}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">Ukuran Barcode</label>
                            <div className="size-options">
                                {['small', 'medium', 'large'].map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${barcodeSize === size ? 'active' : ''}`}
                                        onClick={() => setBarcodeSize(size)}
                                    >
                                        {size === 'small' && 'Kecil'}
                                        {size === 'medium' && 'Sedang'}
                                        {size === 'large' && 'Besar'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="checkbox-setting">
                                <input
                                    type="checkbox"
                                    checked={showLabels}
                                    onChange={(e) => setShowLabels(e.target.checked)}
                                />
                                <span>Tampilkan Label</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Asset Selection */}
                <div className="assets-panel">
                    <div className="panel-header">
                        <Package size={20} />
                        <h2>Pilih Aset</h2>
                        <div className="panel-actions">
                            <button className="btn btn-ghost btn-sm" onClick={selectAll}>
                                Pilih Semua
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={clearAll}>
                                Hapus Semua
                            </button>
                        </div>
                    </div>
                    <div className="panel-content">
                        <div className="assets-list">
                            {availableAssets.map(asset => {
                                const isSelected = selectedAssets.find(a => a.id === asset.id)
                                return (
                                    <div
                                        key={asset.id}
                                        className={`asset-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleAsset(asset)}
                                    >
                                        <div className="asset-checkbox">
                                            {isSelected && <Check size={14} />}
                                        </div>
                                        <div className="asset-info">
                                            <span className="asset-name">{asset.nama}</span>
                                            <span className="asset-code">{asset.kode}</span>
                                        </div>
                                        <span className={`asset-type type-${asset.jenisAset.toLowerCase()}`}>
                                            {asset.jenisAset}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Selected Assets Preview */}
                <div className="preview-panel">
                    <div className="panel-header">
                        <FileText size={20} />
                        <h2>Barcode Terpilih</h2>
                        <span className="selected-count">{selectedAssets.length} dipilih</span>
                    </div>
                    <div className="panel-content">
                        {selectedAssets.length > 0 ? (
                            <div
                                className="barcodes-grid"
                                style={{ gridTemplateColumns: `repeat(${layoutColumns[printLayout]}, 1fr)` }}
                            >
                                {selectedAssets.map(asset => (
                                    <div key={asset.id} className="barcode-card">
                                        <button
                                            className="remove-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleAsset(asset)
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="barcode-qr">
                                            <QRCodeSVG
                                                value={generateBarcodeData(asset)}
                                                size={sizeMap[barcodeSize]}
                                                level="M"
                                                includeMargin={true}
                                                bgColor="white"
                                                fgColor="#0f0f14"
                                            />
                                        </div>
                                        {showLabels && (
                                            <div className="barcode-label">
                                                <span className="label-name">{asset.nama}</span>
                                                <span className="label-code">{asset.kode}</span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        copyCode(asset.kode)
                                                    }}
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-selection">
                                <Package size={48} />
                                <p>Pilih aset untuk generate barcode</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Preview Modal */}
            {showPreview && (
                <>
                    <div className="modal-backdrop no-print" onClick={() => setShowPreview(false)} />
                    <div className="modal modal-lg no-print">
                        <div className="modal-header">
                            <h2>Preview Cetak</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowPreview(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="print-preview">
                                <div
                                    className="preview-page"
                                    style={{ gridTemplateColumns: `repeat(${layoutColumns[printLayout]}, 1fr)` }}
                                >
                                    {selectedAssets.map(asset => (
                                        <div key={asset.id} className="preview-barcode">
                                            <QRCodeSVG
                                                value={generateBarcodeData(asset)}
                                                size={sizeMap[barcodeSize]}
                                                level="M"
                                                includeMargin={true}
                                                bgColor="white"
                                                fgColor="#0f0f14"
                                            />
                                            {showLabels && (
                                                <div className="preview-label">
                                                    <span>{asset.nama}</span>
                                                    <span>{asset.kode}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowPreview(false)}
                            >
                                Tutup
                            </button>
                            <button className="btn btn-primary" onClick={handlePrint}>
                                <Printer size={18} />
                                Cetak Sekarang
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Print-only content */}
            <div className="print-content print-only">
                <div
                    className="print-page"
                    style={{ gridTemplateColumns: `repeat(${layoutColumns[printLayout]}, 1fr)` }}
                >
                    {selectedAssets.map(asset => (
                        <div key={asset.id} className="print-barcode">
                            <QRCodeSVG
                                value={generateBarcodeData(asset)}
                                size={sizeMap[barcodeSize]}
                                level="M"
                                includeMargin={true}
                                bgColor="white"
                                fgColor="black"
                            />
                            {showLabels && (
                                <div className="print-label">
                                    <span className="print-name">{asset.nama}</span>
                                    <span className="print-code">{asset.kode}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BarcodePrint
