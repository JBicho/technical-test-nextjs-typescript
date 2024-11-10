import styled from "styled-components";

export const StyledCard = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: var(--global-rhythm);
  margin: var(--global-rhythm);
  width: 100%;
  max-width: 900px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
`;
