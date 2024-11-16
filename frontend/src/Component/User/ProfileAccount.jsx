import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Container,
  CircularProgress,
} from "@mui/material";


const apiUrl = process.env.REACT_APP_API_URL;

const ProfileAccount = ({ setProfile }) => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    address: "",
    phone_number: "",
    city: "",
    state: "",
    profile_image: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ ...userDetails });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated");
          return;
        }

        const response = await axios.get(`${apiUrl}/user/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setUserDetails(response.data);
        setFormData(response.data);
        setImagePreview(response.data.profile_image);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Could not load user details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the base64 result for preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("phone_number", formData.phone_number);
      data.append("city", formData.city);
      data.append("state", formData.state);
      if (selectedImage) {
        data.append("profile_image", selectedImage);
      }

      const response = await axios.put(`${apiUrl}/user/profile/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUserDetails(formData);
      setImagePreview(response.data.profile_image || formData.profile_image);
      setEditMode(false);
      setError("");
    } catch (error) {
      console.error("Failed to update user details:", error);
      setError("Could not update user details. Please try again later.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "40px" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4} container justifyContent="center">
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={imagePreview || "/default-profile.png"}
                    alt="Profile Picture"
                    sx={{
                      width: 120,
                      height: 120,
                      marginBottom: 2,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      editMode &&
                      document.getElementById("profile-image-input").click()
                    } 
                  />
                  {editMode && (
                    <input
                      type="file"
                      id="profile-image-input"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" gutterBottom>
                  Profile Account
                </Typography>
                {error && (
                  <Typography variant="body2" color="error" paragraph>
                    {error}
                  </Typography>
                )}
                {editMode ? (
                  <div>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSave}
                      style={{ marginTop: "20px" }}
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Typography variant="body1" paragraph>
                      <strong>Username:</strong> {userDetails.username}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Email:</strong> {userDetails.email}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Address:</strong> {userDetails.address}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Phone Number:</strong> {userDetails.phone_number}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>City:</strong> {userDetails.city}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>State:</strong> {userDetails.state}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProfileAccount;
