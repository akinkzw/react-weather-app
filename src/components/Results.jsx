const Results = ({results}) => {
  const {cityName, country, temperature, conditionText, icon} = results;
  return (
    <>
      {cityName && <div className="results-city">{cityName}</div>}
      {country && <div className="results-country">{country}</div>}
      {temperature !== "" && (
        <div className="results-temp">{temperature}<span>℃</span></div>
      )}
      {conditionText && (
        <div className="results-condition">
          <span className="weather-emoji">{icon}</span>
          <span>{conditionText}</span>
        </div>
      )}
    </>
  );
};

export default Results;
