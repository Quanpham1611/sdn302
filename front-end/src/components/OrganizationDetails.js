import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrganizationDetails = () => {
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('members');
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const accessToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming you store the userId in localStorage

    useEffect(() => {
        fetchOrganizationDetails();
        fetchAllUsers();
    }, [organizationId, accessToken]);

    const fetchOrganizationDetails = () => {
        fetch(`http://localhost:5173/api/organization/${organizationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setOrganization(data.organization);
                setMembers(data.members);
            })
            .catch(error => {
                console.error('Error fetching organization details:', error);
            });
    };

    const fetchAllUsers = () => {
        fetch(`http://localhost:5173/api/users/allUsers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Fetch current user details to get the username
                fetch(`http://localhost:5173/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(userData => {
                        const currentUsername = userData.username;
                        const filteredUsers = data.users.filter(user => 
                            user.username !== currentUsername
                        );
                        setAllUsers(filteredUsers);
                        setFilteredUsers(filteredUsers);
                    })
                    .catch(error => {
                        console.error('Error fetching current user details:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const handleInviteUsernameChange = (e) => {
        const value = e.target.value;
        setInviteUsername(value);
        setFilteredUsers(allUsers.filter(user => user.username.toLowerCase().includes(value.toLowerCase())));
    };

    const handleInviteMember = () => {
        // Kiểm tra xem username đã tồn tại trong danh sách thành viên của tổ chức hay chưa
        if (members.some(member => member.username === inviteUsername)) {
            alert('Người dùng này đã là thành viên của tổ chức.');
            return;
        }
    
        fetch(`http://localhost:5173/api/organization/invite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                organizationId,
                username: inviteUsername // Change email to username
            })
        })
            .then(response => response.json())
            .then(data => {
                setShowInvitePopup(false);
                setInviteUsername('');
                fetchOrganizationDetails(); // Refresh the members list
            })
            .catch(error => {
                console.error('Error inviting member:', error);
            });
    };

    const renderTabContent = () => {
        if (!organization) {
            return <p>Loading...</p>;
        }

        switch (activeTab) {
            case 'members':
                return (
                    <div>
                        <h3>Thành viên trong tổ chức</h3>
                        <ul>
                            {members && members.length > 0 ? (
                                members.map(member => (
                                    <li key={member._id}>
                                        {member.username}
                                        {member._id === organization.ownerBy._id && ' (chủ sở hữu)'}
                                    </li>
                                ))
                            ) : (
                                <p>Không có thành viên nào trong tổ chức.</p>
                            )}
                        </ul>
                        {organization.ownerBy._id === userId && (
                            <button onClick={() => setShowInvitePopup(true)} style={{ marginTop: '20px' }}>Mời thành viên</button>
                        )}
                    </div>
                );
            case 'teams':
                return (
                    <div>
                        <h3>Team trong tổ chức</h3>
                        <ul>
                            {organization.teams && organization.teams.length > 0 ? (
                                organization.teams.map(team => (
                                    <li key={team._id}>{team.name}</li>
                                ))
                            ) : (
                                <p>Không có team nào trong tổ chức.</p>
                            )}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>Quay lại</button>
            {organization && (
                <>
                    <h2>Chi tiết tổ chức: {organization.name}</h2>
                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                        <button onClick={() => setActiveTab('members')} style={{ marginRight: '10px' }}>Thành viên</button>
                        <button onClick={() => setActiveTab('teams')}>Team</button>
                    </div>
                    {renderTabContent()}
                </>
            )}
            {showInvitePopup && (
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
                    <h2>Mời thành viên</h2>
                    <input
                        type="text"
                        value={inviteUsername}
                        onChange={handleInviteUsernameChange}
                        placeholder="Nhập username thành viên"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {filteredUsers.length > 0 && (
                        <ul style={{ maxHeight: '150px', overflowY: 'auto', padding: '0', margin: '0', listStyleType: 'none', border: '1px solid #ddd' }}>
                            {filteredUsers.map(user => (
                                <li
                                    key={user._id}
                                    onClick={() => setInviteUsername(user.username)}
                                    style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={handleInviteMember} style={{ marginRight: '10px' }}>Mời</button>
                    <button onClick={() => setShowInvitePopup(false)}>Hủy</button>
                </div>
            )}
        </div>
    );
};

export default OrganizationDetails;