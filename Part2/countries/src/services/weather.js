import axios from 'axios'

const getWeather = async (lat, lon) => {
    const key = import.meta.env.VITE_WEATHER_KEY
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { lat, lon, appid: key, units: 'metric' }
  })
  return res.data
}
export default { getWeather}
