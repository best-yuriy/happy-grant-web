import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logout from './Logout';

import CurrentLocation from './CurrentLocation';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

describe('logout flow', () => {
    let testId = null;

    beforeEach(() => testId = Math.floor(Math.random() * 1000000));

    test('redirect to / after signing up and set current user', async () => {
        const testEmail = `logout-test-${testId}@example.com`;
        const testPassword = 'logout-test-password';

        await createUserWithEmailAndPassword(auth, testEmail, testPassword);

        // Let's ensure that we're logged in before running our scenario.
        expect(auth.currentUser).not.toBeNull();

        const rendered = render(
            <MemoryRouter initialEntries={['/logout']}>
                <CurrentLocation />
                <Logout />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText("Current route: '/logout'")).toBeInTheDocument();
            expect(auth.currentUser).toBeNull();
        });
    });
});
