import React, { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const UploadContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const VisuallyStyledButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5, 1),
}));

const FileNameContainer = styled(Box)({
  maxWidth: '150px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const FileUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onChangeHandler = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const onClickHandler = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

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
      console.log("Files uploaded successfully:", data);
      if (onUpload) onUpload();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContainer>
      <VisuallyStyledButton
        component="label"
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
      >
        {selectedFiles.length === 0 ? "Seleccionar" : "Cambiar"}
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={onChangeHandler}
          hidden
        />
      </VisuallyStyledButton>
      {selectedFiles.length > 0 && (
        <>
          <FileNameContainer>
            <Typography variant="caption">
              {selectedFiles.length === 1
                ? selectedFiles[0].name
                : `${selectedFiles.length} archivos seleccionados`}
            </Typography>
          </FileNameContainer>
          <VisuallyStyledButton
            variant="contained"
            color="secondary"
            onClick={onClickHandler}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          >
            {uploading ? "Subiendo" : "Subir"}
          </VisuallyStyledButton>
        </>
      )}
    </UploadContainer>
  );
};

export default FileUpload;