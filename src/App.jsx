import { useState, useEffect, useRef } from "react";
import Title from "./components/Title.jsx";
import Form from "./components/Form.jsx";
import Results from "./components/Results.jsx";
import Loading from "./components/Loading.jsx";
import { getWeatherInfo } from "./utils/weatherCode.js";
import './App.css';

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: "",
  });
  const debounceTimer = useRef(null);

  useEffect(() => {
    const query = city.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&language=ja&count=5`);
        const data = await res.json();
        setSuggestions(data.results ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [city]);

  const fetchWeather = async (lat, lon, name, country) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const { label, emoji } = getWeatherInfo(data.current.weather_code);
      setResults({
        cityName: name,
        country,
        temperature: data.current.temperature_2m,
        conditionText: label,
        icon: emoji,
      });
      setCity("");
    } catch {
      alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location) => {
    setSuggestions([]);
    fetchWeather(location.latitude, location.longitude, location.name, location.country);
  };

  const getWeather = async (e) => {
    e.preventDefault();
    const query = city.trim();
    if (!query) return;
    setSuggestions([]);
    try {
      const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&language=ja&count=1`);
      const data = await res.json();
      const loc = data.results?.[0];
      if (!loc) { alert("都市が見つかりませんでした。"); return; }
      fetchWeather(loc.latitude, loc.longitude, loc.name, loc.country);
    } catch {
      alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。");
    }
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
          onDismiss={() => setSuggestions([])}
        />
        {loading ? <Loading /> : <Results results={results}/>}
      </div>
    </div>
  );
}

export default App;
