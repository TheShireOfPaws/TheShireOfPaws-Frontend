import Button from '../../common/Button/Button';
import styles from './Hero.module.css';

import dog1 from '../../../assets/Images/HEADER-1.jpg';
import dog2 from '../../../assets/Images/HEADER-2.jpg';
import dog3 from '../../../assets/Images/HEADER-3.jpg';
import dog4 from '../../../assets/Images/HEASDER-4.jpg';
import dog5 from '../../../assets/Images/HEADER-5.jpg';

const Hero = () => {
  const dogImages = [dog1, dog2, dog3, dog4, dog5];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.decorationBg}></div>


        <div className={styles.content}>
          <h1 className={styles.title}>
            Where every journey ends in love.<br />
            And every paw finds a home.
          </h1>
          
          <Button 
            to="/dogs" 
            variant="primary" 
            size="medium"
          >
            ADOPT, DON'T SHOP
          </Button>
        </div>


        <div className={styles.photoGrid}>
          {dogImages.map((imgUrl, index) => (
            <div key={index} className={styles.photoCard}>
              <img 
                src={imgUrl}
                alt={`Adorable dog ${index + 1}`}
                className={styles.photo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
