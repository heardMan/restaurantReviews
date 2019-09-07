let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
 
  fetchNeighborhoods();
  fetchCuisines();
  initMap(); // added 
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoibWFya2hlYXJkIiwiYSI6ImNqcG90bGp2aTA3MnozeG54Y3V0Y2JtZHgifQ.b4kPa-mg7sek6YSvgquEYQ',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <as href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  let cIndex;
  if(cSelect.selectedIndex === -1 ) cIndex = 0;
  else cIndex = cSelect.selectedIndex;

  let nIndex;
  if(nSelect.selectedIndex === -1 ) nIndex = 0;
  else nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  
  const neighborhood = nSelect[nIndex].value;



  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach((restaurant, i ) => {
    ul.append(createRestaurantHTML(restaurant, i , self.restaurants.length));
  });
  addMarkersToMap();
  addARIAtoMarkers();
  modifyAttributionLinksARIA();


}

// /**
//  * Get all attribution links
//  */
// getAttributionLinks = () => {
//   return document.querySelectorAll('.leaflet-control-attribution a');
// }

// /**
//  * Change Attribution link Aria Labels
//  */
// modifyAttributionLinksARIA = () => {
//   const links = getAttributionLinks();
//   const lastLink = document.querySelectorAll('.leaflet-control-attribution as')[0];
//   console.log(links);
//   links.forEach(link => {
//     link.setAttribute('aria-label', `Map Attribution Link ${link.textContent}`);
//   })
//   lastLink.setAttribute('aria-label', `Map Attribution Link ${lastLink.textContent}`);
// }


/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant, i, length) => {
  const li = document.createElement('li');
//console.log(restaurant);
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('alt', `Image of ${restaurant["main-photograph-alt"]}`);
  image.setAttribute('aria-label', `Image of ${restaurant["main-photograph-alt"]}`);
  image.setAttribute('tabindex', '0');

  li.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  name.setAttribute('aria-label', `${restaurant.name}`);
  name.setAttribute('tabindex', '0');
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute('aria-label', `Located in ${restaurant.neighborhood}`);
  neighborhood.setAttribute('tabindex', '0');
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', `Street Address ${restaurant.address}`);
  address.setAttribute('tabindex', '0');
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);
  li.setAttribute('aria-label', `Matching Resaurant ${i+1} of ${length}`);
  li.setAttribute('tabindex', '0');


  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

} 

/**
 * Set custom attributes for markers
 */
addARIAtoMarkers = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    const marker = getMarker(restaurant);
    marker.setAttribute('role', `link`);
    marker.setAttribute('href', `./restaurant.html?id=${restaurant.id}`);
  })
}

/**
 * get and return an array of rendered markers
 */
getMarker = (restaurant) => {
  return document.querySelector(`.restaurant-${restaurant.id}`);
}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

