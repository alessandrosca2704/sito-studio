import { useEffect, useState } from 'react';
import { ensureScadenzeLoaded, getScadenze } from '../data';

export default function useScadenze(lang){
  const [items, setItems] = useState(()=>getScadenze(lang));
  useEffect(()=>{
    let mounted = true;
    ensureScadenzeLoaded().then(()=>{ if (mounted) setItems(getScadenze(lang)); });
    const onUpdate = () => { if (mounted) setItems(getScadenze(lang)); };
    window.addEventListener('deadlines-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => { mounted = false; window.removeEventListener('deadlines-updated', onUpdate); window.removeEventListener('storage', onUpdate); };
  }, [lang]);
  return { items };
}

