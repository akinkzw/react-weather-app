import { useState, useEffect, useRef } from "react";
import Title from "./components/Title.jsx";
import Form from "./components/Form.jsx";
import Results from "./components/Results.jsx";
import Loading from "./components/Loading.jsx";
import { getWeatherInfo } from "./utils/weatherCode.js";
import './App.css';

const GEO_URL      = "https://geocoding-api.open-meteo.com/v1/search";
const GSI_URL      = "/api/gsi";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const isJapanese = (str) => /[　-鿿]/.test(str);

const normalizeGsi = (features) =>
  features.slice(0, 5).map((f, i) => ({
    id: `${f.properties.addressCode || 'gsi'}-${i}`,
    name: f.properties.title,
    admin1: null,
    country: "日本",
    latitude:  f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
  }));

const normalizeOpenMeteo = (results) =>
  (results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1 ?? null,
    country: r.country ?? "",
    latitude:  r.latitude,
    longitude: r.longitude,
  }));

async function geocode(query) {
  if (isJapanese(query)) {
    const res = await fetch(`${GSI_URL}?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return normalizeGsi(data);
  } else {
    const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&language=ja&count=5`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return normalizeOpenMeteo(data.results);
  }
}

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
        const locs = await geocode(query);
        setSuggestions(locs);
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
      setResults({ cityName: name, country, temperature: data.current.temperature_2m, conditionText: label, icon: emoji });
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
      const locs = await geocode(query);
      const loc = locs[0];
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
