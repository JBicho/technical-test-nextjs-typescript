import styled from 'styled-components';

const MeterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledMeter = styled.meter`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;

  &::-webkit-meter-bar {
    background-color: var(--global-accent-color);
    border-radius: 10px;
    background-image: linear-gradient(
      to right,
      var(--global-accent-color),
      var(--global-accent-color)
    );
  }

  &::-webkit-meter-value {
    background-color: #4caf50;
    border-radius: 10px;
  }

  &::-moz-meter-bar {
    background-color: var(--global-accent-color);
    border-radius: 10px;
    background-image: linear-gradient(
      to right,
      var(--global-accent-color),
      var(--global-accent-color)
    );
  }
`;

export { MeterContainer, StyledMeter };
