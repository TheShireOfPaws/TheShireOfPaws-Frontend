import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/common/Button/Button';
import styles from './DogDetailPage.module.css';

const DogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  // MOCK (luego backend)
  const mockDog = {
    id,
    name: 'Buddy',
    age: 3,
    gender: 'MALE',
    size: 'MEDIUM',
    status: 'AVAILABLE',
    story:
      'Buddy is a friendly and playful dog who loves to be around people. He was rescued from the streets when he was just a puppy and has been living in our shelter for the past year. Buddy is house-trained, gets along well with other dogs, and loves children. He enjoys long walks, playing fetch, and cuddling on the couch. Buddy would make a perfect companion for an active family or someone who enjoys outdoor activities. He is up to date on all his vaccinations and has been neutered. If you are looking for a loyal and loving friend, Buddy is waiting to meet you!',
    photoUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    adoptionRequestsCount: 2,
  };

  const handleAdoptClick = () => {
    setShowAdoptionForm(true);

    setTimeout(() => {
      document
        .getElementById('adoption-form')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/dogs')}
          className={styles.backButton}
        >
          ← Back to Dogs
        </button>

        {/* Contenido */}
        <div className={styles.content}>

          {/* Imagen */}
          <div className={styles.imageSection}>
            <img
              src={mockDog.photoUrl}
              alt={mockDog.name}
              className={styles.image}
            />

            {mockDog.status === 'AVAILABLE' && (
              <span className={styles.badge}>Available for Adoption</span>
            )}
          </div>

          {/* About + Story */}
          <div className={styles.storyBox}>
            <h2 className={styles.storyTitle}>About {mockDog.name}</h2>
            <p className={styles.storyText}>{mockDog.story}</p>
          </div>
        </div>

        {/* Nombre + Detalles abajo */}
        <div className={styles.infoSection}>
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Age</span>
              <span className={styles.detailValue}>
                {mockDog.age} Years
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Gender</span>
              <span className={styles.detailValue}>{mockDog.gender}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Size</span>
              <span className={styles.detailValue}>{mockDog.size}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="large"
            onClick={handleAdoptClick}
            fullWidth
          >
            I Want to Adopt {mockDog.name}
          </Button>
        </div>

        {/* Formulario */}
        {showAdoptionForm && (
          <div id="adoption-form" className={styles.formSection}>
            <h2 className={styles.formTitle}>
              Adoption Application for {mockDog.name}
            </h2>

            <p className={styles.formSubtitle}>
              Please fill out this form to start the adoption process.
            </p>

            <div className={styles.formPlaceholder}>
              <p>Adoption form will go here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogDetailPage;
