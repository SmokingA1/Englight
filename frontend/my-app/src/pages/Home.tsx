import React, {useState, useCallback, useEffect} from "react"
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import api from "../api";
import styles from "../styles/Base.module.css"
import { logger } from "../components/utils/logger";

interface UserPorps {
    username: string
    avatar_url: string
}

const Home: React.FC = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserPorps>({
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

        <main className={styles.main}>
                
            <Header 
                verified={isVerified}
                avatar_url={userData.avatar_url}
                username={userData.username}
            />
            
            <MainContent

            />
            
        </main>
    )
}

export default Home;