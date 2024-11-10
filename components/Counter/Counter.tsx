import { StyledSection } from './Styles';

interface CounterProps {
  countOverThreshold: number;
  min: number;
  max: number;
}

export const Counter = ({
  countOverThreshold = 0,
  min = 0,
  max = 0,
}: CounterProps) => {
  return (
    <>
      <StyledSection>
        <p role="status" aria-live="polite">
          Count over threshold:{' '}
          <span>
            {' '}
            <strong>{countOverThreshold}</strong>{' '}
          </span>
        </p>
        <p>
          Min:{' '}
          <span>
            {' '}
            <strong>{min}</strong>{' '}
          </span>
        </p>
        <p>
          Max:{' '}
          <span>
            {' '}
            <strong>{max}</strong>{' '}
          </span>
        </p>
      </StyledSection>
    </>
  );
};
