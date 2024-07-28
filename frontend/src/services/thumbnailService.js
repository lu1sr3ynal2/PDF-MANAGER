// src/services/thumbnailService.js

export const fetchThumbnail = async (filename) => {
    try {
        const response = await fetch(`http://localhost:8000/api/thumbnail/${filename}`);
        if (!response.ok) {
            throw new Error('Error fetching thumbnail');
        }
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        return imageObjectURL;
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        throw error;
    }
};
