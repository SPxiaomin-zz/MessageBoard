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


function nameInteraction(nameInput, nameCnt) {
    nameInput.onfocus = function() {
        var nameLength = nameInput.value.trim().length;

        nameCnt.innerHTML = nameLength;

        var re = /[^a-zA-Z \u4e00-\u9fa5]/g;

        if ( re.test(nameInput.value.trim()) || nameLength === 0 || nameLength > 18 ) {
            nameInput.className = 'invalid';
        } else {
            nameInput.className = 'valid';
        }
    };

    nameInput.onkeyup = function() {
        var nameLength = nameInput.value.trim().length;

        nameCnt.innerHTML = nameLength;

        var re = /[^a-zA-Z \u4e00-\u9fa5]/g;

        if ( re.test(nameInput.value.trim()) || nameLength === 0 || nameLength > 18 ) {
            nameInput.className = 'invalid';
        } else {
            nameInput.className = 'valid';
        }
    };
}

function msgInteraction(msgTextarea, msgCnt) {
    msgTextarea.onfocus = function() {
        var msgLength = msgTextarea.value.length;

        msgCnt.innerHTML = msgLength;

        if ( msgLength <= 0 || msgLength > 240 ) {
            msgTextarea.className = 'invalid';
        } else {
            msgTextarea.className = 'valid';
        }
    };

    msgTextarea.onkeyup = function() {
        var msgLength = msgTextarea.value.length;

        msgCnt.innerHTML = msgLength;

        if ( msgLength <= 0 || msgLength > 240 ) {
            msgTextarea.className = 'invalid';
        } else {
            msgTextarea.className = 'valid';
        }
    };
}


function formInteraction() {
    var nameCnt = document.getElementById('js_name_cnt');
    var msgCnt = document.getElementById('js_msg_cnt');
    var formElements = document.forms.js_form.elements;
    var nameInput = formElements.js_name;
    var msgTextarea = formElements.js_msg;

    nameInteraction(nameInput, nameCnt);
    msgInteraction(msgTextarea, msgCnt);
}

addLoadEvent(formInteraction);


function scrollTop() {
    var btn = document.getElementById("js_back_to_top");
    var timer = null;
    var isTop = true;

    window.onscroll = function() {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;

        if ( osTop >= 30 ) {
            btn.className = 'show';
        } else {
            btn.className = 'hide';
        }

        if ( !isTop ) {
            clearTimeout(timer);
        }
        isTop = false;
    };

    function scroll() {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        var speed = Math.ceil(osTop / 13);

        document.documentElement.scrollTop = document.body.scrollTop = osTop - speed;

        isTop = true;

        if ( osTop > 0 ) {
            timer = setTimeout(scroll, 30);
        }
    }

    btn.onclick = function() {
        timer = setTimeout(scroll, 30);

        return false;
    };
}

addLoadEvent(scrollTop);
