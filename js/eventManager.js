var EventManager = {
    subscribe: function(event, param, fn) {
        $(this).bind(event, param, fn);
    },
    unsubscribe: function(event, param, fn) {
        $(this).unbind(event, param, fn);
    },
    publish: function(event, param) {
        $(this).trigger(event, param);
    }
};