import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";
import { useState } from "react";
import axios from "axios";
import "./badgeForm.css";

const BadgeForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);


const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Génère un aperçu
  }
};


  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("points", values.points);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/badges/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Badge Created:", response.data);
      alert("Badge Created Successfully!");
    } catch (error) {
      console.error("Error creating badge:", error.response?.data || error);
      alert("Failed to create badge.");
    }
  };

  return (
    <Box className="badge-form-container">
      <Header title="CREATE BADGE" subtitle="Create a New Badge" />

      <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={badgeSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? "span 2" : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Title"
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-input": {
                    color: "black", // Change la couleur du texte saisi
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray", // Couleur du label par défaut
                    transition: "color 0.3s", // Animation douce
                  },
                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "transparent", // Rend le label invisible lorsqu'on écrit
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#333", // Fond du champ
                    borderRadius: "5px",
                  },
                }}
              />
              
             
              <TextField
                fullWidth
                variant="filled"
                label="Category"
                name="category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-input": {
                    color: "black", // Change la couleur du texte saisi
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray", // Couleur du label par défaut
                    transition: "color 0.3s", // Animation douce
                  },
                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "transparent", // Rend le label invisible lorsqu'on écrit
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#333", // Fond du champ
                    borderRadius: "5px",
                  },
                }}
              />
              
              
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                multiline
                rows={3}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-input": {
                    color: "black", // Change la couleur du texte saisi
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray", // Couleur du label par défaut
                    transition: "color 0.3s", // Animation douce
                  },
                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "transparent", // Rend le label invisible lorsqu'on écrit
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#333", // Fond du champ
                    borderRadius: "5px",
                  },
                }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Points"
                name="points"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.points}
                error={!!touched.points && !!errors.points}
                helperText={touched.points && errors.points}
                sx={{
                  gridColumn: "span 2",
                  "& .MuiInputBase-input": {
                    color: "black", // Change la couleur du texte saisi
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray", // Couleur du label par défaut
                    transition: "color 0.3s", // Animation douce
                  },
                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                    color: "transparent", // Rend le label invisible lorsqu'on écrit
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#333", // Fond du champ
                    borderRadius: "5px",
                  },
                }}
              />
              
              {/* File Upload */}
              <Box className="file-input-container" display="flex" flexDirection="column" alignItems="center" mt={2}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              
              {/* Affichage de l'aperçu */}
              {preview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img src={preview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "10px" }} />
                </Box>
              )}
            </Box>
            </Box>
            
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" className="create-badge-btn">
                Create Badge
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation Schema
const badgeSchema = yup.object().shape({
  title: yup.string().required("Required"),
  category: yup.string().required("Required"),
  description: yup.string().required("Required"),
  points: yup.number().required("Required").positive().integer(),
});

// Initial Values
const initialValues = {
  title: "",
  category: "",
  description: "",
  points: "",
};

export default BadgeForm;
