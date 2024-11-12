import { Pokemon } from '../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { findMaxPower } from '../../common/utils/findMaxValue';

jest.mock('../../common/utils/calculatePokemonPower', () => ({
  calculatePokemonPower: jest.fn(),
}));

describe('Test findMaxPower function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return -Infinity for an empty pokemon list', () => {
    const result = findMaxPower([]);
    expect(result).toBe(-Infinity);
    expect(calculatePokemonPower).not.toHaveBeenCalled();
  });

  it('Should return the power value for a single pokemon', () => {
    const singlePokemon: Pokemon = {
      id: 1,
      type: ['Poison'],
      name: 'Bulbasaur',
      attack: 49,
      defense: 49,
      hp: 45,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    };

    (calculatePokemonPower as jest.Mock).mockReturnValue(318);

    const result = findMaxPower([singlePokemon]);

    expect(result).toBe(318);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(1);
    expect(calculatePokemonPower).toHaveBeenCalledWith(singlePokemon);
  });

  it('Should find the maximum power among multiple pokemon', () => {
    const pokemonList: Pokemon[] = [
      {
        id: 1,
        type: ['Poison'],
        name: 'Bulbasaur',
        attack: 49,
        defense: 49,
        hp: 45,
        special_attack: 65,
        special_defense: 65,
        speed: 45,
      },
      {
        id: 6,
        type: ['Fire'],
        name: 'Charizard',
        attack: 84,
        defense: 78,
        hp: 78,
        special_attack: 109,
        special_defense: 85,
        speed: 100,
      },
      {
        id: 25,
        name: 'Pikachu',
        type: ['Electric'],
        attack: 55,
        defense: 40,
        hp: 35,
        special_attack: 50,
        special_defense: 50,
        speed: 90,
      },
    ];

    (calculatePokemonPower as jest.Mock)
      .mockReturnValueOnce(318) 
      .mockReturnValueOnce(534) 
      .mockReturnValueOnce(320);

    const result = findMaxPower(pokemonList);

    expect(result).toBe(534);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(3);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(1, pokemonList[0]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(2, pokemonList[1]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(3, pokemonList[2]);
  });

  it('Should handle pokemon with equal powers', () => {
    const pokemonList: Pokemon[] = [
      {
        id: 1,
        name: 'Bulbasaur',
        type: ['Poison'],
        attack: 49,
        defense: 49,
        hp: 45,
        special_attack: 65,
        special_defense: 65,
        speed: 45,
      },
      {
        id: 2,
        name: 'Ivysaur',
        type: ['Poison'],
        attack: 62,
        defense: 63,
        hp: 60,
        special_attack: 80,
        special_defense: 80,
        speed: 60,
      },
    ];

    (calculatePokemonPower as jest.Mock).mockReturnValue(405);

    const result = findMaxPower(pokemonList);

    expect(result).toBe(405);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(2);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(1, pokemonList[0]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(2, pokemonList[1]);
  });

  it('Should handle negative power values', () => {
    const pokemonList: Pokemon[] = [
      {
        id: 1,
        name: 'WeakPokemon',
        type: ['Poison'],
        attack: 10,
        defense: 10,
        hp: 10,
        special_attack: 10,
        special_defense: 10,
        speed: 10,
      },
    ];

    (calculatePokemonPower as jest.Mock).mockReturnValue(-50);

    const result = findMaxPower(pokemonList);

    expect(result).toBe(-50);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(1);
    expect(calculatePokemonPower).toHaveBeenCalledWith(pokemonList[0]);
  });
});
