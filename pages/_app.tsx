import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { GlobalStyles } from '../common/styles/global';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  nonce: string;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => {
      return page;
    });

  return getLayout(
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default App;
