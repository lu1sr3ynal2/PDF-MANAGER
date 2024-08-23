import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ListItem,
  Typography,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Chip,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import Thumbnail from "./Thumbnail";
import { handleRename, deleteFile, performOCR } from "./fileOperations";

const FileItem = ({ file, onDelete, onUpdate, onView }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const textFieldRef = useRef(null);
  const acceptButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const handleAcceptRename = async () => {
    const success = await handleRename(file.name, newName, onUpdate);
    if (success) setEditing(false);
  };

  const handleCancelRename = () => {
    setNewName(file.name);
    setEditing(false);
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleBlur = (e) => {
    if (
      e.relatedTarget !== acceptButtonRef.current &&
      e.relatedTarget !== cancelButtonRef.current
    ) {
      handleCancelRename();
    }
  };

  return (
    <ListItem
      sx={{
        mb: 2,
        p: 2,
        bgcolor: "#f7f9fc",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Link
        to="#"
        onClick={onView}
        style={{ marginRight: "16px", textDecoration: "none" }}
      >
        <Thumbnail file={file} />
      </Link>
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        {!editing ? (
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => setEditing(true)}
          >
            {file.name}
          </Typography>
        ) : (
          <TextField
            ref={textFieldRef}
            value={newName}
            onChange={handleChange}
            autoFocus
            variant="outlined"
            size="small"
            onBlur={handleBlur}
            sx={{ width: "100%" }}
          />
        )}
        <Box sx={{ display: "flex", mt: 1, alignItems: "center" }}>
          <Tooltip title="Pages">
            <Chip
              label={`Pages: ${file.pages}`}
              color="primary"
              sx={{ mr: 1 }}
            />
          </Tooltip>
          <Tooltip title="Size">
            <Chip
              label={`${(file.size / 1024).toFixed(2)} KB`}
              color="secondary"
            />
          </Tooltip>
        </Box>
      </Box>
      {editing && (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <IconButton
            ref={acceptButtonRef}
            onClick={handleAcceptRename}
            color="success"
          >
            <DriveFileRenameOutlineIcon />
          </IconButton>
          <IconButton
            ref={cancelButtonRef}
            onClick={handleCancelRename}
            color="secondary"
          >
            <CancelIcon />
          </IconButton>
        </Box>
      )}
      <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
        <Link
          to={`/view/${file.name}`}
          target="_blank"
          style={{ textDecoration: "none", marginRight: "8px" }}
        >
          <IconButton color="primary">
            <LaunchIcon />
          </IconButton>
        </Link>
        <IconButton
          onClick={() => performOCR(file.name, onUpdate)}
          color="secondary"
        >
          <DocumentScannerIcon />
        </IconButton>
        <IconButton
          onClick={() => deleteFile(file.name, onDelete)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default FileItem;
