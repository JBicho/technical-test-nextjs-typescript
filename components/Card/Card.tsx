import { ReactNode } from 'react';
import { StyledCard } from './Styles';

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return <StyledCard>{children}</StyledCard>;
};
