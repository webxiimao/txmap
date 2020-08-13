function point(a) {
    var e = a.split(",");
    this.lat = parseFloat(e[0]), this.lng = parseFloat(e[1])
}

function createBound(a) {
    for (var e = [], t = a.split("|"), n = 0; n < t.length; n++) e[n] = new point(t[n]);
    return e.pop(), e
}

function inRegion(a, e, t) {
    var n, i, r, o = 0;
    i = t[0];
    for (var l = t.length, s = 1; s <= l; s++) r = t[s % l], a > Math.min(i.lat, r.lat) && a <= Math.max(i.lat, r.lat) && e <= Math.max(i.lng, r.lng) && i.lat != r.lat && (n = (a - i.lat) * (r.lng - i.lng) / (r.lat - i.lat) + i.lng, (i.lng == r.lng || e <= n) && o++), i = r;
    return o % 2 != 0
}

function switchDisplay(a) {
    a ? (container.style.display = "none", panoholder.style.display = "block", $("#heatmap_result").hide()) : (container.style.display = "block", panoholder.style.display = "none", $("#heatmap_result").show())
}

function CustomControl(a) {
    function e() {
        switchDisplay(!1), marker.setMap(MAP), marker.setPosition(latlng), MAP.setCenter(latlng), MAP.setZoom(zoom), info = null, info = new qq.maps.InfoWindow({
            map: MAP,
            content: '<div style="width:80px;font-size:12px;padding-left:10px;padding-right:10px">鍒氭墠鍦ㄨ繖閲�</div>'
        }), info.setPosition(marker), info.setContent('<div style="width:80px;font-size:12px;padding-left:10px;padding-right:10px">鍒氭墠鍦ㄨ繖閲�</div>'), qq.maps.event.trigger(MAP, "resize"), info.open(), marker.id = pano.getPano(), marker.heading = pano.getPov().heading, marker.pitch = pano.getPov().pitch, pano.setPano(null), marker.setOptions({
            clickable: !0
        }), panel.className = "panel1", pad.style.display = "none", pano_layer.setMap(null), hasEnteredPano = !1
    }
    a.index = 1, a.innerHTML = "<b>閫€鍑鸿鏅�</b>", qq.maps.event.addDomListener(a, "click", e), qq.maps.event.addDomListener(a, "mouseover", function () {
        a.style.filter = "alpha(opacity=80)", a.style.opacity = .8
    }), qq.maps.event.addDomListener(a, "mouseout", function () {
        a.style.filter = "alpha(opacity=50)", a.style.opacity = .5
    })
}

function filterByboundary(a, e) {
    return a = $.grep(a, function (a) {
        return inRegion(a.lat, a.lng, e)
    })
}

function has_input_max() {
    return $("#input_max").length > 0
}

function syncTimeWithServer(a) {
    $.ajax({
        url: url_prefix + "syncTime.php"
    }).done(function (e) {
        a(e)
    })
}

function calcNowStrWithRange(a, e) {
    var t = compatibleDateTime(a),
        n = new Date(t).getTime(),
        i = 1e3 * e * 60,
        r = n - n % i,
        o = new Date(r).format("YYYY-MM-dd hh:mm:ss");
    return o
}

function initMap(a, e, n) {
    MAP = new qq.maps.Map(document.getElementById("map-canvas"), {
        center: new qq.maps.LatLng(a, e),
        minZoom: 11,
        maxZoom: 17,
        zoom: n
    });
    var i = new qq.maps.TrafficLayer;
    i.setMap(MAP), MAP.setOptions({
        draggableCursor: "default"
    }), qq.maps.event.addListener(MAP, "click", function (a) {
        isLayerShowed && panoService.getPano(a.latLng, 1e3, function (e) {
            clearTimeout(t), e ? (pano.setPano(e.svid), pano.setPov({
                heading: e.heading,
                pitch: e.pitch
            }), marker2.setMap(null), switchDisplay(!0), isLayerShowed = !1, pano_layer.setMap(null), latlng = a.latLng, hasEnteredPano = !0) : (label.setMap(MAP), label.setPosition(a.latLng), t = setTimeout(function () {
                label.setMap(null)
            }, 1e3))
        })
    }), qq.maps.event.addListener(MAP, "mousemove", function (a) {
        if (isLayerShowed) {
            if (old_latlng && a.latLng.getLat() == old_latlng.getLat() && a.latLng.getLng() == old_latlng.getLng()) return;
            old_latlng = a.latLng, marker2.setPosition(a.latLng), marker2.setOptions({
                clickable: !1
            }), pad.style.left = a.pixel.getX() - 62 + "px", pad.style.top = a.pixel.getY() - 163 + "px", static_img.style.opacity = .7, static_url = encodeURI("//apis.map.qq.com/ws/streetview/v1/image?size=97x70&location=" + a.latLng.getLat() + "," + a.latLng.getLng() + "&pitch=0&heading=0&key=TNBBZ-6MLKQ-QT75L-GP73O-KEPIH-4WBIV"), static_img.src = static_url, tip.innerHTML = "姝ｅ湪鍔犺浇...", hasData = !0, url3 = encodeURI("//apis.map.qq.com/ws/geocoder/v1/?location=" + a.latLng.getLat() + "," + a.latLng.getLng() + "&key=TNBBZ-6MLKQ-QT75L-GP73O-KEPIH-4WBIV&output=jsonp&&callback=?"), $.getJSON(url3, function (a) {
                tip_addr = a.result.address_component.street ? a.result.address_component.street : ""
            })
        }
    }), qq.maps.event.addListener(MAP, "mouseover", function (a) {
        isLayerShowed && (old_latlng = a.latLng, marker2.setMap(MAP), r = !1)
    });
    var r = !0;
    if (qq.maps.event.addListener(MAP, "mouseout", function () {
            isLayerShowed && (marker2.setMap(null), pad.style.display = "none", r = !0)
        }), qq.maps.event.addListener(marker, "click", function () {
            info2.close(), hasEnteredPano = !0, switchDisplay(!0), info.open(), pano.setPano(marker.id), pano.setPov({
                heading: marker.heading,
                pitch: marker.pitch
            })
        }), qq.maps.event.addDomListener(static_img, "error", function () {
            static_img.src = "//3gimg.qq.com/tencentMapTouch/lbs/qqmap_big_data/images/nodata.png", static_img.style.width = "97px", static_img.style.height = "70px", hasData = !1
        }), qq.maps.event.addDomListener(static_img, "load", function () {
            r || (pad.style.display = "block"), static_img.style.opacity = 1, static_img.parentNode || (pad.style.display = "block", pad.appendChild(static_img)), hasData ? tip.innerHTML = tip_addr : tip.innerHTML = "鏃犳暟鎹�"
        }), !customDiv) {
        customDiv = document.createElement("div"), customDiv.id = "customDiv";
        new CustomControl(customDiv);
        pano.controls[qq.maps.ControlPosition.LEFT_TOP].push(customDiv)
    }
}

function generateMap(a, e, t) {
    $.get(url_prefix + "getRegionHeatMapInfoById.php", {
        id: a,
        sub_domain: SUBDOMAIN
    }, function (n) {
        var i, r = $.parseJSON(n),
            o = r.boundary,
            l = r.center_gcj,
            s = r.upper_right,
            p = r.lower_left,
            m = parseFloat(s.split(",")[0]) - parseFloat(p.split(",")[0]),
            c = r.max;
        i = m > .015 ? 15 : m < .05 && m > .01 ? 16 : 17;
        var d = l.split(","),
            _ = parseFloat(d[0]),
            g = parseFloat(d[1]);
        if (MAP ? (MAP.setZoom(i), MAP.setCenter(new qq.maps.LatLng(_, g)), POLYGON.setMap(null)) : initMap(_, g, i), o) {
            var h = createBound(o),
                u = [];
            $.each(h, function (a, e) {
                u.push(new qq.maps.LatLng(e.lat, e.lng))
            }), POLYGON = new qq.maps.Polygon({
                map: MAP,
                path: u,
                editable: !1,
                clickable: !1,
                strokeWeight: 3,
                strokeColor: "#0000ff",
                fillColor: new qq.maps.Color(0, 0, 0, 0)
            }), POLYGON.setMap(MAP)
        }
        c ? (c = parseInt(n, 10), generateMaxContainer(c), t([_, g], c)) : $.get(url_prefix + "getHeatMapInitMaxByRegionId.php", {
            region_id: a,
            date: e,
            sub_domain: SUBDOMAIN
        }, function (a) {
            c = parseInt(a, 10), generateMaxContainer(c), t([_, g], c)
        })
    })
}

function generateMaxContainer(a) {
    var e = Math.floor(.25 * a),
        t = Math.floor(.55 * a),
        n = Math.floor(.85 * a),
        i = $("#heatmap_mark");
    i.children(".heatmap_blue").html("0-" + e), i.children(".heatmap_green").html(e + 1 + "-" + t), i.children(".heatmap_yellow").html(t + 1 + "-" + n), i.children(".heatmap_red").html(n + 1 + "-" + a), i.children(".heatmap_result_red").html(">" + a)
}

function restoreHeatPoints(a, e) {
    var t, n, i, r = e[0],
        o = e[1],
        l = [];
    return $.each(a, function (a, e) {
        t = a.split(","), n = (1e4 * r + parseInt(t[0], 10)) / 1e4, i = (1e4 * o + parseInt(t[1], 10)) / 1e4, l.push({
            lat: n,
            lng: i,
            count: e
        })
    }), l
}

function generateHeatDataByTime(a, e, t) {
    var n = 36e5,
        i = 3e5;
    a = compatibleDateTime(a);
    var r = new Date(a).getTime();
    r -= r % i;
    for (var o = r - n, l = r - i, s = {}, p = o; p <= l; p += i) {
        var m = new Date(p).format("YYYY-MM-dd hh:mm:ss"),
            c = e[m].split("|");
        c.length - 1;
        $.each(c, function (a, e) {
            var t = e.split(","),
                n = 1;
            3 === t.length && (n = parseInt(t[2], 10));
            var i = $.trim(t[0] + "," + t[1]);
            i in s ? s[i] += n : s[i] = n
        })
    }
    var d = restoreHeatPoints(s, t);
    return d
}

function drawHeatMap(a, e, t, n, i) {
    var r = generateHeatDataByTime(a, e, i);
    t.setData({
        max: n,
        data: r
    })
}

function init_Result(a) {
    var e = (init_params.prov, init_params.city, init_params.region_name, init_params.region_id),
        t = init_params.range,
        n = init_params.date;
    syncTimeWithServer(function (a) {
        var i = a,
            r = a.split(" ")[0],
            o = calcNowStrWithRange(i, t),
            l = o.split(" ")[1],
            s = null,
            p = n + " 00:00:00";
        r === n && (s = l, p = o);
        var m = generateSlider("slider", t, n, s, function (a) {
                drawHeatMap(a, HEATDATA_ARR, HEATMAP, MAX, CENTER)
            }),
            c = m[m.length - 1];
        $("#heatmap_play_button").on("click", function (a) {
            var e = $(this).text();
            "鎾斁" === e ? ($(this).html('<i class="pause icon"></i>鏆傚仠'), $(this).removeClass("teal"), $(this).addClass("red"), play_interval = setInterval(function () {
                var a = $("#slider").slider("getValue");
                a === c ? a = 0 : a += 1, $("#slider").slider("setValue", a, !0, !0)
            }, 1e3)) : ($(this).html('<i class="play icon"></i>鎾斁'), $(this).removeClass("red"), $(this).addClass("teal"), clearInterval(play_interval))
        }), generateMap(e, n, function (a, t) {
            MAX = t, CENTER = a;
            var i = 0;
            $.get(url_prefix + "getHeatDataByTime.php", {
                region_id: e,
                datetime: p,
                sub_domain: SUBDOMAIN
            }, function (e) {
                var n = $.parseJSON(e),
                    r = restoreHeatPoints(n, a);
                if (QQMapPlugin.isSupportCanvas) var o = setInterval(function () {
                    MAP.getBounds() && (HEATMAP = new QQMapPlugin.HeatmapOverlay(MAP, {
                        radius: 1,
                        maxOpacity: .8,
                        useLocalExtrema: !1,
                        valueField: "count"
                    }), HEATMAP.setData({
                        max: t,
                        data: r
                    }), clearInterval(o))
                });
                i++, 2 === i && $("#slider").slider("enable")
            }), $.get(url_prefix + "getHeatDataByDate.php", {
                region_id: e,
                date: n,
                sub_domain: SUBDOMAIN
            }, function (a) {
                var e = $.parseJSON(a);
                HEATDATA_ARR = e, i++, 2 === i && $("#slider").slider("enable")
            })
        })
    })
}

function jsCopy() {
    var a = document.getElementById("url_container");
    if (document.body.createTextRange) {
        var e = document.body.createTextRange();
        e.moveToElementText(a), e.select()
    } else if (window.getSelection) {
        var t = window.getSelection(),
            e = document.createRange();
        e.selectNodeContents(a), t.removeAllRanges(), t.addRange(e)
    } else alert("none");
    document.execCommand("Copy", "true", null)
}
$("#map-canvas").height($("body").height() - 200), $("#pano_holder").height($("body").height() - 150);
var current_url = window.location.href,
    current_url_host = window.location.host,
    current_url_pathname = window.location.pathname,
    map = null,
    MAP = null,
    HEATMAP = null,
    MAX = null,
    POLYGON = null,
    HEATDATA_ARR = null,
    CENTER = null,
    coord_dat = [],
    coord_dat_max = 0,
    currentCoord = [],
    datetime = null,
    region_id = null,
    range = null,
    currentBoundary_str = null,
    currentBoundary = null,
    heatmap_data = {},
    heatmap_time_arr = [],
    heatmap = null,
    play_interval = null,
    zoom = 16,
    max_single = 0,
    max_count = 0,
    max_count_total = 0,
    max_count_date = null,
    max = 0,
    center_gcj = null,
    region_name = "",
    customDiv = null,
    container = $("#map-canvas")[0],
    panoholder = $("#pano_holder")[0],
    pano = new qq.maps.Panorama(panoholder, {
        pano: ""
    }),
    marker = new qq.maps.Marker({
        map: null
    }),
    marker2 = new qq.maps.Marker({
        map: null,
        draggable: !1,
        clickable: !1
    }),
    info = null,
    info2 = new qq.maps.InfoWindow({
        map: map
    }),
    pad = $("#pad")[0],
    markerArray = [],
    panoLabelArr = [],
    latlngArr = [],
    curCity = $("#cur_city")[0],
    btnSearch = $("#btn_search")[0],
    bside = $("#bside_left")[0],
    url, query_city, label = new qq.maps.Label({
        content: "姝ゅ鏃犺鏅�"
    }),
    panoService = new qq.maps.PanoramaService,
    t, anchor = new qq.maps.Point(10, 30),
    origin = new qq.maps.Point(141, 130),
    size = new qq.maps.Size(27, 33),
    icon = new qq.maps.MarkerImage("//3gimg.qq.com/tencentMapTouch/lbs/qqmap_big_data/images/bgs32.png", size, origin, anchor);
marker.setIcon(icon);
var anchor2 = new qq.maps.Point(12, 38),
    origin2 = new qq.maps.Point(120, 130),
    size2 = new qq.maps.Size(21, 35),
    icon2 = new qq.maps.MarkerImage("//3gimg.qq.com/tencentMapTouch/lbs/qqmap_big_data/images/bgs32.png", size2, origin2, anchor2);
marker2.setIcon(icon2);
var panel = $("#panel")[0],
    pano_layer = new qq.maps.PanoramaLayer,
    isLayerShowed = !1,
    fullScreen = !1,
    code_panoid = $("#code_panoid")[0],
    code_heading = $("#code_heading")[0],
    code_pitch = $("#code_pitch")[0],
    code_panoid2 = $("#code_panoid2")[0],
    code_heading2 = $("#code_heading2")[0],
    code_pitch2 = $("#code_pitch2")[0],
    hasEnteredPano = !1,
    static_url, url3, static_img = new Image;
static_img.style.marginLeft = "12px", static_img.style.marginTop = "5px";
for (var tip = $("#tip")[0], tip_addr, hasData = !0, old_latlng = null, t2, listener_arr = [], isNoValue = !1, latlng, show_gold = !1, anchor = new qq.maps.Point(10, 10), size = new qq.maps.Size(20, 20), origin = new qq.maps.Point(0, 0), markerIcon_arr = [], tmp_marker, last_region_id = null, last_datetime = null, last_range = null, diy_max_flag = !1, diy_max = null, diy_max_valid = !0, slider_today = !1, draw_heatmap_interval, i = 1; i < 7; i++) tmp_marker = new qq.maps.MarkerImage("//3gimg.qq.com/tencentMapTouch/lbs/qqmap_big_data/images/marker/marker_0" + i + ".png", size, origin, anchor), markerIcon_arr.push(tmp_marker);
var Data = {};
$("#heatmap_form").form({
    date: {
        identifier: "date",
        rules: [{
            type: "empty",
            prompt: "鏃堕棿涓嶈兘涓虹┖"
        }]
    },
    region: {
        identifier: "region",
        rules: [{
            type: "empty",
            prompt: "鍖哄煙涓嶈兘涓虹┖"
        }]
    },
    prov: {
        identifier: "prov",
        rules: [{
            type: "empty",
            prompt: "鐪佸競涓嶈兘涓虹┖"
        }]
    },
    range: {
        identifier: "range",
        rules: [{
            type: "empty",
            prompt: "鏃堕棿绮掑害涓嶈兘涓虹┖"
        }]
    }
}, {
    onSuccess: function (a) {
        draw_heatmap_interval && clearInterval(draw_heatmap_interval), $("#customDiv").trigger("click"), $("#panel").hasClass("panel2") && $("#panel").trigger("click"), global_datetime = $("#date").val(), global_prov = $("#prov_select0").val(), global_city = $("#city_select0").val(), global_region_name = $("#prov_select0 option:selected").text(), global_region_id = $("#region_select0").val(), global_range = $("#range_select0").val();
        var e = parseInt(global_range, 10),
            t = global_datetime,
            n = parseInt(global_region_id, 10);
        current_url = "http://" + current_url_host + current_url_pathname + "?date=" + t + "&prov=" + encodeURIComponent(global_prov) + "&city=" + encodeURIComponent(global_city) + "&region_name=" + encodeURIComponent(global_region_name) + "&region_id=" + global_region_id + "&range=" + global_range, syncTimeWithServer(function (a) {
            var i = a,
                r = a.split(" ")[0],
                o = calcNowStrWithRange(i, e),
                l = o.split(" ")[1],
                s = null,
                p = t + " 00:00:00";
            r === t && (s = l, p = o);
            var m = generateSlider("slider", e, t, s, function (a) {
                    drawHeatMap(a, HEATDATA_ARR, HEATMAP, MAX, CENTER)
                }),
                c = m[m.length - 1];
            clearInterval(play_interval);
            var d = $("#heatmap_play_button");
            d.off("click"), d.html('<i class="play icon"></i>鎾斁'), d.removeClass("red"), d.addClass("teal"), d.on("click", function (a) {
                var e = $(this).text();
                "鎾斁" === e ? ($(this).html('<i class="pause icon"></i>鏆傚仠'), $(this).removeClass("teal"), $(this).addClass("red"), play_interval = setInterval(function () {
                    var a = $("#slider").slider("getValue");
                    a === c ? a = 0 : a += 1, $("#slider").slider("setValue", a, !0, !0)
                }, 1e3)) : ($(this).html('<i class="play icon"></i>鎾斁'), $(this).removeClass("red"), $(this).addClass("teal"), clearInterval(play_interval))
            }), generateMap(n, t, function (a, e) {
                MAX = e, CENTER = a;
                var i = 0;
                $.get(url_prefix + "getHeatDataByTime.php", {
                    region_id: n,
                    datetime: p,
                    sub_domain: SUBDOMAIN
                }, function (t) {
                    var n = $.parseJSON(t),
                        r = restoreHeatPoints(n, a);
                    HEATMAP.setData({
                        max: e,
                        data: r
                    }), i++, 2 === i && $("#slider").slider("enable")
                }), $.get(url_prefix + "getHeatDataByDate.php", {
                    region_id: n,
                    date: t,
                    sub_domain: SUBDOMAIN
                }, function (a) {
                    var e = $.parseJSON(a);
                    HEATDATA_ARR = e, $("#slider").slider("enable"), i++, 2 === i && $("#slider").slider("enable")
                })
            })
        }), a.preventDefault()
    }
});
var init_params = GetUrlParms();
init_params.region_id = parseInt(init_params.region_id, 10), init_params.range = parseInt(init_params.range, 10);
var global_prov = init_params.prov,
    global_city = init_params.city,
    global_region_name = init_params.region_name,
    global_region_id = init_params.region_id,
    global_range = init_params.range,
    global_datetime = init_params.date;
first_init_prov_show = init_params.prov, first_init_city_show = init_params.city, first_init_region_id_show = init_params.region_id, first_init_range_show = init_params.range, $("#date").val(init_params.date), init_prov_city_region_range_select(0, "show"), init_Result(init_params);
var map_canvas_width = $("#map-canvas").width(),
    map_canvas_height = $("#map-canvas").height(),
    map_canvas_position = "relative",
    map_canvas_top = 0,
    map_canvas_left = 0,
    map_canvas_z_index = 0,
    pano_holder_width = $("#pano_holder").children().width(),
    pano_holder_height = $("#pano_holder").children().height(),
    pano_holder_position = "relative",
    pano_holder_top = 0,
    pano_holder_left = 0,
    pano_holder_z_index = 0,
    heatmap_mark_bottom = 0,
    heatmap_mark_right = 0,
    heatmap_mark_padding = $("#heatmap_mark").css("padding"),
    heatmap_mark_font_size = $("#heatmap_mark").css("font-size"),
    heatmap_mark_index = "auto",
    heatmap_mark_title_font_size = $(".heatmap_mark_title").css("font-size");
$("#panel").click(function () {
    if (isLayerShowed) {
        pano_layer.setMap(null), isLayerShowed = !1, marker2.setMap(null), marker.setOptions({
            clickable: !0
        });
        for (var a = 0, e = markerArray.length; a < e; a++) markerArray[a].setOptions({
            clickable: !0
        });
        this.className = "panel1"
    } else {
        pano_layer.setMap(MAP), isLayerShowed = !0, marker2.setMap(MAP), marker.setOptions({
            clickable: !1
        });
        for (var t = 0, n = markerArray.length; t < n; t++) markerArray[t].setOptions({
            clickable: !1
        });
        this.className = "panel2"
    }
}), $("#panel_zoom").click(function () {
    fullScreen ? ($("#map-canvas").css("position", map_canvas_position), $("#map-canvas").css("top", map_canvas_top + "px"), $("#map-canvas").css("left", map_canvas_left + "px"), $("#map-canvas").css("z-index", map_canvas_z_index), $("#map-canvas").width(map_canvas_width), $("#map-canvas").height(map_canvas_height), $("#heatmap_mark").css("padding", heatmap_mark_padding), $("#heatmap_mark").css("font-size", heatmap_mark_font_size), $(".heatmap_mark_title").css("font-size", heatmap_mark_title_font_size), $("#heatmap_mark").css("bottom", heatmap_mark_bottom + "px"), $("#heatmap_mark").css("right", heatmap_mark_right + "px"), $("#heatmap_mark").css("z-index", heatmap_mark_index), fullScreen = !1, this.className = "panel_zoom1") : ($("#map-canvas").css("position", "absolute"), $("#map-canvas").css("top", "-" + $("#map-canvas").offset().top + "px"), $("#map-canvas").css("left", "-" + $("#map-canvas").offset().left + "px"), $("#map-canvas").css("z-index", "999999"), $("#map-canvas").width($(window).width()), $("#map-canvas").height($(window).height()), $("#heatmap_mark").css("padding", "1.2rem"), $("#heatmap_mark").css("font-size", "1.2rem"), $(".heatmap_mark_title").css("font-size", "1.2rem"), $("#heatmap_mark").css("bottom", "-" + ($(window).height() - $("#heatmap_mark").offset().top - $("#heatmap_mark").outerHeight()) + "px"), $("#heatmap_mark").css("right", "-" + ($(window).width() - 1024) / 2 + "px"), $("#heatmap_mark").css("z-index", "9999999"), $("#pano_holder").children().css("position", "absolute"), $("#pano_holder").children().css("top", "-" + $("#map-canvas").offset().top + "px"), $("#pano_holder").children().css("left", "-" + $("#map-canvas").offset().left + "px"), $("#pano_holder").children().css("z-index", "999999"), $("#pano_holder").children().width($(window).width()), $("#pano_holder").children().height($(window).height()), fullScreen = !0, this.className = "panel_zoom2")
}), $(".heatmap_play_img").hover(function (a) {
    var e = a.target,
        t = $(e).attr("src");
    $(e).attr("src", t.replace("a.png", "b.png"))
}, function (a) {
    var e = a.target,
        t = $(e).attr("src");
    $(e).attr("src", t.replace("b.png", "a.png"))
}), $("#toLocation").click(function (a) {
    window.location.href = "location_result.php?date_begin=" + global_datetime + "&date_end=" + global_datetime + "&prov=" + global_prov + "&city=" + global_city + "&region_name=" + global_region_name + "&region_id=" + global_region_id + "&range=" + global_range
});
var client = new ZeroClipboard(document.getElementById("copy-button"));
$("#copy_modal_first").modal({
    onApprove: function () {
        $("#copy_modal_second").modal("show"), jsCopy()
    }
}), $("#heatmap_share").click(function (a) {
    short_url(current_url, function (a) {
        $("#url_container").text(a), $("#copy-button").attr("data-clipboard-text", a), $("#copy_modal_first").modal("setting", "closable", !1).modal("show")
    })
});