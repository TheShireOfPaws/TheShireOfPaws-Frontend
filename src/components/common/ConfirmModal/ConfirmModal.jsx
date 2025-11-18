import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm, 
  onCancel,
  variant = 'danger' 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmButton} ${styles[variant]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfirmModal;