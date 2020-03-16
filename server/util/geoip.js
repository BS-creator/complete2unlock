var maxmind = require('maxmind');
var http = require('http');
var fs = require('fs');
var targz = require('targz');
var geoip;

var request = http.get('http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz', function(response) {
  response.pipe(fs.createWriteStream('/tmp/GeoLite2-City.tar.gz'))
    .on('finish', () => {
      targz.decompress({
        src: '/tmp/GeoLite2-City.tar.gz',
        dest: '/tmp/GeoLite2-City/'
      }, function(err) {
        if (err)
          return console.log('[GEOIP]', err);

        fs.readdir('/tmp/GeoLite2-City/', function(err, items) {
          maxmind.open(`/tmp/GeoLite2-City/${items[0]}/GeoLite2-City.mmdb`, (err, cityLookup) => {
            if (err)
              return console.log('[GEOIP]', err);
            console.log('[GEOIP] ready');
            geoip = cityLookup;
          });
        });


      });
    });
});


module.exports = {
  get: function(ip) {
    if (!geoip)
      throw new Error('geoip not ready');
    if (!ip)
      throw new Error('no ip provided');
    return geoip.get(ip);
  },
  validate: function(ip) {
    return geoip.validate(ip);
  }
};
