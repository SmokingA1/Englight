import React, {useEffect, useState, useCallback} from "react";
import styles from "../styles/MyProfile.module.css"
import api from "../api";
import Button from "./Button";
import Input from "./Input";
import { logger } from "./utils/logger";

interface userDataInterface {
    username: string;
    email: string;
    phone_number: string;
    avatar_url: string;
    id: string;
}

interface deckDataInteface {
    name: string;
    owner_id: string;
    id: string;
}

const MyProfile: React.FC = () => {
    const [userData, setUserData] = useState<userDataInterface>({
        username: '',
        email: '',
        phone_number: '',
        avatar_url: '',
        id: ''
    })

    const [decksData, setDeckData] = useState<deckDataInteface[]>([{
        name: "",
        owner_id: "",
        id: ""
    }])
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [isFormAvatar, setIsFormAvatar] = useState<boolean>(false);
    const [isUpdateForm, setIsUpdateForm] = useState<boolean>(false);
    
    const fetchUserData = useCallback(async () => {
        try {
            const response = await api.get("/users/me");
            const { username, email, phone_number, avatar_url, id } = response.data;
            setUserData({
                username,
                email,
                phone_number,
                avatar_url,
                id
            });

            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("server error: ", error.response)
            }
            console.log(error);
        }
    }, []);

    const fetchUserDecks = useCallback(async () => {
        try {
            const response = await api.get("/decks/my-all");
            setDeckData(response.data);
            logger.info(response.data)
        } catch (error: any) {
            if (error.respone) {
                console.error("Server error", error.respone);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }, []);

    const handleUpdateName = async () => {
        try {
            const response = await api.put("/users/update/me", {
                "username": userData.username
            });
            logger.info(response.data);
            fetchUserData();
            setIsUpdateForm(false);
        } catch (error: any) {
            if (error.respone) {
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network or other error ", error);
            }
        }
    }

    const uploadAvatar = async () => {
        if (!newAvatar) return;

        const formData = new FormData();
        formData.append("user_id", userData.id);
        formData.append("file",  newAvatar);

        try {
            const response = await api.post("/users/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            logger.info(response.data);
            logger.info(newAvatar);
            if (response) {
                setIsFormAvatar(false);
                fetchUserData();
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    useEffect(() => {
        if (userData.id) {
            fetchUserDecks();
        }
    }, [userData.id]);

    return(
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.mainInfo} >
                    <img 
                        className={styles.avatar}
                        src={`http://localhost:8000/${userData.avatar_url}`}
                        alt="My-logo" 
                        onClick={() => setIsFormAvatar(true)}
                    />
                    <span style={{
                        maxWidth: 130 + "px", display: "flex",flexWrap: "wrap", alignItems: "center", wordBreak: "break-word"
                        }}>
                        
                        {isUpdateForm ? (
                            <Input 
                            className={styles.nameInput}
                            type="text"
                            value={userData.username} 
                            onChange={(e) => setUserData({...userData, username: e.target.value})}
                            onKeyDown={(e) => 
                                {if(e.key == "Enter") {
                                    handleUpdateName();
                                }}}
                            />
                            ) : (
                                <span style={{ wordBreak: "break-word" }}>{userData.username}</span>
                            )  
                        }
                        <span 
                            onClick={() => setIsUpdateForm(!isUpdateForm)}
                            style={{cursor: "pointer", marginLeft: 5 + "px"}}
                        >
                            <i className="bi bi-pencil" style={{fontSize: 20 + "px"}}></i>
                        </span>
                    </span>
                    {isFormAvatar && (
                        <>
                            <div
                                className={styles.darkBg}
                                onClick={() => {
                                    setIsFormAvatar(false);
                                    setNewAvatar(null);
                                }}
                            >
                            </div>
                            <div className={styles.formAvatar}>
                                <label htmlFor="avatar-upload" className={styles.customUpload}>
                                    { newAvatar ? (
                                        <span style={{width: 100 + "%", height: 100 + "%"}} >
                                            <img
                                                className={styles.avatarPreload}
                                                src={URL.createObjectURL(newAvatar)} alt="newAvatar"/>
                                        </span>
                                    ): (
                                        <span className={styles.plus}>+</span>
                                    )
                                    }
                                    
                                </label>
                                <input 
                                    className={styles.hiddenInput}
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewAvatar(e.target.files[0])
                                        }
                                    }}
                                />
                                <Button
                                    className={styles.buttonAvatar}
                                    label="Submit"
                                    onClick={uploadAvatar}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.blockInfo}>
                    <div className={styles.otherInfo}>
                        <span>Email: {userData.email}</span>
                        <span>Phone: {userData.phone_number}</span>
                    </div>
                    <div className={styles.decks}>
                        {
                            decksData.map(deck => ( // кароче или {return div} or ()
                                <div key={deck.id} className={styles.deck}> 
                                    {deck.name}
                                </div>
                            ))
                        }
                    </div>
                </div>
                
            </main>
            {/* {
                isAside && 
                <aside>

                </aside>
            } */}
            
        </div>
    )
}

export default MyProfile;







// interface userDataUpdate {
//     username: string | null;
//     email: string | null;
//     phone_number: string | null;
// }

    // const [userUpdateData, setUserUpdateData] = useState<userDataUpdate>(
    //     {
    //         username: null,
    //         email: null,
    //         phone_number: null,
    //     }
    // )