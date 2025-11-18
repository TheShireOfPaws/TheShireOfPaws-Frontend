import DogCard from '../../components/dogs/DogCard/DogCard';       
import DogFilters from '../../components/dogs/DogFilters/DogFilters'; 
import useDogs from '../../hooks/useDogs';
import { useState } from 'react';
import styles from './DogsPage.module.css'; 

const DogsPage = () => {
  const [filters, setFilters] = useState({
    gender: '',
    size: '',
    ageRange: '',
    status: 'AVAILABLE'
  });


  const { dogs: allDogs, loading, error } = useDogs({ status: 'AVAILABLE' });

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      status: 'AVAILABLE'
    });
  };

  const getAgeRange = (age) => {
    if (age <= 1) return 'puppy';
    if (age >= 2 && age <= 3) return 'young';
    if (age >= 4 && age <= 7) return 'adult';
    if (age >= 8) return 'senior';
    return '';
  };

  const filteredDogs = allDogs.filter(dog => {

    if (filters.gender && dog.gender !== filters.gender) return false;
    

    if (filters.size && dog.size !== filters.size) return false;
    

    if (filters.ageRange && getAgeRange(dog.age) !== filters.ageRange) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading dogs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>Error loading dogs: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Loveable<br />
            <span className={styles.titleAccent}>Dogs & Puppies</span>
          </h1>
        </div>

        <DogFilters onFilterChange={handleFilterChange} />

        <div className={styles.grid}>
          {filteredDogs.length > 0 ? (
            filteredDogs.map((dog, index) => (
              <DogCard key={dog.id} dog={dog} index={index} />
            ))
          ) : (
            <p className={styles.noResults}>
              No dogs found matching your filters. Try adjusting your search!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogsPage;