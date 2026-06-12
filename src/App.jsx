import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Title from "./components/Title.jsx";
import Form from "./components/Form.jsx";
import Results from "./components/Results.jsx";
import Loading from "./components/Loading.jsx";
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });
  const debounceTimer = useRef(null);

  useEffect(() => {
    const query = city.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      axios.get("https://api.weatherapi.com/v1/search.json", {
        params: { key: import.meta.env.VITE_WEATHER_API_KEY, q: query },
      })
        .then(res => setSuggestions(res.data))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [city]);

  const handleSelect = (name) => {
    setSuggestions([]);
    fetchWeather(name);
  };

  const fetchWeather = (query) => {
    setLoading(true);
    axios.get("https://api.weatherapi.com/v1/current.json", {
      params: {
        key: import.meta.env.VITE_WEATHER_API_KEY,
        q: query,
        aqi: "no",
        lang: "ja",
      },
    })
      .then(res => {
        setResults({
          country: res.data.location.country,
          cityName: res.data.location.name,
          temperature: res.data.current.temp_c,
          conditionText: res.data.current.condition.text,
          icon: res.data.current.condition.icon,
        });
        setCity("");
      })
      .catch(() => alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。"))
      .finally(() => setLoading(false));
  };

  const getWeather = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setSuggestions([]);
    fetchWeather(city);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <Title />
        <Form
          getWeather={getWeather}
          city={city}
          setCity={setCity}
          suggestions={suggestions}
          onSelect={handleSelect}
        />
        {loading ? <Loading /> : <Results results={results}/>}
      </div>
    </div>
  );
}

export default App;
