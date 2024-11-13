import styled from 'styled-components';

export const StyledCard = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: var(--global-box-shadow);
  padding: var(--global-rhythm);
  margin: var(--global-rhythm);
  width: 100%;
  max-width: var(--global-max-width);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  @media (max-width: 430px), (orientation: landscape) {
    margin-top: calc(2.7 * var(--global-rhythm));
  }
`;
