import Landmass from '../landmass';

jest.unmock('../landmass');

describe('Landmass Generator', () => {
  it('should give 1 at the centre', () => {
    expect(Landmass(0.5, 0.5)).toEqual(1);
  });

  it('should give 0.5 at the edges', () => {
    expect(Landmass(0, 0.5)).toEqual(0.5);
    expect(Landmass(1, 0.5)).toEqual(0.5);
    expect(Landmass(0.5, 0)).toEqual(0.5);
    expect(Landmass(0.5, 1)).toEqual(0.5);
  });
});
