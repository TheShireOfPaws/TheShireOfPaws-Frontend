import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Contact Info */}
        <div className={styles.section}>
          <h3 className={styles.title}>Contact Us</h3>
          <address className={styles.address}>
            <p className={styles.contactItem}>
              <span className={styles.label}>Phone:</span>
              <a href="tel:+441234567890" className={styles.link}>
                +44 1234 567890
              </a>
            </p>
            <p className={styles.contactItem}>
              <span className={styles.label}>Address:</span>
              123 Shire Lane, Hobbiton, UK
            </p>
          </address>
        </div>

        {/* Tagline */}
        <div className={styles.section}>
          <p className={styles.tagline}>
            © 2025 The Shire Of Paws. Every paw matters.
          </p>
        </div>

        {/* Social Media & Admin */}
        <div className={styles.section}>
          <div className={styles.socialLinks}>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Instagram"
            >
              <img src="/src/assets/Icons/instagram.svg" alt="" />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on TikTok"
            >
              <img src="/src/assets/Icons/tik-tok.svg" alt="" />
            </a>
          </div>
          <button 
            className={styles.adminLink}
            aria-label="Admin login"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;