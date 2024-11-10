import { Card } from "../Card/Card";
import { Counter } from "../Counter/Counter";
import { SearchInput } from "../SearchInput/SearchInput";
import { SearchInputContainer } from "./Styles";

export const SearchCard = () => {
  return (
    <>
      <Card>
        <SearchInputContainer>
          <SearchInput
            label="Search"
            placeholder="Search a Pokemon Name"
            onSearch={() => ""}
            id="pokemon-name"
          />

          <SearchInput
            label="Power threshold"
            placeholder="Write a Power Threshold"
            onSearch={() => ""}
            id="pokemon-power-treshold"
          />
        </SearchInputContainer>
        <Counter countOverThreshold={329} min={328} max={456} />
      </Card>
    </>
  );
};
