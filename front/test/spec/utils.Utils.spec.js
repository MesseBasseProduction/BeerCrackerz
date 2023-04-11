import Utils from '../../src/js/utils/Utils.js';


describe('Utils unit test :', () => {

  
  it('Public static method stripDom', done => {
    expect(typeof Utils.stripDom).toEqual('function');
    // Invalid argument args (empty or mistyped)
    expect(Utils.stripDom()).toEqual('');
    expect(Utils.stripDom(true)).toEqual('');
    expect(Utils.stripDom([ true, false ])).toEqual('');
    expect(Utils.stripDom({ true: true })).toEqual('');
    expect(Utils.stripDom(() => {})).toEqual('');
    // Standard striping behavior args
    expect(Utils.stripDom(42)).toEqual('42');
    expect(Utils.stripDom('html')).toEqual('html');
    expect(Utils.stripDom('<p>html</p>')).toEqual('html');
    expect(Utils.stripDom('</div>')).toEqual('');
    expect(Utils.stripDom('&lt;&gt;')).toEqual('<>');
    // End stripDom tests
    done();
  });


  it('Public static method replaceString', done => {
    expect(typeof Utils.replaceString).toEqual('function');
    // Local element for testing
    const testElement = document.createElement('P');
    testElement.innerHTML = 'test string';
    // Invalid first argument args (empty or mistyped)
    expect(Utils.replaceString()).toEqual(false);
    expect(Utils.replaceString(true)).toEqual(false);
    expect(Utils.replaceString(42)).toEqual(false);
    expect(Utils.replaceString('element')).toEqual(false);
    expect(Utils.replaceString([ true, false ])).toEqual(false);
    expect(Utils.replaceString({ true: true })).toEqual(false);
    expect(Utils.replaceString(() => {})).toEqual(false);
    // Invalid second argument args (empty or mistyped)
    expect(Utils.replaceString(testElement)).toEqual(false);
    expect(Utils.replaceString(testElement, null, 'value')).toEqual(false);
    expect(Utils.replaceString(testElement, true, 'value')).toEqual(false);
    expect(Utils.replaceString(testElement, 42, 'value')).toEqual(false);
    expect(Utils.replaceString(testElement, [ true, false ], 'value')).toEqual(false);
    expect(Utils.replaceString(testElement, { true: true }, 'value')).toEqual(false);
    expect(Utils.replaceString(testElement, () => {}, 'value')).toEqual(false);
    // Invalid thrid argument args (empty or mistyped)
    expect(Utils.replaceString(testElement, 'string')).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', null)).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', true)).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', 42)).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', [ true, false ])).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', { true: true })).toEqual(false);
    expect(Utils.replaceString(testElement, 'string', () => {})).toEqual(false);
    // Standard replace behavior
    expect(testElement.innerHTML).toEqual('test string');
    expect(Utils.replaceString(testElement, 'string', 'replaced string')).toEqual(true);
    expect(testElement.innerHTML).toEqual('test replaced string');
    expect(Utils.replaceString(testElement, 'gnirts', 'replaced string')).toEqual(true);
    expect(testElement.innerHTML).toEqual('test replaced string');
    // End replaceString tests
    done();
  });


  it('Public static method getDistanceBetweenCoords', done => {
    expect(typeof Utils.getDistanceBetweenCoords).toEqual('function');
    // Local coordinates for testing
    let from = [21, -15];
    let to = [-18, 32];
    // Invalid first argument args (empty or mistyped)
    expect(Utils.getDistanceBetweenCoords()).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(true)).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords([ true, false ])).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords({ true: true })).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(() => {})).toEqual(-1);
    // Invalid second argument args (empty or mistyped)
    expect(Utils.getDistanceBetweenCoords(from)).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(from, true)).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(from, [ true, false ])).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(from, { true: true })).toEqual(-1);
    expect(Utils.getDistanceBetweenCoords(from, () => {})).toEqual(-1);
    // Standard distance behavior
    expect(Utils.getDistanceBetweenCoords(from, to)).toEqual(6709911.901531838);
    from = [25, 0];
    to = [26, 0];
    expect(Utils.getDistanceBetweenCoords(from, to)).toEqual(111194.92664455889); // Testing on lat delta only
    from = [0, 43];
    to = [0, 42];
    expect(Utils.getDistanceBetweenCoords(from, to)).toEqual(111194.92664455819); // Testing on lng delta only
    // End getDistanceBetweenCoords tests
    done();
  });


  it('Public static method precisionRound', done => {
    expect(typeof Utils.precisionRound).toEqual('function');
    // Invalid first argument args (empty or mistyped)
    expect(Utils.precisionRound()).toEqual(-1);
    expect(Utils.precisionRound(true)).toEqual(-1);
    expect(Utils.precisionRound('value')).toEqual(-1);
    expect(Utils.precisionRound([ true, false ])).toEqual(-1);
    expect(Utils.precisionRound({ true: true })).toEqual(-1);
    expect(Utils.precisionRound(() => {})).toEqual(-1);
    // Invalid second argument args (empty or mistyped)
    expect(Utils.precisionRound(1.123456789)).toEqual(-1);
    expect(Utils.precisionRound(1.123456789, true)).toEqual(-1);
    expect(Utils.precisionRound(1.123456789, 'precision')).toEqual(-1);
    expect(Utils.precisionRound(1.123456789, [ true, false ])).toEqual(-1);
    expect(Utils.precisionRound(1.123456789, { true: true })).toEqual(-1);
    expect(Utils.precisionRound(1.123456789, () => {})).toEqual(-1);
    // Standard rounding behavior
    expect(Utils.precisionRound(0, 0)).toEqual(0); // Zero testing
    expect(Utils.precisionRound(0, 2)).toEqual(0);
    expect(Utils.precisionRound(2.4, 0)).toEqual(2);
    expect(Utils.precisionRound(2.5, 0)).toEqual(3);
    expect(Utils.precisionRound(-4.987654321, 0)).toEqual(-5); // Rounding > .5
    expect(Utils.precisionRound(-4.987654321, 1)).toEqual(-5);
    expect(Utils.precisionRound(-4.987654321, 2)).toEqual(-4.99);
    expect(Utils.precisionRound(-4.987654321, 3)).toEqual(-4.988);
    expect(Utils.precisionRound(-4.987654321, 4)).toEqual(-4.9877);
    expect(Utils.precisionRound(4.987654321, 0)).toEqual(5);
    expect(Utils.precisionRound(4.987654321, 1)).toEqual(5);
    expect(Utils.precisionRound(4.987654321, 2)).toEqual(4.99);
    expect(Utils.precisionRound(4.987654321, 3)).toEqual(4.988);
    expect(Utils.precisionRound(4.987654321, 4)).toEqual(4.9877);
    expect(Utils.precisionRound(4.123456789, 0)).toEqual(4); // Rounding < .5
    expect(Utils.precisionRound(4.123456789, 1)).toEqual(4.1);
    expect(Utils.precisionRound(4.123456789, 2)).toEqual(4.12);
    expect(Utils.precisionRound(4.123456789, 3)).toEqual(4.123);
    expect(Utils.precisionRound(4.123456789, 4)).toEqual(4.1235);
    expect(Utils.precisionRound(-4.123456789, 0)).toEqual(-4);
    expect(Utils.precisionRound(-4.123456789, 1)).toEqual(-4.1);
    expect(Utils.precisionRound(-4.123456789, 2)).toEqual(-4.12);
    expect(Utils.precisionRound(-4.123456789, 3)).toEqual(-4.123);
    expect(Utils.precisionRound(-4.123456789, 4)).toEqual(-4.1235);
    expect(Utils.precisionRound(1 / 500, 10)).toEqual(0.002); // Fractions and other
    expect(Utils.precisionRound(1 / -500, 10)).toEqual(-0.002);
    expect(Utils.precisionRound(Math.PI, 10)).toEqual(3.1415926536);
    // End rounding tests
    done();
  });


  it('Public static method setDefaultPreferences', done => {
    expect(typeof Utils.setDefaultPreferences).toEqual('function');
    // Local element for testing
    const defaultPreferences = {
      'poi-show-spot': true,
      'poi-show-shop': true,
      'poi-show-bar': true,
      'map-plan-layer': 'Plan OSM',
      'selected-lang': 'en',
      'app-debug': false,
      'map-high-accuracy': false,
      'map-center-on-user': false,
      'dark-theme': true,
    };
    let called = 0;
    spyOn(Utils, 'setPreference').and.callFake((pref, value) => {
      ++called;
      expect(defaultPreferences[pref]).toEqual(value);
      // End default pref tests
      if (called === 11) {
        done();
      }
    });
    // Force getPref to alway return null so we can check default values are properly set
    spyOn(Utils, 'getPreference').and.callFake(() => {
      return null;
    });
    // Call for default preferences setter
    Utils.setDefaultPreferences();
  });


  it('Public static method formatMarker', done => {
    expect(typeof Utils.formatMarker).toEqual('function');
    // Invalid argument args (empty)
    expect(Utils.formatMarker()).toEqual(null);
    expect(Utils.formatMarker(true)).toEqual(null);
    expect(Utils.formatMarker(0)).toEqual(null);
    expect(Utils.formatMarker('mark')).toEqual(null);
    expect(Utils.formatMarker([ true, false ])).toEqual(null);
    expect(Utils.formatMarker({ true: true })).toEqual(null);
    expect(Utils.formatMarker(() => {})).toEqual(null);
    // Invalid argument args (name/types)
    expect(Utils.formatMarker({ name: true, types: ['a', 'b'] })).toEqual(null);
    expect(Utils.formatMarker({ name: 42, types: ['a', 'b'] })).toEqual(null);
    expect(Utils.formatMarker({ name: [ true, false ], types: ['a', 'b'] })).toEqual(null);
    expect(Utils.formatMarker({ name: { true: true }, types: ['a', 'b'] })).toEqual(null);
    expect(Utils.formatMarker({ name: () => {}, types: ['a', 'b'] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: true })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: 'types' })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: () => {} })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: [ true, false ] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'] })).toEqual(null); // Good, but not enough objects (lat/lng missing)
    // Invalid argument args (lat/lng)
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42 })).toEqual(null);    
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lng: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: true, lng: 42 })).toEqual(null); // Sending proper lng, testing lat
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: '42', lng: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: [ true, false ], lng: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: { false: true }, lng: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: () => {}, lng: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: true })).toEqual(null); // Sending proper lat, testing lng
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: '42' })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: [ true, false ] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: () => {} })).toEqual(null);
    // Invalid argument args (description)
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: true })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: [ false ] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: () => {} })).toEqual(null);
    // Invalid argument args (modifiers)
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: true })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: 42 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: 'modifiers' })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: () => {} })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: [true] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: [42] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: [[ false, true ]] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: [{ false: true }] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: [() => {}] })).toEqual(null);
    // Invalid argument args (rate)
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: true })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 'rate' })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: [ false, true ] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: () => {} })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: -1 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 5 })).toEqual(null);
    // Invalid argument args (price)
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: true })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: 'price' })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: [ false, true ] })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: { false: true } })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: () => {} })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: -1 })).toEqual(null);
    expect(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'desc', modifiers: ['c'], rate: 2, price: 3 })).toEqual(null);
    // Standard formatting behavior
    expect(JSON.stringify(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42 }))).toEqual('{"name":"Name","types":["a","b"],"lat":42,"lng":42}');
    expect(JSON.stringify(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, description: 'description' }))).toEqual('{"name":"Name","types":["a","b"],"lat":42,"lng":42,"description":"description"}');
    expect(JSON.stringify(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, modifiers: ['c', 'd'] }))).toEqual('{"name":"Name","types":["a","b"],"lat":42,"lng":42,"modifiers":["c","d"]}');
    expect(JSON.stringify(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, rate: 3 }))).toEqual('{"name":"Name","types":["a","b"],"lat":42,"lng":42,"rate":3}');
    expect(JSON.stringify(Utils.formatMarker({ name: 'Name', types: ['a', 'b'], lat: 42, lng: 42, price: 1 }))).toEqual('{"name":"Name","types":["a","b"],"lat":42,"lng":42,"price":1}');
    // End formatting tests
    done();
  });


  it('Public static method removeAllObjectKeys', done => {
    expect(typeof Utils.removeAllObjectKeys).toEqual('function');
    // Invalid argument args (empty)
    expect(Utils.removeAllObjectKeys()).toEqual(false);
    expect(Utils.removeAllObjectKeys(true)).toEqual(false);
    expect(Utils.removeAllObjectKeys(0)).toEqual(false);
    expect(Utils.removeAllObjectKeys('mark')).toEqual(false);
    expect(Utils.removeAllObjectKeys([ true, false ])).toEqual(false);
    expect(Utils.removeAllObjectKeys(() => {})).toEqual(false);
    // Standard formatting behavior
    const testObject = {
      bool: true,
      string: 'string',
      number: 42,
      array: [24, 42],
      object: { false: true, true: false },
      function: () => { return 42; }
    };
    expect(Utils.removeAllObjectKeys(testObject)).toEqual(true);
    expect(testObject).toEqual({});
    // End formatting tests
    done();
  });


});
