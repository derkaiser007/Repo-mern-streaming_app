import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Media {
  _id: string;
  title: string;
  type: string;
}

const App: React.FC = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const stopMedia = () => setSelectedMedia(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/media')
      .then((response) => setMediaList(response.data))
      .catch((error) => console.error('Error fetching media:', error));
  }, []);

  return (
    <div>
      <h1>Media Streaming App</h1>
      <ul>
        {mediaList.map((media) => (
          <li key={media._id}>
            {media.title} ({media.type})
            <button onClick={() => setSelectedMedia(media._id)}>Play</button>
          </li>
        ))}
      </ul>
      {selectedMedia && (
        <div>
          <h2>Now Playing</h2>
          {mediaList.find((media) => media._id === selectedMedia)?.type === 'audio' ? (
            <audio controls autoPlay>
              <source src={`http://localhost:5000/api/media/stream/${selectedMedia}`} type="audio/mpeg" />
            </audio>
          ) : (
            <video controls width="600" autoPlay>
              <source src={`http://localhost:5000/api/media/stream/${selectedMedia}`} type="video/mp4" />
            </video>
          )}
          <button onClick={stopMedia}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default App;
