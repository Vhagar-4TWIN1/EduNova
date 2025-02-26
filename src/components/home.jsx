import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate

const Home = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedData, setExtractedData] = useState({
    nom: '',
    prenom: '',
    email: '',
    image: '',
  });

  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Affichage en aperçu avant upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Veuillez sélectionner une image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setExtractedData({
          nom: response.data.nom,
          prenom: response.data.prenom,
          email: response.data.email,
          image: response.data.image,
        });
      } else {
        alert('Extraction des informations échouée.');
      }
    } catch (error) {
      console.error('Erreur lors de l’upload:', error);
      alert('Une erreur est survenue');
    }
  };

  const handleRedirectToRegistration = () => {
    // Redirection vers la page d'enregistrement en passant les données extraites
    navigate('/Registration', {
      state: { firstName: extractedData.prenom, lastName: extractedData.nom }
    });
  };

  return (
    <div>
      <h1>Upload et Extraction des Informations</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Télécharger et Analyser</button>
      </form>

      {imagePreview && (
        <div>
          <h3>Aperçu de l’image:</h3>
          <img src={imagePreview} alt="Aperçu" width="200px" />
        </div>
      )}

      {extractedData.image && (
        <div>
          <h3>Résultats:</h3>
          <p><strong>Nom:</strong> {extractedData.nom}</p>
          <p><strong>Prénom:</strong> {extractedData.prenom}</p>
          <p><strong>Email:</strong> {extractedData.email}</p>
          <h3>Image Uploadée:</h3>
          <img src={extractedData.image} alt="Carte Identité" width="200px" />
          <button onClick={handleRedirectToRegistration}>Aller à l'enregistrement</button>
        </div>
      )}
    </div>
  );
};

export default Home;
