import React, {useEffect, useState, useCallback} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api";
// import Fortune from "../components/Fortune";
// import FortuneCanvas from "../components/FortuneCanvas";
import FortuneCanvasModule from "../components/FortuneCanvaModule";
interface UserProps {
    username: string
    avatar_url: string
}

const FortunePage: React.FC = () => {
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
            <Header verified={isVerified} username={userData.username} avatar_url={userData.avatar_url}/>
            <FortuneCanvasModule verified={isVerified} />
            <Footer />
        </>
        
    )
}

export default FortunePage;
