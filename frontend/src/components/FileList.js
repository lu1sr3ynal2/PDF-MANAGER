import React, { useEffect, useState } from 'react';
import FileExplorer from './FileExplorer';
import FileTabs from './FileTabs';
import { Box } from '@mui/material';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('explorer'); // Default to 'explorer' for file list

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files`);
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
        fetchFiles(); // Refresh the file list after deletion
    };

    const handleUpdate = (oldName, newName) => {
        setFiles(files.map(file => {
            if (file.name === oldName) {
                return { ...file, name: newName };
            }
            return file;
        }));
    };

    const openTab = (file) => {
        const exists = openTabs.some(tab => tab.name === file.name);
        if (!exists) {
            setOpenTabs([...openTabs, file]);
        }
        setActiveTab(file.name); // Switch to the opened file's tab
    };

    const closeTab = (file) => {
        setOpenTabs(openTabs.filter(tab => tab.name !== file.name));
        if (activeTab === file.name) {
            setActiveTab('explorer'); // Switch back to explorer when closing the active tab
        }
    };

    return (
        <Box>
            <FileTabs 
                activeTab={activeTab} 
                onSelect={setActiveTab} 
                openTabs={openTabs} 
                onCloseTab={closeTab}
            />
            {activeTab === 'explorer' && (
                <FileExplorer 
                    files={files} 
                    onDelete={handleDelete} 
                    onUpdate={handleUpdate} 
                    onView={openTab} 
                />
            )}
        </Box>
    );
};

export default FileList;
