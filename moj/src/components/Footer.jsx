import './Footer.css';
import oglLogo from "../assets/ogl-logo.png"

export default function Footer() {
  return (
    <footer>
      <div className="inner-container">
        <ul>
          <li>
            <div className="ogl-wrapper">
              <img src={oglLogo} className='ogl-logo' alt="OGL Logo" />
              All content is available under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence v3.0</a>, except where otherwise stated
            </div>
          </li> 
          <li>
            <div className="crest-wrapper">
              <a className='govuk-crest' href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/" target="_blank">&copy; Crown copyright</a>
            </div>
          </li>
        </ul>
      </div>
    </footer>
  );
}