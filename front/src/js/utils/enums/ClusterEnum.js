export default Object.freeze({
  spot: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 360,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-green.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  }),
  shop: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 360,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-blue.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  }),
  bar: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 360,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-red.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  })
});
