import { PokemonTableItem } from "../../common/interfaces/pokemon";
import { StyledTable, TableBody, TableFooter, TableHeader } from "./Styles";

interface TableProps {
  pokemonList: PokemonTableItem[];
}

export const Table = ({ pokemonList = [] }: TableProps) => {
  return (
    <>
      <StyledTable>
        <TableHeader>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th colSpan={6}>Stats</th>
            <th>Power</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
            <td>Data 2</td>
            <td>Data 3</td>
            <td>Data 3</td>
            <td>Data 3</td>
            <td>Data 3</td>
            <td>Data 3</td>
            <td>Data 3</td>
          </tr>
          <tr>
            <td>Data 4</td>
            <td>Data 4</td>
            <td>Data 5</td>
            <td>Data 6</td>
            <td>Data 6</td>
            <td>Data 6</td>
            <td>Data 6</td>
            <td>Data 6</td>
            <td>Data 6</td>
          </tr>
        </TableBody>
        <TableFooter>
          <tr>
            <td colSpan={9}>Footer</td>
          </tr>
        </TableFooter>
      </StyledTable>
    </>
  );
};
