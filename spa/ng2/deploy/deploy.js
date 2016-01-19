var fs = require('fs');
var zip = require('zip-dir');
var path = require('path')
var jsforce = require('jsforce');
var meta = require('jsforce-metadata-tools');
var options;

function FileListPlugin(opt) {
  options = opt;
}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    fs.readFile('../../config/.session', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var obj = JSON.parse(data);

        var conn = new jsforce.Connection({
            instanceUrl: obj.instanceUrl,
            accessToken: obj.accessToken
        });

        var staticResource = new require('node-zip')();

        for (var filename in compilation.assets) {
          var file = fs.readFileSync(options.path + filename, 'utf8');
          staticResource.file(filename, file);
        }

        var staticResourceZip = staticResource.generate({base64: true, compression: 'DEFLATE'});
        var metaData = {
          fullName: options.name,
          content: staticResourceZip,
          contentType: 'application/zip',
          cacheControl: 'Public'
        };
        conn.metadata.upsert('StaticResource', [metaData], function(err, results){
          if(err) throw err;
          if(results) console.log('StaticResource: ', results);
        });

        conn.identity(function(err, res) {
          if (err) { return console.error(err); }
          console.log("user ID: " + res.user_id);
          console.log("organization ID: " + res.organization_id);
          console.log("username: " + res.username);
          console.log("display name: " + res.display_name);
        });
    });

    callback();
  });
};

module.exports = FileListPlugin;
