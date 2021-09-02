//Form.js


const Form = ({setCity, getWeather}) => {
  return (
    <form>
      <input type="text" name="city" placeholder="Name of City" onChange={e => setCity(e.target.value)}/>
      <button type="submit" onClick={getWeather}>Get Weather</button>
    </form>
  );
};

export default Form;