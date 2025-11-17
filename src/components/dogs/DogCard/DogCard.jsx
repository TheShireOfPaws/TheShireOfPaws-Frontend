import { Link } from 'react-router-dom';
import styles from './DogCard.module.css';

const DogCard = ({ dog, index }) => {
  const colors = ['gold', 'darkGreen', 'brown', 'green'];
  const colorClass = colors[index % colors.length];

  return (
    <Link to={`/dogs/${dog.id}`} className={`${styles.card} ${styles[colorClass]}`}>
      <div className={styles.content}>
        <h3 className={styles.name}>{dog.name}</h3>
      
        
        <button className={styles.button}>
          MORE ABOUT ME
        </button>
      </div>

      <div className={styles.imageWrapper}>
        <img 
          src={dog.photoUrl || '/images/placeholder-dog.jpg'} 
          alt={dog.name}
          className={styles.image}
        />
      </div>
    </Link>
  );
};

export default DogCard;