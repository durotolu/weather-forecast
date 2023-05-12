import React from 'react';
import { Box, SimpleGrid, Heading } from '@chakra-ui/react';
import ForecastCard  from './ForecastCard';

function Forecast({ weather, unit }) {

  return (
    <Box flex='2'>
      {weather.forecast?.length ? <Heading size={'2xl'} mb={'8'}>Forecast</Heading> : null}
      <SimpleGrid minChildWidth='120px' spacing='20px'>
        {weather.forecast?.map((forecast, index) => (
          <ForecastCard key={index} forecast={forecast} unit={unit}  />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Forecast;
