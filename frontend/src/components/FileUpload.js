import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onChangeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onClickHandler = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('File uploaded successfully:', data);
                onUpload();
                setSelectedFile(null);
                document.getElementById('fileInput').value = '';
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    };

    return (
        <div>
            <input
                type="file"
                id="fileInput"
                onChange={onChangeHandler}
                style={{ display: 'none' }}
            />
            <Button
                variant="contained"
                component="label"
                color="primary"
                style={{ marginRight: '10px' }}
            >
                Seleccionar Archivo
                <input
                    type="file"
                    id="fileInput"
                    onChange={onChangeHandler}
                    hidden
                />
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={onClickHandler}
                disabled={!selectedFile}
            >
                Subir
            </Button>
            {selectedFile && (
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                    {selectedFile.name}
                </Typography>
            )}
        </div>
    );
};

export default FileUpload;
