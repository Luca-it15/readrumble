
import FooterApp from "../components/FooterApp";
import NavAppAdmin from "../components/NavAppAdmin";


const AdminLayout = ({ children }) => {
    return (
      <>
        <NavAppAdmin />
        <main>{children}</main>
        <FooterApp />
      </>
    );
  };
  
  export default AdminLayout; 