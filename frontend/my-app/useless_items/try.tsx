// import React, { useEffect, useState } from "react";
// import styles from "../styles/CardMenu.module.css"
// const DeckMenu: React.FC = () => {
//     const [decks, setDecks] = useState<string[]>([]);
//     const [rotation, setRotation] = useState<number>(0);
//     const total = decks.length;

//     const rotateLeft = () => {
//         setRotation( prev => prev - 360 / decks.length);

//     }

//     const rotateRight = () => {
//         setRotation( prev => prev + 360 / decks.length);
        
//     }

//     useEffect(() => {
//         setDecks(['HELLO', 'BYE', 'Sweet', 'Meat']);
//     }, [])

//     return(
//         <main className={styles.main}>
//             <div className={styles.deckMenu}>
//                 <div className={styles.circle}
//                         style={{ transform: `rotateY(${rotation}deg)` }}
//                 >
//                     { decks.length > 1 ? 
//                         (decks.map((deck, i) => {
//                             const angle = (i / decks.length) * 360;
//                             return (
//                                 <div
//                                     key={i}
//                                     className={styles.deck}
//                                     style={{
//                                         transform: `rotateY(${angle}deg) translateZ(300px)`
//                                     }}
//                                 >
//                                     {deck}
//                                 </div>
//                             );
//                         })
//                         ) : (
//                         <h2></h2>)
//                     }




//                 </div>
//             </div>
//             <div className={styles.deckSettings}>
//                 <div className={styles.controls}>
//                     <button onClick={rotateLeft}>⬅️</button>
//                     <button onClick={rotateRight}>➡️</button>
//                 </div>
//             </div>
//         </main>

//     )
// }

// export default DeckMenu;
