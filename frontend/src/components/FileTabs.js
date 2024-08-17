import React from 'react';
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FileTabs = ({ activeTab, onSelect, openTabs, onCloseTab }) => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => onSelect(newValue)}
            aria-label="file tabs"
        >
            <Tab label="Explorador de Archivos" value="explorer" />
            {openTabs.map(file => (
                <Tab 
                    key={file.name} 
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        {openTabs.map(file => (
            activeTab === file.name && (
                <Box key={file.name} sx={{ p: 3 }}>
                    <iframe 
                        src={`${process.env.REACT_APP_API_URL}/api/files/${file.name}`} 
                        title={file.name} 
                        width="100%" 
                        height="600px" 
                    />
                </Box>
            )
        ))}
    </Box>
);

export default FileTabs;
