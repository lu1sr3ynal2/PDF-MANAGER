import React, { useEffect, useState } from 'react';
import FileItem from './FileItem';

const FileList = ({ refresh }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, [refresh]);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/files');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleDelete = () => {
        fetchFiles();
    };

    const handleUpdate = (oldName, newName) => {
        setFiles(files.map(file => {
            if (file.name === oldName) {
                return { ...file, name: newName };
            }
            return file;
        }));
    };

    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {files.map(file => (
                <FileItem key={file.name} file={file} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
        </ul>
    );
};

export default FileList;
