import { useState } from 'react';
import styles from './DogFilters.module.css';

const DogFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    gender: '',
    size: '',
    ageRange: ''  
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      gender: '',
      size: '',
      ageRange: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className={styles.filters}>
      <h2 className={styles.title}>Find Your Perfect Match</h2>
      
      <div className={styles.filterGroup}>
        <div className={styles.filterItem}>
          <label htmlFor="gender" className={styles.label}>
            Gender
          </label>
          <select
            id="gender"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label htmlFor="size" className={styles.label}>
            Size
          </label>
          <select
            id="size"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            <option value="SMALL">Small</option>
            <option value="MEDIUM">Medium</option>
            <option value="LARGE">Large</option>
            <option value="EXTRA_LARGE">Extra Large</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label htmlFor="ageRange" className={styles.label}>
            Age
          </label>
          <select
            id="ageRange"
            value={filters.ageRange}
            onChange={(e) => handleFilterChange('ageRange', e.target.value)}
            className={styles.select}
          >
            <option value="">All Ages</option>
            <option value="puppy">Puppy (0-1 years)</option>
            <option value="young">Young (2-3 years)</option>
            <option value="adult">Adult (4-7 years)</option>
            <option value="senior">Senior (8+ years)</option>
          </select>
        </div>

        <button 
          onClick={clearFilters}
          className={styles.clearButton}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default DogFilters;