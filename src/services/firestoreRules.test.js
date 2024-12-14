import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import { setImmediate } from 'timers';

describe('Firestore security rules', () => {
    let testEnv;

    beforeAll(async () => {
        // Load the Firestore rules from your local file
        const rules = fs.readFileSync('firestore.rules', 'utf8');
        
        // Initialize the test environment
        testEnv = await initializeTestEnvironment({
            projectId: 'your-project-id',
            firestore: { rules }
        });
    });

    afterAll(async () => {
        await testEnv.cleanup();
    });

    it('should allow a user to read their own document', async () => {
        const alice = testEnv.authenticatedContext('alice');
        const docRef = alice.firestore().doc('happiness-data/alice');

        // Write a document as 'alice'
        await assertSucceeds(setDoc(docRef, { name: 'Alice' }));

        // Read the document as 'alice'
        await assertSucceeds(getDoc(docRef));
    });

    it('should deny a user to read another user\'s document', async () => {
        const alice = testEnv.authenticatedContext('alice');
        const bob = testEnv.authenticatedContext('bob');
        const docRefAlice = alice.firestore().doc('happiness-data/bob');
        const docRefBob = bob.firestore().doc('happiness-data/bob');

        // Write a document as 'bob'
        await assertSucceeds(setDoc(docRefBob, { name: 'Bob' }));

        // Try to read the document as 'alice'
        await assertFails(getDoc(docRefAlice));
    });
});
