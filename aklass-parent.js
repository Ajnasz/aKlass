/* jslint node: true */
(function (context) {

    function skipKey(key) {
        var keys = {
            '$superb': 1,
            '$super': 1
        };
        return !keys.hasOwnProperty(key);
    }

    function mix(parent, mixin) {
        var prop;

        for (prop in mixin) {
            if (mixin.hasOwnProperty(prop) && skipKey(prop)) {
                parent[prop] = mixin[prop];
            }
        }
    }

    function addMixins(Class, mixins) {
        var index, mixinLength, mixin;

        for (index = 0, mixinLength = mixins.length; index < mixinLength; index += 1) {
            mixin = mixins[index];
            if (mixin.prototype) {
                mixin = mixin.prototype;
            }
            mix(Class.prototype, mixin);
        }
    }

    function addStatics(statics, Class) {
        mix(statics, Class);
    }

    function inherit(parent, proto) {
    }

    function extend(parent, proto) {
        var Class, Parent, key, mixin, index, mixinLength, constructor, i;

        Class = function () {
            if (this.initialize) {
                this.initialize();
            }
        };

        if (parent) {

            // inherit prototype
            mix(Class.prototype, parent.prototype);

            // mix statics
            mix(Class, parent);

            // if no both super and superp and want to access to
            // superp.initialize it makes much slower the construction when
            // instanciate a inherited class.
            Class.$super = parent;
            Class.$superp = parent.prototype;
        }

        if (proto.mixins) {
            addMixins(Class, proto.mixins);
            delete proto.mixins;
        }

        if (proto.statics) {
            addStatics(Class, proto.statics);
            delete proto.statics;
        }

        function getInheritedFunction(parent, i) {
            return function () {
                this.parent = Class.$superp[i];
                return proto[i].apply(this, arguments);
            };
        }

        if (parent) {
            for (i in proto) {
                if (proto.hasOwnProperty(i)) {
                    if (typeof parent.prototype[i] === 'function') {
                        Class.prototype[i] = getInheritedFunction(parent, i);
                    } else {
                        Class.prototype[i] = proto[i];
                    }
                }
            }
        } else {
            mix(Class.prototype, proto);
        }

        return Class;
    }

    function klass(proto) {
        return extend(null, proto);
    }

    context.aKlassp = {
        klass: klass,
        extend: extend
    };

    if (typeof module === 'object' && module.exports) {
        exports.aKlass = context.aKlass;
    }

}(this));
