import React, { createContext, useState, useContext, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { mediaApi } from '../services/api';

interface MediaContextProps {
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  uploading: boolean;
  handleUpload: (files: File[]) => Promise<void>;
  refreshMedia: () => void;
}

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

interface MediaProviderProps {
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Filter state is prepared for future pagination implementation
  // const [filter, setFilter] = useState<MediaFilter>({ page: 1, limit: 20 });

  const refreshMedia = () => {
    // This is a placeholder for the Gallery component to implement
    // We'll use a custom event to trigger a refresh
    const event = new CustomEvent('refreshMediaGallery');
    window.dispatchEvent(event);
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      await Promise.all(files.map(file => mediaApi.uploadMedia(file)));
      toast.success(`${files.length} file(s) uploaded successfully`);
      refreshMedia();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setShowUploadModal(false);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        showUploadModal,
        setShowUploadModal,
        uploading,
        handleUpload,
        refreshMedia
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextProps => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};