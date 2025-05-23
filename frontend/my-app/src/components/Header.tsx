import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logger } from "./utils/logger";
import api from "../api";
import icon from "../../icon_englight.png"
import "../styles/header.css"


interface HeaderProps {
    verified?: boolean
    username?: string
    avatar_url?: string
}

const Header: React.FC<HeaderProps> = ({verified, username, avatar_url}) => {
    const [moreInfo, setMoreInfo] = useState<boolean>(false);
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            const response = await api.get("/clear-cookie")
            logger.info(response.data);
            navigate("/login");

        } catch (error: any) {
            if (error.response) {
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network error or other problem: ", error);
            }
        }
    }

    return(
        <header>
            <div className="header-container">
                <nav>
                    <Link to="/" className="nav-0">
                        <img className="icon-app" src={icon} alt="Logo" />
                    </Link>
                    <Link to={"/"} className="nav-1">Home</Link>
                    <Link to={"/fortune"} className="nav-2">Exercices</Link>
                    <Link to="/" className="nav-3">Vocabulary</Link>
                    {verified === undefined ? <span>Loading...</span> : (
                        verified ? (
                            <>
                                <Link to={"/me"} className="nav-3">{username}</Link>
                                <span style={{position: "relative"}}>
                                    <img 
                                    className="iconUser"
                                    src={`http://localhost:8000/${avatar_url}`}
                                    alt="My logo"
                                    onClick={() => setMoreInfo(!moreInfo)}
                                    />

                                    {
                                        moreInfo && (
                                            <div className="more-menu">
                                                <button 
                                                    className="btn-more-info btn-1"
                                                    onClick={() => navigate("/me")} 
                                                >
                                                    <i className="bi bi-person-fill"></i>Your profile
                                                </button>
                                                <button 
                                                    className="btn-more-info btn-2"
                                                    onClick={() => navigate("#")} // /me/settings
                                                >
                                                    <i className="bi bi-gear"></i>Settings
                                                </button>
                                                <button 
                                                    className="btn-more-info btn-3"
                                                    onClick={() => signOut()}
                                                >
                                                    <i className="bi bi-arrow-bar-right"></i>Sign out
                                                </button>
                                            </div>
                                        )
                                    }
                                </span>
                                
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