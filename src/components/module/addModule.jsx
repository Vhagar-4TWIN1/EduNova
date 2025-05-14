import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../header';
//import Footer from '../footer';
import { useNavigate } from 'react-router-dom';

import './addModule.css';

const AddModule = ({ existingModule, onClose }) => {
  const [title, setTitle] = useState(existingModule ? existingModule.title : '');
  const [description, setDescription] = useState(existingModule ? existingModule.description : '');
  const [image, setImage] = useState(existingModule ? existingModule.image : null);
  const navigate = useNavigate();
  useEffect(()=>{
    document.title = "Add Module";
    },[])
  useEffect(() => {
    if (existingModule) {
      setTitle(existingModule.title);
      setDescription(existingModule.description);
      setImage(existingModule.image);
    }
  }, [existingModule]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setImage(base64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      image
    };

    try {
      if (existingModule) {
        // Update Module (PUT request)
        await axios.put(`http://localhost:3000/module/${existingModule._id}`, formData, {
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`

           }
        });
        navigate('/listModules');
      } else {
        // Add New Module (POST request)
        await axios.post('http://localhost:3000/module/add', formData, {
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`

           }
        });
        navigate('/listModules');
      }
      if (onClose) {
        onClose();
      }
       
      
    } catch (error) {
      console.error(error);
      alert('Error saving module');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return (
    <>      
      <div className="container">
        <div className="card">
          <h2 className="card-title">{existingModule ? "Edit Module" : "Add New Module"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Module Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="input-textarea"
              placeholder="Module Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              className="input-file"
              label="Image"
              name="image"
              id="image_upload"
              type="file"
              accept=".jpeg, .png, .jpg"
              onChange={handleImageChange}
              required={!existingModule} // Only required when adding a new module
            />
            <button className="button" type="submit">
              {existingModule ? "Update Module" : "Add Module"}
            </button>
            <button type="button" onClick={onClose} className="button cancel">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddModule;
