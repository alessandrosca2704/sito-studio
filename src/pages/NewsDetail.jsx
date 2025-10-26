import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsDetail.css';
import useNews from '../hooks/useNews';
import {FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { IconFacebook, IconLinkedIn, IconWhatsapp } from '../components/icons/Icons';
import { Helmet } from 'react-helmet-async';

export default function NewsDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items } = useNews(lang);
  const post = items.find(p => p.slug === slug);
  if(!post){
    return (
      <section className="section"><div className="container"><h2>Articolo non trovato</h2><Link to="/news" className="btn btn-brand">Torna alle news</Link></div></section>
    );
  }
  const BASE_URL = 'https://www.studioscarimbolo.it';
  const shareUrl = `${BASE_URL}/news/${post.slug}`;
  const raw = String(post.excerpt || post.content || post.title || '')
    .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt = raw.length > 200 ? raw.slice(0, 197) + '…' : raw;
  return (
    <>
        <Helmet>
      <title>{post.title}</title>
      <meta name="description" content={excerpt} />
      <link rel="canonical" href={shareUrl} />

      <meta property="og:type" content="article" />
      <meta property="og:url" content={shareUrl} />
      <meta property="og:site_name" content="Studio Scarimbolo" />
      <meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_US'} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.image} />
    </Helmet>
    
    <section className="section">
      <div className="container">
        <div className="news-detail">
          <div className="news-detail__media" style={{backgroundImage:`url(${post.image})`}} />
          <h1 className="text-brand">{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="news-detail__content" dangerouslySetInnerHTML={{__html: post.content || post.excerpt}} />
          <div className='share-grid'>
          <span>Condividi la news sui Social!</span>
          <FacebookShareButton className='share-button'  hashtag="#news" resetButtonStyle={false} url={`https://www.studioscarimbolo.it/news/${post.slug}`}><IconFacebook /></FacebookShareButton>
          <WhatsappShareButton className='share-button'  hashtag="#news" resetButtonStyle={false} url={`https://www.studioscarimbolo.it/news/${post.slug}`}><IconWhatsapp/></WhatsappShareButton>
          <LinkedinShareButton className='share-button'  hashtag="#news" resetButtonStyle={false} url={`https://www.studioscarimbolo.it/news/${post.slug}`}><IconLinkedIn/></LinkedinShareButton>
          </div>
          <div style={{marginTop:16}}><Link to="/news" className="btn">← {dict.news.archive}</Link></div>
        </div>
      </div>
    </section>
    </>
  );
}
