import React from "react";
import styles from "../styles/MainContent.module.css"
const MainContent: React.FC = () => {

    return(
        <main className={styles.main}>
            <div className={styles.mainContent}>
                <article className={styles.article}>
                    <h2 style={{ alignSelf: "center", marginBottom: "35px" }}>
                        About Englight, web app for learning English!
                    </h2>
                    <p>Welcome to Englight — a modern app for those who want to learn English and strive for self-development.</p>
                    <p>We created a platform that makes learning simple, flexible, and truly effective.</p>
                    <p>
                        The main feature of Englight is the vocabulary system (Vocabulary). You can create your own decks, add new words while learning English on the internet, and don’t worry about repetitions — the smart system will take care of that. Every word is under control, always at hand.
                    </p>
                    <p>
                        Englight is not just vocabulary. You will dive into grammar, learn to apply words in practice, and improve your language comprehension with trainers, exercises, and tests. Everything you need for growth is collected in one place.
                    </p>
                    <p>
                        Study whenever and however you want. Englight adapts to your rhythm, allowing you to learn at a comfortable pace. No unnecessary distractions — just useful content and thoughtful functionality.
                    </p>
                    <p>
                        Englight is your path to fluent English, which you build yourself. Start today and take the first step to knowledge that will open new opportunities for you.
                    </p>
                </article>
            </div>
            <div className={styles.mainContent}>
                <article className={styles.article}>
                    <h2 style={{ alignSelf: "center", marginBottom: "35px" }}>
                        О Englight, приложении для изучения английского языка!
                    </h2>
                    <p>Добро пожаловать в Englight — современное приложение для тех, кто хочет выучить английский язык и стремится к саморазвитию.</p>
                    <p>Мы создали платформу, которая делает обучение простым, гибким и действительно эффективным.</p>
                    <p>
                        Главная особенность Englight — система работы со словарным запасом (Vocabulary). Ты можешь создавать собственные колоды слов, добавлять новые слова прямо во время изучения языка в интернете и не переживать о повторениях — умная система позаботится об этом. Каждое слово — под контролем, всегда под рукой.
                    </p>
                    <p>
                        Englight — это не только лексика. Ты углубишься в грамматику, научишься применять слова на практике и прокачаешь понимание языка с помощью тренажёров, упражнений и тестов. Всё, что нужно для роста, собрано в одном месте.
                    </p>
                    <p>
                        Занимайся тогда, когда удобно, и так, как удобно. Englight подстраивается под твой ритм, позволяя учиться в комфортном темпе. Никаких лишних отвлечений — только полезный контент и продуманный функционал.
                    </p>
                    <p>
                        Englight — это путь к свободному владению английским, который ты строишь сам. Начни уже сегодня и сделай первый шаг к знаниям, которые откроют перед тобой новые возможности.
                    </p>
                </article>
            </div>
        </main>
    )
}

export default MainContent;