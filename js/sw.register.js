/**
 * This is the script that checks to see if a service worker has been registered
 */

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js')
    .then(function (res) {
      console.log('success');
      console.log(res);
    })
    .catch(function (err) {
      console.log('failed');
      console.log(err);
    })
} 