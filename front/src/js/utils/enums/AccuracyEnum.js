export default Object.freeze({
  optimized: {
    enableHighAccuracy: false, // Less consuption
    maximumAge: 30000, // A position will last 30s maximum
    timeout: 29000 // A position is updated in 29s maximum
  },
  high: {
    enableHighAccuracy: true, // More consuption, better position
    maximumAge: 1000, // A position will last 1s maximum
    timeout: 900, // A position is updated in 0.9s maximum
  }
});
