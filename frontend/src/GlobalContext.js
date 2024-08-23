import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState(null);

    return (
        <GlobalContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </GlobalContext.Provider>
    );
};
