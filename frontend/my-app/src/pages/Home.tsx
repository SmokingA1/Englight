import React, {useState, useCallback, useEffect} from "react"
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";
import api from "../api";
import { logger } from "../components/utils/logger";

interface UserProps {
    username: string
    avatar_url: string
}

const Home: React.FC = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserProps>({
        username: '',
        avatar_url: ''
    })

    const fetchUserData = useCallback(async () => {
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
    }, []);

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
            
            <MainContent

            />

            <Footer />
        </>
    )
}

export default Home;