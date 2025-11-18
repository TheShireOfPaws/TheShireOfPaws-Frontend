import styles from './SuccessModal.module.css';

const SuccessModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        
        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>✓</div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>

        <button 
          className={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
        
      </div>
    </div>
  );
};

export default SuccessModal;