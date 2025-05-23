import React, {useEffect, useState} from "react";
import styles from "../styles/Fortune.module.css"
import api from "../api";
import {Wheel} from "react-custom-roulette";
import type { ImageProps, StyleType } from "react-custom-roulette/dist/components/Wheel/types";
import { logger } from "./utils/logger";
import { Link } from "react-router-dom";
import Button from "./Button";

interface WheelData {
    option?: string;
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

interface FortuneCanvasProps {
    verified?: boolean;
}

const FortuneCanvasModule: React.FC<FortuneCanvasProps> = ({verified = false}) => {
    const [decksData, setDecksData] = useState<DecksData[]>([]);
    const [isSettingsForm, setIsSettingsForm] = useState<boolean>(false);
    const [mustStartSpinning, setMustStartSpinning] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [slotData, setSlotData] = useState<string[]>(['suck dick', 'cowstyle', 'horserider', 'dogstyle', 'misionerka', '69', "scissors", ])
    const [data, setData] = useState<WheelData[]>(
        slotData.map((value, i:number) =>
            {return {
                option: value,
                
                style: {
                    backgroundColor: `hsl(${(360 / slotData.length) * i}, 100%, 67%)`,
                    // backgroundColor: colorsBg.get(i % colorsBg.size),
                    textColor: "black"}
                };
            })
    )
    // const [wordExercise, setWordExercise] = useState("");

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

    const handleSpinClick = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        logger.info(`Вы выиграли: ${data[prizeNumber].option}`);
        
        setMustStartSpinning(true);
    };

    const onStopSpinning = () => {
        setMustStartSpinning(false);
        alert(`Вы выиграли: ${data[prizeNumber].option}`);
    };

    useEffect(() => {
        fetchDecks();
    }, [])

    return verified ? ( 
            <main className={styles.main}>
                <div className={styles.fortuneBlock}>
                    <Wheel 
                        mustStartSpinning={mustStartSpinning}
                        onStopSpinning={onStopSpinning}
                        prizeNumber={prizeNumber }
                        data={data}
                        backgroundColors={['#3e3e3e', '#df3428']}
                        textColors={['#ffffff']}
                    />
                    <div className={styles.fortuneSettings}>
                        <Button 
                            label="Spin the wheel"
                            onClick={handleSpinClick}
                            className={styles.spinButton}
                        />
                        <button
                            className={styles.settingsButton}
                            onClick={() => setIsSettingsForm(!isSettingsForm)}
                        >
                            <i className="bi bi-sliders2"></i>
                        </button>
                        {
                            isSettingsForm && 
                                <div className={styles.settingsForm}>
                                    <button>changesmth</button>
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
                    <div >

                    </div>

                </div>
            </main>

        
    ) : <main className={styles.emptyMain}>
        <h2 style={{fontWeight: 400}} >Please login <Link to="/login" className={styles.link}> sign in...</Link>
        </h2>
    </main>;
}

export default FortuneCanvasModule;

    // {
    //     "0": "green",
    //     "1": "yellow",
    //     "2": "red",
    //     "3": "pink",
    //     "4": 'blue',
    //     "5": 'violet',
    // }

        // const [data, setData] = useState<WheelData[]>([
    //     {option: 'hello', style: {backgroundColor: 'green', textColor: 'black'}},

    //     {option: 'goodbye', style: {backgroundColor: 'white', textColor: 'black'}},

    //     {option: 'bear', style: {backgroundColor: "red", textColor: "black"}}
    // ])