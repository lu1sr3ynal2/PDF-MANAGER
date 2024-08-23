import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onClickHandler = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      onUpload(); // Actualiza el listado de archivos sin recargar la página
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Button
        variant="contained"
        component="label"
        color="primary"
        startIcon={<UploadFileIcon />}
        style={{ marginRight: "10px" }}
      >
        Seleccionar Archivo
        <input type="file" onChange={onChangeHandler} hidden />
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClickHandler}
        disabled={!selectedFile || uploading}
        startIcon={
          uploading ? <CircularProgress size={24} /> : <CloudUploadIcon />
        }
      >
        {uploading ? "Subiendo..." : "Subir"}
      </Button>
      {selectedFile && (
        <Typography variant="body2" style={{ marginLeft: "10px" }}>
          {selectedFile.name}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
