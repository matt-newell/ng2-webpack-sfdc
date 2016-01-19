var fs = require('fs');
var zip = require('zip-dir');
var path = require('path')
var jsforce = require('jsforce');

function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // Create a header string for the generated file:
    var filelist = 'In this build:\n\n';
    var dir = './dist';

    zip('/Users/mattnewell/Projects/ng2-webpack-sfdc/spa/ng2/dist', {saveTo: '/Users/mattnewell/Projects/ng2-webpack-sfdc/src/staticresources/ng2.resource'}, function(err, buffer){
        if (err) throw err;
        fs.readFile('../../config/.session', 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
            var obj = JSON.parse(data);

            var conn = new jsforce.Connection({
                instanceUrl: obj.instanceUrl,
                accessToken: obj.accessToken
            });
            var metaDataPayload = [];
            var metaData = {
              fullName: 'ng2',
              content: buffer,
              contentType: 'application/zip',
              cacheControl: 'Public'
            }
            metaDataPayload.push(metaData);
            conn.metadata.upsert('StaticResource', metaDataPayload, function(err, results){
              if(err) throw err;
            });

            var records = [];
            conn.identity(function(err, res) {
              if (err) { return console.error(err); }
              console.log("user ID: " + res.user_id);
              console.log("organization ID: " + res.organization_id);
              console.log("username: " + res.username);
              console.log("display name: " + res.display_name);
            });
        });
    });

    // Insert this list into the Webpack build as a new file asset:
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist;
      },
      size: function() {
        return filelist.length;
      }
    };

    callback();
  });
};

module.exports = FileListPlugin;
