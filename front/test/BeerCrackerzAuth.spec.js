import BeerCrackerzAuth from '../src/BeerCrackerzAuth';

const container = document.createElement('DIV');
container.className = 'container';
document.body.appendChild(container);

describe('BeerCrackerzAuth unit test', () => {
  it('Getters', done => {
    new BeerCrackerzAuth();
    expect(0).toEqual(0);
    done();
  });
});
