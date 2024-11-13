import type { ReactElement } from 'react';
import { Background, Container, Main, Menu, OverlayPattern } from './Styles';
import Image from 'next/image';
import { ConditionalLink } from '../ConditionalLink/ConditionalLink';

export const Layout = (page: ReactElement): JSX.Element => {
  return (
    <>
      <Background>
        <OverlayPattern />
        <Menu>
          <ConditionalLink href={'/'} aria-label="Go to home page">
            <Image
              priority={true}
              src="/images/pokeball.png"
              alt="Pokeball Image"
              width={60}
              height={60}
            />
            <span>Home</span>
          </ConditionalLink>
        </Menu>
        <Container>
          <Main>{page}</Main>
        </Container>
      </Background>
    </>
  );
};
