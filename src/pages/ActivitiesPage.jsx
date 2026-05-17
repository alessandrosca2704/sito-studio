import React from 'react';
import './ActivitiesPage.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import activitiesContent from '../content/activities';
import siteSettings from '../content/siteSettings.json';
import { getCmsPreviewData } from '../content/cmsPreview';

export default function ActivitiesPage(){
  const { lang } = useI18n();
  const content = getCmsPreviewData('path_activities', lang, activitiesContent[lang] || activitiesContent.it);
  const { ref, visible } = useReveal({threshold:0});
  
  return (
    <>
      <section className="act-hero">
        <div
          className="act-hero__bg"
          style={{
            background: `linear-gradient(180deg, ${siteSettings.colors.activitiesHeroOverlayStart}, ${siteSettings.colors.activitiesHeroOverlayEnd}), url(${content.heroBackground || siteSettings.assets.activitiesHeroBackground}) center/cover no-repeat`
          }}
        />
        <div className="container">
          <h1>{content.heroTitle}</h1>
        </div>
      </section>
      <div className={`container reveal ${visible?'is-visible':''}`}ref={ref}>

      {content.blocks.map((b, i) => {
        const reversed = i % 2 === 1;
        const tinted = i % 2 === 0;
        return (
          <section id={b.id} key={b.id} className={`section act ${reversed? 'act--rev':''} ${tinted? 'act--tint':''}`}>
            <div className="container">
              <div className="act__grid">
                <div className="act__text">
                  <h2><span className="text-brand">{b.highlight}</span> {b.title.replace(b.highlight + ' ', '')}</h2>
                  <div className="act__content">
                    {(b.paragraphs || []).map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                    {!!(b.bullets || []).length && (
                      <ul>
                        {b.bullets.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="act__image">
                  <div className="act__imgwrap">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={b.image} alt={`${b.title} image`} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                    <div className="act__label">{b.title.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      </div>
    </>
  );
}
