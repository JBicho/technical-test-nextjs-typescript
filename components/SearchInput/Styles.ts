import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-bottom: var(--global-rhythm);
`;

const StyledSearchInput = styled.input`
  background-color: var(--global-accent-color);
  color: var(--global-color);
  padding: 12px 20px;
  border: 2px solid #6e8ef9;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  width: 250px;

  &:focus {
    border-color: #9b51e0;
    background-color: #333;
    box-shadow: 0 0 10px rgba(106, 104, 248, 0.6);
  }

  &:hover {
    border-color: #9b51e0;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    border-color: #888;
    color: #aaa;
  }
`;

const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
  font-weight: bold;
`;

export { StyledSearchInput, StyledLabel, StyledContainer };
