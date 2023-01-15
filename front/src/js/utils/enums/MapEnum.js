export default Object.freeze({
  newMarkRange: 200000000/*200*/, // TODO fallback to 200 when roles are implement server side
  socialMarkRange: 100,
  mapBounds: window.L.latLngBounds(
    window.L.latLng(-89.98155760646617, -180),
    window.L.latLng(89.99346179538875, 180)
  )
});
