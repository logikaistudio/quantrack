import { useState, useEffect } from 'react'
import {
    TrendingUp,
    FileText,
    CheckCircle,
    Truck,
    Package,
    Clock,
    BarChart3,
    PieChart,
    MapPin
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { pengajuanData, pengirimanData, penerimaanData } from '../data/sampleData'
import 'leaflet/dist/leaflet.css'
import './Dashboard.css'

// Fix Leaflet default marker icon issue
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

function Dashboard() {
    // Calculate real stats from actual data
    const stats = {
        pengajuanMasuk: pengajuanData.length, // Total pengajuan
        prosesApproval: pengirimanData.filter(ro => ro.status === 'pending_approval').length, // RO pending approval
        pengiriman: penerimaanData.filter(item => item.status === 'locked').length, // Dalam pengiriman (locked)
        sampaiPenerima: penerimaanData.filter(item => item.status === 'unlocked').length // Sampai penerima (unlocked)
    }

    const recentActivity = [
        { id: 1, type: 'pengajuan', code: 'PJN-2026-0005', action: 'Pengajuan baru masuk', time: '5 menit lalu' },
        { id: 2, type: 'approval', code: 'RO-2026-003', action: 'Disetujui oleh Drh. Siti Nurhaliza', time: '15 menit lalu' },
        { id: 3, type: 'pengiriman', code: 'RO-2026-004', action: 'Menunggu approval', time: '1 jam lalu' },
        { id: 4, type: 'penerimaan', code: 'RO-2026-003', action: 'Segel dibuka di Sentul', time: '2 jam lalu' }
    ]

    const monthlyData = [
        { month: 'Jan', pengajuan: 65, selesai: 58 },
        { month: 'Feb', pengajuan: 78, selesai: 72 },
        { month: 'Mar', pengajuan: 90, selesai: 85 },
        { month: 'Apr', pengajuan: 81, selesai: 79 },
        { month: 'Mei', pengajuan: 95, selesai: 88 },
        { month: 'Jun', pengajuan: 110, selesai: 102 }
    ]

    // Get unlocked deliveries for map
    const unlockedDeliveries = penerimaanData.filter(item => item.status === 'unlocked' && item.koordinatUnlock)

    // Center map on average of all unlocked locations (Jabodetabek area)
    const mapCenter = [-6.4, 106.9]
    const mapZoom = 9 // Lower zoom to see all locations


    return (
        <div className="page dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard Karantina</h1>
                    <p className="page-subtitle">Monitoring sistem pelepasan & penerimaan barang karantina</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <FileText size={28} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Pengajuan</span>
                        <span className="stat-value">{stats.pengajuanMasuk}</span>
                        <span className="stat-change">Semua status</span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <Clock size={28} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Pending Approval</span>
                        <span className="stat-value">{stats.prosesApproval}</span>
                        <span className="stat-change">Release Order menunggu</span>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">
                        <Truck size={28} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Dalam Pengiriman</span>
                        <span className="stat-value">{stats.pengiriman}</span>
                        <span className="stat-change">Segel terkunci</span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <CheckCircle size={28} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Sampai Penerima</span>
                        <span className="stat-value">{stats.sampaiPenerima}</span>
                        <span className="stat-change positive">Segel dibuka</span>
                    </div>
                </div>
            </div>

            {/* Delivery Tracking Map */}
            <div className="map-section">
                <h3 className="section-title"><MapPin size={20} /> Tracking Penerimaan Real-time ({unlockedDeliveries.length} Lokasi)</h3>
                <div className="map-card">
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {unlockedDeliveries.map((delivery) => (
                            <Marker
                                key={delivery.id}
                                position={[delivery.koordinatUnlock.lat, delivery.koordinatUnlock.lng]}
                            >
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <strong style={{ fontSize: '14px', color: '#10b981' }}>✓ Penerimaan Berhasil</strong>
                                        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                        <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Kode:</strong> {delivery.kode}</p>
                                        <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Komoditas:</strong> {delivery.komoditas}</p>
                                        <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Penerima:</strong> {delivery.penerima}</p>
                                        <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Dibuka oleh:</strong> {delivery.unlockedBy}</p>
                                        <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Waktu:</strong> {delivery.unlockedAt}</p>
                                        <p style={{ margin: '4px 0', fontSize: '11px', color: '#6b7280' }}>
                                            📍 {delivery.koordinatUnlock.lat}, {delivery.koordinatUnlock.lng}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="map-legend">
                        <div className="map-legend-item">
                            <span className="map-marker success"></span>
                            <span>Penerimaan Selesai ({unlockedDeliveries.length})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Bar Chart - Monthly Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3><BarChart3 size={20} /> Tren Bulanan 2026</h3>
                        <select className="chart-filter">
                            <option>6 Bulan Terakhir</option>
                            <option>12 Bulan Terakhir</option>
                        </select>
                    </div>
                    <div className="chart-body">
                        <div className="bar-chart">
                            {monthlyData.map((data, idx) => (
                                <div key={idx} className="bar-group">
                                    <div className="bar-container">
                                        <div
                                            className="bar bar-primary"
                                            style={{ height: `${(data.pengajuan / 120) * 100}%` }}
                                            title={`Pengajuan: ${data.pengajuan}`}
                                        />
                                        <div
                                            className="bar bar-success"
                                            style={{ height: `${(data.selesai / 120) * 100}%` }}
                                            title={`Selesai: ${data.selesai}`}
                                        />
                                    </div>
                                    <span className="bar-label">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chart-legend">
                            <div className="legend-item">
                                <span className="legend-color primary"></span>
                                <span>Pengajuan</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color success"></span>
                                <span>Selesai</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie Chart - Status Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3><PieChart size={20} /> Distribusi Status</h3>
                    </div>
                    <div className="chart-body">
                        <div className="pie-chart-container">
                            <svg viewBox="0 0 200 200" className="pie-chart">
                                {/* Simplified pie chart - in production use a library like recharts */}
                                <circle cx="100" cy="100" r="80" fill="#3b82f6" stroke="white" strokeWidth="2" />
                                <path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="#10b981" stroke="white" strokeWidth="2" />
                                <path d="M 100 100 L 180 100 A 80 80 0 0 1 140 170 Z" fill="#f59e0b" stroke="white" strokeWidth="2" />
                                <path d="M 100 100 L 140 170 A 80 80 0 0 1 60 170 Z" fill="#ef4444" stroke="white" strokeWidth="2" />
                            </svg>
                            <div className="pie-legend">
                                <div className="pie-legend-item">
                                    <span className="pie-color" style={{ background: '#3b82f6' }}></span>
                                    <span>Pengajuan ({stats.pengajuanMasuk})</span>
                                </div>
                                <div className="pie-legend-item">
                                    <span className="pie-color" style={{ background: '#10b981' }}></span>
                                    <span>Pending Approval ({stats.prosesApproval})</span>
                                </div>
                                <div className="pie-legend-item">
                                    <span className="pie-color" style={{ background: '#f59e0b' }}></span>
                                    <span>Dalam Pengiriman ({stats.pengiriman})</span>
                                </div>
                                <div className="pie-legend-item">
                                    <span className="pie-color" style={{ background: '#ef4444' }}></span>
                                    <span>Selesai ({stats.sampaiPenerima})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
                <h3 className="section-title">Aktivitas Terbaru</h3>
                <div className="activity-list">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className={`activity-item ${activity.type}`}>
                            <div className="activity-icon">
                                {activity.type === 'pengajuan' && <FileText size={18} />}
                                {activity.type === 'approval' && <CheckCircle size={18} />}
                                {activity.type === 'pengiriman' && <Truck size={18} />}
                                {activity.type === 'penerimaan' && <Package size={18} />}
                            </div>
                            <div className="activity-content">
                                <strong>{activity.code}</strong>
                                <span>{activity.action}</span>
                            </div>
                            <span className="activity-time">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
