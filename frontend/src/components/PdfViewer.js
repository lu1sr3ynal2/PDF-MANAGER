// src/components/PdfViewer.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// URL del worker, asegúrate de que sea compatible con tu versión de pdfjs-dist
const workerUrl = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const PdfViewer = () => {
    const { filename } = useParams();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: '80vh' }}>
            <Worker workerUrl={workerUrl}>
                <Viewer
                    fileUrl={`http://localhost:8000/api/files/${filename}`}
                    plugins={[defaultLayoutPluginInstance]}
                    renderError={(error) => (
                        <div>Error: {error.message}</div>
                    )}
                />
            </Worker>
        </div>
    );
};

export default PdfViewer;
