// FileExplorer.js
import React from "react";
import FileItem from "./FileItem";

const FileExplorer = ({ files, onDelete, onUpdate, onView }) => (
  <ul style={{ listStyleType: "none", padding: 0 }}>
    {files.map((file) => (
      <FileItem
        key={file.name}
        file={file}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onView={() => onView(file)}
      />
    ))}
  </ul>
);

export default FileExplorer;
