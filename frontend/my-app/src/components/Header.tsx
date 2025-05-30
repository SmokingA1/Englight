import React, { useEffect, useRef, useState } from "react";
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
    const dropdownRef = useRef<HTMLUListElement>(null);
    const avatarRef = useRef<HTMLImageElement>(null);


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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && // если рендерится то true
                !dropdownRef.current.contains(event.target as Node) && // если было нажато не по дочернему элементу этого узла => true 
                avatarRef.current &&  // если рендерится то true
                !avatarRef.current.contains(event.target as Node) // и также если наш клик находится за пределами аватарки и нажат узел который не явлется его дочерним элементном то мы получим => true
            ) {
                setMoreInfo(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [])

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
                                    ref={avatarRef}
                                    />

                                    {
                                        moreInfo && (
                                            <ul className="more-menu" ref={dropdownRef}>
                                                <li 
                                                    className="btn-more-info btn-1"
                                                    onClick={() => navigate("/me")} 
                                                >
                                                    <i className="bi bi-person-fill"></i>Your profile
                                                </li>
                                                <li 
                                                    className="btn-more-info btn-2"
                                                    onClick={() => navigate("/settings")} // /me/settings
                                                >
                                                    <i className="bi bi-gear"></i>Settings
                                                </li>
                                                <li 
                                                    className="btn-more-info btn-3"
                                                    onClick={() => signOut()}
                                                >
                                                    <i className="bi bi-arrow-bar-right"></i>Sign out
                                                </li>
                                            </ul>
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