import React from "react";
import icon from "../../icon_englight.png"
import "../styles/header.css"
import { Link } from "react-router-dom";

interface HeaderProps {
    verified?: boolean
    username?: string
    avatar_url?: string
}

const Header: React.FC<HeaderProps> = ({verified, username, avatar_url}) => {


    return(
        <header>
            <div className="header-container">
                <nav>
                    <Link to="/" className="nav-0">
                        <img className="icon-app" src={icon} alt="Logo" />
                    </Link>
                    <Link to={"/"} className="nav-1">Exercices</Link>
                    <Link to="/" className="nav-2">Vocabulary</Link>
                    <Link to={"/me"} className="nav-3">My account</Link>
                    {verified === undefined ? <span>Loading...</span> : (
                        verified ? (
                            <>
                                <Link to={"/me"} className="nav-3">{username}</Link>
                                <Link to="/me" className="nav-4">
                                    <img className="iconUser" src={`http://localhost:8000/${avatar_url}`} alt="My logo"/>
                                </Link>
                            </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-3">Sign in</Link>
                                    <Link to="/login" className="nav-4">
                                    <img className="iconUser" src={'http://localhost:8000/static/avatars/d-avatar.jpg'} alt="My logo"/>
                                    </Link>
                                </>
                                
                            )
                    )}
                </nav>

            </div>
        </header>
    )
}

export default Header;