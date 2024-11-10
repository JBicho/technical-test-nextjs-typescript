type Stats = {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

type PartialPokemonProperties = Pick<Pokemon, 'id' | 'name' | 'type'>;

type PokemonTableItem = PartialPokemonProperties & {
  stats: Stats;
  power: number;
};

export type { Pokemon, PokemonTableItem };
