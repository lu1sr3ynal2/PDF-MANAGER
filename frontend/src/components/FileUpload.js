import React, { useState } from 'react';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onChangeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onClickHandler = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch('http://localhost:5000/api/upload', {
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
                onUpload(); // Llamar a la función de actualización después de subir el archivo
                setSelectedFile(null); // Resetea el estado del archivo seleccionado
                document.getElementById('fileInput').value = ''; // Resetea el valor del campo de entrada de archivo
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    };

    return (
        <div>
            <input type="file" id="fileInput" onChange={onChangeHandler} />
            <button type="button" className="btn btn-primary" onClick={onClickHandler} disabled={!selectedFile}>
                Subir
            </button>
        </div>
    );
};

export default FileUpload;
