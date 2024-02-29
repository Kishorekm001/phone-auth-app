import "./App.css";
import Signup from "./views/Signup";
import { Routes, Route } from "react-router-dom";
import Sucess from "./views/Sucess";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<Signup />} />
        <Route path="/success" element={<Sucess />} />
      </Routes>
    </div>
  );
}

export default App;
