import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title mb-4">PDF Manager</h1>
                            <FileUpload onUpload={() => window.location.reload()} />
                            <hr />
                            <FileList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
