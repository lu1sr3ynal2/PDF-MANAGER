import React, { useState, useEffect } from 'react';
import { fetchThumbnail } from '../services/thumbnailService';

const FileItem = ({ file, onDelete, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(file.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        getThumbnail();
    }, []);

    const getThumbnail = async () => {
        try {
            const imageObjectURL = await fetchThumbnail(file.name);
            setThumbnail(imageObjectURL);
        } catch (error) {
            console.error('Error fetching thumbnail:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/delete/${file.name}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Error deleting file');
            }
            onDelete();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleAcceptRename = async () => {
        if (isRenaming) return;
        setIsRenaming(true);

        try {
            const response = await fetch(`http://localhost:8000/api/rename/${encodeURIComponent(file.name)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_name: newName }),
            });
            if (response.ok) {
                setEditing(false);
                onUpdate(file.name, newName);
            } else {
                const errorText = await response.text();
                throw new Error(`Error renaming file: ${errorText}`);
            }
        } catch (error) {
            console.error('Error renaming file:', error);
        } finally {
            setIsRenaming(false);
        }
    };

    const handleCancelRename = () => {
        setNewName(file.name);
        setEditing(false);
    };

    const handleChange = (e) => {
        setNewName(e.target.value);
    };

    const handleBlur = () => {
        if (editing) {
            handleAcceptRename();
        }
    };

    const handleOCR = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/ocr/${file.name}`);
            if (!response.ok) {
                throw new Error('Error performing OCR');
            }

            const data = await response.json();
            const newWindow = window.open();
            newWindow.document.write('<pre>' + data.content + '</pre>');
            newWindow.document.close();

            onUpdate();
        } catch (error) {
            console.error('Error performing OCR:', error);
        }
    };

    return (
        <li style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                {thumbnail && (
                    <img src={thumbnail} alt="Thumbnail" style={{ width: '150px', height: 'auto', marginRight: '20px' }} />
                )}
                {!editing ? (
                    <span style={{ fontSize: '20px', color: '#333', marginRight: '10px' }} onClick={() => setEditing(true)}>{file.name}</span>
                ) : (
                    <input
                        type="text"
                        value={newName}
                        onChange={handleChange}
                        autoFocus
                        onBlur={handleBlur}
                        style={{ fontSize: '20px', marginRight: '10px', padding: '5px', flex: 1, minWidth: '100px' }}
                    />
                )}
                {editing && (
                    <div>
                        <button onClick={handleAcceptRename} className="btn btn-success" style={{ marginRight: '5px' }}>Aceptar</button>
                        <button onClick={handleCancelRename} className="btn btn-secondary">Cancelar</button>
                    </div>
                )}
            </div>
            <div>
                <p style={{ fontSize: '16px', color: '#555' }}>Páginas: {file.pages}</p>
                <p style={{ fontSize: '16px', color: '#555' }}>Tamaño: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <div>
                <button onClick={handleOCR} className="btn btn-secondary">Extraer</button>
                <button onClick={handleDelete} className="btn btn-danger">Borrar</button>
            </div>
        </li>
    );
};

export default FileItem;
