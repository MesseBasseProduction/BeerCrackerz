export default Object.freeze({
  spot: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/cluster-icon-green.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  }),
  shop: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/cluster-icon-blue.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  }),
  bar: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/cluster-icon-red.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    }
  })
});
