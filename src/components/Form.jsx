import { useRef, useEffect } from "react";

const Form = ({ city, setCity, getWeather, suggestions, onSelect, onDismiss }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onDismiss();
      }
    };
    if (suggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [suggestions, onDismiss]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onDismiss();
  };

  return (
    <form onSubmit={getWeather} className="search-form">
      <div className="autocomplete-wrapper" ref={wrapperRef}>
        <input
          type="text"
          name="city"
          placeholder="都市名（例: Tokyo, 山梨, 八王子市）"
          onChange={e => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          value={city}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.id} onMouseDown={() => onSelect(s)}>
                {s.name}
                <span className="suggestion-region">
                  {s.admin1 && `${s.admin1}, `}{s.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit">Check the weather</button>
    </form>
  );
};

export default Form;
