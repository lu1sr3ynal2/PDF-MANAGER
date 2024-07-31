import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchThumbnail, deleteFile, renameFile, performOCR } from './fileOperations';

const FileItem = ({ file, onDelete, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(file.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);

    const getThumbnail = useCallback(async () => {
        try {
            const imageObjectURL = await fetchThumbnail(file.name);
            setThumbnail(imageObjectURL);
        } catch (error) {
            console.error('Error fetching thumbnail:', error);
        }
    }, [file.name]);

    useEffect(() => {
        getThumbnail();
    }, [getThumbnail]);

    const handleDelete = async () => {
        try {
            await deleteFile(file.name);
            onDelete();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleAcceptRename = async () => {
        if (isRenaming) return;
        setIsRenaming(true);

        try {
            await renameFile(file.name, newName);
            setEditing(false);
            onUpdate(file.name, newName);
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
            const content = await performOCR(file.name);
            const newWindow = window.open();
            newWindow.document.write('<pre>' + content + '</pre>');
            newWindow.document.close();
            onUpdate();
        } catch (error) {
            console.error('Error performing OCR:', error);
        }
    };

    return (
        <li className="list-group-item d-flex align-items-center mb-3 p-3 bg-white rounded shadow-sm">
            <Link to={`/view/${file.name}`} className="me-3">
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt="Thumbnail"
                        className="img-thumbnail"
                        style={{ width: '150px', height: 'auto' }}
                    />
                )}
            </Link>
            <div className="flex-grow-1">
                {!editing ? (
                    <span
                        className="fs-5 text-dark"
                        onClick={() => setEditing(true)}
                    >
                        {file.name}
                    </span>
                ) : (
                    <input
                        type="text"
                        value={newName}
                        onChange={handleChange}
                        autoFocus
                        onBlur={handleBlur}
                        className="form-control form-control-sm"
                    />
                )}
            </div>
            {editing && (
                <div className="ms-2">
                    <button
                        onClick={handleAcceptRename}
                        className="btn btn-success me-2"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={handleCancelRename}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                </div>
            )}
            <div className="mt-2">
                <p className="mb-1 text-muted">Páginas: {file.pages}</p>
                <p className="mb-0 text-muted">Tamaño: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="mt-2">
                <Link to={`/view/${file.name}`} className="me-2">
                    <button className="btn btn-primary">Ver PDF</button>
                </Link>
                <button
                    onClick={handleOCR}
                    className="btn btn-secondary me-2"
                >
                    Extraer
                </button>
                <button
                    onClick={handleDelete}
                    className="btn btn-danger"
                >
                    Borrar
                </button>
            </div>
        </li>
    );
};

export default FileItem;
