import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from '../../admin/LoginModal/LoginModal';  
import styles from './Footer.module.css';
import instagramIcon from '../../../assets/Icons/instagram.png';
import tiktokIcon from '../../../assets/Icons/tik-tok.png';

const Footer = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/admin/dashboard');
  };

  return (
    <>
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.container}>
          

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


          <div className={styles.section}>
            <p className={styles.tagline}>
              © 2025 The Shire Of Paws. Every paw matters.
            </p>
          </div>


          <div className={styles.section}>
            <div className={styles.socialLinks}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Instagram"
              >
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on TikTok"
              >
                <img src={tiktokIcon} alt="TikTok" />
              </a>
            </div>

            <div className={styles.adminButtons}>
              {isAuthenticated ? (
                <button 
                  className={styles.adminLink}
                  onClick={() => navigate('/admin/dashboard')}
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  className={styles.adminLink}
                  onClick={() => setIsLoginModalOpen(true)}
                  aria-label="Admin login"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
          
        </div>
      </footer>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Footer;