import { Pokemon } from '../interfaces/pokemon';
import { calculatePokemonPower } from './calculatePokemonPower';

export const findMaxPower = (pokemonList: Pokemon[]): number =>
  pokemonList.reduce((maxPower, currentPokemon) => {
    const currentPower = calculatePokemonPower(currentPokemon);

    return currentPower > maxPower ? currentPower : maxPower;
  }, -Infinity);
