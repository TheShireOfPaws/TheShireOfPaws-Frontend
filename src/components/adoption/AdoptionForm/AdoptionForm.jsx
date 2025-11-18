import { useState } from 'react';
import adoptionRequestService from '../../../services/adoptionRequestService';
import Button from '../../common/Button/Button';
import styles from './AdoptionForm.module.css';

const AdoptionForm = ({ dogId, dogName, onSuccess }) => {
  const [formData, setFormData] = useState({
    requesterFirstName: '',
    requesterLastName: '',
    requesterEmail: '',
    housingType: '',
    householdSize: '',
    motivation: '',
    daytimeLocation: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.requesterFirstName.trim()) newErrors.requesterFirstName = 'First name is required';
    if (!formData.requesterLastName.trim()) newErrors.requesterLastName = 'Last name is required';
    
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = 'Email is required';
    } else if (!emailRegex.test(formData.requesterEmail)) {
      newErrors.requesterEmail = 'Please enter a valid email';
    }

    if (!formData.housingType) newErrors.housingType = 'Please select your housing type';
    
    if (!formData.householdSize) {
      newErrors.householdSize = 'Household size is required';
    } else if (formData.householdSize < 1 || formData.householdSize > 20) {
      newErrors.householdSize = 'Please enter a valid household size (1-20)';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please tell us why you want to adopt';
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await adoptionRequestService.createRequest({
        ...formData,
        householdSize: parseInt(formData.householdSize, 10),
        dogId
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to submit adoption request' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      
      <p className={styles.intro}>
        Fill out this form to apply for adopting <strong>{dogName}</strong>. 
        We'll review your application and get back to you soon!
      </p>


      <div className={styles.row}>
        <Field
          label="First Name"
          name="requesterFirstName"
          value={formData.requesterFirstName}
          onChange={handleChange}
          error={errors.requesterFirstName}
          placeholder="Your first name"
          required
        />
        <Field
          label="Last Name"
          name="requesterLastName"
          value={formData.requesterLastName}
          onChange={handleChange}
          error={errors.requesterLastName}
          placeholder="Your last name"
          required
        />
      </div>


      <Field
        label="Email"
        name="requesterEmail"
        type="email"
        value={formData.requesterEmail}
        onChange={handleChange}
        error={errors.requesterEmail}
        placeholder="your.email@example.com"
        required
      />

      <fieldset className={styles.field}>
        <legend className={styles.label}>
          Housing Type <span className={styles.required}>*</span>
        </legend>
        <div className={styles.radioGroup}>
          {['HOUSE', 'APARTMENT', 'OTHER'].map(type => (
            <label key={type} className={styles.radioLabel}>
              <input
                type="radio"
                name="housingType"
                value={type}
                checked={formData.housingType === type}
                onChange={handleChange}
              />
              <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>
        {errors.housingType && <span className={styles.errorMessage}>{errors.housingType}</span>}
      </fieldset>

      <Field
        label="Household Size"
        name="householdSize"
        type="number"
        value={formData.householdSize}
        onChange={handleChange}
        error={errors.householdSize}
        placeholder="Number of people in your household"
        min="1"
        max="20"
        required
      />


      <Field
        label="Why do you want to adopt this dog?"
        name="motivation"
        value={formData.motivation}
        onChange={handleChange}
        error={errors.motivation}
        placeholder="Tell us about yourself and why you'd be a great fit for this dog (minimum 50 characters)"
        textarea
        rows="5"
        required
        showCharCount
        charCount={formData.motivation.length}
      />


      <Field
        label="Where will the dog stay during the day?"
        name="daytimeLocation"
        value={formData.daytimeLocation}
        onChange={handleChange}
        placeholder="Tell us about the dog's daily routine and where they'll spend their time"
        textarea
        rows="3"
      />


      {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}


      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Adoption Request'}
      </Button>

    </form>
  );
};


const Field = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required, 
  textarea, 
  rows, 
  min, 
  max,
  showCharCount,
  charCount
}) => (
  <div className={styles.field}>
    <label htmlFor={name} className={styles.label}>
      {label} {required && <span className={styles.required}>*</span>}
    </label>
    {textarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.textarea} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
        rows={rows}
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    )}
    {showCharCount && (
      <span className={styles.charCount}>{charCount} / 50 characters minimum</span>
    )}
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

export default AdoptionForm;