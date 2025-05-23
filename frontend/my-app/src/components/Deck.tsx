import React, {useEffect, useState} from "react";
import api from "../api";
import styles from "../styles/Deck.module.css"
import { logger } from "./utils/logger";
import Input from "./Input";
import Button from "./Button";

interface DeckInterface {
    id: string,
    owner_id: string,
    name: string,

};

interface WordInterface {
    id: string,
    deck_id: string,
    name: string;
    translate: string,
    description: string,
    rank: string,
    count: number
}

interface NewWordProps {
    name: string,
    translate: string,
    description: string,
    deck_id: string,
}

const Deck: React.FC<{deck_id: string}> = ({deck_id}) => {
    const [deckData, setDeckData] = useState<DeckInterface>(
        {
            id: "",
            owner_id: "",
            name: "",
        }
    );
    const [wordsData, setWordsData] = useState<WordInterface[]>([]);
    const [newWordFormData, setNewWordFormData] = useState<NewWordProps>({
        name: "",
        translate: "",
        description: "",
        deck_id: deck_id,
    })
    const fetchDeck = async () => {
        try {
            const response = await api.get(`/decks/${deck_id}`);
            logger.info(response.data);
            setDeckData(
                {
                    id: response.data.id,
                    owner_id: response.data.owner_id,
                    name: response.data.name,
                }
            );
        } catch (error: any) {
            if (error.response) {
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network or other error: ", error);
            }
        }
    }

    const fetchWords = async () => {
        try {
            const response = await api.get(`/words/all/${deck_id}`);
            logger.info(response.data);
            setWordsData(response.data);
        } catch (error: any) {
            if (error.response) {
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network or other error: ", error);
            }
        }
    }

    const handleAddWord = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post(`/words/create/`, newWordFormData);
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
        fetchDeck();
        fetchWords();
    }, [deck_id])

    return(
        <div className={styles.deckBlock}>
            <div className={styles.deckMainInfo}>
                <span>Deck cover</span>
                <img className={styles.deckMainInfoCover} src="http://localhost:8000/static/deck_bg/d-deck-bg.jpg" alt="deck-cover" />
                <span className={styles.deckMainInfoName}> {deckData.name} </span>
            </div>
            <div className={styles.words}>
                <form 
                    onSubmit={handleAddWord}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        gap: "5px"
                    }}
                >
                    <Input type="text"
                        className={styles.input}
                        label="Word"
                        id="word-field"
                        value={newWordFormData.name}
                        onChange={(e) => setNewWordFormData({...newWordFormData, name: e.target.value})}
                        required
                    />
                    <Input type="text"
                        className={styles.input}
                        label="Translate"
                        id="translate-field"
                        value={newWordFormData.translate}
                        onChange={(e) => setNewWordFormData({...newWordFormData, translate: e.target.value})}
                        required
                    />
                    <Input type="text"
                        className={styles.input}
                        label="Description"
                        id="description-field"
                        value={newWordFormData.description}
                        onChange={(e) => setNewWordFormData({...newWordFormData, description: e.target.value})}
                        required
                    />
                    
                    <Button
                        className={styles.button}
                        label="Add word"
                    />
                </form>
                { wordsData.length > 0 && (
                    wordsData.map(deck => (
                        <div>
                            <span>{deck.name} - {deck.translate}</span>
                        </div>
                        ))
                    )
                }
            </div>
                
          </div>
    );
};

export default Deck;