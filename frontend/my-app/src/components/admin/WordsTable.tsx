import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { logger } from "../utils/logger";
import styles from "../../styles/Admin/WordsTable.module.css"
import Button from "../Button";

interface WordTableInterface {
    id: string,
    deck_id: string,
    name: string,
    translate: string,
    description: string,
    rank: string,
    count: string
}

const WordsTable: React.FC = () => {
    const [wordsData, setWordsData] = useState<WordTableInterface[] | null>(null);
    const [offset, setOffset] = useState<number>(0);

    const fetchWords = useCallback(async () => {
        try {
            const response = await api.get(`/words/all?offset=${offset}`);
            setWordsData(response.data)
            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                logger.error("Server error or other");
            } else {
                logger.error("Network or other error", error)
            }
        }
    }, [])

    useEffect(() => {
        fetchWords();
    }, [])

    return(
        <div className={styles.wordContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>deck_id</th>
                        <th>name</th>
                        <th>translate</th>
                        <th>description</th>
                        <th>rank</th>
                        <th>count</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        wordsData && (
                            wordsData.map((word) => (
                                <tr key={word.id}>
                                    <td>{word.id}</td>
                                    <td>{word.deck_id}</td>
                                    <td>{word.name}</td>
                                    <td>{word.translate}</td>
                                    <td>{word.description}</td>
                                    <td>{word.rank}</td>
                                    <td>{word.count}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
                
            </table>
            <Button 
                className={styles.button}
                label="Load words" 
                onClick={() => console.log("hello")}
            />
        </div>
    )
}

export default WordsTable;