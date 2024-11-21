const { getData, putData } = require('./LocalStorageService');

describe('LocalStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should get the app data from local storage if data was never set before', () => {
        const retrievedData = getData();
        expect(retrievedData).toEqual({});
    });

    it('should get the app data from local storage if data was set before', () => {
        putData({ 'foo': 123 });
        expect(getData()).toEqual({ 'foo': 123 });
    });

    it('should merge new data into old data from local storage', () => {
        putData({ 'foo': 123, 'bar': 456 });
        expect(getData()).toEqual({ 'foo': 123, 'bar': 456 });

        putData({ 'foo': 'newfoo', 'bazz': 789 });
        expect(getData()).toEqual({ 'foo': 'newfoo', 'bar': 456, 'bazz': 789 });
    });

    it('should overwrite arrays when updating array data in local storage', () => {
        putData({ 'foo': [1, 2] });
        putData({ 'foo': [3, 4, 5] });
        expect(getData()).toEqual({ 'foo': [3, 4, 5] });
    });
});
