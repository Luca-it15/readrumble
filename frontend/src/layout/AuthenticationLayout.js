import React from "react";
import FooterApp from "../components/FooterApp";
import NavApp from "../components/NavApp";

const AuthenticationLayout = ({children}) => {
    return (
        <React.Fragment>
            <NavApp/>
            <main>{children}</main>
            <FooterApp/>
        </React.Fragment>
    );
};

export default AuthenticationLayout;