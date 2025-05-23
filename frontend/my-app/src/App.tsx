import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import FortunePage from "./pages/FortunePage";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/me" element={<MyProfilePage />} />
          <Route path="/fortune" element={<FortunePage />} />
        </Routes>
      </Router>
    </>
  )

  
}

export default App;