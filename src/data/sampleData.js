// Sample Data dengan Korelasi Antar Menu
// Flow: Pengajuan → Pengiriman (RO) → Penerimaan

export const pengajuanData = [
    {
        id: 1,
        kode: 'PJN-2026-0001',
        tanggal: '2026-02-01',
        pemohon: 'PT. Ternak Nusantara',
        komoditas: 'Sapi Brahman',
        jenisAset: 'Hewan',
        jumlah: '200 ekor',
        negaraAsal: 'Australia',
        negaraTujuan: 'Indonesia',
        status: 'approved',
        dokumenLengkap: true,
        dokumen: {
            beaCukai: 'BC-001/2026',
            sertifikatKarantina: 'KT-9-001/2026',
            sertifikatAsal: 'CO-001/2026',
            packingList: 'PL-001/2026'
        },
        manifest: [
            { item: 'Sapi Brahman Jantan', qty: 120, satuan: 'ekor', berat: '60 ton' },
            { item: 'Sapi Brahman Betina', qty: 80, satuan: 'ekor', berat: '40 ton' }
        ]
    },
    {
        id: 2,
        kode: 'PJN-2026-0002',
        tanggal: '2026-02-02',
        pemohon: 'CV. Buah Nusantara',
        komoditas: 'Bibit Mangga',
        jenisAset: 'Tumbuhan',
        jumlah: '1000 bibit',
        negaraAsal: 'Thailand',
        negaraTujuan: 'Indonesia',
        status: 'approved',
        dokumenLengkap: true,
        dokumen: {
            beaCukai: 'BC-002/2026',
            sertifikatKarantina: 'KT-9-002/2026',
            sertifikatAsal: 'CO-002/2026',
            packingList: 'PL-002/2026'
        },
        manifest: [
            { item: 'Bibit Mangga Harumanis', qty: 500, satuan: 'bibit', berat: '2 ton' },
            { item: 'Bibit Mangga Gedong', qty: 500, satuan: 'bibit', berat: '2 ton' }
        ]
    },
    {
        id: 3,
        kode: 'PJN-2026-0003',
        tanggal: '2026-02-03',
        pemohon: 'PT. Equestrian Indonesia',
        komoditas: 'Kuda Pacu',
        jenisAset: 'Hewan',
        jumlah: '5 ekor',
        negaraAsal: 'Selandia Baru',
        negaraTujuan: 'Indonesia',
        status: 'approved',
        dokumenLengkap: true,
        dokumen: {
            beaCukai: 'BC-003/2026',
            sertifikatKarantina: 'KT-9-003/2026',
            sertifikatAsal: 'CO-003/2026',
            packingList: 'PL-003/2026'
        },
        manifest: [
            { item: 'Kuda Pacu Thoroughbred', qty: 5, satuan: 'ekor', berat: '2.5 ton' }
        ]
    },
    {
        id: 4,
        kode: 'PJN-2026-0004',
        tanggal: '2026-02-04',
        pemohon: 'PT. Flora Export Indonesia',
        komoditas: 'Anggrek Bulan',
        jenisAset: 'Tumbuhan',
        jumlah: '500 pot',
        negaraAsal: 'Indonesia',
        negaraTujuan: 'Singapura',
        status: 'processing',
        dokumenLengkap: true,
        dokumen: {
            beaCukai: 'BC-004/2026',
            sertifikatKarantina: 'KT-9-004/2026',
            sertifikatAsal: 'CO-004/2026',
            packingList: 'PL-004/2026'
        },
        manifest: [
            { item: 'Anggrek Bulan Putih', qty: 200, satuan: 'pot', berat: '400 kg' },
            { item: 'Anggrek Bulan Ungu', qty: 300, satuan: 'pot', berat: '600 kg' }
        ]
    },
    {
        id: 5,
        kode: 'PJN-2026-0005',
        tanggal: '2026-02-05',
        pemohon: 'CV. Tropical Fish',
        komoditas: 'Ikan Arwana',
        jenisAset: 'Hewan',
        jumlah: '50 ekor',
        negaraAsal: 'Indonesia',
        negaraTujuan: 'Jepang',
        status: 'pending',
        dokumenLengkap: false,
        dokumen: {
            beaCukai: 'Pending',
            sertifikatKarantina: 'Pending',
            sertifikatAsal: 'CO-005/2026',
            packingList: 'PL-005/2026'
        },
        manifest: [
            { item: 'Ikan Arwana Super Red', qty: 30, satuan: 'ekor', berat: '15 kg' },
            { item: 'Ikan Arwana Golden', qty: 20, satuan: 'ekor', berat: '10 kg' }
        ]
    }
]

export const pengirimanData = [
    {
        id: 1,
        kode: 'RO-2026-001',
        pengajuanKode: 'PJN-2026-0001',
        pemilik: 'PT. Ternak Nusantara',
        komoditas: 'Sapi Brahman',
        jumlah: '200 ekor',
        lokasiTujuan: 'Farm Cikarang, Jl. Raya Industri No. 45, Cikarang Barat, Bekasi, Jawa Barat',
        koordinatTujuan: { lat: -6.2615, lng: 107.1534 },
        kendaraan: 'B 1234 ABC',
        sopir: 'Budi Santoso',
        status: 'approved',
        approvedBy: 'Drh. Ahmad Yani',
        approvedAt: '2026-02-01 14:30',
        segel: 'SEAL-2026-0001',
        dokumen: {
            beaCukai: 'BC-001/2026',
            karantina: 'KT-9-001/2026'
        }
    },
    {
        id: 2,
        kode: 'RO-2026-002',
        pengajuanKode: 'PJN-2026-0002',
        pemilik: 'CV. Buah Nusantara',
        komoditas: 'Bibit Mangga',
        jumlah: '1000 bibit',
        lokasiTujuan: 'Kebun Pembibitan Bogor, Jl. Raya Tajur No. 12, Bogor, Jawa Barat',
        koordinatTujuan: { lat: -6.5971, lng: 106.8060 },
        kendaraan: 'B 5678 DEF',
        sopir: 'Siti Aminah',
        status: 'approved',
        approvedBy: 'Drh. Ahmad Yani',
        approvedAt: '2026-02-02 10:15',
        segel: 'SEAL-2026-0002',
        dokumen: {
            beaCukai: 'BC-002/2026',
            karantina: 'KT-9-002/2026'
        }
    },
    {
        id: 3,
        kode: 'RO-2026-003',
        pengajuanKode: 'PJN-2026-0003',
        pemilik: 'PT. Equestrian Indonesia',
        komoditas: 'Kuda Pacu',
        jumlah: '5 ekor',
        lokasiTujuan: 'Peternakan Kuda Sentul, Jl. Sentul Paradise Park, Sentul City, Bogor',
        koordinatTujuan: { lat: -6.5644, lng: 106.9447 },
        kendaraan: 'B 9012 GHI',
        sopir: 'Joko Widodo',
        status: 'approved',
        approvedBy: 'Drh. Siti Nurhaliza',
        approvedAt: '2026-02-03 09:00',
        segel: 'SEAL-2026-0003',
        dokumen: {
            beaCukai: 'BC-003/2026',
            karantina: 'KT-9-003/2026'
        }
    },
    {
        id: 4,
        kode: 'RO-2026-004',
        pengajuanKode: 'PJN-2026-0004',
        pemilik: 'PT. Flora Export Indonesia',
        komoditas: 'Anggrek Bulan',
        jumlah: '500 pot',
        lokasiTujuan: 'Gudang Ekspor Tanjung Priok, Jl. Pelabuhan No. 88, Jakarta Utara',
        koordinatTujuan: { lat: -6.1064, lng: 106.8818 },
        kendaraan: 'B 3456 JKL',
        sopir: 'Andi Wijaya',
        status: 'pending_approval',
        approvedBy: null,
        approvedAt: null,
        segel: 'SEAL-2026-0004',
        dokumen: {
            beaCukai: 'BC-004/2026',
            karantina: 'KT-9-004/2026'
        }
    },
    {
        id: 5,
        kode: 'RO-2026-005',
        pengajuanKode: 'PJN-2026-0005',
        pemilik: 'CV. Tropical Fish',
        komoditas: 'Ikan Arwana',
        jumlah: '50 ekor',
        lokasiTujuan: 'Aquarium Center Jakarta, Jl. Senen Raya No. 15, Jakarta Pusat',
        koordinatTujuan: { lat: -6.1751, lng: 106.8451 },
        kendaraan: 'B 7890 MNO',
        sopir: 'Rudi Hartono',
        status: 'pending_approval',
        approvedBy: null,
        approvedAt: null,
        segel: 'SEAL-2026-0005',
        dokumen: {
            beaCukai: 'Pending',
            karantina: 'Pending'
        }
    }
]

export const penerimaanData = [
    {
        id: 1,
        kode: 'RO-2026-001',
        pengirim: 'Karantina Tanjung Priok',
        komoditas: 'Sapi Brahman',
        jumlah: '200 ekor',
        tujuan: 'Farm Cikarang, Jl. Raya Industri No. 45, Cikarang Barat, Bekasi, Jawa Barat',
        penerima: 'PT. Ternak Nusantara',
        status: 'unlocked',
        segel: 'SEAL-2026-0001',
        eta: '2026-02-01 18:00',
        unlockedAt: '2026-02-01 18:15',
        unlockedBy: 'Bambang Suryanto',
        koordinatUnlock: { lat: -6.2615, lng: 107.1534 },
        fotoSegel: 'https://via.placeholder.com/400x300?text=Segel+Sapi+Brahman'
    },
    {
        id: 2,
        kode: 'RO-2026-002',
        pengirim: 'Karantina Soekarno-Hatta',
        komoditas: 'Bibit Mangga',
        jumlah: '1000 bibit',
        tujuan: 'Kebun Pembibitan Bogor, Jl. Raya Tajur No. 12, Bogor, Jawa Barat',
        penerima: 'CV. Buah Nusantara',
        status: 'unlocked',
        segel: 'SEAL-2026-0002',
        eta: '2026-02-02 14:00',
        unlockedAt: '2026-02-02 14:20',
        unlockedBy: 'Siti Rahayu',
        koordinatUnlock: { lat: -6.5971, lng: 106.8060 },
        fotoSegel: 'https://via.placeholder.com/400x300?text=Segel+Bibit+Mangga'
    },
    {
        id: 3,
        kode: 'RO-2026-003',
        pengirim: 'Karantina Soekarno-Hatta',
        komoditas: 'Kuda Pacu',
        jumlah: '5 ekor',
        tujuan: 'Peternakan Kuda Sentul, Jl. Sentul Paradise Park, Sentul City, Bogor',
        penerima: 'PT. Equestrian Indonesia',
        status: 'unlocked',
        segel: 'SEAL-2026-0003',
        eta: '2026-02-03 12:00',
        unlockedAt: '2026-02-03 12:10',
        unlockedBy: 'Agus Salim',
        koordinatUnlock: { lat: -6.5644, lng: 106.9447 },
        fotoSegel: 'https://via.placeholder.com/400x300?text=Segel+Kuda+Pacu'
    },
    {
        id: 4,
        kode: 'RO-2026-004',
        pengirim: 'Karantina Tanjung Priok',
        komoditas: 'Anggrek Bulan',
        jumlah: '500 pot',
        tujuan: 'Gudang Ekspor Tanjung Priok, Jl. Pelabuhan No. 88, Jakarta Utara',
        penerima: 'PT. Flora Export Indonesia',
        status: 'locked',
        segel: 'SEAL-2026-0004',
        eta: '2026-02-08 16:00',
        unlockedAt: null,
        unlockedBy: null,
        koordinatUnlock: null,
        fotoSegel: null
    },
    {
        id: 5,
        kode: 'RO-2026-005',
        pengirim: 'Karantina Soekarno-Hatta',
        komoditas: 'Ikan Arwana',
        jumlah: '50 ekor',
        tujuan: 'Aquarium Center Jakarta, Jl. Senen Raya No. 15, Jakarta Pusat',
        penerima: 'CV. Tropical Fish',
        status: 'locked',
        segel: 'SEAL-2026-0005',
        eta: '2026-02-08 20:00',
        unlockedAt: null,
        unlockedBy: null,
        koordinatUnlock: null,
        fotoSegel: null
    }
]
