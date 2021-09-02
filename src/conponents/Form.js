//Form.js


const Form = ({setCity, getWeather}) => {
  return (
    <form onSubmit={getWeather}>
      <input type="text" name="city" placeholder="Name of City" onChange={e => setCity(e.target.value)}/>
      <button type="submit">Get Weather</button>
    </form>
  );
};

export default Form;