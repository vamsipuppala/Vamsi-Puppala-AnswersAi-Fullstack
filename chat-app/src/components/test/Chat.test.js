import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Chat from './Chat';

jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  }));
});

describe('Chat Component', () => {
  test('renders chat interface', () => {
    render(<Chat tokenUsage={0} setTokenUsage={jest.fn()} />);

    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('displays warning message when approaching token limit', () => {
    render(<Chat tokenUsage={900} setTokenUsage={jest.fn()} />);

    expect(screen.getByText(/you are approaching your daily token limit/i)).toBeInTheDocument();
  });

  test('displays error message when sending message fails', async () => {
    render(<Chat tokenUsage={0} setTokenUsage={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/error sending message/i)).toBeInTheDocument();
  });
});
