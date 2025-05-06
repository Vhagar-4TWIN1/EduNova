import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import MusicPlayer from './MusicPlayer';

const MusicPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="music-page">
      <Button variant="light" onClick={() => navigate(-1)}>
        <BiArrowBack /> Back
      </Button>
      
      <h2>Music Player</h2>
      
      <MusicPlayer />
    </Container>
  );
};

export default MusicPage;


