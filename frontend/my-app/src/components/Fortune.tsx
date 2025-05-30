import React, {useEffect, useState} from "react";
import styles from "../styles/Fortune.module.css"
import api from "../api";
import {Wheel} from "react-custom-roulette";
import type { ImageProps, StyleType } from "react-custom-roulette/dist/components/Wheel/types";
import { logger } from "./utils/logger";
import { Link } from "react-router-dom";
import Button from "./Button";
import Message from "./Message";
import Input from "./Input";

interface WheelData {
    option: string;
    image?: ImageProps;
    style?: StyleType;
    optionSize?: number
}
// prizeNumber() should be between 0 and data.length -1 if data has 5 elements, prize can be or 0 min or 4 max 

interface DecksData {
    name: string,
    id: string,
    owner_id: string
}

interface WordData {
    id: string,
    deck_id: string,
    name: string,
    translate: string,
    description: string,
    rank: string,
    count: number,

}

interface FortuneCanvasProps {
    verified?: boolean;
}

interface MessageProps {
    text: string,
    type: 'success' | 'error' | 'info'
}

const Fortune: React.FC<FortuneCanvasProps> = ({verified = false}) => {
    const [decksData, setDecksData] = useState<DecksData[]>([]);
    const [isChooseDeckForm, setIsChooseDeckForm] = useState<boolean>(false);
    const [choosenDeckId, setChoosenDeckId] = useState<string | null>(null);
    const [choosenDeck, setChoosenDeck] = useState<string | null>(null);

    const [mustStartSpinning, setMustStartSpinning] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState<number>(0);

    const [slotData, setSlotData] = useState<WordData[]>([])
    const [data, setData] = useState<WheelData[]>([
        {option: "choose deck", style: {
            backgroundColor: "#ffffff", textColor: "Black"
        }},
        {option: "choose deck", style: {
            backgroundColor: "#ffffff", textColor: "Black"
        }}
    ])
    
    const [message, setMessage] = useState<MessageProps | null>(null);
    const [wonWord, setWonWord] = useState<string | null>(null);
    // const [translatedWord, setTranslatedWord] = useState<string | null>(null)

    const fetchDecks = async () => {
        try {
            const response = await api.get("/decks/my-all")
            logger.info(response.data);
            setDecksData(response.data);
        } catch (error: any) {
            if (error.response) {
                logger.error('Server error: ', error.response);
            } else {
                logger.error('Network error and other: ', error);
            }
        }
    }

    const fillSlots = async () => {
        try {
            const response = await api.get(`/words/all/${choosenDeckId}`);
            logger.info(response.data);
            setSlotData(response.data);
            setIsChooseDeckForm(false);
            const selectedDeck = decksData.find(deck => deck.id === choosenDeckId);
            setChoosenDeck(selectedDeck?.name ?? null)
        } catch (error: any) {
            if (error.response) {
                setMessage({text: "It seems there are no one word in the deck yet...", type: "error"})
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
                logger.error("Server error: ", error.response);
            } else {
                logger.error("Network or other erorr: ", error)
            }
        }
    }

    const handleSpinClick = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        logger.info(`The word you got: ${data[newPrizeNumber].option}`);
        setPrizeNumber(newPrizeNumber);
        setMustStartSpinning(true);
    };

    const onStopSpinning = () => {
        setMustStartSpinning(false);
        setMessage({text: `Вы выиграли: ${data[prizeNumber].option}`, type: "success"});
        setWonWord(data[prizeNumber].option)
        setTimeout(() => setMessage(null), 3000)
    };

    const checkTranslate = (e: React.FormEvent ) => {
        e.preventDefault();
        try {
            if (wonWord) {
                setMessage({text: "Successfully result", type: "success"})
            } else {
                setMessage({text: "Mistake!", type: "success"})
            }
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (erorr: any) {
            logger.error("Some error type was occured(((.");
        }
    }

    useEffect(() => {
        fetchDecks();
    }, [])

    useEffect(() => {
        fillSlots();
    }, [choosenDeckId])

    useEffect(() => {
        if (slotData.length > 0) {
            setData(
                slotData.map((value, i: number) => ({
                    option: value.name,
                    style: {
                        backgroundColor: `hsl(${(360 / slotData.length) * i}, 100%, 67%)`,
                        textColor: "black"
                    }
                }))
            );
        }
    }, [slotData]);

    return verified ? ( 
            <main className={styles.main}>
                <div className={styles.fortuneBlock}>
                    <Wheel 
                        mustStartSpinning={ mustStartSpinning }
                        onStopSpinning={onStopSpinning}
                        prizeNumber={prizeNumber }
                        data={data}
                        backgroundColors={['#3e3e3e', '#df3428']}
                        textColors={['#ffffff']}
                    />
                    <span>
                        Choosen deck:  {choosenDeck ?? "No deck selected"}
                    </span>
                    
                    <div className={styles.fortuneSettings}>
                        <Button 
                            label="Spin the wheel"
                            onClick={() => {
                                if (!mustStartSpinning) {
                                    handleSpinClick();
                                } else {
                                    alert("Wait until the wheel stops!");
                                }
                            }}
                            className={styles.spinButton}
                        />
                        <button
                            className={styles.settingsButton}
                            onClick={() => setIsChooseDeckForm(!isChooseDeckForm)}
                        >
                            <i className="bi bi-sliders2"></i>
                        </button>


                        
                        {isChooseDeckForm && 
                            <div className={styles.chooseDeckForm}>
                                <div className={styles.chooseDecksContainer}>
                                    <span style={{alignSelf: "center"}}>Your decks</span>
                                    {decksData.map((deck) => (
                                        <div key={deck.id} className={styles.chooseDeckButton} onClick={() => setChoosenDeckId(deck.id)}> {deck.name} </div>
                                    ))}
                                </div>
                            </div>
                            }
                    </div>

                </div>
                <div className={styles.wordSettings}>
                    <div className={styles.name}>
                        <h2 style={{
                            fontWeight: 400
                        }}>Exercise</h2>
                    </div>
                    { wonWord &&
                    <>
                        <span>Word: {wonWord}</span> 

                        <form onSubmit={(e) => checkTranslate(e)} className={styles.wordEx1}>
                            <Input 
                                label={`Write an translation of word - ${wonWord}`}
                                id="translate-field"
                                type="text"
                            />
                        </form>
                    </>
                    
                    }  

                </div>
                { message &&
                <Message text={message.text} type={message.type}/>
                }   
            </main>

        ) : <main className={styles.emptyMain}>
            <h2 style={{fontWeight: 400}} >Please login <Link to="/login" className={styles.link}> sign in...</Link>
            </h2>
        </main>;
}

export default Fortune;