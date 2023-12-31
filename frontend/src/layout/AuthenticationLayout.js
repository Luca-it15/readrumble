
import FooterApp from "../components/FooterApp";
import NavApp from "../components/NavApp";


const AuthenticationLayout = ({ children }) => {
    return (
      <>
        <NavApp />
        <main>{children}</main>
        <FooterApp />
      </>
    );
  };
  
  export default AuthenticationLayout; 