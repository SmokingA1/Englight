import React, {useEffect, useState} from "react";
import api from "../api";
import styles from "../styles/Deck.module.css"
import { logger } from "./utils/logger";

interface DeckInterface {
    id: string,
    owner_id: string,
    name: string,
};

const Deck: React.FC<{deck_id: string}> = ({deck_id}) => {
    const [deckData, setDeckData] = useState<DeckInterface>(
        {
            id: "",
            owner_id: "",
            name: "",
        }
    );

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

    useEffect(() => {
        fetchDeck();
    }, [deck_id])

    return(
        <div className={styles.deckBlock}>
            {deckData.name}
            {deckData.id}
            {deckData.owner_id}
        </div>
    );
};

export default Deck;