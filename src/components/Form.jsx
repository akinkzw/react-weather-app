import { useRef, useEffect } from "react";

const Form = ({ city, setCity, getWeather, suggestions, onSelect }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onSelect(city);
      }
    };
    if (suggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [suggestions, city, onSelect]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onSelect(city);
    }
  };

  return (
    <form onSubmit={getWeather} className="search-form">
      <div className="autocomplete-wrapper" ref={wrapperRef}>
        <input
          type="text"
          name="city"
          placeholder="都市名を入力"
          onChange={e => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          value={city}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.id} onMouseDown={() => onSelect(s.name)}>
                {s.name}
                <span className="suggestion-region">{s.region && `${s.region}, `}{s.country}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit">天気を見る</button>
    </form>
  );
};

export default Form;
