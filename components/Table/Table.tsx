import { Pokemon } from '../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { StyledTable, TableBody, TableFooter, TableHeader } from './Styles';

export interface TableProps {
  pokemonList: Pokemon[];
}

export const Table = ({ pokemonList = [] }: TableProps) => {
  return (
    <>
      <StyledTable>
        <TableHeader>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th colSpan={6}>Stats</th>
            <th>Power</th>
          </tr>
        </TableHeader>
        <TableBody>
          {pokemonList.map((pokemon, index) => (
            <tr key={`${pokemon.name}${index}`}>
              <td>{pokemon.id}</td>
              <td>{pokemon.name}</td>
              <td>{pokemon.type.join(', ')}</td>
              <td>{pokemon.hp}</td>
              <td>{pokemon.speed}</td>
              <td>{pokemon.attack}</td>
              <td>{pokemon.special_attack}</td>
              <td>{pokemon.defense}</td>
              <td>{pokemon.special_defense}</td>
              <td>{calculatePokemonPower(pokemon)}</td>
            </tr>
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};
