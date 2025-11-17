import DogCard from '../../components/dogs/DogCard/DogCard';       
import DogFilters from '../../components/dogs/DogFilters/DogFilters'; 
import { useState } from 'react';
import styles from './DogsPage.module.css'; 

const DogsPage = () => {
  const [filters, setFilters] = useState({
    gender: '',
    size: '',
    ageRange: ''  
  });

  const mockDogs = [
    {
      id: '1',
      name: 'Missy',
      age: 1,
      gender: 'FEMALE',
      size: 'MEDIUM',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
    },
    {
      id: '2',
      name: 'Buddy',
      age: 2,
      gender: 'MALE',
      size: 'LARGE',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'
    },
    {
      id: '3',
      name: 'Luna',
      age: 5,
      gender: 'FEMALE',
      size: 'SMALL',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400'
    },
    {
      id: '4',
      name: 'Max',
      age: 9,
      gender: 'MALE',
      size: 'MEDIUM',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400'
    },
    {
      id: '5',
      name: 'Bella',
      age: 0,
      gender: 'FEMALE',
      size: 'SMALL',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400'
    },
    {
      id: '6',
      name: 'Charlie',
      age: 6,
      gender: 'MALE',
      size: 'LARGE',
      status: 'AVAILABLE',
      story: 'Some info here',
      photoUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400'
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  
  const getAgeRange = (age) => {
    if (age <= 1) return 'puppy';
    if (age >= 2 && age <= 3) return 'young';
    if (age >= 4 && age <= 7) return 'adult';
    if (age >= 8) return 'senior';
    return '';
  };

  
  const filteredDogs = mockDogs.filter(dog => {
    if (dog.status !== 'AVAILABLE') return false;
    if (filters.gender && dog.gender !== filters.gender) return false;
    if (filters.size && dog.size !== filters.size) return false;
    if (filters.ageRange && getAgeRange(dog.age) !== filters.ageRange) return false;  // ⭐ Filtro de edad
    return true;
  });

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