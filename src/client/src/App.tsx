import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Gallery from './components/Gallery';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadModal from './components/UploadModal';
import { MediaProvider, useMedia } from './contexts/MediaContext';

const AppContent: React.FC = () => {
  const { showUploadModal, setShowUploadModal, uploading, handleUpload } = useMedia();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onUploadClick={() => setShowUploadModal(true)} />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        uploading={uploading}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MediaProvider>
        <AppContent />
      </MediaProvider>
    </Router>
  );
};

export default App;