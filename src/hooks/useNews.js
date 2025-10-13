import { useEffect, useState } from 'react';
import { getNews, ensureNewsLoaded } from '../data';

export default function useNews(lang){
  const [items, setItems] = useState(()=>getNews(lang));
  useEffect(()=>{
    let mounted = true;
    ensureNewsLoaded().then(()=>{ if (mounted) setItems(getNews(lang)); });
    const onUpdate = () => { if (mounted) setItems(getNews(lang)); };
    window.addEventListener('news-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => { mounted = false; window.removeEventListener('news-updated', onUpdate); window.removeEventListener('storage', onUpdate); };
  }, [lang]);
  return { items };
}

