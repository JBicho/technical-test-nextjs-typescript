import styled from 'styled-components';

const DetailView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h1 {
    margin: 0 0 calc(2 * var(--global-rhythm)) 0;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  img {
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--global-box-shadow);
    border: 2px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px) saturate(180%);
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    }
  }
`;

const DetailViewNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--global-rhythm);
  width: 100%;

  button {
    &:disabled {
      cursor: not-allowed;
    }
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--global-rhythm) 0;
`;

const TypesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 var(--global-rhythm) 0;
  display: flex;
  gap: 5px;

  li {
    position: relative;
  }

  li::after {
    content: '/';
    margin-left: 5px;
  }

  li:last-child::after {
    content: '';
  }
`;

export { Details, DetailView, DetailViewNavigation, ImageContainer, TypesList };
