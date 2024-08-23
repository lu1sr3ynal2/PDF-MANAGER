import React, { useEffect, useState, useCallback } from "react";
import FileItem from "./FileItem";
import { fetchThumbnail } from "./fileOperations";

// Crear un cache para las miniaturas
const thumbnailCache = new Map();

const FileExplorer = ({ files, onDelete, onUpdate, onView }) => {
  const [thumbnails, setThumbnails] = useState({});

  const loadThumbnail = useCallback(async (file) => {
    if (!thumbnailCache.has(file.name)) {
      try {
        const imageObjectURL = await fetchThumbnail(file.name);
        thumbnailCache.set(file.name, imageObjectURL);
        setThumbnails((prevThumbnails) => ({
          ...prevThumbnails,
          [file.name]: imageObjectURL,
        }));
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      }
    } else {
      // No es necesario actualizar el estado si la miniatura ya está en caché
      setThumbnails((prevThumbnails) => ({
        ...prevThumbnails,
        [file.name]: thumbnailCache.get(file.name),
      }));
    }
  }, []);

  useEffect(() => {
    files.forEach((file) => {
      loadThumbnail(file);
    });
  }, [files, loadThumbnail]);

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {files.map((file) => (
        <FileItem
          key={file.name}
          file={file}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onView={() => onView(file)}
          thumbnail={thumbnails[file.name]} // Pasar la miniatura desde el cache
        />
      ))}
    </ul>
  );
};

export default FileExplorer;
