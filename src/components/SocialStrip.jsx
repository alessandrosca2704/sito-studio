import './SocialStrip.css';
import { IconFacebook, IconLinkedIn, IconPhone } from './icons/Icons';
import siteSettings from '../content/siteSettings.json';

export default function SocialStrip(){
  return (
    <section className="social-strip">
      <div className="cta-band">
        <div className="cta-band__left">
          <span className='cta-text'>{siteSettings.social.intro}</span>
          <a className='cta-link' href={siteSettings.social.facebookUrl} target='_blank' rel="noreferrer"><IconFacebook/></a>
          <a className="cta-link" href={siteSettings.social.linkedinUrl} target="_blank" rel="noreferrer"><IconLinkedIn /> </a>
        </div>
        <div className="cta-band__right">
          <div className="cta-phone">
            <IconPhone size={36} color="#fff" />
            <div>
              <div>{siteSettings.social.directContactLabel}</div>
              <div className="cta-number">{siteSettings.contact.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
