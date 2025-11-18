import { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import dogService from '../../../services/dogService';
import fileService from '../../../services/fileService';
import styles from './DogProfileForm.module.css';

const DogProfileForm = ({ dog = null, onSuccess, onCancel }) => {
  const isEditMode = !!dog;

  const [formData, setFormData] = useState({
    name: '',
    story: '',
    gender: '',
    age: '',
    size: '',
    photoUrl: '',
    status: 'AVAILABLE'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Si estamos editando, cargar datos del perro
  useEffect(() => {
    if (dog) {
      setFormData({
        name: dog.name || '',
        story: dog.story || '',
        gender: dog.gender || '',
        age: dog.age?.toString() || '',
        size: dog.size || '',
        photoUrl: dog.photoUrl || '',
        status: dog.status || 'AVAILABLE'
      });
      
      // Cargar preview de imagen existente
      if (dog.photoUrl) {
        setPreviewUrl(fileService.getFileUrl(dog.photoUrl));
      }
    }
  }, [dog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select a valid image file'
        }));
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error de foto
      setErrors(prev => ({
        ...prev,
        photo: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 0 || formData.age > 30) {
      newErrors.age = 'Age must be between 0 and 30';
    }

    if (!formData.size) {
      newErrors.size = 'Size is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // En modo crear, validar que haya foto
    if (!isEditMode && !selectedFile && !formData.photoUrl) {
      newErrors.photo = 'Please upload a photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = formData.photoUrl;

      // Si hay nueva imagen, subirla primero
      if (selectedFile) {
        setUploadingImage(true);
        const uploadResponse = await fileService.uploadFile(selectedFile);
        photoUrl = uploadResponse.fileName;
        setUploadingImage(false);
      }

      // Preparar datos para enviar
      const dogData = {
        name: formData.name.trim(),
        story: formData.story.trim() || null,
        gender: formData.gender,
        age: parseInt(formData.age),
        size: formData.size,
        photoUrl: photoUrl || null,
        status: formData.status
      };

      // Crear o actualizar
      if (isEditMode) {
        await dogService.updateDog(dog.id, dogData);
      } else {
        await dogService.createDog(dogData);
      }

      // Callback de éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to save dog profile. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Nombre y Edad */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="e.g., Buddy"
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="age" className={styles.label}>
            Age <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
            placeholder="Age in years"
            min="0"
            max="30"
          />
          {errors.age && (
            <span className={styles.errorMessage}>{errors.age}</span>
          )}
        </div>
      </div>

      {/* Story */}
      <div className={styles.field}>
        <label htmlFor="story" className={styles.label}>
          Story
        </label>
        <textarea
          id="story"
          name="story"
          value={formData.story}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Tell us about this dog's background and personality..."
          rows="5"
        />
      </div>

      {/* Gender y Size */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="gender" className={styles.label}>
            Gender <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={handleChange}
              />
              <span>Male</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={handleChange}
              />
              <span>Female</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="UNKNOWN"
                checked={formData.gender === 'UNKNOWN'}
                onChange={handleChange}
              />
              <span>Unknown</span>
            </label>
          </div>
          {errors.gender && (
            <span className={styles.errorMessage}>{errors.gender}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="size" className={styles.label}>
            Size <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="SMALL"
                checked={formData.size === 'SMALL'}
                onChange={handleChange}
              />
              <span>Small</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="MEDIUM"
                checked={formData.size === 'MEDIUM'}
                onChange={handleChange}
              />
              <span>Medium</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="LARGE"
                checked={formData.size === 'LARGE'}
                onChange={handleChange}
              />
              <span>Large</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="EXTRA_LARGE"
                checked={formData.size === 'EXTRA_LARGE'}
                onChange={handleChange}
              />
              <span>Extra Large</span>
            </label>
          </div>
          {errors.size && (
            <span className={styles.errorMessage}>{errors.size}</span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className={styles.field}>
        <label htmlFor="status" className={styles.label}>
          Status <span className={styles.required}>*</span>
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="AVAILABLE"
              checked={formData.status === 'AVAILABLE'}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="IN_PROCESS"
              checked={formData.status === 'IN_PROCESS'}
              onChange={handleChange}
            />
            <span>In Process</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="ADOPTED"
              checked={formData.status === 'ADOPTED'}
              onChange={handleChange}
            />
            <span>Adopted</span>
          </label>
        </div>
        {errors.status && (
          <span className={styles.errorMessage}>{errors.status}</span>
        )}
      </div>

      {/* Upload Photo */}
      <div className={styles.field}>
        <label className={styles.label}>
          Upload Photo {!isEditMode && <span className={styles.required}>*</span>}
        </label>
        
        <div className={styles.photoUpload}>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="photo" className={styles.fileLabel}>
            {uploadingImage ? 'Uploading...' : 'Click to select an image'}
          </label>
        </div>

        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          </div>
        )}

        {errors.photo && (
          <span className={styles.errorMessage}>{errors.photo}</span>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className={styles.submitError}>
          {errors.submit}
        </div>
      )}

      {/* Buttons */}
      <div className={styles.buttons}>
        {onCancel && (
          <Button 
            type="button"
            variant="secondary" 
            size="medium"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          size="medium"
          disabled={isSubmitting || uploadingImage}
        >
          {isSubmitting 
            ? 'Saving...' 
            : isEditMode 
              ? 'Update Profile' 
              : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
};

export default DogProfileForm;