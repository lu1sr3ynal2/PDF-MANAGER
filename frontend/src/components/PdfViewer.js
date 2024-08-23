import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { useParams } from "react-router-dom";
import "@react-pdf-viewer/core/lib/styles/index.css";

const workerUrl = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const PdfViewer = ({ file }) => {
  const { filename } = useParams(); // Obtiene el nombre del archivo desde la URL
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Si existe un archivo como prop, lo utiliza. Si no, usa el filename de la URL.
    if (file) {
      setFileUrl(`${process.env.REACT_APP_API_URL}/api/files/${file.name}`);
    } else if (filename) {
      setFileUrl(`${process.env.REACT_APP_API_URL}/api/files/${filename}`);
    } else {
      setFileUrl(""); // No hay archivo para mostrar
    }
    // Reinicia el estado de carga cada vez que cambia el fileUrl
    setLoading(true);
  }, [file, filename]);

  // Maneja el caso en que no hay archivo para mostrar
  if (!fileUrl) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          No se encontró el archivo
        </div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          width: "calc(100% - 48px)",
          maxWidth: "1200px",
          margin: "24px auto",
        }}
      >
        <Worker workerUrl={workerUrl}>
          <Viewer
            fileUrl={fileUrl}
            defaultScale="PageFit"
            onDocumentLoad={() => setLoading(false)}
            renderError={(error) => (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Error: {error.message}
              </div>
            )}
          />
        </Worker>
      </Box>
    </Box>
  );
};

export default PdfViewer;
