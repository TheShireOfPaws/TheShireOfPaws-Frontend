import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import AdoptionForm from '../../components/adoption/AdoptionForm/AdoptionForm';
import dogService from '../../services/dogService';
import fileService from '../../services/fileService';
import styles from './DogDetailPage.module.css';

const DogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        setLoading(true);
        const data = await dogService.getDogById(id);
        setDog(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dog details');
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  const handleAdoptClick = () => {
    setShowAdoptionForm(true);
    setTimeout(() => {
      document
        .getElementById('adoption-form')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFormSuccess = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Dog not found'}</div>
          <Button onClick={() => navigate('/dogs')} variant="primary">
            Back to Dogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button
          onClick={() => navigate('/dogs')}
          className={styles.backButton}
        >
          ← Back to Dogs
        </button>

        <div className={styles.mainCard}>
          <div className={styles.imageSection}>
            <img
              src={dog.photoUrl ? fileService.getFileUrl(dog.photoUrl) : '/placeholder.jpg'}
              alt={dog.name}
              className={styles.image}
            />
            {dog.status === 'AVAILABLE' && (
              <span className={styles.badge}>Available for Adoption</span>
            )}
          </div>

          <div className={styles.storyBox}>
            <h2 className={styles.storyTitle}>About {dog.name}</h2>
            <p className={styles.storyText}>{dog.story || 'No story available.'}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Age</span>
              <span className={styles.detailValue}>
                {dog.age} {dog.age === 1 ? 'Year' : 'Years'}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Gender</span>
              <span className={styles.detailValue}>{dog.gender}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Size</span>
              <span className={styles.detailValue}>{dog.size}</span>
            </div>
          </div>
        </div>

        {dog.status === 'AVAILABLE' && (
          <div className={styles.adoptButtonWrapper}>
            <Button
              variant="primary"
              size="large"
              onClick={handleAdoptClick}
              className={styles.adoptButton}
            >
              I Want to Adopt {dog.name}
            </Button>
          </div>
        )}

        {showAdoptionForm && (
          <div id="adoption-form" className={styles.formSection}>
            <h2 className={styles.formTitle}>
              Adoption Application for {dog.name}
            </h2>

            <p className={styles.formSubtitle}>
              Please fill out this form to start the adoption process. We will review your application and get back to you soon!
            </p>

            <AdoptionForm 
              dogId={dog.id}
              dogName={dog.name}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DogDetailPage;