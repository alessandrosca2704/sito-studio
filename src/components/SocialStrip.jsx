import './SocialStrip.css';
import { IconFacebook, IconLinkedIn, IconPhone } from './icons/Icons';

export default function SocialStrip(){
  return (
    <section className="social-strip">
      
      <div className="cta-band">
        <div className="cta-band__left">
          <span>Vai al nostro profilo Linkedin</span>
          <a className="cta-link" href="https://linkedin.com/in/studio-v-scarimbolo-commercialista-in-bari-a9380529" target="_blank"><IconLinkedIn /> </a>
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

