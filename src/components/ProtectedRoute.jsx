import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthed, refreshExpiry } from '../auth';

export default function ProtectedRoute({ children }){
  const nav = useNavigate();

  React.useEffect(() => {
    // periodic expiry check
    const check = () => { if (!isAuthed()) nav('/login', { replace: true }); };
    const id = setInterval(check, 15000);
    check();
    // idle refresh on user activity (comment out for absolute timeout)
    const bump = () => refreshExpiry();
    const events = ['click','keydown','mousemove','scroll','touchstart'];
    events.forEach(ev => window.addEventListener(ev, bump));
    return () => {
      clearInterval(id);
      events.forEach(ev => window.removeEventListener(ev, bump));
    };
  }, [nav]);

  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}
