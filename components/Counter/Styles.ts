import styled from 'styled-components';

export const StyledSection = styled.section`
  display: flex;
  flex-direction: row;
  gap: var(--global-rhythm);

  p:last-of-type {
    margin-bottom: 0;
  }

  strong {
    display: inline-block;
    text-indent: 10px;
  }
`;
