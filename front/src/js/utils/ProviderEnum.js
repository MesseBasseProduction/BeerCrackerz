export default Object.freeze({
  planOsm: window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 5, // Don't allow dezooming too far from map so it always stay fully visible
    maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
    maxZoom: 21,
  }),
  satEsri: window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri Imagery</a>',
    minZoom: 5, // Don't allow dezooming too far from map so it always stay fully visible
    maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
    maxZoom: 21
  })
});
