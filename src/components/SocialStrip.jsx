import './SocialStrip.css';
import { IconFacebook, IconLinkedIn, IconPhone } from './icons/Icons';

export default function SocialStrip(){
  return (
    <section className="social-strip">
      
      <div className="cta-band">
        <div className="cta-band__left">
          <span className='cta-text'>Dai uno sguardo ai nostri profili social</span>
          <a className='cta-link' href='https://www.facebook.com/studioscarimbolo/' target='_blank'><IconFacebook/></a>
          <a className="cta-link" href="https://www.linkedin.com/in/studio-scarimbolo-a60947276/" target="_blank"><IconLinkedIn /> </a>
        </div>
        <div className="cta-band__right">
          <div className="cta-phone">
            <IconPhone size={36} color="#fff" />
            <div>
              <div>Contatto diretto</div>
              <div className="cta-number">+39 (00) 373 73 86 170</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

