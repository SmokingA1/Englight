// import React, { useEffect, useRef, useState} from "react";
// import styles from "../styles/Fortune.module.css"
// import Button from "./Button";

// const FortuneCanvas: React.FC = () => {
//     const canvasEl = useRef<HTMLCanvasElement | null>(null);
//     const [segments, setSegments] = useState<string[]>([]);
//     const [angle, setAngle] = useState(0);
//     setSegments(["🍇", "🍈", "🍉", "🍊", "🍌"]);
//     // const spinWheel = () => {
//     //     const winnerIndex = Math.floor(Math.random() * segments.length)
//     //     const radiusSpin = 3 * 360 +(winnerIndex * (360 / segments.length)); // 3full cricle and certain agnel to sector
//     //     setAngle((prev) => prev + radiusSpin);
//     //     console.log(winnerIndex);
//     //     console.log(winnerIndex * (360 / segments.length))
        
//     //     console.log(radiusSpin);
//     //     console.log(segments.length)


//     // }

//     const spinWheel = () => {
//         const winnerIndex = Math.floor(Math.random() * segments.length);

//         const segmentAngle = 360 / segments.length;
//         const randomOffset = Math.random() * segmentAngle; // чуть-чуть случайности для анимации

//         // Чтобы выбранный сектор оказался ровно вверх (под стрелкой)
//         const targetAngle = 360 * 5 + (winnerIndex * segmentAngle) + randomOffset;

//         setAngle(targetAngle);

//         console.log("Winner:", segments[winnerIndex]);
//     };



//     useEffect(() => {
//         const canvas = canvasEl.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         const size = 500;
//         canvas.width = size;
//         canvas.height = size;
        
//         const center = size / 2;
//         const radius = size / 2 - 10;


//         const segmentsOut = segments;
//         const angle = (2 * Math.PI) / segments.length;

//         segments.forEach((emoji, i) => {
//             const start = i * angle;
//             const end = start + angle;


//             //Sector
//             ctx.beginPath();
//             ctx.moveTo(center, center);
//             ctx.arc(center, center, radius, start, end);
//             if (segmentsOut.length % 2 === 1 ) {
//                 ctx.fillStyle = i % 3 == 2? "#f8b400" : i % 3 === 0? "#a7f243" : "#f85f73"
//             } else {
//                 ctx.fillStyle = i % 2 === 0? "#a7f243" : "#f85f73"
//             }
//             ctx.fill();
//             ctx.closePath();

//             //Text
//             ctx.save();
//             ctx.translate(center, center);
//             ctx.rotate(start + angle / 2)
//             ctx.textAlign  = "right";
//             ctx.font = "40px sans-serif";
//             ctx.fillStyle = "#fff";
//             ctx.fillText(emoji, radius - 20, 15);
//             ctx.restore();

//         });
//     }, [])

//     return(
//         <main className={styles.main}>
//             <div className={styles.fortuneBlock}>
//                 <div
//                     style={{
//                                 transform: `rotate(${angle}deg)`,
//                                 transition: 'transform 2s ease-out'
//                             }}
//                 >
//                     <canvas  ref={canvasEl}
                        
                    
//                     ></canvas>
//                 </div>
                
//                 <div className={styles.fortuneSettings}>
//                     <Button 
//                         label="Spin the wheel"
//                         className={styles.spinButton}
//                         onClick={() => spinWheel()}
//                     />
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default FortuneCanvas;