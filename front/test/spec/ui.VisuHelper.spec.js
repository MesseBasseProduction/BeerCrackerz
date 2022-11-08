import VisuHelper from '../../src/js/ui/VisuHelper.js';
import nls from '../../../static/nls/en.json';


describe('VisuHelper unit test :', () => {


  beforeEach(() => {
    window.VERSION = '42.0.0';
    window.BeerCrackerz = {
      debugElement: null,
      nls: {
        debug: key => {
          return nls.debug[key];
        }
      }
    };
  });


  afterEach(() => {
    window.VERSION = null;
    window.BeerCrackerz = null;
  });

  
  it('Public static method initDebugUI', done => {
    expect(typeof VisuHelper.initDebugUI).toEqual('function');
    // Standard debug UI
    const element = VisuHelper.initDebugUI();
    expect(element.classList.contains('debug-container')).toEqual(true);
    expect(element.children.length).toEqual(10);
    expect(element.children[0].innerHTML).toEqual(`BeerCrackerz v${window.VERSION}`);
    expect(element.children[1].classList.contains('debug-user-lat')).toEqual(true);
    expect(element.children[1].innerHTML).toEqual(`<b>${nls.debug.lat}</b> -`);
    expect(element.children[2].classList.contains('debug-user-lng')).toEqual(true);
    expect(element.children[2].innerHTML).toEqual(`<b>${nls.debug.lng}</b> -`);
    expect(element.children[3].classList.contains('debug-updates-amount')).toEqual(true);
    expect(element.children[3].innerHTML).toEqual(`<b>${nls.debug.updates}</b> 0`);
    expect(element.children[4].classList.contains('debug-user-accuracy')).toEqual(true);
    expect(element.children[4].innerHTML).toEqual(`<b>${nls.debug.accuracy}</b> -`);
    expect(element.children[5].classList.contains('debug-high-accuracy')).toEqual(true);
    expect(element.children[5].innerHTML).toEqual(`<b>${nls.debug.highAccuracy}</b> -`);
    expect(element.children[6].classList.contains('debug-pos-max-age')).toEqual(true);
    expect(element.children[6].innerHTML).toEqual(`<b>${nls.debug.posAge}</b> -`);
    expect(element.children[7].classList.contains('debug-pos-timeout')).toEqual(true);
    expect(element.children[7].innerHTML).toEqual(`<b>${nls.debug.posTimeout}</b> -`);
    expect(element.children[8].classList.contains('debug-zoom-level')).toEqual(true);
    expect(element.children[8].innerHTML).toEqual(`<b>${nls.debug.zoom}</b> -`);
    expect(element.children[9].classList.contains('debug-marks-amount')).toEqual(true);
    expect(element.children[9].innerHTML).toEqual(`<b>${nls.debug.marks}</b> -`);
    // End init debug UI tests
    done();
  });


  it('Public static method addDebugUI', done => {
    expect(typeof VisuHelper.addDebugUI).toEqual('function');
    window.BeerCrackerz.debugElement = VisuHelper.initDebugUI();
    // Standard debug UI
    VisuHelper.addDebugUI();
    expect(window.BeerCrackerz.debugElement.parentNode).toEqual(document.body);
    // End init debug UI tests
    done();
  });


});
