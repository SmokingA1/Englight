import React, {useState, useEffect} from "react";
import api from "../api";
import { logger } from "../components/utils/logger";
import Header from "../components/Header";
import Settings from "../components/Settings";

interface UserProps {
    username: string
    avatar_url: string
}

const SettingsPage: React.FC = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserProps>({
        username: '',
        avatar_url: ''
    })

    const fetchUserData = async () => {
        try {
            const response = await api.get("/users/me");
            if (response) setIsVerified(true);
            const {username, avatar_url} = response.data;
            setUserData({
                username,
                avatar_url
            })

            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("server error: ", error.response)
            }
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])


    return(
        <>
                
            <Header 
                verified={isVerified}
                avatar_url={userData.avatar_url}
                username={userData.username}
            />
            <Settings />
        </>
    )
}

export default SettingsPage;