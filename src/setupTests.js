// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@inrupt/jest-jsdom-polyfills';
import { ReadableStream } from "web-streams-polyfill";
import { setImmediate } from 'timers';

global.ReadableStream = new ReadableStream();
global.setImmediate = setImmediate;
