import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import PdfViewer from './components/PdfViewer';

function App() {
    return (
        <Router>
            <Container>
                <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    PDF Manager
                                </Typography>
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Router>
    );
}

export default App;
