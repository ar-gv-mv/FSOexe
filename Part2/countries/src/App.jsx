import {useEffect, useState} from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'

const CountryInfo = ({country, weather}) => {
  const languages = country.languages ? Object.values(country.languages) : []
  console.log(country.capital?.[0])
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital?.[0]}</div>
      <div>area {country.area}</div>
      <h3>Languages:</h3>
      <ul>
        {languages.map(l => <li key={l}>{l}</li>)}
      </ul>
      <img
        src={country.flags?.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />
      {weather && (
        <>
          <h3>Weather in {country.capital?.[0]}</h3>
          <div>temperature {weather.main?.temp}°C</div>
          {weather.weather?.[0]?.icon && (
            <img
              alt="weather icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            />
          )}
          <div>wind {weather.wind?.speed}m/s</div>
        </>
      )}
    </div>
  )
}

const CountriesList = ({countries, onShow}) => (
  <div>
    {countries.map(m => (
      <div key={m.cca3}>
        {m.name.common}
        <button onClick={() => onShow(m.name.common)}>
          show
        </button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [searching, setSearching] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService.getAll().then(setAllCountries)
  }, [])

  const updS = searching.trim().toLowerCase()

  const matches = !updS ? [] : allCountries.filter(c =>
    c.name.common.toLowerCase().includes(updS)
  )

  const oneC = matches.length === 1 ? matches[0] : null

  useEffect(() => {
    setWeather(null)
    if (!oneC) return
    const coor = oneC.capitalInfo?.latlng
    if (!coor || coor.length < 2) return
    weatherService
      .getWeather(coor[0], coor[1])
      .then(setWeather)
      .catch(err => console.log('weather error', err.response?.data || err.message))
  }, [oneC])

  const onShow = (name) => setSearching(name)
  return (
    <div>
      find countries
      <input value={searching} onChange={e => setSearching(e.target.value)} />
      {searching.trim() === '' ? null : matches.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : matches.length > 1 ? (
        <CountriesList countries={matches} onShow={onShow} />
      ) : oneC ? (
        <CountryInfo country={oneC} weather={weather} />
      ) : (
        <div>No matches</div>
      )}
    </div>
  )
}

export default App