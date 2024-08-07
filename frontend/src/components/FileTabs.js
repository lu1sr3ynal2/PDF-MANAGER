// FileTabs.js
import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const FileTabs = ({ activeTab, onSelect, openTabs, onCloseTab }) => (
    <Tabs activeKey={activeTab} onSelect={(k) => onSelect(k)} id="file-tabs">
        <Tab eventKey="explorer" title="Explorador de Archivos">
            {/* El contenido del explorador de archivos se renderiza en FileList.js */}
        </Tab>
        {openTabs.map(file => (
            <Tab 
                eventKey={file.name} 
                title={file.name} 
                key={file.name}
            >
                <div style={{ padding: '20px' }}>
                    <iframe 
                        src={`${process.env.REACT_APP_API_URL}/api/files/${file.name}`} 
                        title={file.name} 
                        width="100%" 
                        height="600px" 
                    />
                    <button 
                        onClick={() => onCloseTab(file)} 
                        className="btn btn-danger mt-3"
                    >
                        Cerrar
                    </button>
                </div>
            </Tab>
        ))}
    </Tabs>
);

export default FileTabs;
