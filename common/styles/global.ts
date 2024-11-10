import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
      --global-rhythm: 1.5rem;
    }

    html {
      font-size: 16px;
    }

    html,
    body {
      padding: 0;
      margin: 0;
      height: 100%;
      font-family: 'Poppins', sans-serif;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      width: 150px;
      padding: calc(var(--global-rhythm) / 2);
      background-color: #2a2a2a;                               
      border: none;               
      border-radius: 5px;         
      cursor: pointer;           
      position: relative;         
      overflow: hidden;           
      transition: background-color 0.3s ease, transform 0.2s ease; 
      font-family: 'Poppins', sans-serif;
    }

    button:hover {
      background-color: #3a3a3a;  
      transform: scale(1.05);      
    }

    button:active {
      background-color: #1a1a1a;  
      transform: scale(1);        
    }

    * {
      box-sizing: border-box;
    }

    @media (prefers-color-scheme: dark) {
      html {
          color-scheme: dark;
      }
      body {
          color: white;
          background: black;
      }
    }
`;

export { GlobalStyles };
