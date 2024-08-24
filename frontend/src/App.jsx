import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Paper, Typography, styled } from "@mui/material";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import PdfViewer from "./components/PdfViewer";

const AppContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
}));

const MainContent = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TitleContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '1.8rem',
}));

const ContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
}));

function App() {
  const [refreshFiles, setRefreshFiles] = React.useState(false);

  const handleUploadSuccess = () => {
    setRefreshFiles(!refreshFiles);
  };

  return (
    <Router>
      <AppContainer>
        <MainContent elevation={6}>
          <Header>
            <TitleContainer>
              <StyledTypography component="h1">
                PDF LAB
              </StyledTypography>
            </TitleContainer>
            <FileUpload onUpload={handleUploadSuccess} />
          </Header>
          <ContentArea>
            <Routes>
              <Route
                path="/"
                element={
                  <FileList key={refreshFiles} />
                }
              />
              <Route path="/view/:filename" element={<PdfViewer />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;