// src/services/pdfService.js
export const fetchPdfMetadata = async (file) => {
    const response = await fetch(`http://localhost:8000/api/metadata/${file}`);
    if (!response.ok) {
      throw new Error('Error fetching PDF metadata');
    }
    const metadata = await response.json();
    return metadata;
  };
  