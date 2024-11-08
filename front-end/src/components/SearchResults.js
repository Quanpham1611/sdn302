// src/components/SearchResults.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || {};
    const [detailedResults, setDetailedResults] = useState({
        users: [],
        organizations: [],
        teams: [],
        notes: []
    });

    useEffect(() => {
        fetchDetailedResults();
    }, [searchResults]);

    const fetchDetailedResults = async () => {
        const accessToken = localStorage.getItem('token');
        const fetchDetails = async (type, id) => {
            const response = await fetch(`http://localhost:5173/api/${type}/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        };

        const users = await Promise.all(searchResults.users.map(user => fetchDetails('users', user._id)));
        const organizations = await Promise.all(searchResults.organizations.map(org => fetchDetails('organizations', org._id)));
        const teams = await Promise.all(searchResults.teams.map(team => fetchDetails('teams', team._id)));
        const notes = await Promise.all(searchResults.notes.map(note => fetchDetails('notes', note._id)));

        setDetailedResults({ users, organizations, teams, notes });
    };

    const hasResults = detailedResults.users.length > 0 || detailedResults.organizations.length > 0 || detailedResults.teams.length > 0 || detailedResults.notes.length > 0;

    return (
        <div>
            <h1>Search Results</h1>
            {hasResults ? (
                <div>
                    {detailedResults.users.length > 0 && (
                        <div>
                            <h2>Users</h2>
                            {detailedResults.users.map(user => (
                                <div key={user._id}>
                                    {user.username} - {user.email}
                                </div>
                            ))}
                        </div>
                    )}
                    {detailedResults.organizations.length > 0 && (
                        <div>
                            <h2>Organizations</h2>
                            {detailedResults.organizations.map(org => (
                                <div key={org._id}>
                                    {org.name} - {org.description}
                                </div>
                            ))}
                        </div>
                    )}
                    {detailedResults.teams.length > 0 && (
                        <div>
                            <h2>Teams</h2>
                            {detailedResults.teams.map(team => (
                                <div key={team._id}>
                                    <p>Name: {team.team.name}</p>
                                    <p>Organization: {team.team.organization}</p>
                                    <p>Owner: {team.team.ownerBy ? team.team.ownerBy.username : 'N/A'}</p>
                                    <p>Members:</p>
                                    <ul>
                                        {Array.isArray(team.team.members) && team.team.members.map(member => (
                                            <li key={member._id}>{member.username}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    {detailedResults.notes.length > 0 && (
                        <div>
                            <h2>Notes</h2>
                            {detailedResults.notes.map(note => (
                                <div key={note._id}>
                                    {note.ticketId} - {note.header} - {note.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResults;