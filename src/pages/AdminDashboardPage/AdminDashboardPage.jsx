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
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dogs');

  const [showDogForm, setShowDogForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  

  const [viewingRequest, setViewingRequest] = useState(null);

  const { dogs, loading: dogsLoading, error: dogsError, refetch: refetchDogs } = useDogs();
  const { requests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useAdoptionRequests();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log('Dashboard - Checking auth...'); 
    console.log('Token exists:', !!token); 
    
    if (!token) {
      console.log('No token found, redirecting to home'); 
      navigate('/');
    } else {
      console.log('Token found, user is authenticated'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  const handleAddDog = () => {
    setEditingDog(null);
    setShowDogForm(true);
  };

  const handleEditDog = (dog) => {
    setEditingDog(dog);
    setShowDogForm(true);
  };

  const handleDeleteDog = async (dogId, dogName) => {
    if (window.confirm(`Are you sure you want to delete ${dogName}? This action cannot be undone.`)) {
      try {
        await dogService.deleteDog(dogId);
        refetchDogs();
      } catch (error) {
        alert('Failed to delete dog: ' + (error.response?.data?.message || error.message));
      }
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

  const handleApproveRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this adoption request?')) {
      try {
        await adoptionRequestService.updateRequestStatus(requestId, 'APPROVED');
        refetchRequests();
        setViewingRequest(null);
      } catch (error) {
        alert('Failed to approve request: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDenyRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to deny this adoption request?')) {
      try {
        await adoptionRequestService.updateRequestStatus(requestId, 'DENIED');
        refetchRequests();
        setViewingRequest(null);
      } catch (error) {
        alert('Failed to deny request: ' + (error.response?.data?.message || error.message));
      }
    }
  };


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return styles.statusAvailable;
      case 'IN_PROCESS':
        return styles.statusInProcess;
      case 'ADOPTED':
        return styles.statusAdopted;
      case 'APPROVED':
        return styles.statusApproved;
      case 'DENIED':
        return styles.statusDenied;
      default:
        return '';
    }
  };

  const formatStatus = (status) => {
    return status === 'IN_PROCESS' ? 'In process' : status.toLowerCase();
  };


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
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div className={styles.tabs}>
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
        </div>

        {activeTab === 'dogs' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dog Profiles</h2>
              <Button variant="primary" size="small" onClick={handleAddDog}>
                + Add New Profile
              </Button>
            </div>

            {dogsError && (
              <div className={styles.errorMessage}>
                Error loading dogs: {dogsError}
              </div>
            )}

            {showDogForm && (
              <div className={styles.formContainer}>
                <h3 className={styles.formTitle}>
                  {editingDog ? `Edit ${editingDog.name}` : 'Add New Dog Profile'}
                </h3>
                <DogProfileForm 
                  dog={editingDog}
                  onSuccess={handleDogFormSuccess}
                  onCancel={handleCancelDogForm}
                />
              </div>
            )}

            {!showDogForm && (
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
                      dogs.map((dog) => (
                        <tr key={dog.id}>
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
                            {dog.story ? dog.story.substring(0, 50) + '...' : '-'}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Adoption Requests</h2>

            {requestsError && (
              <div className={styles.errorMessage}>
                Error loading requests: {requestsError}
              </div>
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
                    requests.map((request) => (
                      <tr key={request.id}>
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
                            {request.status === 'IN_PROCESS' && (
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
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewingRequest && (
          <div className={styles.modalBackdrop} onClick={() => setViewingRequest(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Adoption Request Details</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setViewingRequest(null)}
                >
                  ✕
                </button>
              </div>
              
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

              {viewingRequest.status === 'IN_PROCESS' && (
                <div className={styles.modalFooter}>
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
