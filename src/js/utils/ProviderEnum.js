export default Object.freeze({
  planOsm: window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 21,
    maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
    minZoom: 2 // Don't allow dezooming too far from map so it always stay fully visible
  }),
  planGeo: window.L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    minZoom: 2,
    maxZoom: 21,
    apikey: 'choisirgeoportail',
    format: 'image/png',
    style: 'normal'
  }),
  satEsri: window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri Imagery</a>',
    maxZoom: 21,
    maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
    minZoom: 2 // Don't allow dezooming too far from map so it always stay fully visible
  }),
  satGeo: window.L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    apikey: 'choisirgeoportail',
    format: 'image/jpeg',
    style: 'normal'
  })
});
