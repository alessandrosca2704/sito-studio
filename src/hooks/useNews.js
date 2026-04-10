import { useEffect, useState } from 'react';
import { getNews, ensureNewsLoaded } from '../data';

export default function useNews(lang){
  const [items, setItems] = useState(()=>getNews(lang));
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    let mounted = true;
    setLoading(true);
    ensureNewsLoaded()
      .then(()=>{ if (mounted) setItems(getNews(lang)); })
      .finally(()=>{ if (mounted) setLoading(false); });
    const onUpdate = () => { if (mounted) setItems(getNews(lang)); };
    window.addEventListener('news-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => { mounted = false; window.removeEventListener('news-updated', onUpdate); window.removeEventListener('storage', onUpdate); };
  }, [lang]);
  return { items, loading };
}

