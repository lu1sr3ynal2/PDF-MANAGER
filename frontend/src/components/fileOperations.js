// src/components/fileOperations.js

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchThumbnail = async (filename) => {
    try {
        const response = await fetch(`${API_BASE_URL}/thumbnail/${filename}`);
        if (!response.ok) {
            throw new Error('Error fetching thumbnail');
        }
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        throw error;
    }
};

export const deleteFile = async (filename) => {
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(filename)}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Error deleting file');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

export const renameFile = async (oldName, newName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rename/${encodeURIComponent(oldName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_name: newName }),
        });
        if (!response.ok) {
            throw new Error('Error renaming file');
        }
    } catch (error) {
        console.error('Error renaming file:', error);
        throw error;
    }
};

export const performOCR = async (filename) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ocr/${encodeURIComponent(filename)}`);
        if (!response.ok) {
            throw new Error('Error performing OCR');
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error performing OCR:', error);
        throw error;
    }
};
