import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { logger } from "../utils/logger";
import styles from "../../styles/Admin/DecksTable.module.css"
import Button from "../Button";
import Input from "../Input";

interface DeckDataInterface {
    id: string,
    owner_id: string,
    name: string,

}

const DecksTable: React.FC = () => {
    const [decksData, setDecksData] = useState<DeckDataInterface[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [specificDecks, setSpecificDecks] = useState<DeckDataInterface[] | null>(null);
    const [searchBy, setSearchBy] = useState<"id" | "owner-id" | "name">("id");
    const [searchTarget, setSearchTarget] = useState<string>("");

    const fetchDecks = useCallback(async () => {
        try {
            const response = await api.get(`/decks/all?offset=${offset}`);
            setDecksData(response.data)
            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                logger.error("Server error or other");
            } else {
                logger.error("Network or other error", error)
            }
        }
    }, [])

    const fetchSpecificDecks = async () => {
        try {
            let url:string = '';

            if (searchBy === "id") {
                url = `/decks/${searchTarget}`
            } else {
                url = `/${searchBy}/${searchTarget}`
            }

            const response = await api.get(url);

            if (Array.isArray(response.data)) {
                    setSpecificDecks(response.data); 
                } else {
                    setSpecificDecks([response.data])
                }
            logger.info(response.data);
            
        } catch (error: any) {
            if (error.response) { 
                logger.error("Server error ", error.response);
            } else {
                logger.error("Network or other error ", error);
            }
        }
    }

    useEffect(() => {
        fetchDecks();
    }, [])

    return(
        <div className={styles.deckContainer}>
            <h2 style={{fontWeight: "400"}}>Decks table...</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>owner_id</th>
                        <th>name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        decksData && (
                            decksData.map((deck) => (
                                <tr key={deck.id}>
                                    <td>{deck.id}</td>
                                    <td>{deck.owner_id}</td>
                                    <td>{deck.name}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
                
            </table>
            <Button 
                className={styles.button}    
                label="Load decks" 
                onClick={() => console.log("hello")} 
            />

            <div className={styles.deepOptions}>
                <span className={styles.buttons}>  
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("id")}>ID</button>
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("owner-id")}>OWNER-ID</button>
                    <button 
                        className={styles.searchButton} onClick={() => setSearchBy("name")}>NAME</button>
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
                    onClick={() => fetchSpecificDecks()}
                />
                {
                    <table style={{marginBottom: "30px"}} className={styles.table}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>owner_id</th>
                            <th>name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specificDecks && (
                            specificDecks.map((deck) => (
                                <tr key={deck.id}>
                                        <td>{deck.id}</td>
                                        <td>{deck.owner_id}</td>
                                        <td>{deck.name}</td>
                                    </tr>
                            ))
                        )}
                    </tbody>
                    
                </table>
                }
            </div>
        </div>
    )
}

export default DecksTable;