import React, {useState, useEffect, useCallback} from "react";
import Header from "../components/Header";
import MyProfile from "../components/MyProfile";
import api from "../api";

interface UserPorps {
    username: string
    avatar_url: string
}

const MyProfilePage: React.FC = () => {
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
            <>
                <Header 
                    verified={isVerified} 
                    avatar_url={userData.avatar_url}
                    username={userData.username} 
            />
            <MyProfile />   
            </>
        </>
    )
}

export default MyProfilePage;