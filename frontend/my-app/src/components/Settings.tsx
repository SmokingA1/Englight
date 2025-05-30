import React from "react";
import styles from "../styles/Settings.module.css";

const Settings: React.FC = () => {



    return(
        <div className={styles.settingsPage}>
            <aside className={styles.aside}>
                <h2>Settings</h2>   
                <ul className={styles.ul}>
                    <li className={styles.li}><i className="bi bi-person"></i> Public data</li>   
                    <li className={styles.li}><i className="bi bi-gear"></i> Account</li>   
                    <li className={styles.li}><i className="bi bi-question-circle"></i> Supporrt</li>    
                    <li className={styles.li}><i className="bi bi-arrow-bar-right"></i> Sign out</li>    
                </ul> 
            </aside>

            <main className={styles.main}>


            </main>
        </div>
        
    )
}

export default Settings;