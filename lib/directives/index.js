function Directive(name) {
	this.name = name;
	this.params = {};
	this.positions = [];
	this.requiredParamGroups = null;
	this.fn = null;
}

Directive.prototype.param = function(name, opts) {
	this.positions.push(name);
	this.params[name] = opts || {};
	return this;
}

Directive.prototype.requiredParams = function(groups) {
	this.requiredParamGroups = groups;
	return this;
}

Directive.prototype.handler = function(fn) {
	this.fn = fn;
	return this;
}

Directive.prototype.resolveArgs = function(positional, named) {

	if (positional.length > this.positions.length) {
		throw new Error("'" + this.name + "' accepts a maximum of " + this.positions.length + " arguments");
	}

	var args = {};

	// 1. positional args
	for (var i = 0; i < positional.length; ++i) {
        args[this.positions[i]] = positional[i];
    }

    // 2. named args
    for (var argName in named) {
        if (!(argName in this.params)) {
            throw new Error("'" + this.name + "' does not accept argument '" + argName + "'");
        }
        args[argName] = named[argName];
    }

    // 3. check default values/required params/types
    for (var argName in this.params) {
    	var p = this.params[argName];
    	if (('defaultValue' in p) && !(argName in args)) {
    		args[argName] = p.defaultValue;
    	}
    	if (p.required && !(argName in args)) {
    		throw new Error("'" + this.name + "' argument missing: '" + argName + "'");
    	}
    	// TODO(jwf): partial-pipeline test
    }

    // 4. handle requiredParamGroups
    if (this.requiredParamGroups) {
    	var matchingGroupCount = 0;
    	this.requiredParamGroups.forEach(function(group) {
    		for (var requirementName in group) {
    			var isRequired = group[requirementName];
    			if (isRequired != (requirementName in args)) {
    				return;
    			}
    		}
    		matchingGroupCount++;
    	});
    	if (matchingGroupCount !== 1) {
    		// TODO(jwf): fix this error message
    		throw new Error("argument grouping error");
    	}
    }

	// 5. translate arg names to option names expected by raw handlers
	var opts = {};
    for (var argName in args) {
    	opts[this.params[argName].key || argName] = args[argName];
    }

    return opts;

}

Directive.prototype.invoke = function(ctx, env, args, cb) {
	this.fn(ctx, env, args, cb);
}

function directive(name) {
	var directive = new Directive(name);
	exports[name] = directive;
	return directive;
}

directive('append_line')
	.param('file', {
		required: true
	})
	.param('line', {
		required: true
	})
	.handler(require('./raw/append_line'));

directive('append_string')
	.param('file', {
		required: true
	})
	.param('string', {
		required: true
	})
	.handler(require('./raw/append_string'));

directive('copy')
	.param('src', {
		required: true,
		key: 'sourcePath'
	})
	.param('dest', {
		required: true,
		key: 'destinationPath'
	})
	.handler(require('./raw/copy'));

directive('create_git_repo')
	.param('commit')
	.handler(require('./raw/create_git_repo'));

directive('dir')
	.param('name', {
		required: true,
		key: 'directoryName'
	})
	.handler(require('./raw/dir'));

directive('echo')
	.param('msg', {
		required: true,
		key: 'message'
	})
	.handler(require('./raw/echo'));

directive('prompt')
	.param('name', {
		key: 'varName',
		required: true
	})
	.param('prompt', {
		key: 'prompt'
	})
	.param('default', {
		key: 'defaultValue'
	})
	.param('filter', {
		key: 'filter',
		type: 'partial-pipeline'
	})
	.param('postfilter', {
		key: 'postFilter',
		type: 'partial-pipeline'
	})
	.param('validate', {
		key: 'validate',
		type: 'partial-pipeline'
	})
	.handler(require('./raw/prompt'));

directive('set')
	.param('name', {
		key: 'name',
		required: true
	})
	.param('value', {
		key: 'value',
		required: true
	})
	.handler(require('./raw/set'));

directive('shell')
	.param('cmd', {
		key: 'command',
		required: true
	})
	.handler(require('./raw/shell'));

directive('template')
	.param('src', {
		key: 'templatePath'
	})
	.param('dest', {
		key: 'outputPath'
	})
	.param('inplace', {
		key: 'inplacePath'
	})
	.requiredParams([
		{ src: true, dest: true, inplace: false },
		{ src: false, dest: false, inplace: true }
	])
	.handler(require('./raw/template'));

directive('tree')
	.param('src', {
		key: 'sourceDirectory',
		defaultValue: '.'
	})
	.param('dest', {
		key: 'targetDirectory',
		defaultValue: '.'
	})
	.handler(require('./raw/tree'));

directive('yesno')
	.param('name', {
		key: 'varName',
		required: true
	})
	.param('prompt', {
		key: 'prompt'
	})
	.param('default', {
		key: 'defaultValue'
	})
	.handler(require('./raw/yesno'));
