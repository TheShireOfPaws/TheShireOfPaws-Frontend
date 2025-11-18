import { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import dogService from '../../../services/dogService';
import fileService from '../../../services/fileService';
import styles from './DogProfileForm.module.css';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

const SIZE_OPTIONS = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
  { value: 'EXTRA_LARGE', label: 'Extra Large' },
];

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'IN_PROCESS', label: 'In Process' },
  { value: 'ADOPTED', label: 'Adopted' },
];

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
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select a valid image file'
        }));
        return;
      }

      const MAX_SIZE = 10 * 1024 * 1024; 
      if (file.size > MAX_SIZE) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size must be less than 10MB'
        }));
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

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
    } else if (parseInt(formData.age) < 0 || parseInt(formData.age) > 30) {
      newErrors.age = 'Age must be between 0 and 30';
    }

    if (!formData.size) {
      newErrors.size = 'Size is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

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

      if (selectedFile) {
        setUploadingImage(true);
        const uploadResponse = await fileService.uploadFile(selectedFile); 
        photoUrl = uploadResponse.fileName;
      }

      const dogData = {
        name: formData.name.trim(),
        story: formData.story.trim() || null,
        gender: formData.gender,
        age: parseInt(formData.age),
        size: formData.size,
        photoUrl: photoUrl || null,
        status: formData.status
      };

      if (isEditMode) {
        await dogService.updateDog(dog.id, dogData);
      } else {
        await dogService.createDog(dogData);
      }

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

  const RadioOptions = ({ name, options, currentSelection }) => (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioLabel}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={currentSelection === option.value}
            onChange={handleChange}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );

  const ErrorMessage = ({ error }) => 
    error ? <span className={styles.errorMessage}>{error}</span> : null;


  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      
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
          <ErrorMessage error={errors.name} />
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
          <ErrorMessage error={errors.age} />
        </div>
      </div>

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

      <div className={styles.row}> 
        <fieldset className={styles.fieldset}> 
          <legend className={styles.label}>
            Gender <span className={styles.required}>*</span>
          </legend>
          
          <RadioOptions 
            name="gender" 
            options={GENDER_OPTIONS} 
            currentSelection={formData.gender}
          />
          
          <ErrorMessage error={errors.gender} />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>
            Size <span className={styles.required}>*</span>
          </legend>
          
          <RadioOptions 
            name="size" 
            options={SIZE_OPTIONS} 
            currentSelection={formData.size}
          />

          <ErrorMessage error={errors.size} />
        </fieldset>
      </div>
      
      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>
          Status <span className={styles.required}>*</span>
        </legend>
        
        <RadioOptions 
          name="status" 
          options={STATUS_OPTIONS} 
          currentSelection={formData.status}
        />

        <ErrorMessage error={errors.status} />
      </fieldset>

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

        <ErrorMessage error={errors.photo} />
      </div>

      {errors.submit && (
        <div className={styles.submitError}>
          {errors.submit}
        </div>
      )}
      
      <div className={styles.buttons}>
        {onCancel && (
          <Button 
            type="button"
            variant="secondary" 
            size="medium"
            onClick={onCancel}
            disabled={isSubmitting || uploadingImage}
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