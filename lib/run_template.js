var fs              = require('fs');
var gitClone        = require('git-clone');
var mkdirp          = require('mkdirp');
var rimraf          = require('rimraf');
var join            = require('path').join;
var tmp             = require('tmp');

var getTemplatePath = require('./template_path');
var parser          = require('./parser');
var Context         = require('./Context');
var evaluate        = require('./evaluate');

module.exports = runTemplate;
function runTemplate(template, targetPath, cb) {

    var templatePath    = null;
    var plan            = null;

    if (fs.existsSync(targetPath)) {
        return cb(new Error("exists: " + targetPath));
    }

    getTemplatePath(template, '.', function(err, tp) {
        if (err) return cb(err);
        if (tp.type === 'local') {
            templatePath = tp.path;
            _loadPlan();
        } else {
            _cloneRepo(tp);
        }
    });

    function _cloneRepo(repo) {
        tmp.dir({unsafeCleanup: true}, function(err, tmpDir) {
            if (err) return cb(err);
            templatePath = join(tmpDir, 'clone');
            gitClone(repo.url, templatePath, {shallow: true}, function(err) {
                if (err) return cb(err);
                rimraf(join(templatePath, '.git'), function(err) {
                    if (err) return cb(err);
                    _loadPlan();
                });
            });
        });
    }

    function _loadPlan() {

        console.log(templatePath);

        var planSource;
        try {
            planSource = fs.readFileSync(join(templatePath, 'plan.tpl'), 'utf8');
        } catch (err) {
            planSource = 'tree';
        }

        try {
            plan = parser.parse(planSource, {startRule: 'Script'});
        } catch (err) {
            // TODO: need a way to return a descriptive error message
            // with optional detailed error information.
            return cb(err);
        }

        _createTargetDirectory();

    }

    function _createTargetDirectory() {

        try {
            mkdirp.sync(targetPath);
        } catch (err) {
            // TODO: again, need a nice way of reporting this
            return cb(err);
        }

        _run();

    }

    function _run() {

        var ctx = new Context(templatePath, targetPath);

        evaluate.run(plan, ctx, function(err) {
            if (err) return cb(err);
            cb();
        });

    }

}