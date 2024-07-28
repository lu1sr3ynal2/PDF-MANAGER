// src/components/PdfThumbnail.js
import React, { useEffect, useState } from 'react';
import { fetchThumbnail } from '../services/thumbnailService';
import { fetchPdfMetadata } from '../services/pdfService';

const PdfThumbnail = ({ file }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [metadata, setMetadata] = useState({ num_pages: 0, file_size: 0 });

  useEffect(() => {
    getThumbnail();
    getMetadata();
  }, []);

  const getThumbnail = async () => {
    try {
      const imageObjectURL = await fetchThumbnail(file);
      setThumbnail(imageObjectURL);
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
    }
  };

  const getMetadata = async () => {
    try {
      const metadata = await fetchPdfMetadata(file);
      setMetadata(metadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      {thumbnail && (
        <img src={thumbnail} alt="Thumbnail" style={{ width: '150px', height: 'auto', marginRight: '20px' }} />
      )}
      <div>
        <p style={{ fontSize: '16px', color: '#555' }}>Páginas: {metadata.num_pages}</p>
        <p style={{ fontSize: '16px', color: '#555' }}>Tamaño: {(metadata.file_size / 1024).toFixed(2)} KB</p>
      </div>
    </div>
  );
};

export default PdfThumbnail;
