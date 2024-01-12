import FooterApp from "../components/FooterApp";
import "../App.css"; 
import logo from '../img/logoRR.png'; 
import SiteLogo from "../components/SiteLogo";



const GuestLayout = ({ children }) => {
  
    return (
      <>
      <SiteLogo imageSrc={logo} imageAlt={"Logo ReadRumble"} />
        <main>{children}</main>
        <FooterApp />
      </>
    );
  };
  
  export default GuestLayout; 