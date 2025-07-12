import React, { useState, useEffect } from 'react';
import ImageView from './ImageView';
import VideoPlayer from './VideoPlayer';
import './styles.css';

const Gallery: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<Array<{ id: string; type: string; url: string; originalName: string }>>([]);

    useEffect(() => {
        // Fetch media items from the server
        const fetchMediaItems = async () => {
            try {
                const response = await fetch('/api/media');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                const data = result.data || result;
                setMediaItems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch media items:', error);
                setMediaItems([]);
            }
        };

        fetchMediaItems();
    }, []);

    return (
        <div className="gallery">
            {mediaItems?.map(item => (
                <div key={item.id} className="media-item">
                    {item.type === 'image' ? (
                        <ImageView src={item.url} alt={item.originalName} />
                    ) : (
                        <VideoPlayer src={item.url} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Gallery;