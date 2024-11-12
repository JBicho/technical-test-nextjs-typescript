import Link from 'next/link';
import { Pokemon } from '../../common/interfaces/pokemon';
import { calculatePokemonPower } from '../../common/utils/calculatePokemonPower';
import { StyledTable, TableBody, TableFooter, TableHeader } from './Styles';
import { useRouter } from 'next/router';

export interface TableProps {
  pokemonList: Pokemon[];
}

export const Table = ({ pokemonList = [] }: TableProps) => {
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/pokemon/${id}`);
  };

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
          {pokemonList.map(
            (
              {
                id,
                name,
                type,
                hp,
                speed,
                attack,
                special_attack,
                defense,
                special_defense,
              },
              index
            ) => (
              <tr key={`${name}${index}`} onClick={() => handleRowClick(id)}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{type.join(', ')}</td>
                <td>{hp}</td>
                <td>{speed}</td>
                <td>{attack}</td>
                <td>{special_attack}</td>
                <td>{defense}</td>
                <td>{special_defense}</td>
                <td>
                  {calculatePokemonPower({
                    attack,
                    defense,
                    hp,
                    special_attack,
                    special_defense,
                    speed,
                  })}
                </td>
              </tr>
            )
          )}
        </TableBody>
      </StyledTable>
    </>
  );
};
