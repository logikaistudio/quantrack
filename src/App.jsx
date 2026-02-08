import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pengajuan from './pages/Pengajuan'
import Pengiriman from './pages/Pengiriman'
import Penerimaan from './pages/Penerimaan'
import Pengaturan from './pages/Pengaturan'
import './App.css'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pengajuan" element={<Pengajuan />} />
        <Route path="pengiriman" element={<Pengiriman />} />
        <Route path="penerimaan" element={<Penerimaan />} />
        <Route path="pengaturan" element={<Pengaturan />} />
      </Route>
    </Routes>
  )
}


export default App

