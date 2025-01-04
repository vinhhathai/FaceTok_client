import { Link } from 'react-router-dom';

function LogoHeader() {
  return (
    <>
      <Link className="navbar-brand nav-item mr-lg-5" to="/">
        <img
          src="/assets/images/FaceTokIcon.jpeg"
          width="40"
          height="40"
          className="mr-3 logo__icon"
          alt="Logo"
        />
      </Link>
    </>
  );
}

export default LogoHeader;
