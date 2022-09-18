import BeerCrackerzAuth from '../src/BeerCrackerzAuth.js';
import nls from '../../static/nls/en.json';

const container = document.createElement('DIV');
container.className = 'container';
document.body.appendChild(container);

const nlsResponse = new Response(JSON.stringify(nls), { status: 200, statusText: 'OK', });
let bc = null;

describe('BeerCrackerzAuth unit test', () => {
  beforeAll(() => {
    const rawPage = window.__html__['test/templates/welcome.html'];
    const html = document.createRange().createContextualFragment(rawPage)
    container.appendChild(html);
    // Add csrf token to make Kom work properly
    document.cookie = 'csrftoken=FakeCSRF; path=/';
    // Add bundled CSS
    const link = document.createElement('script');
    link.type = 'stylesheet';
    link.src = 'base/static/dist/BeerCrackerzBundle.css';
    document.head.appendChild(link);
  });


  afterAll(() => {
    bc = null;
  });

  
  it('Getters', done => {
    spyOn(window, 'fetch').and.resolveTo(nlsResponse);
    bc = new BeerCrackerzAuth();
    done();
  });
});
