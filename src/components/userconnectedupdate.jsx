import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Grid,
  Box,
  Typography,
} from "@mui/material";

const UserProfile = () => {
  // const [user, setUser] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: localStorage.getItem("rememberedEmail") || "",
  // });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [error, setError] = useState(""); // To handle error messages
  const [id, setId] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Token is missing. Please log in.");
      return;
    }

    // Extract userId from the token
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.userId) {
      alert("Invalid token.");
      return;
    }
    console.log(decodedToken);
    const userId = decodedToken.userId; // Stocker userId
    setId(userId);

    axios
      .get(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);

        setEmail(response.data.data.email);
        setLoading(false);
        console.log(email);

        // Stop loading when data is fetched
      })
      .catch((error) => {
        setError("Error loading user data.");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/users/${id}`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      console.log(email);
      console.log(id);
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating the profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/signup"; // Redirect after deletion
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting the account.");
    }
  };

  return (
    <Container maxWidth="sm">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  readOnly
                />
              </Grid>
            </Grid>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              sx={{ mt: 3 }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Update Profile
            </Button>

            <Button
              fullWidth
              sx={{ mt: 3 }}
              variant="contained"
              color="secondary"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default UserProfile;
