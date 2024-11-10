import { Pokemon } from '../interfaces/pokemon';

export const calculatePokemonPower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.speed +
  pokemon.attack +
  pokemon.special_attack +
  pokemon.defense +
  pokemon.special_defense;
