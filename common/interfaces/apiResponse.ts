import { Pokemon } from './pokemon';

export interface SearchResponse {
  pokemonList: Pokemon[];
  count: number;
  min: number;
  max: number;
}
