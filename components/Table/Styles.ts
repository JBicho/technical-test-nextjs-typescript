import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  max-width: var(--global-max-width);
  min-width: var(--global-max-width);
  margin: 20px auto;
  border-spacing: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: rgba(255, 255, 255, 0.15);

  th {
    padding: calc(var(--global-rhythm) / 1.5);
    font-weight: 600;
    font-size: 1rem;
    text-align: left;
  }

  tr:first-child th:first-child {
    border-top-left-radius: 12px;
  }
  tr:first-child th:last-child {
    border-top-right-radius: 12px;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px rgba(255, 255, 255, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      cursor: pointer;
    }
  }

  td {
    padding: calc(var(--global-rhythm) / 1.5);
    font-size: 0.95rem;
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EmptyListTd = styled.td`
  text-align: center !important;
`;

const TableFooter = styled.tfoot`
  td {
    padding: 12px;
    font-weight: 500;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);

    span {
      font-size: 0.9rem;
    }

    button {
      background-color: transparent;
      height: 46px;
      width: 50px;

      &:first-child {
        margin-right: var(--global-rhythm);
      }

      &:last-child {
        margin-left: var(--global-rhythm);
      }
    }

    &:first-child {
      border-bottom-left-radius: 12px;
    }
    &:last-child {
      border-bottom-right-radius: 12px;
    }
  }
`;

export { StyledTable, TableBody, TableFooter, TableHeader, EmptyListTd };
