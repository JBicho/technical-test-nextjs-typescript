import { fireEvent, render, waitFor } from '@testing-library/react';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import '../setupTests';

describe('Test SearchInput', () => {
  it('Renders the label and input with the correct props', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <SearchInput
        label="Test Label"
        id="test-id"
        placeholder="Test Placeholder"
        value=""
        onSearch={() => {}}
      />
    );

    expect(getByLabelText('Test Label')).toBeInTheDocument();
    expect(getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('Calls onSearch with the correct value when input changes', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput
        label="Test Label"
        id="test-id"
        placeholder="Test Placeholder"
        value=""
        onSearch={onSearch}
      />
    );

    fireEvent.change(getByPlaceholderText('Test Placeholder'), {
      target: { value: 'test value' },
    });

    expect(onSearch).toHaveBeenCalledWith('test value');
  });

  it('Updates the input value when the value prop changes', () => {
    const { getByPlaceholderText, rerender } = render(
      <SearchInput
        label="Test Label"
        id="test-id"
        placeholder="Test Placeholder"
        value=""
        onSearch={() => {}}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');
    expect(input).toHaveValue('');

    rerender(
      <SearchInput
        label="Test Label"
        id="test-id"
        placeholder="Test Placeholder"
        value="new value"
        onSearch={() => {}}
      />
    );

    expect(input).toHaveValue('new value');
  });

  it('Calls onSearch with an empty string when input is cleared', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput
        label="Test Label"
        id="test-id"
        placeholder="Test Placeholder"
        value="test value"
        onSearch={onSearch}
      />
    );

    const input = getByPlaceholderText('Test Placeholder');

    fireEvent.change(input, { target: { value: '' } });

    expect(onSearch).toHaveBeenCalledWith('');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
