import { ChangeEvent } from 'react';
import { StyledContainer, StyledLabel, StyledSearchInput } from './Styles';

interface SearchInputProps {
  label: string;
  id: string;
  placeholder?: string;
  onSearch: (input: string) => void;
}

export const SearchInput = ({
  label,
  id,
  placeholder = 'Search a parameter',
  onSearch,
}: SearchInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <StyledContainer>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <StyledSearchInput
        id={id}
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        aria-label="Search input"
        aria-describedby="search-help-text"
      />
    </StyledContainer>
  );
};
