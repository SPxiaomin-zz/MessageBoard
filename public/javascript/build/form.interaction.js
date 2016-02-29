/* jshint browser:true,devel:true */

function addLoadEvent(newFunc) {
    var func = window.onload;

    if ( typeof func !== 'function' ) {
        window.onload = newFunc;
    } else {
        window.onload = function() {
            func();
            newFunc();
        };
    }
}

var EventUtil = {
    addHandler: function(element, type, handler) {
        if ( element.addEventListener ) {
            element.addEventListener(type, handler, false);
        } else if ( element.attachEvent ) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    preventDefault: function(event) {
        if ( event.preventDefault ) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};

function throttle(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        method.call(context);
    }, 100);
}

function scrollTop() {
    var btn = document.getElementById("js_back_to_top");
    var timer;
    var isTop;

    function handleScrollEvent() {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;

        if ( osTop >= 30 ) {
            btn.className = 'show';
        } else {
            btn.className = 'hide';
        }
    }

    EventUtil.addHandler(window, 'scroll', function() {
        throttle(handleScrollEvent);

        if ( !isTop ) {
            clearTimeout(timer);
        }
        isTop = false;
    });

    function scroll() {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        var speed = Math.ceil(osTop / 13);

        document.documentElement.scrollTop = document.body.scrollTop = osTop - speed;

        isTop = true;

        if ( osTop > 0 ) {
            timer = setTimeout(scroll, 30);
        }
    }

    EventUtil.addHandler(btn, 'click', function(event) {
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);

        timer = setTimeout(scroll, 30);
    });
}

addLoadEvent(scrollTop);
