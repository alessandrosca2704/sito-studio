import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthed } from '../auth';

export default function ProtectedRoute({ children }){
  const [status, setStatus] = React.useState('checking');

  React.useEffect(() => {
    let active = true;
    isAuthed().then((ok) => { if (active) setStatus(ok ? 'authenticated' : 'anonymous'); });
    return () => { active = false; };
  }, []);

  if (status === 'checking') return <div className="container">Verifica sessione...</div>;
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return children;
}
