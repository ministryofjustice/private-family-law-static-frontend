import React, { useState, useEffect } from 'react';
import './VideoGallery.css'; // You'll need to create this CSS file

const VideoGallery = ({ stepId = 'mediationProcess_mediation_preparation', title = 'Prepare for mediation' }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/media-extraction/get-videos/?step_id=${stepId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setVideos(data.videos || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchVideos();
  }, [stepId]);

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate YouTube embed URL
  const getEmbedUrl = (videoUrl) => {
    const videoId = extractVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading videos...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error loading videos: {error}</p>
        <p className="mt-2">Please check that your API is running at localhost:8000</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return <div className="p-4">No videos found for this step.</div>;
  }

  return (
    <div className="relevantVideos">
      <h3 className="mb-2">{title}</h3>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <div className="videoContainer">
              <iframe 
                width="560" 
                height="315" 
                src={getEmbedUrl(video.url)}
                title={video.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <p className="videoDescription">{video.description || video.title}</p>
              {video.duration && (
                <p className="videoDuration">
                  <span>Total: </span>
                  <span>{video.duration}</span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoGallery;