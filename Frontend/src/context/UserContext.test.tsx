/// <reference types="vitest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';

const TestComponent = () => {
  const { isLoggedIn, userName, userRole, login, isAdmin } = useUser();

  React.useEffect(() => {
    login('testuser', 'testuser@admin.roadmonitor.in', 'Admin');
  }, []);

  return (
    <div>
      <p>{`Logged In: ${isLoggedIn}`}</p>
      <p>{`User Name: ${userName}`}</p>
      <p>{`Role: ${userRole}`}</p>
      <p>{`Is Admin: ${isAdmin()}`}</p>
    </div>
  );
};

describe('UserContext', () => {
  it('provides correct context values after login', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByText('Logged In: true')).toBeInTheDocument();
    expect(screen.getByText('User Name: testuser')).toBeInTheDocument();
    expect(screen.getByText('Role: Admin')).toBeInTheDocument();
    expect(screen.getByText('Is Admin: true')).toBeInTheDocument();
  });
});
