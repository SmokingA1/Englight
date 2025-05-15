import React from "react"
import Header from "../components/Header";
const Home: React.FC = () => {


    return(
        <div className="home-page" style={{display: "flex", justifyContent: "center"}}>
            <Header />
        </div>
    )
}

export default Home;