import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Box, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Avatar, Stack, TextField, CircularProgress, Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import Quill from 'quill';

// Quill CSS - IMP: Ye public/index.html mein daal do ya import karo
import 'quill/dist/quill.snow.css';

const API_URL = 'https://backendapi.trakky.in/salons/master-service-image/';

// Clean empty <p> tags
const cleanContent = (html) => {
  if (!html) return '';
  return html
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/&nbsp;/g, ' ');
};

const ListServiceImages = () => {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: null,
    theme_name: '',
    description: '',
    image: null,
    imageFile: null,
  });

  const descriptionEditorRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Fetch Services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setServices(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authTokens?.access) fetchServices();
  }, [authTokens]);

  // Initialize Quill Editor
  useEffect(() => {
    if (!open || !editorContainerRef.current) return;

    // Destroy previous editor
    if (descriptionEditorRef.current) {
      descriptionEditorRef.current = null;
    }

    // Create Quill Editor
    const quill = new Quill(editorContainerRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'bullet' }],
        ],
      },
      placeholder: 'Enter description...',
    });

    descriptionEditorRef.current = quill;

    // Load existing content
    if (currentService.description) {
      quill.clipboard.dangerouslyPasteHTML(currentService.description);
    }

    // Sync on text change
    const handler = () => {
      const html = quill.root.innerHTML;
      const cleaned = cleanContent(html);
      setCurrentService(prev => ({ ...prev, description: cleaned }));
    };

    quill.on('text-change', handler);

    return () => {
      if (quill) quill.off('text-change', handler);
    };
  }, [open]); // Sirf open pe depend karega

  // Open Edit Dialog
  const handleEdit = (service) => {
    setCurrentService({
      id: service.id,
      theme_name: service.theme_name || '',
      description: service.description || '',
      image: service.image || null,
      imageFile: null,
    });
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setCurrentService({
      id: null,
      theme_name: '',
      description: '',
      image: null,
      imageFile: null,
    });
    if (descriptionEditorRef.current) {
      descriptionEditorRef.current = null;
    }
  };

  // Save Changes
  const handleSave = async () => {
    if (!currentService.theme_name.trim()) return alert('Theme name is required');

    if (!descriptionEditorRef.current || descriptionEditorRef.current.getText().trim() === '') {
      return alert('Description is required');
    }

    const formData = new FormData();
    formData.append('theme_name', currentService.theme_name);
    formData.append('description', currentService.description);
    if (currentService.imageFile) formData.append('image', currentService.imageFile);

    try {
      const res = await fetch(`${API_URL}${currentService.id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      handleClose();
    } catch (e) {
      alert(e.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try {
      await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentService(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setCurrentService(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Manage Service Images</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/add-service-image')}>
          Add New
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map(s => (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Avatar src={s.image} variant="rounded" sx={{ width: 70, height: 70 }}>
                    {!s.image && 'No Img'}
                  </Avatar>
                </TableCell>
                <TableCell>{s.theme_name}</TableCell>
                <TableCell
                  onClick={() => handleEdit(s)}
                  sx={{ cursor: 'pointer', maxWidth: 400 }}
                  dangerouslySetInnerHTML={{ __html: s.description || '—' }}
                />
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleDelete(s.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDIT DIALOG */}
   
    </Box>
  );
};

export default ListServiceImages;