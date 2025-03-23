// src/components/VideoPreloader.js
import { useEffect } from 'react';

const VideoPreloader = ({ isAuthenticated, isLoading }) => {
  useEffect(() => {

    if (isAuthenticated && !isLoading) {
      preloadVideos();
    }
  }, [isAuthenticated, isLoading]);

  return null;
};


const preloadVideos = async () => {
  try {
    console.log('Preloading videos data...');
    
    const response = await fetch(
      'https://origineer.sheetdb.io/api/v1/ij73hup2r94z5?sheet=content'
    );
    let data = await response.json();

    const videoItems = data.filter(item => 
      item.type && item.type.toLowerCase().includes('video')
    );

    const processedVideos = videoItems.map(item => {
      const videoItem = { ...item };

      if (!videoItem.cover_image_url && videoItem.video_url) {
        if (videoItem.video_url.includes('cloudinary.com')) {
          videoItem.cover_image_url = videoItem.video_url
            .replace('/video/upload/', '/video/upload/so_0,w_640,h_360,c_fill,q_80/')
            .replace('.mp4', '.jpg');
        } else {
          videoItem.cover_image_url = 'https://via.placeholder.com/640x360?text=Video';
        }
      }

      if (!videoItem.title && videoItem.content) {
        const firstLine = videoItem.content.split('\n')[0];
        videoItem.title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      }
      
      if (!videoItem.excerpt && videoItem.content) {
        videoItem.excerpt = videoItem.content.length > 120 ? videoItem.content.substring(0, 120) + '...' : videoItem.content;
      }
      

      if (!videoItem.read_time) {
        videoItem.read_time = '2';
      }

      videoItem.location = videoItem.title;
      videoItem.author = videoItem.creator || 'user' + Math.floor(Math.random() * 1000);
      videoItem.likes = Math.floor(Math.random() * 50);
      videoItem.dislikes = Math.floor(Math.random() * 10);
      videoItem.view_count = Math.floor(Math.random() * 10000);
      videoItem.avatar_url = `https://api.dicebear.com/7.x/adventurer/png?seed=${videoItem.author}`;
      

      if (videoItem.content) {
        const lines = videoItem.content.split('\n');
        if (lines.length > 1) {
          videoItem.overlay_text = lines[1] || '';
        }
      }
      
      return videoItem;
    });

    if (processedVideos.length > 0) {
      global.videoEvents.setProcessedVideos(processedVideos);
      console.log('Preloaded videos to global.videoEvents, count:', processedVideos.length);
    }
  } catch (error) {
    console.error('Error preloading videos:', error);
  }
};

export default VideoPreloader;