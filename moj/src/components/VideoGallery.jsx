import React, { useState, useEffect } from 'react';
import './VideoGallery.css';

const VideoGallery = ({ stepId = 'mediationProcess_mediation_preparation', title = 'Prepare for mediation' }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDefaults, setUsingDefaults] = useState(false);

  const defaultVideos = [
    {
      id: 'default-1',
      url: 'https://www.youtube.com/watch?v=hvfa0DHKzbg',
      title: 'What is Parental Responsibility',
      description: 'Do you know your parental responsibilities and rights? Family Law specialist Christina Blacklaws breaks down the main responsibilities of a parent and how a step-parent can legally gain them too.',
      thumbnail: 'https://img.youtube.com/vi/hvfa0DHKzbg/hqdefault.jpg'
    },
    {
      id: 'default-2',
      url: 'https://www.youtube.com/watch?v=Qv6pGXCS6c8',
      title: 'What to include in a Child Arrangement Plan',
      description: 'A comprehensive guide on essential elements to include when creating an effective child arrangement plan.',
      thumbnail: 'https://img.youtube.com/vi/Qv6pGXCS6c8/hqdefault.jpg'
    }
  ];

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // If stepId is none or empty, use defaults immediately
        if (!stepId || stepId === 'none') {
          setVideos(defaultVideos);
          setUsingDefaults(true);
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/media-extraction/get-videos/?step_id=${stepId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        let fetchedVideos = data?.videos || [];
        
        // Add thumbnails to all videos
        fetchedVideos = fetchedVideos.map(video => {
          const videoId = extractVideoId(video.url);
          return {
            ...video,
            thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
          };
        });
        
        // If no videos returned from API, use defaults
        if (!fetchedVideos || fetchedVideos.length === 0) {
          setVideos(defaultVideos);
          setUsingDefaults(true);
        } else {
          setVideos(fetchedVideos);
          setUsingDefaults(false);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message);
        // Use default videos on error
        setVideos(defaultVideos);
        setUsingDefaults(true);
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [stepId]);

  if (loading) {
    return (
      <div className="relevantVideos loading">
        <h3 className="mb-2">{title}</h3>
        <div className="flex justify-center items-center p-8">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="relevantVideos">
      <h3 className="mb-2">{title}</h3>
      {usingDefaults && (
        <p className="text-sm text-gray-600 mb-4">
          Showing recommended videos related to your case.
        </p>
      )}
      {error && (
        <p className="text-sm text-gray-600 mb-4">
          Could not load specific videos. Showing recommended content instead.
        </p>
      )}
      <ul className="videoList">
        {videos.map((video) => {
          const videoId = extractVideoId(video?.url);
          
          return (
            <li key={video?.id || Math.random().toString()} className="videoItem">
              <div className="videoCard">
                <div className="thumbnailContainer">
                  {video.thumbnail ? (
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={`Watch ${video.title || 'Video'} on YouTube`}
                    >
                      <img 
                        src={video.thumbnail}
                        alt={video.title || 'Video thumbnail'}
                        className="videoThumbnail"
                      />
                      <div className="playButton">▶</div>
                    </a>
                  ) : (
                    <div className="placeholderThumbnail">
                      <span className="playButton">▶</span>
                    </div>
                  )}
                </div>
                <div className="videoInfo">
                  <h4 className="videoTitle">
                    <a 
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {video.title || 'Video'}
                    </a>
                  </h4>
                  <p className="videoDescription">{video.description || 'No description available'}</p>
                  {video.duration && (
                    <p className="videoDuration">
                      <span>Duration: </span>
                      <span>{video.duration}</span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VideoGallery;