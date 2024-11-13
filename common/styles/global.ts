import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
      --global-rhythm: 1.5rem;
      --global-box-shadow: box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      --global-max-width: 700px;
      --global-color: #ffffff;
      --global-accent-color: #2a2a2a;
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
      color: var(--global-color);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      width: 150px;
      padding: calc(var(--global-rhythm) / 2);
      background-color: var(--global-accent-color);                               
      border: none;               
      border-radius: 5px;         
      cursor: pointer;           
      position: relative;         
      overflow: hidden;           
      transition: background-color 0.3s ease, transform 0.2s ease; 
      font-family: 'Poppins', sans-serif;
      color: var(--global-color);
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
`;

export { GlobalStyles };
