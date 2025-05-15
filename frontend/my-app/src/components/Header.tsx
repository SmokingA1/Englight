import React from "react";
import icon from "../../icon_englight.png"
import icon_user from "../assets/icon_user.jpg"
import "../styles/header.css"
const Header: React.FC = () => {


    return(
        <header>
            <div className="header-container">
                <img className="icon-app" src={icon} alt="Logo" />
                <nav>
                    <a href="#" className="nav-1">Exercices</a>
                    <a href="#" className="nav-2">Vocabulary</a>
                    <a href="#" className="nav-3">My account</a>
                    <a href="#" className="nav-4"><img className="icon-user" src={icon_user} alt="User icon"/></a>

                </nav>

            </div>
        </header>
    )
}

export default Header;