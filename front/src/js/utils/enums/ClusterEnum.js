export default Object.freeze({
  spot: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 0,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-green.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    },
    polygonOptions: {
      fillColor: '#3ABC30',
      color: '#3ABC30',
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.3
    }
  }),
  shop: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 0,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-blue.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    },
    polygonOptions: {
      fillColor: '#4295CF',
      color: '#4295CF',
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.3
    }
  }),
  bar: new window.L.MarkerClusterGroup({
    animateAddingMarkers: true,
    disableClusteringAtZoom: 18,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
    maxClusterRadius: 0,
    iconCreateFunction: cluster => {
      return window.L.divIcon({
        className: 'cluster-icon-wrapper',
        html: `
          <img src="/static/img/marker/marker-icon-red.png" class="cluster-icon">
          <span class="cluster-label">${cluster.getChildCount()}</span>
        `
      });
    },
    polygonOptions: {
      fillColor: '#D0465D',
      color: '#D0465D',
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.3
    }
  })
});
