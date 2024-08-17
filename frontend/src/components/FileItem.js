import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchThumbnail, deleteFile, renameFile, performOCR } from './fileOperations';
import { ListItem, Typography, Box, IconButton, TextField } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const FileItem = ({ file, onDelete, onUpdate, onView }) => {
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
        <ListItem sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
            <Link to="#" onClick={onView} style={{ marginRight: '16px' }}>
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt="Thumbnail"
                        style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                    />
                )}
            </Link>
            <Box sx={{ flexGrow: 1 }}>
                {!editing ? (
                    <Typography variant="h6" onClick={() => setEditing(true)}>
                        {file.name}
                    </Typography>
                ) : (
                    <TextField
                        value={newName}
                        onChange={handleChange}
                        autoFocus
                        onBlur={handleBlur}
                        variant="outlined"
                        size="small"
                    />
                )}
            </Box>
            {editing && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <IconButton onClick={handleAcceptRename} color="success">
                        <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelRename} color="secondary">
                        <CancelIcon />
                    </IconButton>
                </Box>
            )}
            <Box sx={{ ml: 2 }}>
                <Typography variant="body2" color="textSecondary">Pages: {file.pages}</Typography>
                <Typography variant="body2" color="textSecondary">{(file.size / 1024).toFixed(2)} KB</Typography>
            </Box>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Link to={`/view/${file.name}`} target="_blank" style={{ textDecoration: 'none', marginRight: '8px' }}>
                    <IconButton color="primary">
                        <LaunchIcon /> 
                    </IconButton>
                </Link>
                <IconButton onClick={handleOCR}  color="secondary" >
                    <DocumentScannerIcon />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                </IconButton>
            </Box>
        </ListItem>
    );
};

export default FileItem;
