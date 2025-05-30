import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { logger } from "../utils/logger";
import styles from "../../styles/Admin/UsersTable.module.css"
import Button from "../Button";
import Input from "../Input";

interface UserDataInterface {
    id: string,
    username: string,
    email: string,
    phone_number: string,
    avatar_url: string,
    role: string,
    created_at: string,
    updated_at: string
}

const UsersTable: React.FC = () => {
    const [usersData, setUsersData] = useState<UserDataInterface[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [searchBy, setSearchBy] = useState<"id" | "username" | "email" | "phone-number">("id");
    const [searchTarget, setSearchTarget] = useState<string>("");
    const [userData, setUserData] = useState< UserDataInterface[] | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get(`/users/?offset=${offset}`);
            setUsersData(response.data)
            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                logger.error("Server error or other");
            } else {
                logger.error("Network or other error", error)
            }
        }
    }, [])

    const fetchUser = async () => {
        try {
            let url = "";
            if (searchBy === "id") {
                logger.info('id')
                url = `/users/${searchTarget}`;
            } else {
                // Преобразование "phone-number" → "phone_number"
                url = `/users/${searchBy}/${searchTarget}`;
            }

            const response = await api.get(url);

            if (Array.isArray(response.data)) {
                setUserData(response.data); 
            } else {
                setUserData([response.data])
            }
            logger.info(response.data);

        } catch (error: any) {
            if (error.response) {
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return(
        <div className={styles.userContainer}>
 
            <h2 style={{fontWeight: "400"}}>Users table...</h2>
            <div className={styles.usersList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>username</th>
                            <th>email</th>
                            <th>phone</th>
                            <th>avatar_url</th>
                            <th>avatar</th>
                            <th>role</th>
                            <th>created_at</th>
                            <th>updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usersData && (
                                usersData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td>{user.avatar_url}</td>
                                        <td><img style={{width: "50px"}}  src={`http://localhost:8000/${user.avatar_url}`} alt="user-logo" /></td>
                                        <td>{user.role}</td>
                                        <td>{user.created_at}</td>
                                        <td>{user.updated_at}</td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                    
                </table>
            </div>
            <Button 
                className={styles.button}
                label="Load users"
                onClick={() => console.log("hello")}
            />

            <div className={styles.deepOptions}>
                `<span className={styles.buttons}>  
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("id")}>ID</button>
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("username")}>USERNAME</button>
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("email")}>EMAIL</button>
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("phone-number")}>PHONE</button>
                </span>
                <Input 
                    className={styles.input}
                    id="search-field"
                    label={`Find by ${searchBy}`}
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                />
                <Button 
                    label="Find"
                    className={styles.findButton}
                    onClick={() => fetchUser()}
                />
                {
                    <table style={{marginBottom: "30px"}} className={styles.table}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>username</th>
                            <th>email</th>
                            <th>phone</th>
                            <th>avatar_url</th>
                            <th>avatar</th>
                            <th>role</th>
                            <th>created_at</th>
                            <th>updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userData && (
                                userData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td>{user.avatar_url}</td>
                                        <td><img style={{width: "50px"}}  src={`http://localhost:8000/${user.avatar_url}`} alt="user-logo" /></td>
                                        <td>{user.role}</td>
                                        <td>{user.created_at}</td>
                                        <td>{user.updated_at}</td>
                                    </tr>
                                )) 
                            )
                        }
                    </tbody>
                    
                </table>
                }
            </div>

        </div>
    )
}

export default UsersTable;