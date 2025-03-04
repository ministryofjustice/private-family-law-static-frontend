import * as React from 'react';
import './RelevantVideos.css';

export default function RelevantVideos() {
  return (
    <div className="relevantVideos">
      <h3 className="mb-2">Prepare for mediation</h3>
      <ul>
        <li>
          <div className="videoContainer">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/zYhWdwazCZA?si=vSTagi1bHvLXxSbY" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
            <p className="videoDescription">Family mediation can be a quicker, cheaper and less stressful way to move forward if you've decided to separate from your partner.</p>
            <p className="videoDuration">
              <span>Total: </span>
              <span>3 mins</span>
            ​</p>
          </div>
        ​</li>
      </ul>
    </div>
  );
}