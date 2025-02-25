import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Gestion du fichier sélectionné
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Envoi de l'image pour vérification
  const handleVerifyDiploma = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setVerificationResult(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/verify-diploma',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setVerificationResult(response.data);
      } else {
        setErrorMessage(response.data.message || 'Vérification échouée.');
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setErrorMessage('Erreur lors de la vérification du diplôme.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Vérification de Diplôme</h1>
      <form onSubmit={handleVerifyDiploma}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Vérification...' : 'Vérifier Diplôme'}
        </button>
      </form>

      {imagePreview && (
        <div>
          <h3>Aperçu:</h3>
          <img src={imagePreview} alt="Aperçu" width="200px" />
        </div>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {verificationResult && (
        <div>
          <h3>Résultats:</h3>
          <p><strong>Institution:</strong> {verificationResult.diplomaInfo.institution}</p>
          <p><strong>Type de Diplôme:</strong> {verificationResult.diplomaInfo.diplomaType}</p>
          <p><strong>Date de délivrance:</strong> {verificationResult.diplomaInfo.date}</p>
          <p><strong>Nom:</strong> {verificationResult.diplomaInfo.name}</p>
          <p>
            <strong>Statut:</strong> {verificationResult.success ? 
              <span style={{ color: 'green' }}>✅ Diplôme valide</span> : 
              <span style={{ color: 'red' }}>❌ Diplôme invalide</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;