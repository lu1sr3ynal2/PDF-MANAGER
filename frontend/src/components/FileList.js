import React, { useEffect, useState } from 'react';
import FileItem from './FileItem';

const FileList = ({ refresh }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, [refresh]);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/files');
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
            if (file === oldName) {
                return newName;
            }
            return file;
        }));
    };

    return (
        <div>
            {files.map((file, index) => (
                <FileItem key={index} file={file} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
        </div>
    );
};

export default FileList;