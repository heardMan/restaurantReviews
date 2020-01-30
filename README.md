# Restaurant Reviews

<h2>Welcome!</h2>
<p>Restaurant Reviews is map based search application designed to help users find nearby restaurants.</p>
<p>Search for your favorite retaurant by Neighborhood</p>
<p>Search for your favorite retaurant by Cuisine Type</p>
<p>Click view details to see more information on restaurant.</p>
<p></p>
<h2>Documentation<h2>
<p></p>
<h3>Architecture</h3>
<p>
  This application is fully accessible a Progressive Web Application.
  The Restaurant Reviews uses semantic HTML where possible and modifies the accessibilty tree where necessary.
  Currently, the data for the application comes from a simple text file (JSON if you want to get technical). 
  The application has abstracted database functions so that pairing this front end application with a database should be a breeze!
</p>

<p>
  Restaurant Reviews is also an offline first application and as such it has a Service Worker file.
  While service worker files are supported by nearly all modern browsers there are still many legacy browsers that will not support them. As a result a polyfill is included to extend service worker functionality to those borwsers that do not natively support service workers.
</p>

<p>Here is a brief over view of the directory structure</p>

<p>This application has 2 views:</p>

<ul>
 <li>index.html</li>
 <li>restaurant.html</li>
</ul>

<p>Each view has it's own controller --</p>
<ul>
 <li>main.js is coupled with index.html</li>
 <li>restaurant_info.js is coupled with restaurant.html</li>
</ul>

<p>The model of the application is set in dbhelper.js and currently points to the JSON files located in the <code>data</code> directory.</p>

<h3>Leaflet</h3>
<p>
  All the maps in the application were generated using a great Javascript Library called LeafletJS.
  For more information on the Leaflet Opensource Map Library please visit the 
  <a href="https://leafletjs.com/">Leaflet Documentation.</a>
  The leaflet library is included in the application so that maps are available even without an internet connection.
</p>

<h3>Hosting</h3>
<p>
  This application is hosted using github pages!
  Github pages is a great and effective 
</p>

