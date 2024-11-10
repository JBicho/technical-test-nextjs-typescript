jest.mock('../../common/utils/calculatePokemonPower', () => ({
  calculatePokemonPower: jest.fn().mockReturnValue(100),
}));

import { render, screen } from '@testing-library/react';
import { Table, TableProps } from '../../components/Table/Table';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import '../setupTests';

describe('Test Table Component', () => {
  const tableProps: TableProps = {
    pokemonList: [
      {
        id: 1,
        name: 'Bulbasaur',
        type: ['Grass', 'Water'],
        hp: 45,
        attack: 49,
        defense: 48,
        special_attack: 65,
        special_defense: 67,
        speed: 46,
      },
      {
        id: 2,
        name: 'Ivysaur',
        type: ['Poison', 'Fire'],
        hp: 60,
        attack: 62,
        defense: 63,
        special_attack: 81,
        special_defense: 80,
        speed: 69,
      },
    ],
  };

  const setupComponent = () => render(<Table {...tableProps} />);

  it('Renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render the component with the correct props', () => {
    setupComponent();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Power')).toBeInTheDocument();
  });

  it('Renders data rows correctly for each Pokemon', () => {
    setupComponent();

    const rows = screen.getAllByRole('row');

    expect(rows[1]).toHaveTextContent('1');
    expect(rows[1]).toHaveTextContent('Bulbasaur');
    expect(rows[1]).toHaveTextContent('Grass, Water');
    expect(rows[1]).toHaveTextContent('45');
    expect(rows[1]).toHaveTextContent('49');
    expect(rows[1]).toHaveTextContent('48');
    expect(rows[1]).toHaveTextContent('65');
    expect(rows[1]).toHaveTextContent('67');
    expect(rows[1]).toHaveTextContent('46');
    expect(rows[1]).toHaveTextContent('100');

    expect(rows[2]).toHaveTextContent('2');
    expect(rows[2]).toHaveTextContent('Ivysaur');
    expect(rows[2]).toHaveTextContent('Poison, Fire');
    expect(rows[2]).toHaveTextContent('60');
    expect(rows[2]).toHaveTextContent('62');
    expect(rows[2]).toHaveTextContent('63');
    expect(rows[2]).toHaveTextContent('81');
    expect(rows[2]).toHaveTextContent('80');
    expect(rows[2]).toHaveTextContent('69');
    expect(rows[2]).toHaveTextContent('100');
  });

  it('Calls calculatePokemonPower for each Pokémon', () => {
    setupComponent();

    expect(calculatePokemonPower).toHaveBeenCalledWith(
      tableProps.pokemonList[0]
    );
    expect(calculatePokemonPower).toHaveBeenCalledWith(
      tableProps.pokemonList[1]
    );
  });

  test('Renders no rows when pokemonList is empty', () => {
    render(<Table pokemonList={[]} />);

    const rows = screen.queryAllByRole('row');

    expect(rows).toHaveLength(1);
  });
});
