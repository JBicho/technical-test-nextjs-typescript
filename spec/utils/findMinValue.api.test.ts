import { Pokemon } from '../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { findMinPower } from '../../common/utils/findMinValue';

jest.mock('../../common/utils/calculatePokemonPower', () => ({
  calculatePokemonPower: jest.fn(),
}));

describe('Test findMinPower function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return Infinity for an empty pokemon list', () => {
    const result = findMinPower([]);
    expect(result).toBe(Infinity);
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

    const result = findMinPower([singlePokemon]);

    expect(result).toBe(318);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(1);
    expect(calculatePokemonPower).toHaveBeenCalledWith(singlePokemon);
  });

  it('Should find the minimum power among multiple pokemon', () => {
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
        id: 6,
        name: 'Charizard',
        type: ['Fire'],
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

    const result = findMinPower(pokemonList);

    expect(result).toBe(318);
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

    const result = findMinPower(pokemonList);

    expect(result).toBe(405);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(2);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(1, pokemonList[0]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(2, pokemonList[1]);
  });

  it('Should handle negative power values', () => {
    const pokemonList: Pokemon[] = [
      {
        id: 1,
        name: 'StrongPokemon',
        type: ['Poison'],
        attack: 100,
        defense: 100,
        hp: 100,
        special_attack: 100,
        special_defense: 100,
        speed: 100,
      },
      {
        id: 2,
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

    (calculatePokemonPower as jest.Mock)
      .mockReturnValueOnce(500)
      .mockReturnValueOnce(-50);

    const result = findMinPower(pokemonList);

    expect(result).toBe(-50);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(2);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(1, pokemonList[0]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(2, pokemonList[1]);
  });

  it('Should find minimum when values are all positive', () => {
    const pokemonList: Pokemon[] = [
      {
        id: 1,
        name: 'Strong',
        type: ['Poison'],
        attack: 100,
        defense: 100,
        hp: 100,
        special_attack: 100,
        special_defense: 100,
        speed: 100,
      },
      {
        id: 2,
        name: 'Medium',
        type: ['Poison'],
        attack: 50,
        defense: 50,
        hp: 50,
        special_attack: 50,
        special_defense: 50,
        speed: 50,
      },
    ];

    (calculatePokemonPower as jest.Mock)
      .mockReturnValueOnce(600)
      .mockReturnValueOnce(300);

    const result = findMinPower(pokemonList);

    expect(result).toBe(300);
    expect(calculatePokemonPower).toHaveBeenCalledTimes(2);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(1, pokemonList[0]);
    expect(calculatePokemonPower).toHaveBeenNthCalledWith(2, pokemonList[1]);
  });
});
