import React from "react";
import { Tabs, Tab, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfViewer from "./PdfViewer";

const FileTabs = ({ activeTab, onSelect, openTabs, onCloseTab }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onSelect(newValue)}
        aria-label="file tabs"
      >
        <Tab label="Explorador de Archivos" value="explorer" />
        {openTabs.map((file) => (
          <Tab
            key={file.name}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {file.name}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(file);
                  }}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            value={file.name}
          />
        ))}
      </Tabs>
      {openTabs.map(
        (file) =>
          activeTab === file.name && <PdfViewer key={file.name} file={file} />
      )}
    </Box>
  );
};

export default FileTabs;
