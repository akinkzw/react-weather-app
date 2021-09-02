//App.js

import { useState } from "react";
import axios from "axios";
import Title from "./conponents/Title";
import Form from "./conponents/Form";
import Results from "./conponents/Results";
import './App.css';
import Loafing from "./conponents/Loading";

function App() {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [results, setResults]= useState({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });

  const getWeather = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.get(`https://api.weatherapi.com/v1/current.json?key=46e423faf40844c5bc1155606213108&q=${city}&aqi=no`)
    .then(res => {
      setResults({
        country: res.data.location.country,
        cityName: res.data.location.name,
        temperature: res.data.current.temp_c,
        conditionText: res.data.current.condition.text,
        icon:res.data.current.condition.icon
      })
      setCity("");
      setLoading(false);
    })
      .catch(err => alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。")); 
  }

  return (
    <div className = "wrapper">
      <div className = "container">
        <Title />
        <Form getWeather={getWeather} setCity={setCity} city={city}/>
        <Results results={results}/>
        {loading && <Loading/>}
      </div>
    </div>
  );
}

export default App;
