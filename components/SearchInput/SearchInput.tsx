import { ChangeEvent } from 'react';
import { StyledContainer, StyledLabel, StyledSearchInput } from './Styles';

export interface SearchInputProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onSearch: (value: string) => void;
}

export const SearchInput = ({
  label,
  id,
  placeholder = 'Search a parameter',
  value,
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
        value={value}
        onChange={handleChange}
        aria-label="Search input"
        aria-describedby="search-help-text"
      />
    </StyledContainer>
  );
};
