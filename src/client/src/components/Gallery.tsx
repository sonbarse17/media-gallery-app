import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import { MediaItem, PaginatedResponse, MediaFilter } from '../types';
import MediaCard from './MediaCard';
import FilterBar from './FilterBar';
import LoadingSpinner from './LoadingSpinner';
import { mediaApi } from '../services/api';
import { useMedia } from '../contexts/MediaContext';

const Gallery: React.FC = () => {
  const { setShowUploadModal } = useMedia();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MediaFilter>({ page: 1, limit: 20 });
  const [hasMore, setHasMore] = useState(true);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const fetchMedia = async (newFilter: MediaFilter, append = false) => {
    try {
      setLoading(!append);
      const response: PaginatedResponse<MediaItem> = await mediaApi.getMedia(newFilter);
      
      if (Array.isArray(response?.data)) {
        if (append) {
          setMedia(prev => [...prev, ...response.data]);
        } else {
          setMedia(response.data);
        }
      } else {
        console.error("API response's data property is not an array:", response);
        toast.error('Received invalid media data from server.');
        if (!append) {
          setMedia([]);
        }
      }
      
      setHasMore(response?.pagination?.page < response?.pagination?.pages);
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(filter);
  }, [filter.type, filter.sortBy, filter.sortOrder]);
  
  useEffect(() => {
    const handleRefresh = () => {
      setFilter({ ...filter, page: 1 });
      fetchMedia({ ...filter, page: 1 });
    };
    
    window.addEventListener('refreshMediaGallery', handleRefresh);
    return () => {
      window.removeEventListener('refreshMediaGallery', handleRefresh);
    };
  }, [filter]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = { ...filter, page: (filter.page || 1) + 1 };
      setFilter(nextPage);
      fetchMedia(nextPage, true);
    }
  }, [inView, hasMore, loading]);



  const handleDelete = async (id: string) => {
    try {
      await mediaApi.deleteMedia(id);
      setMedia(prev => prev.filter(item => item.id !== id));
      toast.success('Media deleted successfully');
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  if (loading && media.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <FilterBar 
        filter={filter} 
        onFilterChange={setFilter}
        onUploadClick={() => setShowUploadModal(true)}
      />

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {(media || []).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaCard 
                media={item} 
                onDelete={() => handleDelete(item.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {media.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No media files found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Upload your first file
          </button>
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && <LoadingSpinner />}
        </div>
      )}


    </div>
  );
};

export default Gallery;