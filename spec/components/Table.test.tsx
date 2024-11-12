import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { Table, TableProps } from '../../components/Table/Table';
import '../setupTests';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../common/utils/calculatePokemonPower');

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
(calculatePokemonPower as jest.Mock).mockReturnValue(100);

describe('Test Table Component', () => {
  const tableProps: TableProps = {
    pokemonList: [
      {
        id: 1,
        name: 'Bulbasaur',
        type: ['Grass', 'Poison'],
        hp: 45,
        attack: 49,
        defense: 55,
        special_attack: 65,
        special_defense: 61,
        speed: 41,
      },
      {
        id: 2,
        name: 'Charmander',
        type: ['Fire'],
        hp: 39,
        attack: 52,
        defense: 43,
        special_attack: 60,
        special_defense: 50,
        speed: 66,
      },
    ],
  };

  const setupComponent = () => render(<Table {...tableProps} />);

  it('Renders correctly and matches the snapshot', () => {
    const { asFragment } = setupComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders the table headers correctly', () => {
    setupComponent();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Power')).toBeInTheDocument();
  });

  it('Renders each Pokemon row with correct data', () => {
    setupComponent();

    tableProps.pokemonList.forEach((pokemon) => {
      expect(screen.getByText(pokemon.id)).toBeInTheDocument();
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
      expect(screen.getByText(pokemon.type.join(', '))).toBeInTheDocument();
      expect(screen.getByText(pokemon.hp)).toBeInTheDocument();
      expect(screen.getByText(pokemon.speed)).toBeInTheDocument();
      expect(screen.getByText(pokemon.attack)).toBeInTheDocument();
      expect(screen.getByText(pokemon.special_attack)).toBeInTheDocument();
      expect(screen.getByText(pokemon.defense)).toBeInTheDocument();
      expect(screen.getByText(pokemon.special_defense)).toBeInTheDocument();
    });
  });

  it('Calculates and displays the Pokemon power for each row', () => {
    setupComponent();

    expect(calculatePokemonPower).toHaveBeenCalledWith({
      attack: tableProps.pokemonList[0].attack,
      defense: tableProps.pokemonList[0].defense,
      hp: tableProps.pokemonList[0].hp,
      special_attack: tableProps.pokemonList[0].special_attack,
      special_defense: tableProps.pokemonList[0].special_defense,
      speed: tableProps.pokemonList[0].speed,
    });
    expect(screen.getAllByText('100')).toHaveLength(
      tableProps.pokemonList.length
    );
  });

  it('Navigates to the correct detail page when a row is clicked', () => {
    setupComponent();

    const firstRow = screen
      .getByText(tableProps.pokemonList[0].name)
      .closest('tr');

    fireEvent.click(firstRow!);

    expect(mockPush).toHaveBeenCalledWith(
      `/pokemon/${tableProps.pokemonList[0].id}`
    );
  });
});
