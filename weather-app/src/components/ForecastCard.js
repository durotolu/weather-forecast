import React from 'react';
import { Box, Badge } from '@chakra-ui/react';

function ForecastCard({ forecast, unit }) {
  const {dt_txt, main: { temp, humidity }, wind: { speed }, weather } = forecast

  return (
    <Box p='3' borderX={'1px'} borderRadius={'20px'}>
      <Box color='gray.500' fontSize='xs'>
        {dt_txt.substring(5, 16)}
      </Box>
      <Badge fontSize='xs' colorScheme={'teal'}>
        {humidity}% humidity
      </Badge>
      <Badge borderRadius='full' px='2' colorScheme={'red' }>
        {temp}°{unit === 'metric' ? 'C' : 'F'}
      </Badge>
      <Box fontSize='xs'>
        {speed} wind
      </Box>
      <Box fontSize='xs'>
        {weather[0].description}
      </Box>
    </Box>
  );
}

export default ForecastCard;
