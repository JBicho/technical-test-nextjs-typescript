import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #6e8ef9, #9b51e0, #000000);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const OverlayPattern = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://www.transparenttextures.com/patterns/white-diamond.png');
  opacity: 0.05;
  pointer-events: none;
`;

const Menu = styled.nav`
  position: fixed;
  background: rgba(110, 142, 249, 1);
  box-shadow: var(--global-box-shadow);
  width: 100%;
  top: 0;
  padding: var(--global-rhythm);
  z-index: 9999;

  a {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    span {
      display: flex;
      align-items: center;
      margin-left: calc(var(--global-rhythm) / 2);
    }
  }
`;

const Container = styled.div`
  padding: 0 var(--global-rhythm);
`;

const Main = styled.div`
  padding: calc(2 * var(--global-rhythm)) 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  h1 {
    margin-top: 90px;
  }
`;

export { Background, Container, Main, Menu, OverlayPattern };
