import { Link } from 'react-router-dom';
import fileService from '../../../services/fileService';
import styles from './DogCard.module.css';

const DogCard = ({ dog, index }) => {
  const colors = ['gold', 'darkGreen', 'brown', 'green'];
  const colorClass = colors[index % colors.length];
  
  const imageUrl = dog.photoUrl 
    ? fileService.getFileUrl(dog.photoUrl) 
    : '/images/placeholder-dog.jpg';

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
          src={imageUrl}
          alt={dog.name}
          className={styles.image}
          onError={(e) => {
            e.target.src = '/images/placeholder-dog.jpg';
          }}
        />
      </div>
    </Link>
  );
};

export default DogCard;