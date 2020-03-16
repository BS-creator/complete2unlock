'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $translateProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);

  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/lang/',
    suffix: '.json'
  });
  if ((navigator.language || navigator.userLanguage).indexOf('de') !== -1)
    $translateProvider.preferredLanguage('de');
  else if ((navigator.language || navigator.userLanguage).indexOf('es') !== -1)
    $translateProvider.preferredLanguage('es');
  else if ((navigator.language || navigator.userLanguage).indexOf('idn') !== -1)
    $translateProvider.preferredLanguage('idn');
  else if ((navigator.language || navigator.userLanguage).indexOf('prt') !== -1)
    $translateProvider.preferredLanguage('prt');
  else
    $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage(['en']);

  /*window.GoogleAuth; // Google Auth object.
  window.handleClientLoad = function () {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    if(!gapi)
      return;
    gapi.load('client:auth2', ()  => {
      console.log('gload');
      gapi.client.init({
        'clientId': '324982300888-spm3g8hiqfncehetc2oqvoh94p9s0i4p.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
      }).then(function() {
        window.GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        //window.GoogleAuth.isSignedIn.listen(() => ));
      });
    });
  }
  window.handleClientLoad();*/
}
