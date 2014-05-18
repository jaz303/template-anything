var path = require('path');
var fs = require('fs');
var githubUser = require('./github_username');

exports.resolve = resolveTemplate;

function resolveTemplate(tplRef, relativeTo, cb) {

    var candidatePath = path.join(relativeTo, tplRef);

    fs.stat(candidatePath, function(err, stat) {
        if (err || !stat.isDirectory()) {
            tryUrl();
        } else {
            cb(null, {
                type    : 'local',
                path    : candidatePath
            });
        }
    });

    function tryUrl() {
        
        // github: user/repo
        if (tplRef.match(/^[a-z0-9_-]+\/[a-z0-9_-]+$/i)) {
            
            cb(null, {
                type    : 'git',
                url     : 'git@github.com:' + tplRef + '.git'
            });

        // github: repo
        } else if (tplRef.match(/^[a-z0-9_-]+$/)) {

            githubUser(function(err, username) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, {
                        type    : 'git',
                        url     : 'git@github.com:' + username + '/' + tplRef + '.git'
                    });
                }
            });

        // just assume a git url
        // FIXME: this is weak.
        } else {

            cb(null, {
                type    : 'git',
                url     : tplRef
            });

        }
    }

}
