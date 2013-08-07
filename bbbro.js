(function(){

	/* BBBro setup */

	onBackboneReady(brotifyBackbone);

	function brotifyBackbone(backbone) {
		console.log('BBBRo: backbone detected', backbone.VERSION);
		removeWatchers();
		var original = backbone.View.prototype._ensureElement;
		backbone.View.prototype._ensureElement = function() {
			var res = original.apply(this, arguments);
			this.el.className += ' bbbro-view';
			this.el['bbbro-view'] = this;
			return res;
		}
	}

	/* BBBro helpers */

	function onBackboneReady(callback) {
		initWatchers();
		var backboneDetected = false;
		window.watch('Backbone', function(name, oldval, backbone){
			if (!backbone) {
				return backbone;
			}

			if (typeof backbone.View === 'function') {
				backboneDetected = true;
				callback(backbone);
			} else {
				backbone.watch('History', function(name, oldval, history) {
					if(typeof history === 'function'){
						backboneDetected = true;
						callback(backbone);
					}
					return history;
				});
			}

			return backbone;
		});
		setTimeout(function(){
			if(!backboneDetected) {
				console.log('BBBRo: no backbone detected');
				removeWatchers();
			}
		}, 10 * 1000);
	}

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
		window.unwatch('Backbone');
		Backbone && Backbone.unwatch('History');
	}

})();
