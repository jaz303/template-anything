var fs              = require('fs');
var gitClone        = require('git-clone');
var mkdirp          = require('mkdirp');
var rimraf          = require('rimraf');
var join            = require('path').join;
var tmp             = require('tmp');

var Context         = require('./Context');
var Environment     = require('./Environment');
var evaluate        = require('./evaluate');
var parser          = require('./parser');
var setupDirectives = require('./directives');
var getTemplatePath = require('./template_path');

module.exports = runTemplate;
function runTemplate(template, targetPath, cb) {

    var templatePath    = null;
    var plan            = null;

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
                })
            })
        })
    }

    function _loadPlan() {

        var planSource = 'tree';
        try {
            planSource = fs.readFileSync(path.join(templatePath, 'plan.tpl'), 'utf8');
        } catch (err) {
            // do nothing; use default plan.
            // TODO: should we log this?
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

    }

    function _run() {

        var env = new Environment();
        setupDirectives(env);

        var ctx = new Context(env, templatePath, targetPath);

        evaluate.run(plan, ctx, function(err) {
            if (err) return cb(err);
            cb();
        });

    }

}