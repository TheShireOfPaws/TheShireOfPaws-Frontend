import { useState } from 'react';
import Button from '../../common/Button/Button';
import adoptionRequestService from '../../../services/adoptionRequestService';
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
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.requesterFirstName.trim()) {
      newErrors.requesterFirstName = 'First name is required';
    }

    if (!formData.requesterLastName.trim()) {
      newErrors.requesterLastName = 'Last name is required';
    }

    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.requesterEmail)) {
      newErrors.requesterEmail = 'Email is invalid';
    }

    if (!formData.housingType) {
      newErrors.housingType = 'Housing type is required';
    }

    if (!formData.householdSize || formData.householdSize < 1) {
      newErrors.householdSize = 'Household size must be at least 1';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please tell us why you want to adopt';
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters';
    }

    if (!formData.daytimeLocation.trim()) {
      newErrors.daytimeLocation = 'Please tell us where the dog will stay during the day';
    } else if (formData.daytimeLocation.trim().length < 30) {
      newErrors.daytimeLocation = 'Please provide at least 30 characters';
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
      await adoptionRequestService.createRequest({
        ...formData,
        householdSize: parseInt(formData.householdSize),
        dogId: dogId
      });

      setSubmitSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to submit application. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={styles.successMessage}>
        <h3 className={styles.successTitle}>Application Submitted!</h3>
        <p className={styles.successText}>
          Thank you for your interest in adopting {dogName}! We have received your application 
          and will review it shortly. Our team will contact you at {formData.requesterEmail} within 
          the next 2-3 business days.
        </p>
        <Button to="/dogs" variant="primary">
          See Other Dogs
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="requesterFirstName" className={styles.label}>
              First Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="requesterFirstName"
              name="requesterFirstName"
              value={formData.requesterFirstName}
              onChange={handleChange}
              className={`${styles.input} ${errors.requesterFirstName ? styles.inputError : ''}`}
              placeholder="John"
            />
            {errors.requesterFirstName && (
              <span className={styles.errorMessage}>{errors.requesterFirstName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="requesterLastName" className={styles.label}>
              Last Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="requesterLastName"
              name="requesterLastName"
              value={formData.requesterLastName}
              onChange={handleChange}
              className={`${styles.input} ${errors.requesterLastName ? styles.inputError : ''}`}
              placeholder="Doe"
            />
            {errors.requesterLastName && (
              <span className={styles.errorMessage}>{errors.requesterLastName}</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="requesterEmail" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="requesterEmail"
            name="requesterEmail"
            value={formData.requesterEmail}
            onChange={handleChange}
            className={`${styles.input} ${errors.requesterEmail ? styles.inputError : ''}`}
            placeholder="john.doe@example.com"
          />
          {errors.requesterEmail && (
            <span className={styles.errorMessage}>{errors.requesterEmail}</span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Housing Information</h3>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="housingType" className={styles.label}>
              Housing Type <span className={styles.required}>*</span>
            </label>
            <select
              id="housingType"
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              className={`${styles.select} ${errors.housingType ? styles.inputError : ''}`}
            >
              <option value="">Select housing type</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.housingType && (
              <span className={styles.errorMessage}>{errors.housingType}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="householdSize" className={styles.label}>
              Household Size <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="householdSize"
              name="householdSize"
              value={formData.householdSize}
              onChange={handleChange}
              className={`${styles.input} ${errors.householdSize ? styles.inputError : ''}`}
              placeholder="How many people live in your home?"
              min="1"
            />
            {errors.householdSize && (
              <span className={styles.errorMessage}>{errors.householdSize}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About You and {dogName}</h3>
        
        <div className={styles.field}>
          <label htmlFor="motivation" className={styles.label}>
            Why do you want to adopt {dogName}? <span className={styles.required}>*</span>
          </label>
          <textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.motivation ? styles.inputError : ''}`}
            placeholder="Tell us about your motivation to adopt this dog, your experience with pets, and why you think you're a good match..."
            rows="5"
          />
          <span className={styles.charCount}>
            {formData.motivation.length} / 50 minimum characters
          </span>
          {errors.motivation && (
            <span className={styles.errorMessage}>{errors.motivation}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="daytimeLocation" className={styles.label}>
            Where will the dog stay during the day? <span className={styles.required}>*</span>
          </label>
          <textarea
            id="daytimeLocation"
            name="daytimeLocation"
            value={formData.daytimeLocation}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.daytimeLocation ? styles.inputError : ''}`}
            placeholder="Describe where the dog will be during work hours, who will take care of them, etc..."
            rows="4"
          />
          <span className={styles.charCount}>
            {formData.daytimeLocation.length} / 30 minimum characters
          </span>
          {errors.daytimeLocation && (
            <span className={styles.errorMessage}>{errors.daytimeLocation}</span>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className={styles.submitError}>
          {errors.submit}
        </div>
      )}

      <Button 
        type="submit" 
        variant="primary" 
        size="large"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Submitting...' : `Submit Application for ${dogName}`}
      </Button>
    </form>
  );
};

export default AdoptionForm;