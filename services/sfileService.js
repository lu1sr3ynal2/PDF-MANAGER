// src/services/fileService.js

export async function fetchFile(filename) {
    try {
        const response = await fetch(`http://localhost:8000/api/files/${filename}`);
        if (!response.ok) {
            throw new Error('Error fetching PDF');
        }
        return URL.createObjectURL(await response.blob());
    } catch (error) {
        console.error('Error fetching PDF:', error);
        throw error;
    }
}
