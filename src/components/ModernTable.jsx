import { useState } from 'react'
import { Eye, Edit2, Trash2, X, Save } from 'lucide-react'
import './ModernTable.css'

function ModernTable({
    columns,
    data,
    onRowClick,
    onEdit,
    onDelete,
    emptyMessage = "Tidak ada data"
}) {
    return (
        <div className="modern-table-container">
            <div className="table-wrapper">
                <table className="modern-table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={{ width: col.width || 'auto' }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="empty-state">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={rowIdx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className="table-row-clickable"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx}>
                                            {col.render ? col.render(row) : row[col.field]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function DetailModal({
    isOpen,
    onClose,
    title,
    data,
    fields,
    onEdit,
    onDelete
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState(data || {})

    if (!isOpen) return null

    const handleSave = () => {
        if (onEdit) {
            onEdit(editedData)
        }
        setIsEditing(false)
    }

    const handleDelete = () => {
        if (window.confirm('Yakin ingin menghapus data ini?')) {
            if (onDelete) {
                onDelete(data)
            }
            onClose()
        }
    }

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal modal-detail">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-grid">
                        {fields.map((field, idx) => (
                            <div key={idx} className="detail-field">
                                <label className="detail-label">{field.label}</label>
                                {isEditing && field.editable !== false ? (
                                    field.type === 'textarea' ? (
                                        <textarea
                                            className="input"
                                            value={editedData[field.key] || ''}
                                            onChange={(e) => setEditedData({
                                                ...editedData,
                                                [field.key]: e.target.value
                                            })}
                                            rows={3}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            className="input"
                                            value={editedData[field.key] || ''}
                                            onChange={(e) => setEditedData({
                                                ...editedData,
                                                [field.key]: e.target.value
                                            })}
                                        >
                                            {field.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            className="input"
                                            value={editedData[field.key] || ''}
                                            onChange={(e) => setEditedData({
                                                ...editedData,
                                                [field.key]: e.target.value
                                            })}
                                        />
                                    )
                                ) : (
                                    <div className="detail-value">
                                        {field.render ? field.render(data) : data[field.key]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    {isEditing ? (
                        <>
                            <button className="btn btn-secondary" onClick={() => {
                                setIsEditing(false)
                                setEditedData(data)
                            }}>
                                Batal
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} /> Simpan
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                <Trash2 size={16} /> Hapus
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Edit
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export { ModernTable, DetailModal }
