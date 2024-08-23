import React from "react";
import { Box } from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";

const Thumbnail = ({ file, thumbnail }) => {
  return (
    <Box
      sx={{
        width: "90px",
        height: "auto",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: thumbnail ? "transparent" : "#e0e0e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`Thumbnail of ${file.name}`}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
          loading="lazy"  // Carga diferida
        />
      ) : (
        <FilePresentIcon sx={{ fontSize: 48, color: "#9e9e9e" }} />
      )}
    </Box>
  );
};

export default Thumbnail;
