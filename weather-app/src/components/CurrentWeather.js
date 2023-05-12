import React from 'react';
import { Box, Badge, Heading, Slider, VStack, SliderFilledTrack, SliderTrack, SliderThumb, SliderMark, Image, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons'

function CurrentWeather({ weather, unit }) {
  const [isLargerThan650] = useMediaQuery('(min-width: 650px)')
  
  return (
    <VStack spacing={isLargerThan650 ? 10 : 4} px='5' py='12'>
      {isLargerThan650 && <Heading size={'2xl'} mb={'8'}>Current conditions</Heading>}
      <Heading color='gray.500' size='xl'>
        {weather.current?.name}, {weather.current?.sys?.country}
      </Heading>
      <Badge fontSize='lg' mt={'500px'} colorScheme={'teal'}>
        {weather.current?.main?.humidity}% humidity
      </Badge>
        {isLargerThan650 && weather.current?.main?.temp_max !== weather.current?.main?.temp_min ?
          <Slider value={weather.current?.main?.temp} min={weather.current?.main?.temp_min} max={weather.current?.main?.temp_max}>
            <SliderMark value={weather.current?.main?.temp_min} mt='1' ml='-2.5' fontSize='sm'>
              {weather.current?.main?.temp_min}
            </SliderMark>
            <SliderMark
              value={weather.current?.main?.temp}
              textAlign='center'
              mt='-10'
              ml='-5'
              w='12'
            >
              <Badge borderRadius='full' px='2' colorScheme={'red' } fontSize='1em'>
                {weather.current?.main?.temp}°{unit === 'metric' ? 'C' : 'F'}
              </Badge>
            </SliderMark>
            <SliderMark value={weather.current?.main?.temp_max} mt='1' ml='-2.5' fontSize='sm'>
              {weather.current?.main?.temp_max}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider> : 
          <Badge borderRadius='full' px='2' colorScheme={'red' } fontSize='1em'>
            {weather.current?.main?.temp}°{unit === 'metric' ? 'C' : 'F'}
          </Badge>
        }
        <Box fontSize='lg'>
          Feels like {weather.current?.main?.feels_like}°C
        </Box>
      <Flex fontSize='lg'>
        <Image width="6" height="6" src="https://img.icons8.com/office/16/wind--v1.png" alt="wind--v1" mr={'4'} />
        <ArrowRightIcon boxSize={"3"} height="6" /> <Text mx={'2'}>{weather.current?.wind?.speed}</Text> <ArrowRightIcon boxSize={"3"} height="6" /> 
      </Flex>
      <Box textTransform={'capitalize'}>
        {weather.current?.weather?.[0]?.description}
      </Box>
    </VStack>
  );
}

export default CurrentWeather;
