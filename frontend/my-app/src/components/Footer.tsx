import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css"

const Footer: React.FC = () => {

    return(
        <footer className={styles.footer}>
            <div className={styles.footEl}>
                <h2>Useful links</h2>
                <Link to="/#" className={styles.link}>About</Link>
                <Link to="/#" className={styles.link}>Support</Link>
                <Link to="/#" className={styles.link}>Contact</Link>
                <Link to="/#" className={styles.link}>Social networks</Link>
            </div>
            <div className={styles.footEl}>
                <h2>Feature</h2>
            </div>
            <div className={styles.footEl} style={{alignItems: "start"}}>
                <h2>Contact me</h2>
                <span className={styles.contact}>Initial: Fadin Denis</span>
                <span className={styles.contact}>Email: smokinga1wm@gmail.com</span>
                <span className={styles.contact}>Telegram: @smokingA1</span>
                <span className={styles.contact}>Mobile phone: +380661360680</span>
            </div>
        </footer>
    )
}

export default Footer;