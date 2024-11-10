import React from 'react';
import { render } from '@testing-library/react';
import './setupTests';

import HomePage from '../pages';

describe('Test HomePage component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should show HomePage', () => {
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toBeTruthy();
  });
});
