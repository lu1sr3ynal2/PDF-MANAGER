import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import PdfViewer from './components/PdfViewer';

function App() {
    return (
        <Router>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="card-title mb-4">PDF Manager</h1>
                                <Routes>
                                    <Route path="/" element={
                                        <>
                                            <FileUpload onUpload={() => window.location.reload()} />
                                            <hr />
                                            <FileList />
                                        </>
                                    } />
                                    <Route path="/view/:filename" element={<PdfViewer />} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
