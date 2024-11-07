import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId');
    const accessToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('ca-nhan');
    const [organizationStatus, setOrganizationStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgDescription, setNewOrgDescription] = useState('');
    const [organizations, setOrganizations] = useState([]); // State to store organization data
    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [editOrgId, setEditOrgId] = useState(null); // State to store the ID of the organization being edited
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteOrgId, setDeleteOrgId] = useState(null);
    const [notifications, setNotifications] = useState([]); // State to store notifications

    // Fetch user's organization status
    useEffect(() => {
        if (activeTab === 'to-chuc') {
            setLoading(true);
            fetch(`http://localhost:5173/api/organization/check-organization/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.message === "User is not in any organization") {
                        setOrganizationStatus("not-in-organization");
                    } else {
                        setOrganizationStatus("in-organization");
                        fetchOrganizations(); // Fetch organization details if the user is part of one
                    }
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error fetching organization status:', error);
                });
        }
    }, [activeTab, accessToken]);

    const handleAcceptInvitation = (notificationId, organizationId) => {
        fetch(`http://localhost:5173/api/organization/accept-invitation/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ organizationId })
        })
            .then(response => response.json())
            .then(data => {
                // Update the notification status to "read"
                setNotifications(notifications.map(notification =>
                    notification._id === notificationId ? { ...notification, status: 'read' } : notification
                ));
                fetchOrganizations(); // Refresh the organizations list
            })
            .catch(error => {
                console.error('Error accepting invitation:', error);
            });
    };
    
    const handleDeclineInvitation = (notificationId) => {
        fetch(`http://localhost:5173/api/organization/decline-invitation/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Update the notification status to "read"
                setNotifications(notifications.map(notification =>
                    notification._id === notificationId ? { ...notification, status: 'read' } : notification
                ));
            })
            .catch(error => {
                console.error('Error declining invitation:', error);
            });
    };

    // Fetch notifications
    useEffect(() => {
        if (activeTab === 'thong-bao') {
            fetch(`http://localhost:5173/api/notifications/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    setNotifications(data.notifications);
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [activeTab, accessToken]);

    const handleViewOrganization = (org) => {
        navigate(`/organization/${org._id}`);
    };

    const handleDeleteOrganization = () => {
        fetch(`http://localhost:5173/api/organization/delete/${deleteOrgId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setShowDeletePopup(false);
                setDeleteOrgId(null);
                fetchOrganizations(); // Fetch updated organization list after deletion
            })
            .catch(error => {
                console.error('Error deleting organization:', error);
            });
    };

    const fetchOrganizations = () => {
        fetch(`http://localhost:5173/api/organization/user/organizations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.organizations) {
                    setOrganizations(data.organizations);
                }
            })
            .catch(error => console.error('Error fetching organizations:', error));
    };

    const handleCreateOrganization = () => {
        fetch('http://localhost:5173/api/organization/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newOrgName,
                description: newOrgDescription
            })
        })
            .then(response => response.json())
            .then(data => {
                setShowPopup(false);
                setOrganizationStatus("in-organization");
                fetchOrganizations(); // Fetch updated organization list after creation
            })
            .catch(error => {
                console.error('Error creating organization:', error);
            });
    };

    const handleEditOrganization = (org) => {
        setEditMode(true);
        setEditOrgId(org._id);
        setNewOrgName(org.name);
        setNewOrgDescription(org.description);
        setShowPopup(true);
    };

    const handleSaveOrganization = () => {
        fetch(`http://localhost:5173/api/organization/update/${editOrgId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newOrgName,
                description: newOrgDescription
            })
        })
            .then(response => response.json())
            .then(data => {
                setShowPopup(false);
                setEditMode(false);
                setEditOrgId(null);
                fetchOrganizations(); // Fetch updated organization list after update
            })
            .catch(error => {
                console.error('Error updating organization:', error);
            });
    };

    const renderContent = () => {
        if (activeTab === 'ca-nhan') {
            return (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>Thông tin Cá nhân</h2>
                        <button
                            onClick={() => alert('Create new note feature not implemented yet')}
                            style={{ cursor: 'pointer', padding: '10px 20px' }}
                        >
                            + Tạo mới note
                        </button>
                    </div>
    
                    <p>Đây là nội dung cho Cá nhân.</p>
                </div>
            );
        }
        if (activeTab === 'to-chuc') {
            if (loading) {
                return <p>Đang kiểm tra trạng thái tổ chức...</p>;
            }

            if (organizationStatus === "not-in-organization") {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ margin: 0 }}>Bạn chưa ở trong tổ chức nào cả</h2>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                                cursor: 'pointer',
                                padding: '10px 16px',
                                backgroundColor: '#007bff', // Button color
                                borderRadius: '8px',
                                color: '#fff',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                setEditMode(false);
                                setShowPopup(true);
                            }}
                        >
                            <span style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginRight: '8px'
                            }}>+</span>
                            <span>Tạo mới tổ chức</span>
                        </div>
                    </div>
                );
            }
            

            return (
                <div>
                    <h2>Thông tin Tổ chức</h2>
                    {/* "+" Icon for creating a new organization (always visible) */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '20px',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setEditMode(false);
                        setShowPopup(true);
                    }}
                >
                    <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginRight: '8px'
                    }}>+</span>
                    <span>Tạo mới tổ chức</span>
                </div>
                    {organizations.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Owner By</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created At</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizations.map(org => (
                                    <tr key={org._id}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{org.name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{org.description}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{org.ownerBy.username}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(org.createdAt).toLocaleString()}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', gap: '10px' }}>
                                            {/* View Icon (always enabled) */}
                                            <button 
                                                title="View" 
                                                style={{ cursor: 'pointer', fontSize: '16px' }}
                                                onClick={() => handleViewOrganization(org)}
                                            >
                                                👁️
                                            </button>                                            
                                            {/* Edit Icon (enabled based on canEdit) */}
                                            <button 
                                                title="Edit" 
                                                style={{ 
                                                    cursor: org.canEdit ? 'pointer' : 'not-allowed', 
                                                    opacity: org.canEdit ? 1 : 0.5, 
                                                    fontSize: '16px' 
                                                }}
                                                disabled={!org.canEdit}
                                                onClick={() => handleEditOrganization(org)}
                                            >
                                                ✏️
                                            </button>
                                            
                                            <button 
                                                title="Delete" 
                                                style={{ 
                                                    cursor: org.canDelete ? 'pointer' : 'not-allowed', 
                                                    opacity: org.canDelete ? 1 : 0.5, 
                                                    fontSize: '16px' 
                                                }}
                                                disabled={!org.canDelete}
                                                onClick={() => {
                                                    if (org.canDelete) {
                                                        setDeleteOrgId(org._id);
                                                        setShowDeletePopup(true);
                                                    }
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có tổ chức nào để hiển thị.</p>
                    )}
                </div>
            );
        }
        if (activeTab === 'thong-bao') {
            return (
                <div>
                    <h2>Thông báo</h2>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map(notification => (
                                <li key={notification._id}>
                                    {notification.message} - {new Date(notification.createdAt).toLocaleString()}
                                    {notification.status === 'unread' && (
                                        <div>
                                            <button
                                                onClick={() => handleAcceptInvitation(notification._id, notification.organization_id)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Đồng ý
                                            </button>
                                            <button onClick={() => handleDeclineInvitation(notification._id)}>
                                                Từ chối
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có thông báo nào để hiển thị.</p>
                    )}
                </div>
            );
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '200px',
                backgroundColor: '#f4f4f4',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
            }}>
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'ca-nhan' ? '#ddd' : 'transparent',
                        borderRadius: '4px'
                    }}
                    onClick={() => setActiveTab('ca-nhan')}
                >
                    Cá nhân
                </div>
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'to-chuc' ? '#ddd' : 'transparent',
                        borderRadius: '4px'
                    }}
                    onClick={() => setActiveTab('to-chuc')}
                >
                    Tổ chức
                </div>
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'thong-bao' ? '#ddd' : 'transparent',
                        borderRadius: '4px'
                    }}
                    onClick={() => setActiveTab('thong-bao')}
                >
                    Thông báo
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '20px' }}>
                {renderContent()}
            </div>

            {/* Popup for creating or editing an organization */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000
                }}>
                    <h2>{editMode ? 'Chỉnh sửa tổ chức' : 'Tạo tổ chức mới'}</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Tên tổ chức:</label>
                        <input
                            type="text"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Mô tả tổ chức:</label>
                        <textarea
                            value={newOrgDescription}
                            onChange={(e) => setNewOrgDescription(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button onClick={editMode ? handleSaveOrganization : handleCreateOrganization} style={{ marginRight: '10px' }}>
                        {editMode ? 'Lưu' : 'Tạo'}
                    </button>
                    <button onClick={() => setShowPopup(false)}>Hủy</button>
                </div>
            )}
            {showDeletePopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000
                }}>
                    <h2>Xác nhận xóa</h2>
                    <p>Bạn có chắc chắn muốn xóa tổ chức này không? Việc xóa tổ chức đồng nghĩa với việc xóa hết tất cả mọi người ở trong tổ chức đi và không thể khôi phục lại</p>
                    <button onClick={handleDeleteOrganization} style={{ marginRight: '10px' }}>Có</button>
                    <button onClick={() => setShowDeletePopup(false)}>Không</button>
                </div>
            )}
        </div>
    );
};

export default Home;