import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Login from './Login';
import CurrentLocation from './CurrentLocation';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

describe('login flow', () => {
    let testId = null;

    beforeEach(() => testId = Math.floor(Math.random() * 1000000));

    test('redirect to / after logging in and set current user', async () => {
        const testEmail = `login-test-${testId}@example.com`;
        const testPassword = 'login-test-password';

        await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        await signOut(auth);

        const rendered = render(
            <MemoryRouter initialEntries={['/login']} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <CurrentLocation />
                <Login />
            </MemoryRouter>
        );
    
        // Let's ensure that we're not logged in before running our scenario.
        expect(auth.currentUser).toBeNull();

        const email = rendered.getByRole('textbox', { name: 'email' });
        await userEvent.type(email, testEmail);
        
        const password = document.getElementById('password-input');
        await userEvent.type(password, testPassword);
        
        const submit = rendered.getByRole('button', { name: 'SIGN IN' });
        await userEvent.click(submit);
    
        await waitFor(() => {
            expect(screen.getByText("Current route: '/'")).toBeInTheDocument();
            expect(auth.currentUser).toBeDefined();
            expect(auth.currentUser.email).toBe(testEmail);
        });
    });
});
