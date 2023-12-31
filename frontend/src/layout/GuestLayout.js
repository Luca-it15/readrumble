import FooterApp from "../components/FooterApp";
import NavApp from "../components/NavApp";


const GuestLayout = ({ children }) => {
    return (
      <>
        <main>{children}</main>
        <FooterApp />
      </>
    );
  };
  
  export default GuestLayout; 