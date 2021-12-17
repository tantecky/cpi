import './extensions';

describe('Extension methods', () => {
  it('should be February', () => {
    let date = new Date(1995, 0, 1);
    date.incrementMonth();
    expect(date.getMonth()).toEqual(1);
  });

  it('should be next', () => {
    let date = new Date(1995, 11, 1);
    date.incrementMonth();
    expect(date.getMonth()).toEqual(0);
    expect(date.getFullYear()).toEqual(1996);
  });
});
