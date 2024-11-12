import { Pokemon } from '../interfaces/pokemon';

type PartialPokemonProperties = Pick<
  Pokemon,
  'hp' | 'speed' | 'attack' | 'special_attack' | 'defense' | 'special_defense'
>;

export const calculatePokemonPower = ({
  attack,
  defense,
  hp,
  special_attack,
  special_defense,
  speed,
}: PartialPokemonProperties) =>
  hp + speed + attack + special_attack + defense + special_defense;
