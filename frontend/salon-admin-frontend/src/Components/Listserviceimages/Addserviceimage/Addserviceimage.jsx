import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Avatar, Stack, Container,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../Context/AuthContext';  // Adjust path
import Quill from 'quill';

const API_URL = 'https://backendapi.trakky.in/salons/master-service-image/';

const cleanContent = (content) => {
  // Implement your cleaning logic here, e.g., remove disallowed tags or clean empty elements
  // For example:
  return content.replace(/<p><br><\/p>/g, '').replace(/<p><\/p>/g, '');
};

const AddServiceImage = () => {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    theme_name: '',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const descriptionEditorRef = useRef(null);

  useEffect(() => {
    descriptionEditorRef.current = new Quill("#description-editor", {
      theme: "snow",
      modules: { toolbar: [["bold", "italic", "underline", "strike"], [{ list: "bullet" }]] },
    });
    descriptionEditorRef.current.on("text-change", () => {
      let content = descriptionEditorRef.current.root.innerHTML;
      const cleaned = cleanContent(content);
      if (cleaned !== content) {
        descriptionEditorRef.current.root.innerHTML = cleaned;
        const range = descriptionEditorRef.current.getSelection();
        if (range) descriptionEditorRef.current.setSelection(range.index, 0);
        else descriptionEditorRef.current.setSelection(descriptionEditorRef.current.getLength() - 1, 0);
      }
      setFormData({ ...formData, description: descriptionEditorRef.current.root.innerHTML });
    });

    return () => {
      if (descriptionEditorRef.current) descriptionEditorRef.current = null;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please upload a valid image' });
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.theme_name.trim()) newErrors.theme_name = 'Title is required';
    if (descriptionEditorRef.current.getText().trim() === '') newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const payload = new FormData();
    payload.append('theme_name', formData.theme_name);
    payload.append('description', formData.description);
    payload.append('image', formData.image);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: payload
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to add service');
      }

      setSuccess(true);
      setTimeout(() => navigate('/list-service-images?mode=salon'), 500);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/list-service-images?mode=salon');

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
            Add New Service Image
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Service added successfully! Redirecting...
            </Alert>
          )}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Theme Name"
              name="theme_name"
              value={formData.theme_name}
              onChange={handleChange}
              error={!!errors.theme_name}
              helperText={errors.theme_name}
              disabled={loading}
            />

            <Box margin="normal">
              <Typography variant="subtitle2" gutterBottom>
                Description *
              </Typography>
              <div
                id="description-editor"
                style={{ height: "200px", border: "1px solid #ccc" }}
              ></div>
              {errors.description && (
                <Typography color="error" variant="caption" display="block">
                  {errors.description}
                </Typography>
              )}
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="body1" gutterBottom>
                Upload Service Image
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                Choose Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>

              {errors.image && (
                <Typography color="error" variant="caption" display="block">
                  {errors.image}
                </Typography>
              )}

              {imagePreview && (
                <Box mt={2}>
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    variant="rounded"
                    sx={{ width: 140, height: 140, mx: 'auto', boxShadow: 3 }}
                  />
                  <Typography variant="caption" display="block" mt={1}>
                    Image Preview
                  </Typography>
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={2} mt={4} justifyContent="center">
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                disabled={loading}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Adding...' : 'Add Service'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddServiceImage;