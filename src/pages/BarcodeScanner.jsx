import { useState, useRef, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
    Camera,
    X,
    Search,
    MoreVertical,
    Check,
    AlertCircle,
    Clock,
    QrCode,
    Package,
    MapPin,
    User,
    Info
} from 'lucide-react'
import './BarcodeScanner.css'

function BarcodeScanner() {
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [scanError, setScanError] = useState(null)
    const [manualCode, setManualCode] = useState('')
    const [history, setHistory] = useState([
        { id: 1, type: 'manifest', code: 'MNF-AU-2026-0456', time: '10:30', status: 'success', detail: 'Sapi Brahman - 200 Ekor' },
        { id: 2, type: 'item', code: 'ITM-2026-0089', time: '09:15', status: 'success', detail: 'Bibit Mangga - Box #4' },
        { id: 3, type: 'unknown', code: 'ERR-8821-99', time: 'Yesterday', status: 'error', detail: 'Invalid Format' }
    ])

    const scannerRef = useRef(null)
    const html5QrCodeRef = useRef(null)

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current?.isScanning) {
                html5QrCodeRef.current.stop().catch(console.error)
            }
        }
    }, [])

    const startScanning = async () => {
        setIsScanning(true)
        setScanResult(null)
        setScanError(null)

        try {
            const devices = await Html5Qrcode.getCameras()
            if (devices && devices.length) {
                const cameraId = devices[0].id
                const html5QrCode = new Html5Qrcode("reader")
                html5QrCodeRef.current = html5QrCode

                await html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText, decodedResult) => {
                        handleScanSuccess(decodedText)
                    },
                    (errorMessage) => {
                        // ignore frame errors
                    }
                )
            } else {
                setScanError('Tidak ada kamera terdeteksi')
            }
        } catch (err) {
            setScanError('Gagal mengakses kamera: ' + err.message)
            setIsScanning(false)
        }
    }

    const stopScanning = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop()
                setIsScanning(false)
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleScanSuccess = (decodedText) => {
        stopScanning()

        // Simulate lookup
        const result = {
            code: decodedText,
            timestamp: new Date().toLocaleString(),
            type: decodedText.startsWith('MNF') ? 'Manifest' : (decodedText.startsWith('ITM') ? 'Item' : 'Unknown'),
            valid: decodedText.startsWith('MNF') || decodedText.startsWith('ITM'),
            data: {
                nama: 'Sapi Brahman',
                jumlah: '200 ekor',
                asal: 'Australia',
                pengirim: 'Queensland Cattle Co.',
                kondisi: 'Sehat'
            }
        }

        setScanResult(result)

        // Add to history
        setHistory(prev => [{
            id: Date.now(),
            type: result.valid ? 'success' : 'error',
            code: decodedText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: result.valid ? 'success' : 'error',
            detail: result.valid ? 'Data Terverifikasi' : 'Format Tidak Dikenal'
        }, ...prev])
    }

    const handleManualSubmit = (e) => {
        e.preventDefault()
        if (manualCode.trim()) {
            handleScanSuccess(manualCode) // Simulate scan
        }
    }

    return (
        <div className="page barcode-scanner">
            <div className="scanner-container">
                {/* Scanner View */}
                <div className="scanner-section">
                    <div className="scanner-card">
                        {isScanning ? (
                            <div className="scanner-view">
                                <div id="reader" className="scanner-video"></div>
                                <div className="scanner-overlay">
                                    <div className="scanner-frame">
                                        <div className="scanner-corner top-left"></div>
                                        <div className="scanner-corner top-right"></div>
                                        <div className="scanner-corner bottom-left"></div>
                                        <div className="scanner-corner bottom-right"></div>
                                        <div className="scanner-line"></div>
                                    </div>
                                    <p className="scanner-hint">Arahkan kamera ke barcode/QR Code manifest</p>
                                </div>
                            </div>
                        ) : (
                            <div className="scanner-idle">
                                <div className="scanner-icon-container">
                                    <QrCode size={48} />
                                </div>
                                <p>Kamera tidak aktif</p>
                            </div>
                        )}

                        {scanError && (
                            <div className="camera-error">
                                <AlertCircle size={16} />
                                <span>{scanError}</span>
                            </div>
                        )}

                        <div className="scanner-controls">
                            {isScanning ? (
                                <button
                                    className="btn btn-secondary scan-btn"
                                    onClick={stopScanning}
                                >
                                    <X size={20} />
                                    Stop Scanning
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary scan-btn"
                                    onClick={startScanning}
                                >
                                    <Camera size={20} />
                                    Mulai Scan
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Manual Input */}
                <form className="manual-input" onSubmit={handleManualSubmit}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Input kode manifest manual..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary btn-icon">
                        <Search size={20} />
                    </button>
                </form>

                {/* Result Section (Updated for Rich Data) */}
                {scanResult && (
                    <div className={`result-section ${scanResult.valid ? 'success' : 'error'}`}>
                        <div className="result-card">
                            <div className="result-header">
                                <div className={`result-status ${scanResult.valid ? 'success' : 'error'}`}>
                                    {scanResult.valid ? <Check size={24} /> : <X size={24} />}
                                </div>
                                <div className="result-title">
                                    <h3>{scanResult.valid ? 'Data Ditemukan' : 'Tidak Dikenal'}</h3>
                                    <span className="result-code">{scanResult.code}</span>
                                </div>
                                <button
                                    className="btn btn-ghost btn-icon btn-sm close-result"
                                    onClick={() => setScanResult(null)}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {scanResult.valid ? (
                                <div className="result-details">
                                    <div className="result-info-grid">
                                        <div className="result-info-item">
                                            <Package size={18} />
                                            <div>
                                                <span className="info-label">Komoditas</span>
                                                <span className="info-value">{scanResult.data.nama}</span>
                                            </div>
                                        </div>
                                        <div className="result-info-item">
                                            <Info size={18} />
                                            <div>
                                                <span className="info-label">Jumlah</span>
                                                <span className="info-value">{scanResult.data.jumlah}</span>
                                            </div>
                                        </div>
                                        <div className="result-info-item">
                                            <MapPin size={18} />
                                            <div>
                                                <span className="info-label">Asal</span>
                                                <span className="info-value">{scanResult.data.asal}</span>
                                            </div>
                                        </div>
                                        <div className="result-info-item">
                                            <User size={18} />
                                            <div>
                                                <span className="info-label">Pengirim</span>
                                                <span className="info-value">{scanResult.data.pengirim}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="result-condition">
                                        <span className="condition-label">Status Terkini:</span>
                                        <span className="condition-value">{scanResult.data.kondisi}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="result-error">
                                    <AlertCircle size={20} />
                                    <span>Kode tidak terdaftar dalam sistem manifest.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Scan History */}
                <div className="history-section">
                    <div className="section-header">
                        <Clock size={18} />
                        <h2>Riwayat Scan</h2>
                    </div>
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-item">
                                <div className={`history-status ${item.status}`}>
                                    {item.status === 'success' ? <Check size={14} /> : <X size={14} />}
                                </div>
                                <div className="history-content">
                                    <span className="history-code">{item.code}</span>
                                    <span className="history-info">{item.detail}</span>
                                </div>
                                <span className="history-time">{item.time}</span>
                            </div>
                        ))}

                        {history.length === 0 && (
                            <div className="empty-history">
                                <Clock size={48} />
                                <p>Belum ada riwayat scan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarcodeScanner
