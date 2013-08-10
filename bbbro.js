(function(){

	/* BBBro hooks */

	detectBackbone(brotifyBackbone);

	function brotifyBackbone(backbone) {
		console.log('BBBRo-info: backbone detected', backbone.VERSION);
		var original = backbone.View.prototype._ensureElement;
		backbone.View.prototype._ensureElement = function() {
			var res = original.apply(this, arguments);
			this.el.className += ' bbbro-view';
			this.el['bbbro-view'] = this;
			return res;
		}
	}

	/* Backbone detection */

	function detectBackbone(callback) {

		if (isBackboneReady(window.Backbone)) {
			console.log('BBBRo-warn: the page has been started before we made a hook, you might want to refresh');
			return callback(window.Backbone);
		}

		initWatchers();
		var detected = false;

		window.watch('Backbone', function(name, oldval, backbone){
			if (!detect(backbone)) {
				backbone.watch('History', function(name, oldval, history) {
					detect(backbone);
					return history;
				});
			}
			return backbone;
		});

		function detect(backbone) {
			if (isBackboneReady(backbone)) {
				detected = true;
				callback(backbone);
				removeWatchers();
				return true;
			}
		}

		setTimeout(function(){
			if(!detected) {
				console.log('BBBRo-info: no backbone detected in 10 sec');
				removeWatchers();
			}
		}, 10 * 1000);
	}

	function isBackboneReady(backbone) {
		return backbone &&
			backbone.View &&
			backbone.View.prototype &&
			backbone.View.prototype._ensureElement;
	}

	/* Object watchers */

	function initWatchers() {
		if (!Object.prototype.watch) {
		    Object.defineProperty(Object.prototype, "watch", {
		          enumerable: false
		        , configurable: true
		        , writable: false
		        , value: function (prop, handler) {
		            var
		              oldval = this[prop]
		            , newval = oldval
		            , getter = function () {
		                return newval;
		            }
		            , setter = function (val) {
		                oldval = newval;
		                return newval = handler.call(this, prop, oldval, val);
		            }
		            ;

		            if (delete this[prop]) { // can't watch constants
		                Object.defineProperty(this, prop, {
		                      get: getter
		                    , set: setter
		                    , enumerable: true
		                    , configurable: true
		                });
		            }
		        }
		    });
		}

		if (!Object.prototype.unwatch) {
		    Object.defineProperty(Object.prototype, "unwatch", {
		          enumerable: false
		        , configurable: true
		        , writable: false
		        , value: function (prop) {
		            var val = this[prop];
		            delete this[prop]; // remove accessors
		            this[prop] = val;
		        }
		    });
		}
	}

	function removeWatchers() {
		window.unwatch && window.unwatch('Backbone');
		Backbone && Backbone.unwatch && Backbone.unwatch('History');
	}

})();
