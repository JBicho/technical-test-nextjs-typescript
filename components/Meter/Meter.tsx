import { MeterContainer, StyledMeter } from './Styles';

export interface MeterProps {
  id: string;
  value: number;
  label: string;
  max: number;
  min?: number;
}

export const Meter = ({ id, value, label, max, min = 0 }: MeterProps) => {
  return (
    <MeterContainer>
      <label htmlFor={id}>{label}</label>
      <StyledMeter id={id} value={value} max={max} min={min} />
    </MeterContainer>
  );
};
