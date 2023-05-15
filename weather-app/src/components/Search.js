import React from 'react';
import { Input, List, ListItem, Flex, Button, IconButton, useColorMode } from '@chakra-ui/react';
import LocatorIcon  from '../LocatorIcon';

function Search({
  handleSearch,
  handleUnitChange,
  unit,
  autocompleteCities,
  getLocation,
  setCity,
}) {
  const { colorMode } = useColorMode();
  return (
    <>
      <Flex>
        <Input maxW={'sm'} placeholder='Search city' onChange={handleSearch} />
        <Button ml={'2'} onClick={handleUnitChange}>{unit === 'metric' ? '°F' : '°C'}</Button>
        <IconButton ml={'2'} aria-label='Get location' icon={<LocatorIcon />} onClick={getLocation} />
      </Flex>
      <List
        spacing={3}
        pos={'absolute'}
        left={0}
        right={0}
        margin-left={'auto'}
        margin-right={'auto'}
        zIndex={'5'}
        maxH={'50%'}
        overflow={'scroll'}
        bg={colorMode === 'dark' ? 'gray.800' : '#fff'}>
        {autocompleteCities.map((city, index) => (
          <ListItem cursor={'pointer'} key={index} onClick={() => setCity(city)}>
            {city.name}, {city.stateCode}, {city.countryCode}
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Search;
