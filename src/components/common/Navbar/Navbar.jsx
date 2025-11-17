import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <a href="/" aria-label="The Shire Of Paws - Home">
            <img 
              src="/src/assets/Icons/dogstadistic.png" 
              alt="The Shire Of Paws Logo" 
              className={styles.logoImage}
            />
            <span className={styles.logoText}>The Shire<br />of Paws</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <ul className={styles.menu}>
          <li><a href="/" className={styles.menuLink}>Home</a></li>
          <li><a href="/dogs" className={styles.menuLink}>Adopt a Dog</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuIcon}></span>
          <span className={styles.menuIcon}></span>
          <span className={styles.menuIcon}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileMenuList}>
            <li>
              <a href="/" className={styles.mobileMenuLink} onClick={toggleMenu}>
                Home
              </a>
            </li>
            <li>
              <a href="/dogs" className={styles.mobileMenuLink} onClick={toggleMenu}>
                Adopt a Dog
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;