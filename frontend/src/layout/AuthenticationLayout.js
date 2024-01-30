import React from "react";
import FooterApp from "../components/FooterApp";
import NavApp from "../components/NavApp";

const AuthenticationLayout = ({children}) => {
    return (
        <React.Fragment>
            <main>
                <NavApp/>
                {children}
                <FooterApp/>
            </main>
        </React.Fragment>
    );
};

export default AuthenticationLayout;