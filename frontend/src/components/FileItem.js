import React, { useState } from 'react';

function FileItem({ file, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(file);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/${file}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Error deleting file');
      }
      onDelete();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  

  const handleAcceptRename = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rename/${encodeURIComponent(file)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName }),
      });
      if (response.ok) {
        setEditing(false);
        onUpdate(file, newName);
      } else {
        const errorText = await response.text();
        throw new Error(`Error renaming file: ${errorText}`);
      }
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleCancelRename = () => {
    setNewName(file);
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
      const response = await fetch(`http://localhost:5000/api/ocr/${file}`);
      if (!response.ok) {
        throw new Error('Error performing OCR');
      }

      const textResponse = await response.text();
      const newWindow = window.open();
      newWindow.document.write('<pre>' + textResponse + '</pre>');
      newWindow.document.close();

      onUpdate();
    } catch (error) {
      console.error('Error performing OCR:', error);
    }
  };

  return (
    <li style={{ marginBottom: '10px' }}>
      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
        {!editing ? (
          <span style={{ fontSize: '20px', color: '#333', marginRight: '10px' }} onClick={() => setEditing(true)}>{file}</span>
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
        <button onClick={handleOCR} className="btn btn-secondary">Extraer</button>
        <button onClick={handleDelete} className="btn btn-danger">Borrar</button>
      </div>
    </li>
  );
}

export default FileItem;
