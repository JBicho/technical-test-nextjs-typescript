import { StyledSection } from './Styles';

export interface CounterProps {
  count: number;
  min: number;
  max: number;
}

export const Counter = ({ count = 0, min = 0, max = 0 }: CounterProps) => {
  return (
    <>
      <StyledSection>
        <p role="status" aria-live="polite">
          Count:
          <span>
            <strong>{count}</strong>
          </span>
        </p>
        <p>
          Min:
          <span>
            <strong>{min}</strong>
          </span>
        </p>
        <p>
          Max:
          <span>
            <strong>{max}</strong>
          </span>
        </p>
      </StyledSection>
    </>
  );
};
