import styles from './About.module.css';

const About = () => {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
        <h2 id="about-title" className={styles.title}>
          A little bit about us.
        </h2>
        
        <div className={styles.content}>
          <p className={styles.text}>
            At The Shire Of Paws, we believe every dog deserves a loving home and every family 
            deserves the joy of a furry companion. Founded in 2020, our mission is to rescue, 
            rehabilitate, and rehome dogs in need across the UK.
          </p>
          
          <p className={styles.text}>
            We work tirelessly to match each dog with the perfect family, ensuring both the pet 
            and their new owners are ready for a lifetime of happiness together. Our team of 
            dedicated volunteers and veterinary professionals provide comprehensive care, training, 
            and support throughout the adoption process.
          </p>
          
          <p className={styles.text}>
            Every adoption makes a difference. When you choose to adopt, you're not just saving 
            one life – you're opening up space in our shelter for another dog in need. Join us 
            in our mission to ensure every paw finds its forever home.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;