import ModalFactory from '../../src/js/ui/ModalFactory.js';


let backup = null; // console.error backup
describe('ModalFactory unit test :', () => {

/*
  beforeAll(() => {
    const container = document.createElement('DIV');
    container.className = 'container';
    document.body.appendChild(container);
    
    const rawPage = window.__html__['test/templates/index.html'];
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
*/

  beforeEach(() => {
    // Instantiating modal will raise errors in console but we're not tesing modal themselves here
    backup = console.error;
    console.error = () => {};
    window.BeerCrackerz = {
      kom: { getTemplate: () => { return Promise.resolve('Test'); } }
    };
  });


  afterEach(() => {
    console.error = backup;
    window.BeerCrackerz = null;
  });

  
  it('Public static method build', done => {
    expect(ModalFactory.build()).toEqual(null);
    expect(ModalFactory.build('NotModal')).toEqual(null);
    expect(JSON.stringify(ModalFactory.build('AddMark', { type: 'spot' }))).toEqual('{"_type":"addspot","_url":"/modal/addspot","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{"type":"spot"},"_action":"add","_name":"","_description":"","_rating":null,"_pricing":null}');
    expect(JSON.stringify(ModalFactory.build('DeleteMark'))).toEqual('{"_type":"deletemark","_url":"/modal/deletemark","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{},"_footerCancelButton":null,"_footerSubmitButton":null}');
    expect(JSON.stringify(ModalFactory.build('EditMark', { type: 'shop' }))).toEqual('{"_type":"editshop","_url":"/modal/editshop","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{"type":"shop"},"_action":"edit","_name":"","_description":"","_rating":null,"_pricing":null}');
    expect(JSON.stringify(ModalFactory.build('User'))).toEqual('{"_type":"user","_url":"/modal/user","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{},"_footerCancelButton":null,"_footerSubmitButton":null}');
    expect(JSON.stringify(ModalFactory.build('UpdateProfilePicture'))).toEqual('{"_type":"updatepp","_url":"/modal/updatepp","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{},"_footerCancelButton":null,"_footerSubmitButton":null}');
    expect(JSON.stringify(ModalFactory.build('HideShow'))).toEqual('{"_type":"hideshow","_url":"/modal/hideshow","_rootElement":null,"_modalOverlay":null,"_closeButton":null,"_evtIds":[],"_opts":{},"_footerCancelButton":null,"_footerSubmitButton":null}');
    done();
  });


});
