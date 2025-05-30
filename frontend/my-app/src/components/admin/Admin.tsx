import React, { useState} from 'react';
import styles from "../../styles/Admin.module.css"
import UsersTable from './UsersTable';
import DecksTable from './DecksTable';
import WordsTable from './WordsTable';


const Admin: React.FC = () => {
    const [activeLayout, setActiveLayout] = useState<"users" | "decks" | "words" | null>(null);

    return (
        <div className={styles.adminPage}>
            <aside className={styles.aside}>
                <h2 style={{fontWeight: "400"}}>Englight</h2>
                <h2 style={{fontWeight: "400"}}>Admin panel</h2>
                <button 
                    className={`${styles.button} ${activeLayout === "users" ? styles.active : ""}`}
                    onClick={() => setActiveLayout("users")}>Users</button>
                <button 
                    className={`${styles.button} ${activeLayout === "decks" ? styles.active : ""}`}
                    onClick={() => setActiveLayout("decks")}>Decks</button>
                <button 
                    className={`${styles.button} ${activeLayout === "words" ? styles.active : ""}`}
                    onClick={() => setActiveLayout("words")}>Words</button>
            </aside>
            <main className={styles.main}>
                {activeLayout === "users" && <UsersTable />}
                {activeLayout === "decks" && <DecksTable />}
                {activeLayout === "words" && <WordsTable />}
            </main>
        </div>
    );
}

export default Admin;