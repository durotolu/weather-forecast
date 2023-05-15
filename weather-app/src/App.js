import './App.css';
import React, { useEffect, useState } from 'react';
import { Box, Flex, useToast, useMediaQuery, Heading } from '@chakra-ui/react';
import { City }  from 'country-state-city';
import Forecast  from './components/Forecast';
import CurrentWeather  from './components/CurrentWeather';
import Search  from './components/Search';

const baseUrl = 'https://api.openweathermap.org/data/2.5/'

function App() {
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [cities] = useState(City.getAllCities());
  const [city, setCity] = useState({});
  const [weather, setWeather] = useState({ current: {}, forecast: [] });
  const [unit, setUnit] = useState('metric');
  const toast = useToast();
  const [isLargerThan650] = useMediaQuery('(min-width: 650px)');

  const handleSearch = (e) => {
    const filteredCities = cities.filter(city => city.name.toLowerCase().includes(e.target.value.toLowerCase()));
    if (filteredCities?.length < 50) setAutocompleteCities(filteredCities)
    else setAutocompleteCities([]);
  }

  const handleUnitChange = () => {
    if (unit === 'imperial') setUnit('metric')
    else setUnit('imperial');
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        description: "Geolocation is not supported by your browser.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setCity({ latitude: position.coords.latitude, longitude: position.coords.longitude
        });
      }, () => {
        toast({
          description: "Unable to retrieve your location.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    };
  };

  useEffect(() => getLocation(), [])

  useEffect(() => {
    if (!Object.keys(city)?.length) return
    const getWeather = async () => {
      const suffixUrl = `&lon=${city.longitude}&appid=${process.env.REACT_APP_WEATHER_ID}&units=${unit}`
      const currentResponse = await fetch(`${baseUrl}weather?lat=${city.latitude}${suffixUrl}`);
      const forecastResponse = await fetch(`${baseUrl}forecast?lat=${city.latitude}${suffixUrl}`);
      if (currentResponse.status !== 200 || forecastResponse.status !== 200) {
        toast({
          description: "Unable to retrieve data.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setAutocompleteCities([])
        return
      }
      const current = await currentResponse.json();
      const forecast = await forecastResponse.json();
      setWeather({ current, forecast: forecast.list })
      setAutocompleteCities([])
    };
    getWeather();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, city.latitude, city.longitude]);

  return (
    <Flex borderRadius='lg' textAlign={'center'} p={6} flexDir={isLargerThan650 ? 'row' : 'column'}>
      <Box flex='1' height={'100vh'} position={'relative'} mr={isLargerThan650 && '16'}>
        <Search
          handleSearch={handleSearch}
          handleUnitChange={handleUnitChange}
          unit={unit}
          autocompleteCities={autocompleteCities}
          getLocation={getLocation}
          setCity={setCity}
         />
         {!Object.keys(weather.current)?.length ? <Heading>Search for City here</Heading> : <CurrentWeather weather={weather} unit={unit} />}
      </Box>
      <Forecast weather={weather} unit={unit}  />
    </Flex>
  );
}

export default App;
