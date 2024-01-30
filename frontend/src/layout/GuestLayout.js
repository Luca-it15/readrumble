import React from "react";
import FooterApp from "../components/FooterApp";
import "../App.css";

const GuestLayout = ({children}) => {
    return (
        <React.Fragment>
            <main>{children}
                <FooterApp/>
            </main>
        </React.Fragment>
    );
};

export default GuestLayout;