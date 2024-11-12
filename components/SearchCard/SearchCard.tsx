import { useState, useEffect, useCallback } from 'react';
import { debounce, throttle } from 'lodash';
import { Card } from '../Card/Card';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchInputContainer } from './Styles';
import { Counter } from '../Counter/Counter';

export interface SearchCardProps {
  onSearch: (name: string, powerThreshold: string) => void;
  displayCount: boolean;
  countObject: {
    count: number;
    min: number;
    max: number;
  };
}

export const SearchCard = ({
  onSearch,
  countObject,
  displayCount,
}: SearchCardProps) => {
  const [pokemonName, setPokemonName] = useState('');
  const [powerThreshold, setPowerThreshold] = useState('');
  const debouncedSearch = useCallback(
    debounce(() => onSearch(pokemonName, powerThreshold), 300),
    [pokemonName, powerThreshold]
  );
  const throttledSearch = useCallback(
    throttle(() => onSearch(pokemonName, powerThreshold), 1000),
    [pokemonName, powerThreshold]
  );

  useEffect(() => {
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [pokemonName, powerThreshold, debouncedSearch]);

  const handleNameChange = (value: string) => {
    setPokemonName(value);
    throttledSearch();
  };
  const handlePowerThresholdChange = (value: string) => {
    setPowerThreshold(value);
    throttledSearch();
  };

  return (
    <Card>
      <SearchInputContainer>
        <SearchInput
          label="Search"
          placeholder="Search a Pokemon Name"
          value={pokemonName}
          onSearch={handleNameChange}
          id="pokemon-name"
        />

        <SearchInput
          label="Power threshold"
          placeholder="Write a Power Threshold"
          value={powerThreshold}
          onSearch={handlePowerThresholdChange}
          id="pokemon-power-threshold"
        />
      </SearchInputContainer>

      {displayCount && <Counter {...countObject} />}
    </Card>
  );
};
