import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Signup from './Signup';
import CurrentLocation from './CurrentLocation';
import { auth } from '../firebase';

describe('signup flow', () => {
    let testId = null;

    beforeEach(() => testId = Math.floor(Math.random() * 1000000));

    test('redirect to / after signing up and set current user', async () => {
        const testEmail = `signup-test-${testId}@example.com`;

        const rendered = render(
            <MemoryRouter initialEntries={['/signup']} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <CurrentLocation />
                <Signup />
            </MemoryRouter>
        );
    
        const email = rendered.getByRole('textbox', { name: 'email' });
        await userEvent.type(email, testEmail);
        
        const password = document.getElementById('password-input');
        await userEvent.type(password, 'signup-test-password');
        
        const submit = rendered.getByRole('button', { name: 'SIGN UP' });
        await userEvent.click(submit);
    
        await waitFor(() => {
            expect(screen.getByText("Current route: '/'")).toBeInTheDocument();
            expect(auth.currentUser).toBeDefined();
            expect(auth.currentUser.email).toBe(testEmail);
        });
    });
});
