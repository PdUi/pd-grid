describe('the grid module given no options', () => {
    var grid;

    beforeEach(() => {
        grid = new Grid();
    });

    it('should not be able to page backward', () => {
        expect(grid.canPageBackward).toBeFalsy();
    });
});
