module.exports = function(env) {

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    env.defineFunctions({

        append: function(str, suffix) {
            return ('' + str) + suffix;
        },

        prepend: function(str, prefix) {
            return ('' + prefix) + str;
        },

        replace: function(str, needle, replacement) {
            return ('' + str).replace(new RegExp(escapeRegExp(needle), 'g'), replacement);
        },

        dasherize: function(str) {
            return ('' + str).replace(/\s+/g, '-');
        },

        substr: function(str, start, length) {
            return ('' + str).substr(start, length);
        },

        substring: function(str, start, end) {
            return ('' + str).substring(start, end);
        },

        downcase: function(str) {
            return ('' + str).toLowerCase();
        },

        upcase: function(str) {
            return ('' + str).toUpperCase();
        },

        trim: function(str) {
            return ('' + str).trim();
        }

    });

}