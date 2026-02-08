import { useState } from 'react'
import { Save, Upload, Building2 } from 'lucide-react'
import './Pengaturan.css'

function Pengaturan() {
    const [settings, setSettings] = useState({
        appName: 'Sitrak',
        appSubtitle: 'Sistim Tracking Karantina',
        organizationName: 'Badan Karantina Indonesia',
        address: 'Jl. Harsono RM No.3, Ragunan, Jakarta Selatan 12550',
        phone: '+62 21 7815380',
        email: 'info@karantina.go.id',
        logo: null
    })

    const [previewLogo, setPreviewLogo] = useState(null)

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewLogo(reader.result)
                setSettings({ ...settings, logo: file })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = (e) => {
        e.preventDefault()
        console.log('Settings saved:', settings)
        alert('Pengaturan berhasil disimpan!')
    }

    return (
        <div className="page pengaturan-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pengaturan Aplikasi</h1>
                    <p className="page-subtitle">Konfigurasi nama aplikasi, logo, dan informasi organisasi</p>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="settings-container">
                    {/* Logo Section */}
                    <div className="settings-card">
                        <h3 className="card-title">
                            <Upload size={20} /> Logo Aplikasi
                        </h3>
                        <div className="logo-upload-section">
                            <div className="logo-preview">
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Logo Preview" />
                                ) : (
                                    <div className="logo-placeholder">
                                        <Building2 size={48} />
                                        <p>Belum ada logo</p>
                                    </div>
                                )}
                            </div>
                            <div className="logo-upload-info">
                                <label className="upload-btn">
                                    <Upload size={16} />
                                    Pilih Logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <p className="upload-hint">Format: PNG, JPG, SVG (Max 2MB)</p>
                                <p className="upload-hint">Rekomendasi: 200x200px</p>
                            </div>
                        </div>
                    </div>

                    {/* App Info Section */}
                    <div className="settings-card">
                        <h3 className="card-title">
                            <Building2 size={20} /> Informasi Aplikasi
                        </h3>
                        <div className="form-grid-2">
                            <div className="input-group">
                                <label>Nama Aplikasi *</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={settings.appName}
                                    onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Subtitle Aplikasi *</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={settings.appSubtitle}
                                    onChange={(e) => setSettings({ ...settings, appSubtitle: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Organization Info Section */}
                    <div className="settings-card">
                        <h3 className="card-title">
                            <Building2 size={20} /> Informasi Organisasi
                        </h3>
                        <div className="form-grid-1">
                            <div className="input-group">
                                <label>Nama Organisasi *</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={settings.organizationName}
                                    onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Alamat Lengkap *</label>
                                <textarea
                                    className="input"
                                    required
                                    rows={3}
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                />
                            </div>
                            <div className="form-grid-2">
                                <div className="input-group">
                                    <label>Nomor Telepon *</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        required
                                        value={settings.phone}
                                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        className="input"
                                        required
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="settings-card">
                        <h3 className="card-title">Preview</h3>
                        <div className="preview-section">
                            <div className="preview-sidebar">
                                <div className="preview-logo">
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Logo" />
                                    ) : (
                                        <Building2 size={32} />
                                    )}
                                </div>
                                <div className="preview-text">
                                    <h4>{settings.appName}</h4>
                                    <p>{settings.appSubtitle}</p>
                                </div>
                            </div>
                            <div className="preview-document">
                                <h5>{settings.organizationName}</h5>
                                <p>{settings.address}</p>
                                <p>Telp: {settings.phone} | Email: {settings.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="save-section">
                    <button type="submit" className="btn btn-primary btn-lg">
                        <Save size={18} /> Simpan Pengaturan
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Pengaturan
