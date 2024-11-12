import { Pokemon } from '../interfaces/pokemon';
import { calculatePokemonPower } from './calculatePokemonPower';

export const findMinPower = (pokemonList: Pokemon[]): number =>
  pokemonList.reduce((minPower, currentPokemon) => {
    const currentPower = calculatePokemonPower(currentPokemon);

    return currentPower < minPower ? currentPower : minPower;
  }, Infinity);
