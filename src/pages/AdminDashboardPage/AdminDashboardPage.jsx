import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dogs');
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);


  const [dogs] = useState([
    {
      id: 1,
      name: 'Rover',
      story: 'Rover is...',
      gender: 'MALE',
      age: 8,
      size: 'MEDIUM',
      photoUrl: 'RoverPhoto.jpg',
      status: 'IN_PROCESS'
    },
    {
      id: 2,
      name: 'Moon',
      story: 'Moon is...',
      gender: 'FEMALE',
      age: 8,
      size: 'LARGE',
      photoUrl: 'MoonPhoto.jpg',
      status: 'AVAILABLE'
    },
    {
      id: 3,
      name: 'Kika',
      story: 'Kika is...',
      gender: 'FEMALE',
      age: 8,
      size: 'SMALL',
      photoUrl: 'KikaPhoto.jpg',
      status: 'ADOPTED'
    }
  ]);

  const [requests] = useState([
    {
      id: 1,
      requesterFirstName: 'Anne',
      requesterEmail: 'anne@...',
      dogName: 'Rover',
      status: 'IN_PROCESS'
    },
    {
      id: 2,
      requesterFirstName: 'John',
      requesterEmail: 'john@...',
      dogName: 'Rover',
      status: 'APPROVED'
    },
    {
      id: 3,
      requesterFirstName: 'Alexandra',
      requesterEmail: 'alex@...',
      dogName: 'Rover',
      status: 'DENIED'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    navigate('/');
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
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
            Dog Profiles
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'requests' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Adoption Requests
          </button>
        </div>


        {activeTab === 'dogs' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dog Profiles</h2>
              <Button variant="primary" size="small">
                + Add New Profile
              </Button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Story</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Size</th>
                    <th>Photo</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dogs.map((dog) => (
                    <tr key={dog.id}>
                      <td>{dog.name}</td>
                      <td className={styles.storyCell}>{dog.story}</td>
                      <td>{dog.gender}</td>
                      <td>{dog.age}</td>
                      <td>{dog.size}</td>
                      <td>{dog.photoUrl}</td>
                      <td>
                        <span className={`${styles.badge} ${getStatusBadgeClass(dog.status)}`}>
                          {dog.status === 'IN_PROCESS' ? 'In process' : dog.status.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.iconButton} title="Edit">
                            ✏️
                          </button>
                          <button className={styles.iconButton} title="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {activeTab === 'requests' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Adoption Requests</h2>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Dog</th>
                    <th>Status</th>
                    <th>Form</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.requesterFirstName}</td>
                      <td>{request.requesterEmail}</td>
                      <td>{request.dogName}</td>
                      <td>
                        <span className={`${styles.badge} ${getStatusBadgeClass(request.status)}`}>
                          {request.status === 'IN_PROCESS' ? 'In process' : request.status.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <button className={styles.iconButton} title="View Form">
                          👁️
                        </button>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {request.status === 'IN_PROCESS' && (
                            <>
                              <button className={styles.approveButton} title="Approve">
                                ✓
                              </button>
                              <button className={styles.denyButton} title="Deny">
                                ✕
                              </button>
                            </>
                          )}
                          {request.status !== 'IN_PROCESS' && (
                            <>
                              <button className={styles.iconButton} title="Edit">
                                ✏️
                              </button>
                              <button className={styles.iconButton} title="Delete">
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;