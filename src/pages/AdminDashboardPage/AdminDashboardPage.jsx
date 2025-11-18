import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useDogs from '../../hooks/useDogs';
import useAdoptionRequests from '../../hooks/useAdoptionRequests';
import dogService from '../../services/dogService';
import adoptionRequestService from '../../services/adoptionRequestService';
import fileService from '../../services/fileService';
import Button from '../../components/common/Button/Button';
import DogProfileForm from '../../components/admin/Dashboard/DogProfileForm';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  

  const [activeTab, setActiveTab] = useState('dogs');
  const [showDogForm, setShowDogForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger',
    onConfirm: null
  });
  

  const { dogs, loading: dogsLoading, error: dogsError, refetch: refetchDogs } = useDogs();
  const { requests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useAdoptionRequests();
  

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
  }, [navigate]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

 
  const handleAddDog = () => {
    setEditingDog(null);
    setShowDogForm(true);
  };

  const handleEditDog = (dog) => {
    setEditingDog(dog);
    setShowDogForm(true);
  };

  const handleDeleteDog = (dogId, dogName) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Dog Profile',
      message: `Are you sure you want to delete ${dogName}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: () => confirmDeleteDog(dogId)
    });
  };

  const confirmDeleteDog = async (dogId) => {
    try {
      await dogService.deleteDog(dogId);
      refetchDogs();
      closeConfirmModal();
    } catch (error) {
      alert('Failed to delete dog: ' + (error.response?.data?.message || error.message));
      closeConfirmModal();
    }
  };

  const handleDogFormSuccess = () => {
    setShowDogForm(false);
    setEditingDog(null);
    refetchDogs();
  };

  const handleCancelDogForm = () => {
    setShowDogForm(false);
    setEditingDog(null);
  };


  const handleViewRequest = async (requestId) => {
    try {
      const request = await adoptionRequestService.getRequestById(requestId);
      setViewingRequest(request);
    } catch (error) {
      alert('Failed to load request details');
    }
  };

  const handleApproveRequest = (requestId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Approve Adoption Request',
      message: 'Are you sure you want to approve this adoption request?',
      confirmText: 'Approve',
      variant: 'info',
      onConfirm: () => confirmUpdateStatus(requestId, 'APPROVED')
    });
  };

  const handleDenyRequest = (requestId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Deny Adoption Request',
      message: 'Are you sure you want to deny this adoption request?',
      confirmText: 'Deny',
      variant: 'danger',
      onConfirm: () => confirmUpdateStatus(requestId, 'DENIED')
    });
  };

  const handleResetRequest = (requestId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to In Process',
      message: 'Are you sure you want to change the status back to in process?',
      confirmText: 'Reset',
      variant: 'warning',
      onConfirm: () => confirmUpdateStatus(requestId, 'IN_PROCESS')
    });
  };

  const confirmUpdateStatus = async (requestId, status) => {
    try {
      await adoptionRequestService.updateRequestStatus(requestId, status);
      refetchRequests();
      

      if (viewingRequest?.id === requestId) {
        const updatedRequest = await adoptionRequestService.getRequestById(requestId);
        setViewingRequest(updatedRequest);
      }
      
      closeConfirmModal();
    } catch (error) {
      alert('Failed to update request: ' + (error.response?.data?.message || error.message));
      closeConfirmModal();
    }
  };


  const getStatusBadgeClass = (status) => {
    const statusMap = {
      AVAILABLE: styles.statusAvailable,
      IN_PROCESS: styles.statusInProcess,
      ADOPTED: styles.statusAdopted,
      APPROVED: styles.statusApproved,
      DENIED: styles.statusDenied
    };
    return statusMap[status] || '';
  };

  const formatStatus = (status) => status === 'IN_PROCESS' ? 'In process' : status.toLowerCase();


  const DogTableRow = ({ dog }) => (
    <tr>
      <td>
        {dog.photoUrl ? (
          <img 
            src={fileService.getFileUrl(dog.photoUrl)} 
            alt={dog.name}
            className={styles.dogPhoto}
          />
        ) : (
          <div className={styles.noPhoto}>No photo</div>
        )}
      </td>
      <td className={styles.nameCell}>{dog.name}</td>
      <td className={styles.storyCell}>
        {dog.story ? `${dog.story.substring(0, 50)}...` : '-'}
      </td>
      <td>{dog.gender}</td>
      <td>{dog.age}</td>
      <td>{dog.size}</td>
      <td>
        <span className={`${styles.badge} ${getStatusBadgeClass(dog.status)}`}>
          {formatStatus(dog.status)}
        </span>
      </td>
      <td>{dog.adoptionRequestsCount || 0}</td>
      <td>
        <div className={styles.actions}>
          <button 
            className={styles.iconButton} 
            title="Edit"
            onClick={() => handleEditDog(dog)}
          >
            ✏️
          </button>
          <button 
            className={styles.iconButton} 
            title="Delete"
            onClick={() => handleDeleteDog(dog.id, dog.name)}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );

  const RequestTableRow = ({ request }) => (
    <tr>
      <td>{request.requesterFirstName} {request.requesterLastName}</td>
      <td>{request.requesterEmail}</td>
      <td>{request.dogName || '-'}</td>
      <td>
        <span className={`${styles.badge} ${getStatusBadgeClass(request.status)}`}>
          {formatStatus(request.status)}
        </span>
      </td>
      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
      <td>
        <button 
          className={styles.iconButton} 
          title="View Form"
          onClick={() => handleViewRequest(request.id)}
        >
          👁️
        </button>
      </td>
      <td>
        <div className={styles.actions}>
          {request.status === 'IN_PROCESS' ? (
            <>
              <button 
                className={styles.approveButton} 
                title="Approve"
                onClick={() => handleApproveRequest(request.id)}
              >
                ✓
              </button>
              <button 
                className={styles.denyButton} 
                title="Deny"
                onClick={() => handleDenyRequest(request.id)}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button 
                className={styles.iconButton} 
                title="Reset to In Process"
                onClick={() => handleResetRequest(request.id)}
              >
                🔄
              </button>
              {request.status === 'DENIED' && (
                <button 
                  className={styles.approveButton} 
                  title="Approve"
                  onClick={() => handleApproveRequest(request.id)}
                >
                  ✓
                </button>
              )}
              {request.status === 'APPROVED' && (
                <button 
                  className={styles.denyButton} 
                  title="Deny"
                  onClick={() => handleDenyRequest(request.id)}
                >
                  ✕
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );


  if (dogsLoading || requestsLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <header className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </header>


        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'dogs' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('dogs')}
          >
            Dog Profiles ({dogs.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'requests' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Adoption Requests ({requests.length})
          </button>
        </nav>


        {activeTab === 'dogs' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dog Profiles</h2>
              <Button variant="primary" size="small" onClick={handleAddDog}>
                + Add New Profile
              </Button>
            </div>

            {dogsError && (
              <div className={styles.errorMessage}>Error loading dogs: {dogsError}</div>
            )}

            {showDogForm ? (
              <article className={styles.formContainer}>
                <h3 className={styles.formTitle}>
                  {editingDog ? `Edit ${editingDog.name}` : 'Add New Dog Profile'}
                </h3>
                <DogProfileForm 
                  dog={editingDog}
                  onSuccess={handleDogFormSuccess}
                  onCancel={handleCancelDogForm}
                />
              </article>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Story</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Requests</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dogs.length === 0 ? (
                      <tr>
                        <td colSpan="9" className={styles.emptyMessage}>
                          No dogs found. Click "Add New Profile" to create one.
                        </td>
                      </tr>
                    ) : (
                      dogs.map(dog => <DogTableRow key={dog.id} dog={dog} />)
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}


        {activeTab === 'requests' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Adoption Requests</h2>

            {requestsError && (
              <div className={styles.errorMessage}>Error loading requests: {requestsError}</div>
            )}

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Dog</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Form</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className={styles.emptyMessage}>
                        No adoption requests yet.
                      </td>
                    </tr>
                  ) : (
                    requests.map(request => <RequestTableRow key={request.id} request={request} />)
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}


        {viewingRequest && (
          <div className={styles.modalBackdrop} onClick={() => setViewingRequest(null)}>
            <article className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <header className={styles.modalHeader}>
                <h3>Adoption Request Details</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setViewingRequest(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </header>
              
              <div className={styles.modalBody}>
                <div className={styles.detailRow}>
                  <strong>Name:</strong> 
                  <span>{viewingRequest.requesterFirstName} {viewingRequest.requesterLastName}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>Email:</strong> 
                  <span>{viewingRequest.requesterEmail}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>Dog:</strong> 
                  <span>{viewingRequest.dogName}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>Housing Type:</strong> 
                  <span>{viewingRequest.housingType}</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>Household Size:</strong> 
                  <span>{viewingRequest.householdSize} people</span>
                </div>
                <div className={styles.detailRow}>
                  <strong>Motivation:</strong> 
                  <p>{viewingRequest.motivation}</p>
                </div>
                <div className={styles.detailRow}>
                  <strong>Daytime Location:</strong> 
                  <p>{viewingRequest.daytimeLocation || 'Not provided'}</p>
                </div>
                <div className={styles.detailRow}>
                  <strong>Status:</strong> 
                  <span className={`${styles.badge} ${getStatusBadgeClass(viewingRequest.status)}`}>
                    {formatStatus(viewingRequest.status)}
                  </span>
                </div>
              </div>

              <footer className={styles.modalFooter}>
                {viewingRequest.status === 'IN_PROCESS' ? (
                  <>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleDenyRequest(viewingRequest.id)}
                    >
                      Deny
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => handleApproveRequest(viewingRequest.id)}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleResetRequest(viewingRequest.id)}
                    >
                      Reset to In Process
                    </Button>
                    {viewingRequest.status === 'DENIED' && (
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => handleApproveRequest(viewingRequest.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {viewingRequest.status === 'APPROVED' && (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDenyRequest(viewingRequest.id)}
                      >
                        Deny
                      </Button>
                    )}
                  </>
                )}
              </footer>
            </article>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          variant={confirmModal.variant}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirmModal}
        />

      </div>
    </div>
  );
};

export default AdminDashboardPage;