import './App.css';
import React, { useEffect, useState } from 'react';
import { Input, Box, List, ListItem, SimpleGrid, Flex, Button, Heading, useToast, IconButton } from '@chakra-ui/react';
import { City }  from 'country-state-city';
import ForecastCard  from './components/ForecastCard';
import CurrentWeather  from './components/CurrentWeather';

function App() {
  const [autocompleteCities, setAutocompleteCities] = useState([])
  const [cities] = useState(City.getAllCities())
  const [city, setCity] = useState({})
  const [weather, setWeather] = useState({ current: {}, forecast: [] })
  const [unit, setUnit] = useState('metric')
  const toast = useToast()

  const handleChange = (e) => {
    const filteredCities = cities.filter(city => city.name.toLowerCase().includes(e.target.value.toLowerCase()))
    if (filteredCities.length < 50) setAutocompleteCities(filteredCities)
    else setAutocompleteCities([])
  }

  const handleUnitChange = () => {
    if (unit === 'imperial') setUnit('metric')
    else setUnit('imperial')
  }

  const getWeather = async (city) => {
    if (!Object.keys(city).length) return
    const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${process.env.REACT_APP_WEATHER_ID}=${unit}`);
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${process.env.REACT_APP_WEATHER_ID}=${unit}`);
    const current = await currentResponse.json();
    const forecast = await forecastResponse.json();
    setWeather({ current, forecast: forecast.list })
    setAutocompleteCities([])
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        description: "Geolocation is not supported by your browser.",
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setCity({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }, () => {
        toast({
          description: "Unable to retrieve your location.",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      });
    }
  }

  useEffect(() => {
    getWeather(city)
  }, [unit, city])

  return (
    <Flex borderRadius='lg' textAlign={'center'} p={6}>
      <Box flex='1' height={'100vh'} position={'relative'} mr={'16'}>
        <Flex>
          <Input maxW={'sm'} placeholder='Search city' onChange={handleChange} />
          <Button ml={'2'} onClick={handleUnitChange}>{unit === 'metric' ? '°F' : '°C'}</Button>
          <IconButton ml={'2'} aria-label='Get location' icon={<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 395.71 395.71" xmlSpace="preserve">
            <g>
              <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738   c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388   C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191   c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
            </g>
          </svg>} onClick={getLocation} />
        </Flex>
        <List spacing={3} pos={'absolute'} left={0} right={0} margin-left={'auto'} margin-right={'auto'} zIndex={'5'} maxH={'50%'} overflow={'scroll'} bg={'gray.700'}>
          {autocompleteCities.map((city, index) => (
            <ListItem cursor={'pointer'} key={index} onClick={() => setCity(city)}>
              {city.name}, {city.stateCode}, {city.countryCode}
            </ListItem>
          ))}
        </List>
        {Object.keys(weather.current).length ? <CurrentWeather weather={weather} unit={unit} /> : null}
      </Box>
      <Box flex='2'>
        {weather.forecast.length ? <Heading size={'2xl'} mb={'8'}>Forecast</Heading> : null}
        <SimpleGrid minChildWidth='120px' spacing='40px'>
          {weather.forecast?.map((item, index) => (
            <ForecastCard key={index} forecast={item} unit={unit}  />
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}

export default App;
