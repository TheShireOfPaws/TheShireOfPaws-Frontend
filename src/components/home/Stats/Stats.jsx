import { useState, useEffect } from 'react';
import statsService from '../../../services/statsService';
import styles from './Stats.module.css';

const Stats = () => {
  const [stats, setStats] = useState({
    rescued: 0,
    adopted: 0,
    available: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading stats...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div className={styles.statCard}>
            <div className={styles.number}>{stats.rescued}</div>
            <div className={styles.label}>Rescued Dogs</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.number}>{stats.adopted}</div>
            <div className={styles.label}>Adopted Dogs</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.number}>{stats.available}</div>
            <div className={styles.label}>Dogs Available</div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;