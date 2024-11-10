import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';

describe('Test calculatePokemonPower util', () => {
  it('Should return the correct power number when a pokemon is passed', () => {
    const expectedResult = 318;
    const testPokemon = {
      id: 1,
      name: 'Bulbasaur',
      type: ['Grass', 'Poison'],
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    };

    expect(calculatePokemonPower(testPokemon)).toEqual(expectedResult);
  });
});
