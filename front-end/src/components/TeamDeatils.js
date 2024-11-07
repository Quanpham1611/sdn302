import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Input, Select } from 'antd';


const { Option } = Select;

const TeamDetails = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        header: '',
        description: '',
        assignedTo: '',
        estimatedHours: '',
        priority: 'Low',
        status: 'To Do',
        reviewer: ''
    });
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateNotePopup, setShowCreateNotePopup] = useState(false);
    const [showEditNotePopup, setShowEditNotePopup] = useState(false);
    const accessToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming you store the userId in localStorage

    useEffect(() => {
        fetchTeamDetails();
        fetchCurrentUser();
        fetchNotes();
    }, [teamId]);

    const fetchTeamDetails = () => {
        fetch(`http://localhost:5173/api/teams/${teamId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Team data:', data); // Debugging log
                setTeam(data.team);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching team details:', error);
                setIsLoading(false);
            });
    };

    const fetchCurrentUser = () => {
        fetch(`http://localhost:5173/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('User data:', data); // Debugging log
                setCurrentUser(data.user);
            })
            .catch(error => {
                console.error('Error fetching current user details:', error);
            });
    };

    const fetchNotes = () => {
        fetch(`http://localhost:5173/api/notes/${teamId}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setNotes(data.notes);
            })
            .catch(error => {
                console.error('Error fetching notes:', error);
            });
    };

    const handleCreateNote = () => {
        const noteData = {
            ...newNote,
            createdBy: userId,
            teamId,
            assignedTo: newNote.assignedTo || userId, // Assign to the creator if not specified
            reviewer: newNote.status === 'Review' ? newNote.reviewer : null
        };

        fetch(`http://localhost:5173/api/notes/${teamId}/notes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        })
            .then(response => response.json())
            .then(data => {
                setNewNote({
                    header: '',
                    description: '',
                    assignedTo: '',
                    estimatedHours: '',
                    priority: 'Low',
                    status: 'To Do',
                    reviewer: ''
                });
                setShowCreateNotePopup(false);
                fetchNotes(); // Refresh the notes list
            })
            .catch(error => {
                console.error('Error creating note:', error);
            });
    };

    const handleEditNote = () => {
        const noteData = {
            ...selectedNote,
            assignedTo: selectedNote.assignedTo || userId, // Assign to the creator if not specified
            reviewer: selectedNote.status === 'Review' ? selectedNote.reviewer : null
        };

        fetch(`http://localhost:5173/api/notes/${teamId}/notes/${selectedNote._id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        })
            .then(response => response.json())
            .then(data => {
                setSelectedNote(null);
                setShowEditNotePopup(false);
                fetchNotes(); // Refresh the notes list
            })
            .catch(error => {
                console.error('Error editing note:', error);
            });
    };

    const handleRowClick = (record) => {
        setSelectedNote(record);
        setShowEditNotePopup(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }


    const isOwner = team.ownerBy._id === userId;
    const isMember = team.members.some(member => member._id === userId);

    if (!isOwner && !isMember) {
        return <div>Bạn không ở trong team này nên không được xem</div>;
    }

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'ticketId',
            key: 'ticketId',
            sorter: (a, b) => a.ticketId.localeCompare(b.ticketId)
        },
        {
            title: 'Summary',
            dataIndex: 'header',
            key: 'header',
            sorter: (a, b) => a.header.localeCompare(b.header)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Created By',
            dataIndex: ['createdBy', 'username'],
            key: 'createdBy',
            sorter: (a, b) => a.createdBy.username.localeCompare(b.createdBy.username)
        },
        {
            title: 'Assigned To',
            dataIndex: ['assignedTo', 'username'],
            key: 'assignedTo',
            sorter: (a, b) => (a.assignedTo ? a.assignedTo.username : '').localeCompare(b.assignedTo ? b.assignedTo.username : '')
        },
        {
            title: 'Reviewer',
            dataIndex: ['reviewer', 'username'],
            key: 'reviewer',
            sorter: (a, b) => (a.reviewer ? a.reviewer.username : '').localeCompare(b.reviewer ? b.reviewer.username : '')
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            sorter: (a, b) => a.priority.localeCompare(b.priority)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'To Do', value: 'To Do' },
                { text: 'In Progress', value: 'In Progress' },
                { text: 'Review', value: 'Review' },
                { text: 'Done', value: 'Done' },
                { text: 'Cancel', value: 'Cancel' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Estimated Completion',
            dataIndex: 'estimatedCompletionDate',
            key: 'estimatedCompletionDate',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.estimatedCompletionDate) - new Date(b.estimatedCompletionDate)
        }
    ];

    const rowClassName = (record) => {
        switch (record.status) {
            case 'To Do':
                return 'todo-row';
            case 'Done':
                return 'done-row';
            case 'Cancel':
                return 'cancel-row';
            default:
                return '';
        }
    };

    return (
        <div>
            <h1>Team Details</h1>
            <h2>{team.name}</h2>
            <div>
                <Button onClick={() => setActiveTab('members')}>Thành viên</Button>
                <Button onClick={() => setActiveTab('notes')}>Note</Button>
            </div>
            {activeTab === 'members' && (
                <div>
                    <h3>Thành viên</h3>
                    <ul>
                        {team.members.map(member => (
                            <li key={member._id}>{member.username}</li>
                        ))}
                    </ul>
                </div>
            )}
            {activeTab === 'notes' && (
                <div>
                    <h3>Notes</h3>
                    <Button onClick={() => setShowCreateNotePopup(true)}>Create Note</Button>
                    <Modal
                        title="Create Note"
                        visible={showCreateNotePopup}
                        onCancel={() => setShowCreateNotePopup(false)}
                        onOk={handleCreateNote}
                    >
                        <label>Header</label>
                        <Input
                            value={newNote.header}
                            onChange={(e) => setNewNote({ ...newNote, header: e.target.value })}
                            placeholder="Header"
                            style={{ marginBottom: '10px' }}
                        />
                        <label>Description</label>
                        <Input
                            value={newNote.description}
                            onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                            placeholder="Description"
                            style={{ marginBottom: '10px' }}
                        />
                        <label>Assign to</label>
                        <Select
                            value={newNote.assignedTo}
                            onChange={(value) => setNewNote({ ...newNote, assignedTo: value })}
                            placeholder="Assign to"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            {team.members.map(member => (
                                <Option key={member._id} value={member._id}>{member.username}</Option>
                            ))}
                        </Select>
                        <label>Estimated hours</label>
                        <Input
                            type="number"
                            value={newNote.estimatedHours}
                            onChange={(e) => setNewNote({ ...newNote, estimatedHours: e.target.value })}
                            placeholder="Estimated hours"
                            style={{ marginBottom: '10px' }}
                        />
                        <label>Priority</label>
                        <Select
                            value={newNote.priority}
                            onChange={(value) => setNewNote({ ...newNote, priority: value })}
                            placeholder="Priority"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            <Option value="Low">Low</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="High">High</Option>
                        </Select>
                        <label>Status</label>
                        <Select
                            value={newNote.status}
                            onChange={(value) => setNewNote({ ...newNote, status: value })}
                            placeholder="Status"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            <Option value="To Do">To Do</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Review">Review</Option>
                            <Option value="Done">Done</Option>
                            <Option value="Cancel">Cancel</Option>
                        </Select>
                        {newNote.status === 'Review' && (
                            <>
                                <label>Reviewer</label>
                                <Select
                                    value={newNote.reviewer}
                                    onChange={(value) => setNewNote({ ...newNote, reviewer: value })}
                                    placeholder="Reviewer"
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {team.members.map(member => (
                                        <Option key={member._id} value={member._id}>{member.username}</Option>
                                    ))}
                                </Select>
                            </>
                        )}
                    </Modal>
                    <Table
                        columns={columns}
                        dataSource={notes}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        rowClassName={rowClassName}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record)
                        })}
                    />
                    <Modal
                        title="Edit Note"
                        visible={showEditNotePopup}
                        onCancel={() => setShowEditNotePopup(false)}
                        onOk={handleEditNote}
                    >
                        {selectedNote && (
                            <>
                                <label>Header</label>
                                <Input
                                    value={selectedNote.header}
                                    onChange={(e) => setSelectedNote({ ...selectedNote, header: e.target.value })}
                                    placeholder="Header"
                                    style={{ marginBottom: '10px' }}
                                />
                                <label>Description</label>
                                <Input
                                    value={selectedNote.description}
                                    onChange={(e) => setSelectedNote({ ...selectedNote, description: e.target.value })}
                                    placeholder="Description"
                                    style={{ marginBottom: '10px' }}
                                />
                                <label>Assign to</label>
                                <Select
                                    value={selectedNote.assignedTo}
                                    onChange={(value) => setSelectedNote({ ...selectedNote, assignedTo: value })}
                                    placeholder="Assign to"
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {team.members.map(member => (
                                        <Option key={member._id} value={member._id}>{member.username}</Option>
                                    ))}
                                </Select>
                                <label>Estimated hours</label>
                                <Input
                                    type="number"
                                    value={selectedNote.estimatedHours}
                                    onChange={(e) => setSelectedNote({ ...selectedNote, estimatedHours: e.target.value })}
                                    placeholder="Estimated hours"
                                    style={{ marginBottom: '10px' }}
                                />
                                <label>Priority</label>
                                <Select
                                    value={selectedNote.priority}
                                    onChange={(value) => setSelectedNote({ ...selectedNote, priority: value })}
                                    placeholder="Priority"
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    <Option value="Low">Low</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="High">High</Option>
                                </Select>
                                <label>Status</label>
                                <Select
                                    value={selectedNote.status}
                                    onChange={(value) => setSelectedNote({ ...selectedNote, status: value })}
                                    placeholder="Status"
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    <Option value="To Do">To Do</Option>
                                    <Option value="In Progress">In Progress</Option>
                                    <Option value="Review">Review</Option>
                                    <Option value="Done">Done</Option>
                                    <Option value="Cancel">Cancel</Option>
                                </Select>
                                {selectedNote.status === 'Review' && (
                                    <>
                                        <label>Reviewer</label>
                                        <Select
                                            value={selectedNote.reviewer}
                                            onChange={(value) => setSelectedNote({ ...selectedNote, reviewer: value })}
                                            placeholder="Reviewer"
                                            style={{ width: '100%', marginBottom: '10px' }}
                                        >
                                            {team.members.map(member => (
                                                <Option key={member._id} value={member._id}>{member.username}</Option>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            </>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default TeamDetails;