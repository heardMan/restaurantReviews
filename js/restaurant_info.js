let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
  
  
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });

 

      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibWFya2hlYXJkIiwiYSI6ImNqcG90bGp2aTA3MnozeG54Y3V0Y2JtZHgifQ.b4kPa-mg7sek6YSvgquEYQ'
      }).addTo(newMap);


      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
      modifyAttributionLinksARIA();
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */


fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');

  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('tabindex', "0");

    const day = document.createElement('td');
    day.innerHTML = key;
    // day.setAttribute('aria-label', key);
    // day.setAttribute('tabindex', "0");
    row.appendChild(day);

    const time = document.createElement('td');

    if(operatingHours[key].includes(', ')){
      const hourSet = operatingHours[key].split(', ');
      let ariaLabelString = '';
      hourSet.forEach(setOfHours => {
        const times = document.createElement('div');
        times.textContent = setOfHours;
        ariaLabelString += ` ${setOfHours}`;
        time.appendChild(times);

      });
      // time.setAttribute('aria-label', ariaLabelString)
    }
    else {
      time.innerHTML = operatingHours[key];
      // time.setAttribute('aria-label', operatingHours[key])
    }
    // time.setAttribute('tabindex', '0')
    
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.setAttribute('aria-label', 'No reviews yet.');
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach((review, i) => {
    ul.appendChild(createReviewHTML(review, i+1, reviews.length));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review, i , length) => {
  const li = document.createElement('li');

  const reviewInfo = document.createElement('div');

  const name = document.createElement('p');
  name.innerHTML = review.name;
  reviewInfo.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  reviewInfo.appendChild(date);

  const rating = document.createElement('p');

  rating.innerHTML = calculateRating(review.rating);
  reviewInfo.appendChild(rating);

  const ariaLabelString = `This is a ${review.rating} thumbs up review written by ${review.name} on ${review.date}`;

  reviewInfo.setAttribute('aria-label', ariaLabelString);
  reviewInfo.setAttribute('tabindex', '0');
  li.appendChild(reviewInfo);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute('aria-label', review.comments);
  comments.setAttribute('tabindex', '0');
  
  li.appendChild(comments);
  
  li.setAttribute('role', 'listitem');
  li.setAttribute('aria-label', `List item ${i} of ${length}`);
  li.setAttribute('tabindex', '0');

  return li;
}

/**
 * Calculate Rating
 */
calculateRating = (length) => {
  let ratingString = '';
  for(let i = 0; i<length; i++){
    ratingString += '👍';
  }
  return ratingString;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('id', `breadCrumb-${restaurant.name}`);
  li.setAttribute('aria-current', `page`);
  li.setAttribute('tabindex', '0');

  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
