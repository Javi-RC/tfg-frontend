import React, { useEffect, useState, useContext } from 'react';
import { getProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    getProfile().then(res => setProfile(res.data)).catch(()=>{/* handle error */});
  }, []);
  if (!profile) return <div style={{ padding: 24 }}>Loading...</div>;
  return (
    <div style={{ maxWidth: 720, margin: '32px auto', padding: 16 }}>
      <h2>{profile.username || profile.name || 'User'}</h2>
      <p>{profile.email}</p>
      <p>{profile.role}</p>
      <p>Created: {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '—'}</p>
      <button onClick={logout} style={{ marginTop: 12 }}>Log out</button>
    </div>
  );
}
