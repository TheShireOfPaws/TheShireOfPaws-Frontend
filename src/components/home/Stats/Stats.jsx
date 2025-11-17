import { useState, useEffect } from 'react';
import styles from './Stats.module.css';

const Stats = () => {
  const [rescuedCount, setRescuedCount] = useState(0);
  const [adoptedCount, setAdoptedCount] = useState(0);

  // Simular contador animado
  useEffect(() => {
    // Estos valores vendrán del backend luego
    const targetRescued = 6;
    const targetAdopted = 3;

    const animateCount = (target, setter) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    animateCount(targetRescued, setRescuedCount);
    animateCount(targetAdopted, setAdoptedCount);
  }, []);

  return (
    <section className={styles.stats} aria-label="Statistics">
      <div className={styles.container}>
        {/* Rescued Dogs */}
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <svg 
              className={styles.icon}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </div>
          <div className={styles.number} aria-live="polite">
            {rescuedCount}
          </div>
          <div className={styles.label}>Rescued Dogs</div>
        </div>

        {/* Adopted Dogs */}
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <svg 
              className={styles.icon}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          </div>
          <div className={styles.number} aria-live="polite">
            {adoptedCount}
          </div>
          <div className={styles.label}>Adopted Dogs</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;