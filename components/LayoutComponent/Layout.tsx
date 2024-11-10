import type { ReactElement } from 'react';
import { Background, Container, Main, Menu, OverlayPattern } from './Styles';
import Image from 'next/image';
import Link from 'next/link';

export const Layout = (page: ReactElement): JSX.Element => {
  return (
    <>
      <Background>
        <OverlayPattern />
        <Menu>
          <Link href={'/'} aria-label="Go to home page">
            <Image
              src="/images/pokeball.png"
              alt="Pokeball Image"
              width={96}
              height={96}
            />
            <span>Home</span>
          </Link>
        </Menu>
        <Container>
          <Main>{page}</Main>
        </Container>
      </Background>
    </>
  );
};
