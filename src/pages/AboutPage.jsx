import React from 'react';
import './AboutPage.css';
import { useI18n } from '../i18n';
import { IconHandshake, IconBars } from '../components/icons/Icons';
import useReveal from '../hooks/useReveal';
import aboutContent from '../content/about';
import siteSettings from '../content/siteSettings.json';
import { getCmsPreviewData } from '../content/cmsPreview';

export default function AboutPage(){
  const { lang } = useI18n();
  const { ref, visible } = useReveal();
  const content = getCmsPreviewData('path_about', lang, aboutContent[lang] || aboutContent.it);

  return (
    <>
      <section className="about-hero">
        <div
          className="about-hero__bg"
          style={{
            background: `linear-gradient(180deg, ${siteSettings.colors.aboutHeroOverlayStart}, ${siteSettings.colors.aboutHeroOverlayEnd}), url(${content.images?.heroBackground || siteSettings.assets.aboutHeroBackground}) center/cover no-repeat`
          }}
        />
        <div className="container about-hero__inner">
          <h1>{content.heroTitle}</h1>
        </div>
      </section>

      <section className="section about-intro" ref={ref}>
        <div className={`container about-intro__grid ${visible ? 'is-visible' : ''}`}>
          <div className="about-intro__icon"><IconHandshake size={52} /></div>
          <div>
            <h2 className="text-brand">{content.introTitle}</h2>
            {content.introParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section about-focus"
        style={{
          '--about-focus-bg': `url(${content.images?.focusBackground || siteSettings.assets.aboutFocusBackground})`,
          '--about-focus-accent-start': siteSettings.colors.aboutFocusAccentStart,
          '--about-focus-accent-end': siteSettings.colors.aboutFocusAccentEnd
        }}
      >
        <div className="container about-focus__grid">
          <div className="about-focus__text">
            <span className="eyebrow"><IconBars size={32} />&nbsp; {content.focusTitle}</span>
            <div className="about-focus__lead"><p><strong>{content.focusLead}</strong></p></div>
            <ul>
              {content.focusBullets.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
         <div className="about-focus__media">
         </div>
        </div>
      </section>

      <section className="section about-team">
        <div className="container about-team__grid">
          <div className="about-team__photo">
            <img src={content.images?.teamPhoto || siteSettings.assets.teamPhoto} alt={content.teamName} />
          </div>
          <div className="about-team__bio">
            <h3 className="text-brand">{content.teamTitle}</h3>
            <h4>{content.teamName}</h4>
            <div className="about-team__role">{content.teamRole}</div>
            {content.teamBio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            <div className="about-team__badge">
              <img src={content.images?.teamBadge || siteSettings.assets.teamBadge} alt={content.badgeCaption} />
              <span>{content.badgeCaption}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
