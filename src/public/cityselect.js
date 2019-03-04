﻿var pageSize = 12;
var $cityInput;

function init_city_select($inputE) {
    var html = "";
    html += '<div class="provinceCityAll">';
    html += '<div class="tabs clearfix">';
    html += '<ul>';
    html += '<li><a tb="provinceAll" id="provinceAll" class="current">省份</a></li>';
    html += '<li><a tb="cityAll" id="cityAll">城市</a></li>';
    html += '<li><a tb="countyAll" id="countyAll">区/县</a></li>';
    html += '</ul>';
    html += '</div>';
    html += '<div class="con">';
    html += '<div class="provinceAll">';
    html += '<div class="pre"><a></a></div>';
    html += '<div class="list"><ul></ul></div>';
    html += '<div class="next"><a></a></div>';
    html += '</div>';
    html += '<div class="cityAll">';
    html += '<div class="pre"><a></a></div>';
    html += '<div class="list"><ul></ul></div>';
    html += '<div class="next"><a></a></div>';
    html += '</div>';
    html += '<div class="countyAll">';
    html += '<div class="pre"><a></a></div>';
    html += '<div class="list"><ul></ul></div>';
    html += '<div class="next"><a></a></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $(".provinceCityAll").remove();
    $("body").append(html);
    if (!allProvince) {
        getAllProvince();
    }
    if (!allCity) {
        getAllCity();
    }
    if (!allCounty) {
        getAllCounty();
    }
    $(document).on("click", function (event) {
        $(".provinceCityAll").hide();
    });
    $(".provinceCityAll").on("click", function (event) {
        event.stopPropagation();
    });
    $inputE.on("click", function (event) {
        $cityInput = $(this);
        $(".provinceCityAll").css({
            "left": $(this).offset().left + "px",
            "top": $(this).offset().top + $(this).height() + 3 + "px",
        }).toggle();
        getProvinceCityCounty($cityInput);
        event.stopPropagation();
    });
    $(".provinceCityAll .tabs li a").on("click", function () {
        if ($(this).attr("tb") == "cityAll" && $(".provinceAll .list .current").length < 1) {
            return;
        };
        if ($(this).attr("tb") == "countyAll" && $(".cityAll .list .current").length < 1) {
            return;
        };
        $(this).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
        $(".provinceCityAll .con").find("." + $(this).attr("tb")).show().siblings().hide();
    });
}

function getProvinceCityCounty($cityInput) {
    if ($cityInput) {
        $(".provinceAll .list ul").empty();
        $(".cityAll .list ul").empty();
        $(".countyAll .list ul").empty();
        var pccName = $cityInput.val().split("-");
        if (pccName.length == 3) {
            var provinceName = pccName[0];
            var provinceId;
            var provinceIndex;
            $.each(allProvince, function (i) {
                if (this.name == provinceName) {
                    provinceId = this.id;
                    provinceIndex = i;
                    return;
                }
            });
            var cityName = pccName[1];
            var cityId;
            var cityIndex;
            if (provinceId) {
                var prvinceAllCity = allCityMap.get(provinceId);
                $.each(prvinceAllCity, function (i) {
                    if (this.name == cityName) {
                        cityId = this.id;
                        cityIndex = i;
                        return;
                    }
                });
            }
            var countyName = pccName[2];
            var countyId;
            var countyIndex;
            if (cityId) {
                var cityAllcounty = allCountyMap.get(cityId);
                $.each(cityAllcounty, function (i) {
                    if (this.name == countyName) {
                        countyId = this.id;
                        countyIndex = i;
                        return;
                    }
                });
            }
            if (countyId) {
                var currentProvincePage = Math.ceil((provinceIndex + 1) / pageSize);
                var currentCityPage = Math.ceil((cityIndex + 1) / pageSize);
                var currentCountyPage = Math.ceil((countyIndex + 1) / pageSize);
                provincePage(currentProvincePage);
                cityPage(provinceId, currentCityPage);
                countyPage(cityId, currentCountyPage);
                var prvinceName = $("#" + provinceId).addClass("current");
                var cityName = $("#" + cityId).addClass("current");
                var countyName = $("#" + countyId).addClass("current");
                $("#countyAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
                $(".provinceCityAll .con .countyAll").show().siblings().hide();
                return;
            }
        }
    }
    viewProvince();
}

function viewProvince() {
    $(".provinceCityAll .con .provinceAll").show().siblings().hide();
    $("#provinceAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    provincePage(1);
}

function provincePage(currentProvincePage) {
    $(".provinceAll .pre a, .provinceAll .next a").removeClass("can");
    var totalPage = Math.ceil(allProvince.length / pageSize);
    if (totalPage > 1) {
        if (currentProvincePage == 1) {
            $(".provinceAll .pre a").removeClass("can").removeAttr("onclick");
            $(".provinceAll .next a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage + 1) + ");");
        } else if (currentProvincePage > 1 && currentProvincePage < totalPage) {
            $(".provinceAll .pre a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage - 1) + ");");
            $(".provinceAll .next a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage + 1) + ");");
        } else {
            $(".provinceAll .pre a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage - 1) + ");");
            $(".provinceAll .next a").removeClass("can").removeAttr("onclick");
        }
    } else {
        $(".provinceAll .pre a").removeClass("can").removeAttr("onclick");
        $(".provinceAll .next a").removeClass("can").removeAttr("onclick");
    }
    var start = (currentProvincePage - 1) * pageSize;
    var end = currentProvincePage * pageSize;
    if (currentProvincePage == totalPage) {
        end = allProvince.length;
    }
    var html = "";
    for (var i = start; i < end; i++) {
        var provinceName = allProvince[i].name;
        if (provinceName == '内蒙古自治区') {
            provinceShortName = '内蒙古';
        } else if (provinceName == '黑龙江省') {
            provinceShortName = '黑龙江';
        } else {
            provinceShortName = provinceName.substr(0, 2);
        }
        var provinceId = allProvince[i].id;
        html += '<li><a onclick="viewCity(\'' + provinceId + '\');" id="' + provinceId + '" title="' + provinceName + '">' + provinceShortName + '</a></li>';
    }
    $(".provinceAll .list ul").html(html);
}

function viewCity(provinceId) {
    $("#" + provinceId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    $(".provinceCityAll .con .cityAll").show().siblings().hide();
    $("#cityAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    cityPage(provinceId, 1);
}

function cityPage(provinceId, currentCityPage) {
    var provinceAllCity = allCityMap.get(provinceId);
    var totalPage = Math.ceil(provinceAllCity.length / pageSize);
    $(".cityAll .pre a, .cityAll .next a").removeClass("can");
    if (totalPage > 1) {
        if (currentCityPage == 1) {
            $(".cityAll .pre a").removeClass("can").removeAttr("onclick");
            $(".cityAll .next a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage + 1) + ");");
        } else if (currentCityPage > 1 && currentCityPage < totalPage) {
            $(".cityAll .pre a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage - 1) + ");");
            $(".cityAll .next a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage + 1) + ");");
        } else {
            $(".cityAll .pre a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage - 1) + ");");
            $(".cityAll .next a").removeClass("can").removeAttr("onclick");
        }
    } else {
        $(".cityAll .pre a").removeClass("can").removeAttr("onclick");
        $(".cityAll .next a").removeClass("can").removeAttr("onclick");
    }
    var start = (currentCityPage - 1) * pageSize;
    var end = currentCityPage * pageSize;
    if (currentCityPage == totalPage) {
        end = provinceAllCity.length;
    }
    var html = "";
    for (var i = start; i < end; i++) {
        var cityName = provinceAllCity[i].name;
        var cityShortName = cityName.substring(0, 4);
        var cityId = provinceAllCity[i].id;
        html += '<li><a onclick="viewCounty(\'' + cityId + '\');" id="' + cityId + '" title="' + cityName + '">' + cityShortName + '</a></li>';
    }
    $(".cityAll .list ul").html(html);
}

function viewCounty(cityId) {
    $("#" + cityId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    $(".provinceCityAll .con .countyAll").show().siblings().hide();
    $("#countyAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    countyPage(cityId, 1);
}

function countyPage(cityId, currentCountyPage) {
    var cityAllCounty = allCountyMap.get(cityId);
    var totalPage = Math.ceil(cityAllCounty.length / pageSize);
    $(".countyAll .pre a, .countyAll .next a").removeClass("can");
    if (totalPage > 1) {
        if (currentCountyPage == 1) {
            $(".countyAll .pre a").removeClass("can").removeAttr("onclick");
            $(".countyAll .next a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage + 1) + ");");
        } else if (currentCountyPage > 1 && currentCountyPage < totalPage) {
            $(".countyAll .pre a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage - 1) + ");");
            $(".countyAll .next a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage + 1) + ");");
        } else {
            $(".countyAll .pre a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage - 1) + ");");
            $(".countyAll .next a").removeClass("can").removeAttr("onclick");
        }
    } else {
        $(".countyAll .pre a").removeClass("can").removeAttr("onclick");
        $(".countyAll .next a").removeClass("can").removeAttr("onclick");
    }
    var start = (currentCountyPage - 1) * pageSize;
    var end = currentCountyPage * pageSize;
    if (currentCountyPage == totalPage) {
        end = cityAllCounty.length;
    }
    var html = "";
    for (var i = start; i < end; i++) {
        var countyName = cityAllCounty[i].name;
        var countyShortName = countyName.substring(0, 4);
        var countyId = cityAllCounty[i].id;
        html += '<li><a onclick="viewAll(\'' + countyId + '\');" id="' + countyId + '" title="' + countyName + '">' + countyShortName + '</a></li>';
    }
    $(".countyAll .list ul").html(html);
}

function viewAll(countyId) {
    $("#" + countyId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
    $(".provinceCityAll").hide();
    var prvinceName = $(".provinceAll .list li a.current").attr("title");
    var cityName = $(".cityAll .list li a.current").attr("title");
    var countyName = $(".countyAll .list li a.current").attr("title");
    $cityInput.val(prvinceName + "-" + cityName + "-" + countyName);
}
var allProvince;
var allCity;
var allCounty;
var allCityMap = new Map();
var allCountyMap = new Map();

function getAllProvince() {
    allProvince = [{
        "id": "beijin",
        "name": "北京"
    },
    {
        "id": "shanghai",
        "name": "上海"
    },
    {
        "id": "tianjin",
        "name": "天津"
    },
    {
        "id": "chongqing",
        "name": "重庆"
    },
    {
        "id": "anhui",
        "name": "安徽省"
    },
    {
        "id": "aomen",
        "name": "澳门特别行政区"
    },
    {
        "id": "fujian",
        "name": "福建省"
    },
    {
        "id": "gansu",
        "name": "甘肃省"
    },
    {
        "id": "guangdong",
        "name": "广东省"
    },
    {
        "id": "guangxi",
        "name": "广西壮族自治区"
    },
    {
        "id": "guizhou",
        "name": "贵州省"
    },
    {
        "id": "hainan",
        "name": "海南省"
    },
    {
        "id": "hebei",
        "name": "河北省"
    },
    {
        "id": "henan",
        "name": "河南省"
    },
    {
        "id": "heilongjiang",
        "name": "黑龙江省"
    },
    {
        "id": "hubei",
        "name": "湖北省"
    },
    {
        "id": "hunan",
        "name": "湖南省"
    },
    {
        "id": "jilin",
        "name": "吉林省"
    },
    {
        "id": "jiangsu",
        "name": "江苏省"
    },
    {
        "id": "jiangxi",
        "name": "江西省"
    },
    {
        "id": "liaoning",
        "name": "辽宁省"
    },
    {
        "id": "neimenggu",
        "name": "内蒙古自治区"
    },
    {
        "id": "ningxia",
        "name": "宁夏回族自治区"
    },
    {
        "id": "qinghai",
        "name": "青海省"
    },
    {
        "id": "shandong",
        "name": "山东省"
    },
    {
        "id": "shanxi1",
        "name": "山西省"
    },
    {
        "id": "shanxi2",
        "name": "陕西省"
    },
    {
        "id": "sichuan",
        "name": "四川省"
    },
    {
        "id": "taiwan",
        "name": "台湾省"
    },
    {
        "id": "xizang",
        "name": "西藏自治区"
    },
    {
        "id": "xianggang",
        "name": "香港特别行政区"
    },
    {
        "id": "xinjiang",
        "name": "新疆维吾尔自治区"
    },
    {
        "id": "yunnan",
        "name": "云南省"
    },
    {
        "id": "zhejiang",
        "name": "浙江省"
    }];
}

function getAllCity() {
    allCity = [{
        "name": "上海市",
        "id": "HVi9qJvwTqaJTXJYaIcBF1",
        "provinceId": "shanghai"
    },
    {
        "name": "深圳市",
        "id": "UFUa2xpERgmtaI1qjBXOTV",
        "provinceId": "guangdong"
    },
    {
        "name": "北京市",
        "id": "SgGkHXTSRsBqGY3q3JNaP1",
        "provinceId": "beijin"
    },
    {
        "name": "广州市",
        "id": "4YE91XXHTYyMcvPs3bkzkF",
        "provinceId": "guangdong"
    },
    {
        "name": "苏州市",
        "id": "fgCYGCEESdBte2WiSUNAUF",
        "provinceId": "jiangsu"
    },
    {
        "name": "成都市",
        "id": "uIMcazYzTxeHdTDrBk7ril",
        "provinceId": "sichuan"
    },
    {
        "name": "东莞市",
        "id": "CxC8XbcATk69iyhLx6hLiV",
        "provinceId": "guangdong"
    },
    {
        "name": "宁波市",
        "id": "AS6BjjieQRSSsdLsjG1Kgl",
        "provinceId": "zhejiang"
    },
    {
        "name": "天津市",
        "id": "xSRnHPR9Q42VL0bHzTFhCF",
        "provinceId": "tianjin"
    },
    {
        "name": "佛山市",
        "id": "A1ZrUmaVSze8xYoiidNo0V",
        "provinceId": "guangdong"
    },
    {
        "name": "青岛市",
        "id": "S6037PkXT1BBG47fVpJlNl",
        "provinceId": "shandong"
    },
    {
        "name": "重庆市",
        "id": "qqaXeuzHTxyrLTQtGA6Ezl",
        "provinceId": "chongqing"
    },
    {
        "name": "武汉市",
        "id": "mTPhBOLeRcKWglIZDn9s5l",
        "provinceId": "hubei"
    },
    {
        "name": "杭州市",
        "id": "HQL2kvvyQPiKTzFkL14fZF",
        "provinceId": "zhejiang"
    },
    {
        "name": "沈阳市",
        "id": "IwS8airmRPSNJD9EAULiWl",
        "provinceId": "liaoning"
    },
    {
        "name": "南昌市",
        "id": "JNJsMOuaQ5m4WEDOBsGdeF",
        "provinceId": "jiangxi"
    },
    {
        "name": "阿坝藏族羌族自治州",
        "id": "mij3ewMkTiuAsykQ7hEonV",
        "provinceId": "sichuan"
    },
    {
        "name": "阿克苏地区",
        "id": "4Q5qeZM0RTe6xw16ABMuD1",
        "provinceId": "xinjiang"
    },
    {
        "name": "阿拉尔市",
        "id": "d9RcznG7RvGN2i4POFVgz1",
        "provinceId": "xinjiang"
    },
    {
        "name": "阿拉善盟",
        "id": "FwdFCt5RRhmDAvuorgYsa1",
        "provinceId": "neimenggu"
    },
    {
        "name": "阿勒泰地区",
        "id": "EntGxGbhSYC0LP9RAx4fu1",
        "provinceId": "xinjiang"
    },
    {
        "name": "阿里地区",
        "id": "R41NEg3RT6qzT8dMPSmXDF",
        "provinceId": "xizang"
    },
    {
        "name": "安康市",
        "id": "cvwjYvPhSrKGnwT9b6zeGl",
        "provinceId": "shanxi2"
    },
    {
        "name": "安庆市",
        "id": "1FhRFP6wQjG5Ed2fh4Doi1",
        "provinceId": "anhui"
    },
    {
        "name": "鞍山市",
        "id": "l48offAsSyC8iAdGkqKuj1",
        "provinceId": "liaoning"
    },
    {
        "name": "安顺市",
        "id": "TAYos9MCQHqGUiBXAp0Kvl",
        "provinceId": "guizhou"
    },
    {
        "name": "安阳市",
        "id": "Tq9kjGzxRgOnHswnQSBE6l",
        "provinceId": "henan"
    },
    {
        "name": "澳门半岛",
        "id": "KbZWc7j0QxmeW4SAd4BIFF",
        "provinceId": "aomen"
    },
    {
        "name": "澳门离岛市",
        "id": "FG3QwGPQQvGevZvQK2W8Nl",
        "provinceId": "aomen"
    },
    {
        "name": "白城市",
        "id": "EnKWQIIDQSuqb94JBnAOG1",
        "provinceId": "jilin"
    },
    {
        "name": "百色市",
        "id": "jSuSh4LBQBu7qZkvnAzKwl",
        "provinceId": "guangxi"
    },
    {
        "name": "白沙黎族自治县",
        "id": "SY7uuNGrS2u0A9IfxsM3eV",
        "provinceId": "hainan"
    },
    {
        "name": "白山市",
        "id": "dSI9Vc65RbCRpbzrIAFVcl",
        "provinceId": "jilin"
    },
    {
        "name": "白银市",
        "id": "jx55ydxfQKmNqB4ADMsaeF",
        "provinceId": "gansu"
    },
    {
        "name": "保定市",
        "id": "pfVBDMXSS4yDZqdmZlO6xl",
        "provinceId": "hebei"
    },
    {
        "name": "宝鸡市",
        "id": "c0YoZBy8QFeh9DpqqK4HRV",
        "provinceId": "shanxi2"
    },
    {
        "name": "保山市",
        "id": "fJRLv6LJTcy0jRylxEvLWF",
        "provinceId": "yunnan"
    },
    {
        "name": "保亭黎族苗族自治县",
        "id": "VBkIB7URQUehvfcHAdpAbl",
        "provinceId": "hainan"
    },
    {
        "name": "包头市",
        "id": "kj38GTK8SbqExSdDWj0AUF",
        "provinceId": "neimenggu"
    },
    {
        "name": "巴彦淖尔市",
        "id": "cAg6URukQ3WCr4rK4AnTsV",
        "provinceId": "neimenggu"
    },
    {
        "name": "巴音郭楞蒙古自治州",
        "id": "GR1MFlWPQbiVAV0AWq9MXl",
        "provinceId": "xinjiang"
    },
    {
        "name": "巴中市",
        "id": "BHzC8cI3ShBae0kMjRGTAl",
        "provinceId": "sichuan"
    },
    {
        "name": "北海市",
        "id": "EwCUBDHnTH2S4usWvzmIO1",
        "provinceId": "guangxi"
    },
    {
        "name": "蚌埠市",
        "id": "c7NBuS8uQTSj8eWvBkpsBV",
        "provinceId": "anhui"
    },
    {
        "name": "本溪市",
        "id": "zVHAgUNBTnuweKy9FfTozV",
        "provinceId": "liaoning"
    },
    {
        "name": "毕节地区",
        "id": "rIYTldvBREehIRIzm83wE1",
        "provinceId": "guizhou"
    },
    {
        "name": "滨州市",
        "id": "CJYn4NQrRcujQUeBeAQ6Ll",
        "provinceId": "shandong"
    },
    {
        "name": "博尔塔拉蒙古自治州",
        "id": "5OFHnsfIQdOKa50lhtlBmV",
        "provinceId": "xinjiang"
    },
    {
        "name": "亳州市",
        "id": "x1BbMxgVTJiy8d0bx3Hj1l",
        "provinceId": "anhui"
    },
    {
        "name": "沧州市",
        "id": "CeCKB4cGTYeWeY2LVLDDDF",
        "provinceId": "hebei"
    },
    {
        "name": "澄迈县",
        "id": "gsYX8ODARwabnUcZZh3fHF",
        "provinceId": "hainan"
    },
    {
        "name": "长春市",
        "id": "E4q3lD4JSEy6p1URH36T6F",
        "provinceId": "jilin"
    },
    {
        "name": "常德市",
        "id": "uLGhTDvoQQepu1FbRpN6RF",
        "provinceId": "hunan"
    },
    {
        "name": "昌都地区",
        "id": "Y5dNnqC4Sm2vnm6omtyCZl",
        "provinceId": "xizang"
    },
    {
        "name": "昌江黎族自治县",
        "id": "WmeedtAWSSWt7HLOZk0g9F",
        "provinceId": "hainan"
    },
    {
        "name": "昌吉回族自治州",
        "id": "96NGQhBVRBe6JPAfACUZ1F",
        "provinceId": "xinjiang"
    },
    {
        "name": "长沙市",
        "id": "qZZsxxHTTLmmfu6LUDf7c1",
        "provinceId": "hunan"
    },
    {
        "name": "长治市",
        "id": "CPxaQseqRtKnBX8fWq2z3F",
        "provinceId": "shanxi1"
    },
    {
        "name": "常州市",
        "id": "X3zjD7METaCjHB1r24SSeF",
        "provinceId": "jiangsu"
    },
    {
        "name": "巢湖市",
        "id": "BRQEG3qjRxa6cmAbIzoqV1",
        "provinceId": "anhui"
    },
    {
        "name": "朝阳市",
        "id": "NCulC70eSGaq4rmi0wJi0F",
        "provinceId": "liaoning"
    },
    {
        "name": "潮州市",
        "id": "jUxovkChQMO0BYIkse3jU1",
        "provinceId": "guangdong"
    },
    {
        "name": "承德市",
        "id": "tMCQRvSHTtS8n9cupl7agl",
        "provinceId": "hebei"
    },
    {
        "name": "郴州市",
        "id": "a03KwWMyRBSNFyUnBJfnUF",
        "provinceId": "hunan"
    },
    {
        "name": "赤峰市",
        "id": "Y6fl4rWaQtyw1b9en2YNLl",
        "provinceId": "neimenggu"
    },
    {
        "name": "池州市",
        "id": "50UCMLklQk20BrhS3G9nb1",
        "provinceId": "anhui"
    },
    {
        "name": "崇左市",
        "id": "rMN6FeShQQuBqTmClExyIF",
        "provinceId": "guangxi"
    },
    {
        "name": "楚雄彝族自治州",
        "id": "WywsyCALSdSxB6tAyoEVZV",
        "provinceId": "yunnan"
    },
    {
        "name": "滁州市",
        "id": "2Q5vaBzoS7GUAb7hllE1SV",
        "provinceId": "anhui"
    },
    {
        "name": "大连市",
        "id": "tY1IAsDLS7O5166XXxFspV",
        "provinceId": "liaoning"
    },
    {
        "name": "大理白族自治州",
        "id": "ccvxzMeVT9qC5R0RKcINmV",
        "provinceId": "yunnan"
    },
    {
        "name": "丹东市",
        "id": "luOCfhU6R72OjnG58x9kBV",
        "provinceId": "liaoning"
    },
    {
        "name": "儋州市",
        "id": "H3L2EnG9RjKYuCu8cYt0BV",
        "provinceId": "hainan"
    },
    {
        "name": "大庆市",
        "id": "sGZrd8KyRcSSETBbGqywK1",
        "provinceId": "heilongjiang"
    },
    {
        "name": "大同市",
        "id": "9HXUnAfnRqexzOSNtBRw8V",
        "provinceId": "shanxi1"
    },
    {
        "name": "大兴安岭地区",
        "id": "p3Bv66xgQS249PrdvAjmBV",
        "provinceId": "heilongjiang"
    },
    {
        "name": "达州市",
        "id": "8oT6fIqBQ4OJB8Muky5Nu1",
        "provinceId": "sichuan"
    },
    {
        "name": "德宏傣族景颇族自治州",
        "id": "3Kw7SNqMSK2QNlxk2MsAAl",
        "provinceId": "yunnan"
    },
    {
        "name": "德阳市",
        "id": "hSTCfeYeRZyAICxK2KNfEF",
        "provinceId": "sichuan"
    },
    {
        "name": "德州市",
        "id": "hCBVBLECQOqM1yNAfyTCZ1",
        "provinceId": "shandong"
    },
    {
        "name": "定安县",
        "id": "v6lMtMvyRIuxYJvtNfjH6l",
        "provinceId": "hainan"
    },
    {
        "name": "定西市",
        "id": "naEoZ2XdTnyS2eLdAh0xKF",
        "provinceId": "gansu"
    },
    {
        "name": "迪庆藏族自治州",
        "id": "jA7wZ4PcTwu0OavGBsvDql",
        "provinceId": "yunnan"
    },
    {
        "name": "东方市",
        "id": "VR9jIgIHQPO96UVKHMXjWF",
        "provinceId": "hainan"
    },
    {
        "name": "东营市",
        "id": "4fBxBqrtRcCbWvPaqj9NlF",
        "provinceId": "shandong"
    },
    {
        "name": "鄂尔多斯市",
        "id": "kBlPmPGiTGuWHIwGpB4to1",
        "provinceId": "neimenggu"
    },
    {
        "name": "恩施土家族苗族自治州",
        "id": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "provinceId": "hubei"
    },
    {
        "name": "鄂州市",
        "id": "dfAvKljPRB2biVlaJj52AV",
        "provinceId": "hubei"
    },
    {
        "name": "防城港市",
        "id": "U2fzxZ4gTIqmfAyDz769cV",
        "provinceId": "guangxi"
    },
    {
        "name": "抚顺市",
        "id": "hUfHtzpXQdSU7XZRQJyRsV",
        "provinceId": "liaoning"
    },
    {
        "name": "阜新市",
        "id": "7b5i6hAHRBSB9oDevgAu6l",
        "provinceId": "liaoning"
    },
    {
        "name": "阜阳市",
        "id": "qB8SbIp6QNOpraCMUfI0x1",
        "provinceId": "anhui"
    },
    {
        "name": "福州市",
        "id": "UrAb1aw5QZqL8EGSmaEaWV",
        "provinceId": "fujian"
    },
    {
        "name": "抚州市",
        "id": "K3HOS3CQQ32bG44VK7UVKl",
        "provinceId": "jiangxi"
    },
    {
        "name": "甘南藏族自治州",
        "id": "JDpwdXIVT1yPuqTBqWKdBF",
        "provinceId": "gansu"
    },
    {
        "name": "赣州市",
        "id": "MnqoMAgpQeCmiKHe23vXlV",
        "provinceId": "jiangxi"
    },
    {
        "name": "甘孜藏族自治州",
        "id": "NwvrQuLlRzWv5h7wCjKTp1",
        "provinceId": "sichuan"
    },
    {
        "name": "高雄市",
        "id": "e2mcedWpT1OBSzPN9peCtV",
        "provinceId": "taiwan"
    },
    {
        "name": "高雄县市",
        "id": "J0ws7MX5SxOPG0oM9M4DoF",
        "provinceId": "taiwan"
    },
    {
        "name": "广安市",
        "id": "9FCPBeGkTM2CoIHNVLAsMl",
        "provinceId": "sichuan"
    },
    {
        "name": "广元市",
        "id": "tlxkofemRnKASAajPMj79V",
        "provinceId": "sichuan"
    },
    {
        "name": "贵港市",
        "id": "6MuDnmqlQxSAalOo2s0zBl",
        "provinceId": "guangxi"
    },
    {
        "name": "桂林市",
        "id": "R2MGr3mAQuWJG400bFLQYV",
        "provinceId": "guangxi"
    },
    {
        "name": "贵阳市",
        "id": "J9HyGz2nSD6f15HKnuVyDF",
        "provinceId": "guizhou"
    },
    {
        "name": "果洛藏族自治州",
        "id": "uwEoISagSrOiAUuotAiAn1",
        "provinceId": "qinghai"
    },
    {
        "name": "固原市",
        "id": "xFEk36jYRuWwRknzZfEnUV",
        "provinceId": "ningxia"
    },
    {
        "name": "哈尔滨市",
        "id": "9RlojU6aSgOxIgBUWdfdGV",
        "provinceId": "heilongjiang"
    },
    {
        "name": "海北藏族自治州",
        "id": "Z7pWzlYDTuimk8Exq31NJV",
        "provinceId": "qinghai"
    },
    {
        "name": "海东地区",
        "id": "a9RNTQB6Q42cdIVqkPDiDV",
        "provinceId": "qinghai"
    },
    {
        "name": "海口市",
        "id": "LgxPtlJDRsOELF8nc8EfEl",
        "provinceId": "hainan"
    },
    {
        "name": "海南藏族自治州",
        "id": "5fwU4TARQ2Chx9G8Z1NsdF",
        "provinceId": "qinghai"
    },
    {
        "name": "海西蒙古族藏族自治州",
        "id": "V1nlY4TEQkSkNHJswPRTfV",
        "provinceId": "qinghai"
    },
    {
        "name": "哈密地区",
        "id": "8YxtNda0TyqJ4SPA4XUn1F",
        "provinceId": "xinjiang"
    },
    {
        "name": "邯郸市",
        "id": "QQoADPwbTQi01m0YqxdUe1",
        "provinceId": "hebei"
    },
    {
        "name": "汉中市",
        "id": "EypWQsI9RZBBWoH9gCfDAV",
        "provinceId": "shanxi2"
    },
    {
        "name": "鹤壁市",
        "id": "L4LXKliRTYOZ3FPvmfayPF",
        "provinceId": "henan"
    },
    {
        "name": "河池市",
        "id": "kBRAAvSgS1aoQbDuLlmAbF",
        "provinceId": "guangxi"
    },
    {
        "name": "合肥市",
        "id": "kNb36T9zQHSPRMuAekAE2F",
        "provinceId": "anhui"
    },
    {
        "name": "鹤岗市",
        "id": "uousCrk2RPSSoo3XLhS0BV",
        "provinceId": "heilongjiang"
    },
    {
        "name": "黑河市",
        "id": "WdrmCWCgSMCsif86l6oQiV",
        "provinceId": "heilongjiang"
    },
    {
        "name": "衡水市",
        "id": "62BC1RhISA26JNdY5OecEF",
        "provinceId": "hebei"
    },
    {
        "name": "衡阳市",
        "id": "zu313KWATnOWZ2DaurStBF",
        "provinceId": "hunan"
    },
    {
        "name": "和田地区",
        "id": "ZxY3tBPjRHC6cJH1nSJslF",
        "provinceId": "xinjiang"
    },
    {
        "name": "河源市",
        "id": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "provinceId": "guangdong"
    },
    {
        "name": "菏泽市",
        "id": "BsvdzjbUQYibBPmyKXgzU1",
        "provinceId": "shandong"
    },
    {
        "name": "贺州市",
        "id": "rswwRd2wSDWRZWtDSShtlV",
        "provinceId": "guangxi"
    },
    {
        "name": "红河哈尼族彝族自治州",
        "id": "DjpawhJUSLiqJPEnX0nYBV",
        "provinceId": "yunnan"
    },
    {
        "name": "淮安市",
        "id": "P6eZe0srTMiRof1Cv89S7F",
        "provinceId": "jiangsu"
    },
    {
        "name": "淮北市",
        "id": "HVMTanysROWMSUw8sclwdF",
        "provinceId": "anhui"
    },
    {
        "name": "怀化市",
        "id": "YSqcZ3boTcefiEaUFAbxrV",
        "provinceId": "hunan"
    },
    {
        "name": "淮南市",
        "id": "1n4xeYsISluBm6Tbu0zAsl",
        "provinceId": "anhui"
    },
    {
        "name": "花莲县",
        "id": "uabJYPqLS3yjwNDqbvurH1",
        "provinceId": "taiwan"
    },
    {
        "name": "黄冈市",
        "id": "OckAmUaaQwuJZBJQFdS8OV",
        "provinceId": "hubei"
    },
    {
        "name": "黄南藏族自治州",
        "id": "TcipBdDPTUGDxi04CuzEKV",
        "provinceId": "qinghai"
    },
    {
        "name": "黄山市",
        "id": "jGAf9UwSTD6Iyief0g6s01",
        "provinceId": "anhui"
    },
    {
        "name": "黄石市",
        "id": "3TcAluBASIibs7Le2LToUV",
        "provinceId": "hubei"
    },
    {
        "name": "呼和浩特市",
        "id": "K92FeAvSTy2U59aCzlEjjV",
        "provinceId": "neimenggu"
    },
    {
        "name": "惠州市",
        "id": "HNNAWbhDT1SjB4ywB4BJuF",
        "provinceId": "guangdong"
    },
    {
        "name": "葫芦岛市",
        "id": "QKXZ2pGnSBWdNpyg2QzJGF",
        "provinceId": "liaoning"
    },
    {
        "name": "呼伦贝尔市",
        "id": "eYvnCSvGSiBe6WnxBXTL4F",
        "provinceId": "neimenggu"
    },
    {
        "name": "湖州市",
        "id": "BmhW0wAmRrqp0R3KHc5JPF",
        "provinceId": "zhejiang"
    },
    {
        "name": "佳木斯市",
        "id": "J3LXgu61SAix3mINBLIKl1",
        "provinceId": "heilongjiang"
    },
    {
        "name": "吉安市",
        "id": "24OAmYjuRRW48pZAVKZ3rV",
        "provinceId": "jiangxi"
    },
    {
        "name": "江门市",
        "id": "aEP8arzxQEG3mjNd1BfU1F",
        "provinceId": "guangdong"
    },
    {
        "name": "焦作市",
        "id": "byUugnyxRMWVVlwy4YwqUV",
        "provinceId": "henan"
    },
    {
        "name": "嘉兴市",
        "id": "wCnfQOxOSPSaoDFePuzkDF",
        "provinceId": "zhejiang"
    },
    {
        "name": "嘉义市",
        "id": "6oP8BdiBQu2ekov98B02Yl",
        "provinceId": "taiwan"
    },
    {
        "name": "嘉义县",
        "id": "113BPZgGRziC3DJIxl4VRl",
        "provinceId": "taiwan"
    },
    {
        "name": "嘉峪关市",
        "id": "0uzldFAERWKxrsxhBXyPKV",
        "provinceId": "gansu"
    },
    {
        "name": "揭阳市",
        "id": "pq9RAGRDSJeRDVfzOMFCX1",
        "provinceId": "guangdong"
    },
    {
        "name": "吉林市",
        "id": "FOttci5fTpm8Rw5K0xmBD1",
        "provinceId": "jilin"
    },
    {
        "name": "基隆市",
        "id": "76ytD8FnQ9awdZ1hsfHHhF",
        "provinceId": "taiwan"
    },
    {
        "name": "济南市",
        "id": "8icZNYO1QAev2J1oMcraGl",
        "provinceId": "shandong"
    },
    {
        "name": "金昌市",
        "id": "DzhfMD2ZRiWJcZeC5eFLCl",
        "provinceId": "gansu"
    },
    {
        "name": "晋城市",
        "id": "KFXHBEwMSBqWU3Ge9vskIl",
        "provinceId": "shanxi1"
    },
    {
        "name": "景德镇市",
        "id": "QsOAp3AtQlyLAHEL1MJ2Bl",
        "provinceId": "jiangxi"
    },
    {
        "name": "荆门市",
        "id": "pzyDfLLvRW623comq63RsV",
        "provinceId": "hubei"
    },
    {
        "name": "荆州市",
        "id": "6EaRBS9YS0mBnCPWKxiBJV",
        "provinceId": "hubei"
    },
    {
        "name": "金华市",
        "id": "ZzqgUfDWTYqKOjcjvkQ04F",
        "provinceId": "zhejiang"
    },
    {
        "name": "济宁市",
        "id": "4ekeqXM4QuB40OVJzuBCAV",
        "provinceId": "shandong"
    },
    {
        "name": "金门县",
        "id": "0xxYBJxvRKiKbvhz45VZf1",
        "provinceId": "taiwan"
    },
    {
        "name": "晋中市",
        "id": "bBgOCmPGRgKJ2GFP4NCqyV",
        "provinceId": "shanxi1"
    },
    {
        "name": "锦州市",
        "id": "XdVBIBwNTw2mIEbRBIfdbl",
        "provinceId": "liaoning"
    },
    {
        "name": "九江市",
        "id": "fPBc9tidT8C9E2034eG07V",
        "provinceId": "jiangxi"
    },
    {
        "name": "九龙",
        "id": "5CMgNdvZSN2FJJmpRtZMl1",
        "provinceId": "xianggang"
    },
    {
        "name": "酒泉市",
        "id": "uICYEf8QQBKo9xcjSkhBFl",
        "provinceId": "gansu"
    },
    {
        "name": "鸡西市",
        "id": "dfcs5qbnRLGBB3ovNc94Jl",
        "provinceId": "heilongjiang"
    },
    {
        "name": "开封市",
        "id": "A5vyLFKpR6iqAM9z6kwqPV",
        "provinceId": "henan"
    },
    {
        "name": "喀什地区",
        "id": "2tArbt8zTSGI11DFlLmwVl",
        "provinceId": "xinjiang"
    },
    {
        "name": "克拉玛依市",
        "id": "SDpY6V2ITICBLWBft5UiIF",
        "provinceId": "xinjiang"
    },
    {
        "name": "克孜勒苏柯尔克孜自治州",
        "id": "SwentZd6RBeU78iyNd5921",
        "provinceId": "xinjiang"
    },
    {
        "name": "昆明市",
        "id": "mjsuSJi3TqqyAqhMrAR5M1",
        "provinceId": "yunnan"
    },
    {
        "name": "来宾市",
        "id": "cF71GRkwRlaH99fDDyKSNl",
        "provinceId": "guangxi"
    },
    {
        "name": "莱芜市",
        "id": "PxflkbAaQQWQ8BLKk1pJ01",
        "provinceId": "shandong"
    },
    {
        "name": "廊坊市",
        "id": "TCeTeTU9Rla5AvhSku4uT1",
        "provinceId": "hebei"
    },
    {
        "name": "兰州市",
        "id": "QTggD1EVS5u7EYTZMkmZiF",
        "provinceId": "gansu"
    },
    {
        "name": "拉萨市",
        "id": "aw3zsPJAThqCaasxTwYABF",
        "provinceId": "xizang"
    },
    {
        "name": "乐东黎族自治县",
        "id": "jLM3a6rsQpyAicwmr6QU1V",
        "provinceId": "hainan"
    },
    {
        "name": "乐山市",
        "id": "uiqgEsO2T2uczD28qFJBSF",
        "provinceId": "sichuan"
    },
    {
        "name": "凉山彝族自治州",
        "id": "7aMwhXomT3GqRKNxI4IDO1",
        "provinceId": "sichuan"
    },
    {
        "name": "连江县市",
        "id": "7afkA2JpT5SKCITM1PzbdF",
        "provinceId": "taiwan"
    },
    {
        "name": "连云港市",
        "id": "A7lmXA7RT1qZ4URpIGkbzl",
        "provinceId": "jiangsu"
    },
    {
        "name": "聊城市",
        "id": "ZLBCMUd3StCAVkvThN1YvF",
        "provinceId": "shandong"
    },
    {
        "name": "辽阳市",
        "id": "y7Chz2tIQMu3CQN5gPD3vF",
        "provinceId": "liaoning"
    },
    {
        "name": "辽源市",
        "id": "3VTGDoaaQEKK6qoV8J9p91",
        "provinceId": "jilin"
    },
    {
        "name": "丽江市",
        "id": "uOjDrnIaR3OAlM1KbbA4nl",
        "provinceId": "yunnan"
    },
    {
        "name": "临沧市",
        "id": "d32W1VEvS4GuFUhrEJ51EV",
        "provinceId": "yunnan"
    },
    {
        "name": "临汾市",
        "id": "YjGioDkRTd6gUvABloBbD1",
        "provinceId": "shanxi1"
    },
    {
        "name": "临高县",
        "id": "aSNBVGzSTCW3UxyzJAkUJF",
        "provinceId": "hainan"
    },
    {
        "name": "陵水黎族自治县",
        "id": "mpxhqA5gQZBMdCzowxAK8V",
        "provinceId": "hainan"
    },
    {
        "name": "临夏回族自治州",
        "id": "nWltMkFAStqs9p1s52IeiV",
        "provinceId": "gansu"
    },
    {
        "name": "临沂市",
        "id": "jeDy7VpTQVqkmrrsCmy5GF",
        "provinceId": "shandong"
    },
    {
        "name": "林芝地区",
        "id": "hEPtHDoaQdqluFAWsMw001",
        "provinceId": "xizang"
    },
    {
        "name": "丽水市",
        "id": "tgVAVrDMQmBcjQ4q7iLeHF",
        "provinceId": "zhejiang"
    },
    {
        "name": "六安市",
        "id": "W05E7DMrQNmXCeaMm59RFV",
        "provinceId": "anhui"
    },
    {
        "name": "六盘水市",
        "id": "UpFvFTldRTqUsNlvvUP0AF",
        "provinceId": "guizhou"
    },
    {
        "name": "柳州市",
        "id": "X6Iy9AoTSCKRShptuWA84l",
        "provinceId": "guangxi"
    },
    {
        "name": "陇南市",
        "id": "0uG8VaWFQRK5sRh7xY0PVV",
        "provinceId": "gansu"
    },
    {
        "name": "龙岩市",
        "id": "dl43y3y4RX6jjhUgI61vB1",
        "provinceId": "fujian"
    },
    {
        "name": "娄底市",
        "id": "nsbf5TURSWuJ2zCBxE80oV",
        "provinceId": "hunan"
    },
    {
        "name": "漯河市",
        "id": "Xm5wHSV2SKB5rqXvjxeXcl",
        "provinceId": "henan"
    },
    {
        "name": "洛阳市",
        "id": "0OR3RAgWQnWb1Uq95bWSOV",
        "provinceId": "henan"
    },
    {
        "name": "泸州市",
        "id": "1RZYHMuVRn67kqdB4EtXG1",
        "provinceId": "sichuan"
    },
    {
        "name": "吕梁市",
        "id": "ALuDH7cRRGe65K3KM5Zqy1",
        "provinceId": "shanxi1"
    },
    {
        "name": "马鞍山市",
        "id": "ulAZGrBFRXB317Z8wHsI41",
        "provinceId": "anhui"
    },
    {
        "name": "茂名市",
        "id": "Qb8NyrtZSYmLlJKhLdgFz1",
        "provinceId": "guangdong"
    },
    {
        "name": "眉山市",
        "id": "yVPV5tBGRi2iPCbjfOT9A1",
        "provinceId": "sichuan"
    },
    {
        "name": "梅州市",
        "id": "vyzmxosJRAqS4f53uB6ep1",
        "provinceId": "guangdong"
    },
    {
        "name": "绵阳市",
        "id": "dUULyBxNRf6nd1yiBlnYrl",
        "provinceId": "sichuan"
    },
    {
        "name": "苗栗县",
        "id": "Np9UNulgQjerfE6TeDgZv1",
        "provinceId": "taiwan"
    },
    {
        "name": "牡丹江市",
        "id": "9BU7lRKcRsBkx6mNARBsdF",
        "provinceId": "heilongjiang"
    },
    {
        "name": "南充市",
        "id": "DZJUE80dSaWETuvA0ROxbF",
        "provinceId": "sichuan"
    },
    {
        "name": "南京市",
        "id": "aWPzXWtBSIyQbzdu1MIdDV",
        "provinceId": "jiangsu"
    },
    {
        "name": "南宁市",
        "id": "7gJXLvGRSABkLfRuAHSuXF",
        "provinceId": "guangxi"
    },
    {
        "name": "南平市",
        "id": "XL1LC7G0QBy0FcRD8AOngV",
        "provinceId": "fujian"
    },
    {
        "name": "南沙群岛",
        "id": "bTPQ6jG4Q3CSvKw9vHEaXV",
        "provinceId": "hainan"
    },
    {
        "name": "南通市",
        "id": "AAHMSGjwSASpLXvLgjdLAF",
        "provinceId": "jiangsu"
    },
    {
        "name": "南投县",
        "id": "AkB0oUtLTvm2s3g9CjOI7F",
        "provinceId": "taiwan"
    },
    {
        "name": "南阳市",
        "id": "qWTdBgOLQpiyv50yUQwxyV",
        "provinceId": "henan"
    },
    {
        "name": "那曲地区",
        "id": "AOdoBgSQTp6GKcd45CO5iF",
        "provinceId": "xizang"
    },
    {
        "name": "内江市",
        "id": "VVz6UniQT3CjyoTu0REV9F",
        "provinceId": "sichuan"
    },
    {
        "name": "宁德市",
        "id": "MsynoLvgRoiMxUqlvjndwl",
        "provinceId": "fujian"
    },
    {
        "name": "怒江傈傈族自治州市",
        "id": "94GWNu4NTDOQ7tZ3BRNYX1",
        "provinceId": "yunnan"
    },
    {
        "name": "盘锦市",
        "id": "JTu5vyd0TKKIoV4rAeOnYF",
        "provinceId": "liaoning"
    },
    {
        "name": "攀枝花市",
        "id": "Le5W5bxsSKaO0oiwOMp4W1",
        "provinceId": "sichuan"
    },
    {
        "name": "澎湖县",
        "id": "BpTU5qTERR2Sw3F72O79i1",
        "provinceId": "taiwan"
    },
    {
        "name": "平顶山市",
        "id": "ZLQb0am1T9CHW7F3EhVku1",
        "provinceId": "henan"
    },
    {
        "name": "屏东县",
        "id": "J7Ek2sLQQCWuAG4XlEFizV",
        "provinceId": "taiwan"
    },
    {
        "name": "平凉市",
        "id": "M8oj7jlkQOq7LU7yZNBSk1",
        "provinceId": "gansu"
    },
    {
        "name": "萍乡市",
        "id": "sVuEAYA0RzBWwGYBg2PrzV",
        "provinceId": "jiangxi"
    },
    {
        "name": "普洱市",
        "id": "7NJtL3VoTPWBt3ScI4ljxV",
        "provinceId": "yunnan"
    },
    {
        "name": "莆田市",
        "id": "ChvJPBZtTXySUcBJwktP0F",
        "provinceId": "fujian"
    },
    {
        "name": "濮阳市",
        "id": "D9hHTDwuSrW4wAgICoi4Sl",
        "provinceId": "henan"
    },
    {
        "name": "黔东南苗族侗族自治州",
        "id": "34OIgwojRIyEpkfAlCVoXF",
        "provinceId": "guizhou"
    },
    {
        "name": "潜江市",
        "id": "11I5tsIGRKBzlflehFdq31",
        "provinceId": "hubei"
    },
    {
        "name": "黔南布依族苗族自治州",
        "id": "JQcQFod1QSSdO9bMRtryOF",
        "provinceId": "guizhou"
    },
    {
        "name": "黔西南布依族苗族自治州",
        "id": "TnTWoAYSTsCb0FGbFrfAEF",
        "provinceId": "guizhou"
    },
    {
        "name": "庆阳市",
        "id": "i35uUQtyRv6fBcX1qcldbF",
        "provinceId": "gansu"
    },
    {
        "name": "清远市",
        "id": "IvGrAwIBRIChCR6sokcHyl",
        "provinceId": "guangdong"
    },
    {
        "name": "秦皇岛市",
        "id": "pCsBAZ3cTBqcupy8ctIpVF",
        "provinceId": "hebei"
    },
    {
        "name": "钦州市",
        "id": "UKif7im9RNGInBe0g3Dmg1",
        "provinceId": "guangxi"
    },
    {
        "name": "琼海市",
        "id": "dxlOyhAtSkOcKpkKJJ0rz1",
        "provinceId": "hainan"
    },
    {
        "name": "琼中黎族苗族自治县",
        "id": "sqEJqAhWQteCfxLQ5iZbP1",
        "provinceId": "hainan"
    },
    {
        "name": "齐齐哈尔市",
        "id": "28T4lYR8SNmZBYsCCuH9cl",
        "provinceId": "heilongjiang"
    },
    {
        "name": "七台河市",
        "id": "lE56axJ3TKC2W8BjURVAe1",
        "provinceId": "heilongjiang"
    },
    {
        "name": "泉州市",
        "id": "7vqG01JzTRuC5awk5nuqAl",
        "provinceId": "fujian"
    },
    {
        "name": "曲靖市",
        "id": "3QvsGIeUQRCNvoABA9tPAF",
        "provinceId": "yunnan"
    },
    {
        "name": "衢州市",
        "id": "Js9NVTPHSZGLTEH4ZuqAnV",
        "provinceId": "zhejiang"
    },
    {
        "name": "日喀则地区",
        "id": "F4OJ0DDtRyuINwdtPjrMpV",
        "provinceId": "xizang"
    },
    {
        "name": "日照市",
        "id": "eiyesojLS2mYJCmT8dCGwV",
        "provinceId": "shandong"
    },
    {
        "name": "三门峡市",
        "id": "hSenHBIFTYSgBdNZgG31gF",
        "provinceId": "henan"
    },
    {
        "name": "三明市",
        "id": "AfrQiip4QkSoSCWxcppKnF",
        "provinceId": "fujian"
    },
    {
        "name": "三亚市",
        "id": "Di6ZvoZsQ7mtBTAiXOAyuF",
        "provinceId": "hainan"
    },
    {
        "name": "商洛市",
        "id": "T9BHPbCEQqe1ZzrdMRwv7V",
        "provinceId": "shanxi2"
    },
    {
        "name": "商丘市",
        "id": "7OJTjawIRUKCizYy2xp2UF",
        "provinceId": "henan"
    },
    {
        "name": "上饶市",
        "id": "cLjmbvsiSpGMWBya00W2CF",
        "provinceId": "jiangxi"
    },
    {
        "name": "山南地区",
        "id": "aVygddPYREBFLhX8hc1oPF",
        "provinceId": "xizang"
    },
    {
        "name": "汕头市",
        "id": "k7lIOhoSS4S8WgrYzFYG4l",
        "provinceId": "guangdong"
    },
    {
        "name": "汕尾市",
        "id": "m9aTiCwVRpqnrQz2vMTfgF",
        "provinceId": "guangdong"
    },
    {
        "name": "韶关市",
        "id": "A2rjgBdcQOy4XgAJSt1OJ1",
        "provinceId": "guangdong"
    },
    {
        "name": "绍兴市",
        "id": "EIvPqKbATiBBJafF7V0p9V",
        "provinceId": "zhejiang"
    },
    {
        "name": "邵阳市",
        "id": "FDPH1bbiTVKgYLaBdbjz5l",
        "provinceId": "hunan"
    },
    {
        "name": "神农架林区",
        "id": "YOow77pNTty3PMiDsBL7hV",
        "provinceId": "hubei"
    },
    {
        "name": "石河子市",
        "id": "2pDAa4BGQWCaHb7Y3uuBdV",
        "provinceId": "xinjiang"
    },
    {
        "name": "石家庄市",
        "id": "h34U4POBQamXAVpkwnaVZF",
        "provinceId": "hebei"
    },
    {
        "name": "十堰市",
        "id": "ImVfBxCdT66QChcDAKen91",
        "provinceId": "hubei"
    },
    {
        "name": "石嘴山市",
        "id": "VyGjK2N3TVBa3zO8a32Rl1",
        "provinceId": "ningxia"
    },
    {
        "name": "双鸭山市",
        "id": "YYsmFCqOTaWwMcTxldbH4F",
        "provinceId": "heilongjiang"
    },
    {
        "name": "朔州市",
        "id": "cG86JYq6TsOk11vUydFk8V",
        "provinceId": "shanxi1"
    },
    {
        "name": "四平市",
        "id": "zomQN8bmRoC80Ia1GAwROl",
        "provinceId": "jilin"
    },
    {
        "name": "松原市",
        "id": "NezJrMtGSF2eBAhTXU5Atl",
        "provinceId": "jilin"
    },
    {
        "name": "绥化市",
        "id": "ASszDCKmQNGFu05pb0UFfl",
        "provinceId": "heilongjiang"
    },
    {
        "name": "遂宁市",
        "id": "rMAnzsDQTbqnUH9sBCT7r1",
        "provinceId": "sichuan"
    },
    {
        "name": "随州市",
        "id": "XfhdbpurRseET5JRyL6uo1",
        "provinceId": "hubei"
    },
    {
        "name": "宿迁市",
        "id": "ib716QvfSBa4IRDCAkZ6TF",
        "provinceId": "jiangsu"
    },
    {
        "name": "宿州市",
        "id": "6vIu3KV2RkmJEDNwtiX9hV",
        "provinceId": "anhui"
    },
    {
        "name": "塔城地区",
        "id": "bQIKVB7xTJOAS93FhFKXKl",
        "provinceId": "xinjiang"
    },
    {
        "name": "泰安市",
        "id": "PQoaB9ULTVqglp2Lhqkbr1",
        "provinceId": "shandong"
    },
    {
        "name": "台北市",
        "id": "LqMjbaJZQdSz48RaZzIuDF",
        "provinceId": "taiwan"
    },
    {
        "name": "台北县市",
        "id": "aGlipUWnTqOKtM8SAvxmjl",
        "provinceId": "taiwan"
    },
    {
        "name": "台东县",
        "id": "reFzBLBASCyTxeIqn1WcM1",
        "provinceId": "taiwan"
    },
    {
        "name": "台南市",
        "id": "nuLJmshfTwatxJzHetuaEl",
        "provinceId": "taiwan"
    },
    {
        "name": "台南县市",
        "id": "CBDHKAH6SjBUv7xdoa9mn1",
        "provinceId": "taiwan"
    },
    {
        "name": "太原市",
        "id": "hIAQGfE3RzufsAwYmCCjVl",
        "provinceId": "shanxi1"
    },
    {
        "name": "台中市",
        "id": "w3RPvroWQriBbvH6gzog6F",
        "provinceId": "taiwan"
    },
    {
        "name": "台中县市",
        "id": "bKxqFjV6QSmTBs8nZxbh01",
        "provinceId": "taiwan"
    },
    {
        "name": "台州市",
        "id": "N7AAS7KwSmyJzAs3aBIzCl",
        "provinceId": "zhejiang"
    },
    {
        "name": "泰州市",
        "id": "GAF2VmxnRD2aYBy476EMlF",
        "provinceId": "jiangsu"
    },
    {
        "name": "唐山市",
        "id": "zvr9L34hQAyPtDLKsL5aSl",
        "provinceId": "hebei"
    },
    {
        "name": "桃园县",
        "id": "WRHu6BwwQHiDEy7gg1yB9l",
        "provinceId": "taiwan"
    },
    {
        "name": "天门市",
        "id": "O7FkcI0iSPSIzwTU7cc9a1",
        "provinceId": "hubei"
    },
    {
        "name": "天水市",
        "id": "DxfSCBXdShyefl9L5QDUyF",
        "provinceId": "gansu"
    },
    {
        "name": "铁岭市",
        "id": "yCUSNlBATOO6BpSaYcqSzV",
        "provinceId": "liaoning"
    },
    {
        "name": "铜川市",
        "id": "LA0kTGegSdy8EQvN16Ddfl",
        "provinceId": "shanxi2"
    },
    {
        "name": "通化市",
        "id": "DUrxmkkjRS6QjpVc49RAIV",
        "provinceId": "jilin"
    },
    {
        "name": "通辽市",
        "id": "1mCHwpjVRVe1qKdiISSsS1",
        "provinceId": "neimenggu"
    },
    {
        "name": "铜陵市",
        "id": "jwjqAEXkQdqEeAh1fJGURV",
        "provinceId": "anhui"
    },
    {
        "name": "铜仁地区",
        "id": "njkAG5IDSbOzpaNvz8yWTl",
        "provinceId": "guizhou"
    },
    {
        "name": "吐鲁番地区",
        "id": "zC3zA3APRsabdm7lkhllnV",
        "provinceId": "xinjiang"
    },
    {
        "name": "图木舒克市",
        "id": "VHeQ5ehLQ0eS6Xw36XcOoF",
        "provinceId": "xinjiang"
    },
    {
        "name": "屯昌县",
        "id": "z2BhKnKPRzB3QbHO4O5waV",
        "provinceId": "hainan"
    },
    {
        "name": "万宁市",
        "id": "Jex4B2JZRbuV3uPQRmhLZF",
        "provinceId": "hainan"
    },
    {
        "name": "潍坊市",
        "id": "ml32yqtISAOzqV45JLmKkF",
        "provinceId": "shandong"
    },
    {
        "name": "威海市",
        "id": "BwFCz7ULRqBCuEiC3Bofbl",
        "provinceId": "shandong"
    },
    {
        "name": "渭南市",
        "id": "27ZXGtbhTsyUzDkSSAsfql",
        "provinceId": "shanxi2"
    },
    {
        "name": "文昌市",
        "id": "2VDdO4RWSrBBYTv2Me3O9V",
        "provinceId": "hainan"
    },
    {
        "name": "文山壮族苗族自治州",
        "id": "8gpCmFveTdKysLa36r3ErV",
        "provinceId": "yunnan"
    },
    {
        "name": "温州市",
        "id": "TgbkJY6qQQGfzx17k1MxKF",
        "provinceId": "zhejiang"
    },
    {
        "name": "乌海市",
        "id": "hvCobrAESv6UY2PSf5FjMl",
        "provinceId": "neimenggu"
    },
    {
        "name": "芜湖市",
        "id": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "provinceId": "anhui"
    },
    {
        "name": "五家渠市",
        "id": "gp316aHzQA6uFE5BKbEi3F",
        "provinceId": "xinjiang"
    },
    {
        "name": "乌兰察布市",
        "id": "LMrXSgaAThGeHRwyV79fXV",
        "provinceId": "neimenggu"
    },
    {
        "name": "乌鲁木齐市",
        "id": "BoPIl2ooTKWmSvVpf78PkF",
        "provinceId": "xinjiang"
    },
    {
        "name": "武威市",
        "id": "G3wtsJdtTDeyBCxb7qFttV",
        "provinceId": "gansu"
    },
    {
        "name": "无锡市",
        "id": "YBhHNMzDTwOjtS1fENhLHF",
        "provinceId": "jiangsu"
    },
    {
        "name": "五指山市",
        "id": "sQeI6SDITaGsuYoyTCIfzl",
        "provinceId": "hainan"
    },
    {
        "name": "吴忠市",
        "id": "4nHh5JugSqB6IDyqzqVYrl",
        "provinceId": "ningxia"
    },
    {
        "name": "梧州市",
        "id": "bbu48iSZR2yLVKiwnsJmil",
        "provinceId": "guangxi"
    },
    {
        "name": "厦门市",
        "id": "6o5zYebaQMqH6MUkjcgAeF",
        "provinceId": "fujian"
    },
    {
        "name": "西安市",
        "id": "uHHyd6FpSuuyDBlnc1z6vF",
        "provinceId": "shanxi2"
    },
    {
        "name": "香港岛",
        "id": "7vSGvkL8QwebP9ymJ3zXu1",
        "provinceId": "xianggang"
    },
    {
        "name": "湘潭市",
        "id": "obEnAt4WThiKceSx3hBz6V",
        "provinceId": "hunan"
    },
    {
        "name": "湘西土家族苗族自治州",
        "id": "dEsGLUzLSra6BIfUxKKKBV",
        "provinceId": "hunan"
    },
    {
        "name": "襄阳市",
        "id": "gbQqO8U7QviiKfYKAXWbYl",
        "provinceId": "hubei"
    },
    {
        "name": "咸宁市",
        "id": "P7HJaADHQTaitM7eQaTnRl",
        "provinceId": "hubei"
    },
    {
        "name": "仙桃市",
        "id": "8C6McygDSgqiE3AdSkKiNF",
        "provinceId": "hubei"
    },
    {
        "name": "咸阳市",
        "id": "wk9pVPAqTpyodRWvsUcSTV",
        "provinceId": "shanxi2"
    },
    {
        "name": "孝感市",
        "id": "6ICLFUIqQKO0P1GJLBzRHF",
        "provinceId": "hubei"
    },
    {
        "name": "锡林郭勒盟",
        "id": "sc1Ao1EYRMmTrbgsxyheGV",
        "provinceId": "neimenggu"
    },
    {
        "name": "兴安盟",
        "id": "qHWiTAGhToCc8S1SYvnM6V",
        "provinceId": "neimenggu"
    },
    {
        "name": "邢台市",
        "id": "iKGbyXUvRLeBEwyTIlIhwV",
        "provinceId": "hebei"
    },
    {
        "name": "西宁市",
        "id": "a5xyFiH9TymKqwzoLdde3F",
        "provinceId": "qinghai"
    },
    {
        "name": "新界",
        "id": "jlOsL31MTB6claGAo0NxI1",
        "provinceId": "xianggang"
    },
    {
        "name": "新乡市",
        "id": "Axmd5hINReyPfKHFESzrb1",
        "provinceId": "henan"
    },
    {
        "name": "信阳市",
        "id": "XQfeHu9vQhWB9nQDfNZuVl",
        "provinceId": "henan"
    },
    {
        "name": "新余市",
        "id": "6AAmciAeTsyV0Z1M2yt3YV",
        "provinceId": "jiangxi"
    },
    {
        "name": "忻州市",
        "id": "N3NIrMZGQLeNBfdY9A709V",
        "provinceId": "shanxi1"
    },
    {
        "name": "新竹市",
        "id": "e4ACHhS5RWKVD5gLiO06PF",
        "provinceId": "taiwan"
    },
    {
        "name": "新竹县",
        "id": "LsXZ7b57SueGobyV5hf2dV",
        "provinceId": "taiwan"
    },
    {
        "name": "西沙群岛",
        "id": "1cAwEZxmR5mSy0fUTsR3Dl",
        "provinceId": "hainan"
    },
    {
        "name": "西双版纳傣族自治州",
        "id": "dAQw9pwaRumZYH2QKlHctV",
        "provinceId": "yunnan"
    },
    {
        "name": "宣城市",
        "id": "MT8U3gcKTyunhJIiajjdz1",
        "provinceId": "anhui"
    },
    {
        "name": "许昌市",
        "id": "IrdbQxkkQAKPwOK9mdtYol",
        "provinceId": "henan"
    },
    {
        "name": "徐州市",
        "id": "nPIpLHk5RJWHHJrBHIuykV",
        "provinceId": "jiangsu"
    },
    {
        "name": "雅安市",
        "id": "eSdMZ6KLQmOwmxBpPZocx1",
        "provinceId": "sichuan"
    },
    {
        "name": "延安市",
        "id": "SF0dLhAvSges9lw2aYUQ6F",
        "provinceId": "shanxi2"
    },
    {
        "name": "延边朝鲜族自治州",
        "id": "SknXVAXvRo2Urf7R0VMBtV",
        "provinceId": "jilin"
    },
    {
        "name": "盐城市",
        "id": "aJvw45JwQgmPW4glHesyrl",
        "provinceId": "jiangsu"
    },
    {
        "name": "阳江市",
        "id": "PBwO6KyOQqiByoANHs9zj1",
        "provinceId": "guangdong"
    },
    {
        "name": "阳泉市",
        "id": "HjQvlY6yR2SLEMHabOtCwF",
        "provinceId": "shanxi1"
    },
    {
        "name": "扬州市",
        "id": "yBBgceGBQMmCPBLkj8QKx1",
        "provinceId": "jiangsu"
    },
    {
        "name": "烟台市",
        "id": "wp22ZEzyQ1yo5MkukFCWMF",
        "provinceId": "shandong"
    },
    {
        "name": "宜宾市",
        "id": "A8DkDpZERzq8RnkC6EvTfl",
        "provinceId": "sichuan"
    },
    {
        "name": "宜昌市",
        "id": "C5sfzgOPRKy7X1xrRO7uBF",
        "provinceId": "hubei"
    },
    {
        "name": "伊春市",
        "id": "5P5tr8GrTBK1bylIowlOwF",
        "provinceId": "heilongjiang"
    },
    {
        "name": "宜春市",
        "id": "A5m0Tlh3TOaKBODFRg0WM1",
        "provinceId": "jiangxi"
    },
    {
        "name": "宜兰县",
        "id": "u1bLs8ZqTCeU4gZKCNRaWV",
        "provinceId": "taiwan"
    },
    {
        "name": "伊犁哈萨克自治州",
        "id": "oisrBxZGQoaXu9s2vKpsJF",
        "provinceId": "xinjiang"
    },
    {
        "name": "银川市",
        "id": "I8nXu6bRRa2duLwfE8C2ql",
        "provinceId": "ningxia"
    },
    {
        "name": "营口市",
        "id": "UK3HGdjuSAWYbjLwe7BtE1",
        "provinceId": "liaoning"
    },
    {
        "name": "鹰潭市",
        "id": "Iv4gXPOvSMmigNrEclsm9F",
        "provinceId": "jiangxi"
    },
    {
        "name": "益阳市",
        "id": "szaG7dxGShSrvWPX9Szk41",
        "provinceId": "hunan"
    },
    {
        "name": "永州市",
        "id": "3ujjIpxUTN6BUFjKsME3Ml",
        "provinceId": "hunan"
    },
    {
        "name": "岳阳市",
        "id": "59NfTXALRnyPyWod2n2HfV",
        "provinceId": "hunan"
    },
    {
        "name": "玉林市",
        "id": "lrio6w7hTsqoyLy8VSYjBV",
        "provinceId": "guangxi"
    },
    {
        "name": "榆林市",
        "id": "dN3aFk4tSq61fMlTMWldcF",
        "provinceId": "shanxi2"
    },
    {
        "name": "运城市",
        "id": "hCPYkqACRIiFlPBbkxZ8jV",
        "provinceId": "shanxi1"
    },
    {
        "name": "云浮市",
        "id": "gOy9XLexTCCgF0PbViIx0F",
        "provinceId": "guangdong"
    },
    {
        "name": "云林县",
        "id": "m4gWS4hDSBOMIqyCWYRzl1",
        "provinceId": "taiwan"
    },
    {
        "name": "玉树藏族自治州",
        "id": "KDqpU54GQMy9qMfGBMzz21",
        "provinceId": "qinghai"
    },
    {
        "name": "玉溪市",
        "id": "5DAAGFqfSgykAVPhz1wSsV",
        "provinceId": "yunnan"
    },
    {
        "name": "枣庄市",
        "id": "sEGLTzhCTYBvPe1UT6c0R1",
        "provinceId": "shandong"
    },
    {
        "name": "彰化县",
        "id": "iHAV6X69TWWySlQ8SxglX1",
        "provinceId": "taiwan"
    },
    {
        "name": "张家界市",
        "id": "Tk1UB4AqTvCRsZOwuNyefV",
        "provinceId": "hunan"
    },
    {
        "name": "张家口市",
        "id": "mqzqtUoETjuNy7Y8sM9YjF",
        "provinceId": "hebei"
    },
    {
        "name": "张掖市",
        "id": "Gt1gm8hkR9GapBnXx0q5ll",
        "provinceId": "gansu"
    },
    {
        "name": "漳州市",
        "id": "WmPuDBqeQaB4Il8DgYtDr1",
        "provinceId": "fujian"
    },
    {
        "name": "湛江市",
        "id": "w56zI9dNScmVFb93cj4A9F",
        "provinceId": "guangdong"
    },
    {
        "name": "肇庆市",
        "id": "tqkB64R4RAWNp55Pt8mbTF",
        "provinceId": "guangdong"
    },
    {
        "name": "昭通市",
        "id": "BAj4I5l8QQmcBdABABjXBl",
        "provinceId": "yunnan"
    },
    {
        "name": "郑州市",
        "id": "ZZO6BoTsQIOywrL5swLBp1",
        "provinceId": "henan"
    },
    {
        "name": "镇江市",
        "id": "izALokboTKK7BwsBgr4Fyl",
        "provinceId": "jiangsu"
    },
    {
        "name": "中山市",
        "id": "TGuf639YSEurha9Hr17L0l",
        "provinceId": "guangdong"
    },
    {
        "name": "中沙群岛的岛礁及其海域",
        "id": "mcSpRjSmRmBAVh9mMIzOJl",
        "provinceId": "hainan"
    },
    {
        "name": "中卫市",
        "id": "35AlZXKAQ7ijgGj3GIwyGl",
        "provinceId": "ningxia"
    },
    {
        "name": "周口市",
        "id": "ZDmm5ivhRmBOrQDn5R5DCV",
        "provinceId": "henan"
    },
    {
        "name": "舟山市",
        "id": "ifJP0Ai0TpGeUi0xfeKxv1",
        "provinceId": "zhejiang"
    },
    {
        "name": "珠海市",
        "id": "PPAnTn3AQ76mm0lPJWuv6l",
        "provinceId": "guangdong"
    },
    {
        "name": "驻马店市",
        "id": "RBw1assKR8arutdsLGp6RF",
        "provinceId": "henan"
    },
    {
        "name": "株洲市",
        "id": "AGAQcq3gQMqZJMkFlgjBm1",
        "provinceId": "hunan"
    },
    {
        "name": "淄博市",
        "id": "YnrvOp7gQTapzsnCoBIsf1",
        "provinceId": "shandong"
    },
    {
        "name": "自贡市",
        "id": "NffjLTMhQWahj4OqaTbNT1",
        "provinceId": "sichuan"
    },
    {
        "name": "资阳市",
        "id": "lBp7lb40QLiAB78ENiu4w1",
        "provinceId": "sichuan"
    },
    {
        "name": "遵义市",
        "id": "jI37MKrmTzanEJMGBiZJZF",
        "provinceId": "guizhou"
    }];
    $.each(allCity, function () {
        var cityArr = allCityMap.get(this.provinceId);
        if (!cityArr) {
            cityArr = [];
        }
        cityArr.push({
            "id": this.id,
            "name": this.name
        });
        allCityMap.put(this.provinceId, cityArr);
    });
}

function getAllCounty() {
    allCounty = [{
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "噶尔县",
        "provinceId": "xizang",
        "id": "gaerxian"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "城区",
        "provinceId": "shanxi1",
        "id": "chengqu"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "代县",
        "provinceId": "shanxi1",
        "id": "daixian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "德保县",
        "provinceId": "guangxi",
        "id": "debaoxian"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "宁乡县",
        "provinceId": "hunan",
        "id": "ningxiangxian"
    },
    {
        "cityId": "BHzC8cI3ShBae0kMjRGTAl",
        "name": "平昌县",
        "provinceId": "sichuan",
        "id": "pingchangxian"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "汉川市",
        "provinceId": "hubei",
        "id": "hanchuanshi"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "怀集县",
        "provinceId": "guangdong",
        "id": "huaijixian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "集宁区",
        "provinceId": "neimenggu",
        "id": "jiningqu"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "景县",
        "provinceId": "hebei",
        "id": "jingxian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "开封县",
        "provinceId": "henan",
        "id": "kaifengxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "荔湾区",
        "provinceId": "guangdong",
        "id": "liwanqu"
    },
    {
        "cityId": "fJRLv6LJTcy0jRylxEvLWF",
        "name": "施甸县",
        "provinceId": "yunnan",
        "id": "shidianxian"
    },
    {
        "cityId": "ib716QvfSBa4IRDCAkZ6TF",
        "name": "宿城区",
        "provinceId": "jiangsu",
        "id": "suchengqu"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "紫云苗族布依族自治县",
        "provinceId": "guizhou",
        "id": "ziyunmiaozubuyizuzizhixian"
    },
    {
        "cityId": "eiyesojLS2mYJCmT8dCGwV",
        "name": "莒县",
        "provinceId": "shandong",
        "id": "juxian"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "林甸县",
        "provinceId": "heilongjiang",
        "id": "lindianxian"
    },
    {
        "cityId": "VVz6UniQT3CjyoTu0REV9F",
        "name": "隆昌县",
        "provinceId": "sichuan",
        "id": "longchangxian"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "庐阳区",
        "provinceId": "anhui",
        "id": "luyangqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "麻江县",
        "provinceId": "guizhou",
        "id": "majiangxian"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "民和回族土族自治县",
        "provinceId": "qinghai",
        "id": "minhehuizutuzuzizhixian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "祁县",
        "provinceId": "shanxi1",
        "id": "qixian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "千阳县",
        "provinceId": "shanxi2",
        "id": "qianyangxian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "三江侗族自治县",
        "provinceId": "guangxi",
        "id": "sanjiangdongzuzizhixian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "商南县",
        "provinceId": "shanxi2",
        "id": "shangnanxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "双城市",
        "provinceId": "heilongjiang",
        "id": "shuangchengshi"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "松北区",
        "provinceId": "heilongjiang",
        "id": "songbeiqu"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "肃北蒙古族自治县",
        "provinceId": "gansu",
        "id": "subeimengguzuzizhixian"
    },
    {
        "cityId": "fJRLv6LJTcy0jRylxEvLWF",
        "name": "腾冲县",
        "provinceId": "yunnan",
        "id": "tengchongxian"
    },
    {
        "cityId": "O7FkcI0iSPSIzwTU7cc9a1",
        "name": "天门市",
        "provinceId": "hubei",
        "id": "tianmenshi"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "通山县",
        "provinceId": "hubei",
        "id": "tongshanxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "蔚县",
        "provinceId": "hebei",
        "id": "weixian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "文水县",
        "provinceId": "shanxi1",
        "id": "wenshuixian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "瓮安县",
        "provinceId": "guizhou",
        "id": "wenganxian"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "武川县",
        "provinceId": "neimenggu",
        "id": "wuchuanxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "西平县",
        "provinceId": "henan",
        "id": "xipingxian"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "襄阳区",
        "provinceId": "hubei",
        "id": "xiangyangqu"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "祥云县",
        "provinceId": "yunnan",
        "id": "xiangyunxian"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "伊通满族自治县",
        "provinceId": "jilin",
        "id": "yitongmanzuzizhixian"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "应县",
        "provinceId": "shanxi1",
        "id": "yingxian"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "雨城区",
        "provinceId": "sichuan",
        "id": "yuchengqu"
    },
    {
        "cityId": "uOjDrnIaR3OAlM1KbbA4nl",
        "name": "玉龙纳西族自治县",
        "provinceId": "yunnan",
        "id": "yulongnaxizuzizhixian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "玉田县",
        "provinceId": "hebei",
        "id": "yutianxian"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "云梦县",
        "provinceId": "hubei",
        "id": "yunmengxian"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "中江县",
        "provinceId": "sichuan",
        "id": "zhongjiangxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "淄川区",
        "provinceId": "shandong",
        "id": "zichuanqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "左云县",
        "provinceId": "shanxi1",
        "id": "zuoyunxian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "岚皋县",
        "provinceId": "shanxi2",
        "id": "langaoxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "泸西县",
        "provinceId": "yunnan",
        "id": "luxixian"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "工业园区",
        "provinceId": "jiangsu",
        "id": "gongyeyuanqu"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "彰武县",
        "provinceId": "liaoning",
        "id": "zhangwuxian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "漳浦县",
        "provinceId": "fujian",
        "id": "zhangpuxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "宣化县",
        "provinceId": "hebei",
        "id": "xuanhuaxian"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "镇宁布依族苗族自治县",
        "provinceId": "guizhou",
        "id": "zhenningbuyizumiaozuzizhixian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "枝江市",
        "provinceId": "hubei",
        "id": "zhijiangshi"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "中原区",
        "provinceId": "henan",
        "id": "zhongyuanqu"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "周村区",
        "provinceId": "shandong",
        "id": "zhoucunqu"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "邹平县",
        "provinceId": "shandong",
        "id": "zoupingxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "讷河市",
        "provinceId": "heilongjiang",
        "id": "naheshi"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "蕲春县",
        "provinceId": "hubei",
        "id": "qichunxian"
    },
    {
        "cityId": "eiyesojLS2mYJCmT8dCGwV",
        "name": "岚山区",
        "provinceId": "shandong",
        "id": "lanshanqu"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "岢岚县",
        "provinceId": "shanxi1",
        "id": "kelanxian"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "峄城区",
        "provinceId": "shandong",
        "id": "yichengqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "闵行区",
        "provinceId": "shanghai",
        "id": "minhangqu"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "汶上县",
        "provinceId": "shandong",
        "id": "wenshangxian"
    },
    {
        "cityId": "94GWNu4NTDOQ7tZ3BRNYX1",
        "name": "泸水县",
        "provinceId": "yunnan",
        "id": "lushuixian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "浠水县",
        "provinceId": "hubei",
        "id": "xishuixian"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "潼关县",
        "provinceId": "shanxi2",
        "id": "tongguanxian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "婺城区",
        "provinceId": "zhejiang",
        "id": "wuchengqu"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "婺源县",
        "provinceId": "jiangxi",
        "id": "wuyuanxian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "珙县",
        "provinceId": "sichuan",
        "id": "gongxian"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "睢县",
        "provinceId": "henan",
        "id": "suixian"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "端州区",
        "provinceId": "guangdong",
        "id": "duanzhouqu"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "高县",
        "provinceId": "sichuan",
        "id": "gaoxian"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "城区",
        "provinceId": "shanxi1",
        "id": "chengqu"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "丹徒区",
        "provinceId": "jiangsu",
        "id": "dantuqu"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "德江县",
        "provinceId": "guizhou",
        "id": "dejiangxian"
    },
    {
        "cityId": "JTu5vyd0TKKIoV4rAeOnYF",
        "name": "盘山县",
        "provinceId": "liaoning",
        "id": "panshanxian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "偏关县",
        "provinceId": "shanxi1",
        "id": "pianguanxian"
    },
    {
        "cityId": "35AlZXKAQ7ijgGj3GIwyGl",
        "name": "海原县",
        "provinceId": "ningxia",
        "id": "haiyuanxian"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "华宁县",
        "provinceId": "yunnan",
        "id": "huaningxian"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "化隆回族自治县",
        "provinceId": "qinghai",
        "id": "hualonghuizuzizhixian"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "黄石港区",
        "provinceId": "hubei",
        "id": "huangshigangqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "剑河县",
        "provinceId": "guizhou",
        "id": "jianhexian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "建华区",
        "provinceId": "heilongjiang",
        "id": "jianhuaqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "江岸区",
        "provinceId": "hubei",
        "id": "jianganqu"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "静宁县",
        "provinceId": "gansu",
        "id": "jingningxian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "靖西县",
        "provinceId": "guangxi",
        "id": "jingxixian"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "开化县",
        "provinceId": "zhejiang",
        "id": "kaihuaxian"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "立山区",
        "provinceId": "liaoning",
        "id": "lishanqu"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "鲁山县",
        "provinceId": "henan",
        "id": "lushanxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "泌阳县",
        "provinceId": "henan",
        "id": "miyangxian"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "乃东县",
        "provinceId": "xizang",
        "id": "naidongxian"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "宣汉县",
        "provinceId": "sichuan",
        "id": "xuanhanxian"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "宣州区",
        "provinceId": "anhui",
        "id": "xuanzhouqu"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "亚东县",
        "provinceId": "xizang",
        "id": "yadongxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "沙河市",
        "provinceId": "hebei",
        "id": "shaheshi"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "水富县",
        "provinceId": "yunnan",
        "id": "shuifuxian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "松山区",
        "provinceId": "neimenggu",
        "id": "songshanqu"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "松滋市",
        "provinceId": "hubei",
        "id": "songzishi"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "兴业县",
        "provinceId": "guangxi",
        "id": "xingyexian"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "通城县",
        "provinceId": "hubei",
        "id": "tongchengxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "桐城市",
        "provinceId": "anhui",
        "id": "tongchengshi"
    },
    {
        "cityId": "jwjqAEXkQdqEeAh1fJGURV",
        "name": "铜官山区",
        "provinceId": "anhui",
        "id": "tongguanshanqu"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "乌拉特中旗",
        "provinceId": "neimenggu",
        "id": "wulatezhongqi"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "献县",
        "provinceId": "hebei",
        "id": "xianxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "乡城县",
        "provinceId": "sichuan",
        "id": "xiangchengxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "迎江区",
        "provinceId": "anhui",
        "id": "yingjiangqu"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "岳普湖县",
        "provinceId": "xinjiang",
        "id": "yuepuhuxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "都安瑶族自治县",
        "provinceId": "guangxi",
        "id": "duanyaozuzizhixian"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "杜尔伯特蒙古族自治县",
        "provinceId": "heilongjiang",
        "id": "duerbotemengguzuzizhixian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "坊子区",
        "provinceId": "shandong",
        "id": "fangziqu"
    },
    {
        "cityId": "U2fzxZ4gTIqmfAyDz769cV",
        "name": "防城区",
        "provinceId": "guangxi",
        "id": "fangchengqu"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "鸡泽县",
        "provinceId": "hebei",
        "id": "jizexian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "吉首市",
        "provinceId": "hunan",
        "id": "jishoushi"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "集贤县",
        "provinceId": "heilongjiang",
        "id": "jixianxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "冀州市",
        "provinceId": "hebei",
        "id": "jizhoushi"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "嘉定区",
        "provinceId": "shanghai",
        "id": "jiadingqu"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "嘉陵区",
        "provinceId": "sichuan",
        "id": "jialingqu"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "建宁县",
        "provinceId": "fujian",
        "id": "jianningxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "建水县",
        "provinceId": "yunnan",
        "id": "jianshuixian"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "江源区",
        "provinceId": "jilin",
        "id": "jiangyuanqu"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "交城县",
        "provinceId": "shanxi1",
        "id": "jiaochengxian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "交口县",
        "provinceId": "shanxi1",
        "id": "jiaokouxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "金城江区",
        "provinceId": "guangxi",
        "id": "jinchengjiangqu"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "金东区",
        "provinceId": "zhejiang",
        "id": "jindongqu"
    },
    {
        "cityId": "ulAZGrBFRXB317Z8wHsI41",
        "name": "金家庄区",
        "provinceId": "anhui",
        "id": "jinjiazhuangqu"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "金门县",
        "provinceId": "fujian",
        "id": "jinmenxian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "金明区",
        "provinceId": "henan",
        "id": "jinmingqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "金溪县",
        "provinceId": "jiangxi",
        "id": "jinxixian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "晋江市",
        "provinceId": "fujian",
        "id": "jinjiangshi"
    },
    {
        "cityId": "jx55ydxfQKmNqB4ADMsaeF",
        "name": "景泰县",
        "provinceId": "gansu",
        "id": "jingtaixian"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "开福区",
        "provinceId": "hunan",
        "id": "kaifuqu"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "开鲁县",
        "provinceId": "neimenggu",
        "id": "kailuxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "开远市",
        "provinceId": "yunnan",
        "id": "kaiyuanshi"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "柯坪县",
        "provinceId": "xinjiang",
        "id": "kepingxian"
    },
    {
        "cityId": "SDpY6V2ITICBLWBft5UiIF",
        "name": "克拉玛依区",
        "provinceId": "xinjiang",
        "id": "kelamayiqu"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "克什克腾旗",
        "provinceId": "neimenggu",
        "id": "keshenketengqi"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "奎屯市",
        "provinceId": "xinjiang",
        "id": "kuitunshi"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "昆山市",
        "provinceId": "jiangsu",
        "id": "kunshanshi"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "莱山区",
        "provinceId": "shandong",
        "id": "laishanqu"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "郎溪县",
        "provinceId": "anhui",
        "id": "langxixian"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "老边区",
        "provinceId": "liaoning",
        "id": "laobianqu"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "乐都县",
        "provinceId": "qinghai",
        "id": "leduxian"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "梨树县",
        "provinceId": "jilin",
        "id": "lishuxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "理塘县",
        "provinceId": "sichuan",
        "id": "litangxian"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "历城区",
        "provinceId": "shandong",
        "id": "lichengqu"
    },
    {
        "cityId": "4fBxBqrtRcCbWvPaqj9NlF",
        "name": "利津县",
        "provinceId": "shandong",
        "id": "lijinxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "廉江市",
        "provinceId": "guangdong",
        "id": "lianjiangshi"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "两当县",
        "provinceId": "gansu",
        "id": "liangdangxian"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "林口县",
        "provinceId": "heilongjiang",
        "id": "linkouxian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "林州市",
        "provinceId": "henan",
        "id": "linzhoushi"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "临夏县",
        "provinceId": "gansu",
        "id": "linxiaxian"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "临泽县",
        "provinceId": "gansu",
        "id": "linzexian"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "临洮县",
        "provinceId": "gansu",
        "id": "lintaoxian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "临澧县",
        "provinceId": "hunan",
        "id": "linlixian"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "邻水县",
        "provinceId": "sichuan",
        "id": "linshuixian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "邓州市",
        "provinceId": "henan",
        "id": "dengzhoushi"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "叠彩区",
        "provinceId": "guangxi",
        "id": "diecaiqu"
    },
    {
        "cityId": "v6lMtMvyRIuxYJvtNfjH6l",
        "name": "定安县",
        "provinceId": "hainan",
        "id": "dinganxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "定南县",
        "provinceId": "jiangxi",
        "id": "dingnanxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "东城区",
        "provinceId": "beijin",
        "id": "dongchengqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "东光县",
        "provinceId": "hebei",
        "id": "dongguangxian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "东河区",
        "provinceId": "neimenggu",
        "id": "donghequ"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "东台市",
        "provinceId": "jiangsu",
        "id": "dongtaishi"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "东乌珠穆沁旗",
        "provinceId": "neimenggu",
        "id": "dongwuzhumuqinqi"
    },
    {
        "cityId": "VVz6UniQT3CjyoTu0REV9F",
        "name": "东兴区",
        "provinceId": "sichuan",
        "id": "dongxingqu"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "都匀市",
        "provinceId": "guizhou",
        "id": "duyunshi"
    },
    {
        "cityId": "SDpY6V2ITICBLWBft5UiIF",
        "name": "独山子区",
        "provinceId": "xinjiang",
        "id": "dushanziqu"
    },
    {
        "cityId": "dfAvKljPRB2biVlaJj52AV",
        "name": "鄂城区",
        "provinceId": "hubei",
        "id": "echengqu"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "二道区",
        "provinceId": "jilin",
        "id": "erdaoqu"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "丰宁满族自治县",
        "provinceId": "hebei",
        "id": "fengningmanzuzizhixian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "奉化市",
        "provinceId": "zhejiang",
        "id": "fenghuashi"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "凤庆县",
        "provinceId": "yunnan",
        "id": "fengqingxian"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "抚松县",
        "provinceId": "jilin",
        "id": "fusongxian"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "富宁县",
        "provinceId": "yunnan",
        "id": "funingxian"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "甘州区",
        "provinceId": "gansu",
        "id": "ganzhouqu"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "皋兰县",
        "provinceId": "gansu",
        "id": "gaolanxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "高青县",
        "provinceId": "shandong",
        "id": "gaoqingxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "根河市",
        "provinceId": "neimenggu",
        "id": "genheshi"
    },
    {
        "cityId": "rswwRd2wSDWRZWtDSShtlV",
        "name": "八步区",
        "provinceId": "guangxi",
        "id": "babuqu"
    },
    {
        "cityId": "jx55ydxfQKmNqB4ADMsaeF",
        "name": "白银区",
        "provinceId": "gansu",
        "id": "baiyinqu"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "白玉县",
        "provinceId": "sichuan",
        "id": "baiyuxian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "白云区",
        "provinceId": "guizhou",
        "id": "baiyunqu"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "蚌山区",
        "provinceId": "anhui",
        "id": "bengshanqu"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "北湖区",
        "provinceId": "hunan",
        "id": "beihuqu"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "北林区",
        "provinceId": "heilongjiang",
        "id": "beilinqu"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "北仑区",
        "provinceId": "zhejiang",
        "id": "beilunqu"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "比如县",
        "provinceId": "xizang",
        "id": "biruxian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "宾川县",
        "provinceId": "yunnan",
        "id": "binchuanxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "博山区",
        "provinceId": "shandong",
        "id": "boshanqu"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "苍南县",
        "provinceId": "zhejiang",
        "id": "cangnanxian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "昌都县",
        "provinceId": "xizang",
        "id": "changduxian"
    },
    {
        "cityId": "fJRLv6LJTcy0jRylxEvLWF",
        "name": "昌宁县",
        "provinceId": "yunnan",
        "id": "changningxian"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "昌图县",
        "provinceId": "liaoning",
        "id": "changtuxian"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "常山县",
        "provinceId": "zhejiang",
        "id": "changshanxian"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "长白朝鲜族自治县",
        "provinceId": "jilin",
        "id": "changbaichaoxianzuzizhixian"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "长海县",
        "provinceId": "liaoning",
        "id": "changhaixian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "城阳区",
        "provinceId": "shandong",
        "id": "chengyangqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "成华区",
        "provinceId": "sichuan",
        "id": "chenghuaqu"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "澄城县",
        "provinceId": "shanxi2",
        "id": "chengchengxian"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "川汇区",
        "provinceId": "henan",
        "id": "chuanhuiqu"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "大石桥市",
        "provinceId": "liaoning",
        "id": "dashiqiaoshi"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "大通区",
        "provinceId": "anhui",
        "id": "datongqu"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "大兴区",
        "provinceId": "beijin",
        "id": "daxingqu"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "道外区",
        "provinceId": "heilongjiang",
        "id": "daowaiqu"
    },
    {
        "cityId": "BmhW0wAmRrqp0R3KHc5JPF",
        "name": "德清县",
        "provinceId": "zhejiang",
        "id": "deqingxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "南宫市",
        "provinceId": "hebei",
        "id": "nangongshi"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "南华县",
        "provinceId": "yunnan",
        "id": "nanhuaxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "南汇区",
        "provinceId": "shanghai",
        "id": "nanhuiqu"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "南山区",
        "provinceId": "heilongjiang",
        "id": "nanshanqu"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "宁都县",
        "provinceId": "jiangxi",
        "id": "ningduxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "宁晋县",
        "provinceId": "hebei",
        "id": "ningjinxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "彭州市",
        "provinceId": "sichuan",
        "id": "pengzhoushi"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "鼓楼区",
        "provinceId": "jiangsu",
        "id": "gulouqu"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "古交市",
        "provinceId": "shanxi1",
        "id": "gujiaoshi"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "古县",
        "provinceId": "shanxi1",
        "id": "guxian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "固安县",
        "provinceId": "hebei",
        "id": "guanxian"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "关岭布依族苗族自治县",
        "provinceId": "guizhou",
        "id": "guanlingbuyizumiaozuzizhixian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "光山县",
        "provinceId": "henan",
        "id": "guangshanxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "光泽县",
        "provinceId": "fujian",
        "id": "guangzexian"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "广安区",
        "provinceId": "sichuan",
        "id": "guanganqu"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "广阳区",
        "provinceId": "hebei",
        "id": "guangyangqu"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "韩城市",
        "provinceId": "shanxi2",
        "id": "hanchengshi"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "汉南区",
        "provinceId": "hubei",
        "id": "hannanqu"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "和静县",
        "provinceId": "xinjiang",
        "id": "hejingxian"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "和龙市",
        "provinceId": "jilin",
        "id": "helongshi"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "和硕县",
        "provinceId": "xinjiang",
        "id": "heshuoxian"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "东风区",
        "provinceId": "heilongjiang",
        "id": "dongfengqu"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "河津市",
        "provinceId": "shanxi1",
        "id": "hejinshi"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "黑山县",
        "provinceId": "liaoning",
        "id": "heishanxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "虹口区",
        "provinceId": "shanghai",
        "id": "hongkouqu"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "洪江市",
        "provinceId": "hunan",
        "id": "hongjiangshi"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "呼图壁县",
        "provinceId": "xinjiang",
        "id": "hutubixian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "花都区",
        "provinceId": "guangdong",
        "id": "huaduqu"
    },
    {
        "cityId": "uOjDrnIaR3OAlM1KbbA4nl",
        "name": "华坪县",
        "provinceId": "yunnan",
        "id": "huapingxian"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "化州市",
        "provinceId": "guangdong",
        "id": "huazhoushi"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "怀仁县",
        "provinceId": "shanxi1",
        "id": "huairenxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "黄龙县",
        "provinceId": "shanxi2",
        "id": "huanglongxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "黄山区",
        "provinceId": "anhui",
        "id": "huangshanqu"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "惠安县",
        "provinceId": "fujian",
        "id": "huianxian"
    },
    {
        "cityId": "pq9RAGRDSJeRDVfzOMFCX1",
        "name": "惠来县",
        "provinceId": "guangdong",
        "id": "huilaixian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "会东县",
        "provinceId": "sichuan",
        "id": "huidongxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "霞山区",
        "provinceId": "guangdong",
        "id": "xiashanqu"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "相城区",
        "provinceId": "jiangsu",
        "id": "xiangchengqu"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "镶黄旗",
        "provinceId": "neimenggu",
        "id": "xianghuangqi"
    },
    {
        "cityId": "jUxovkChQMO0BYIkse3jU1",
        "name": "湘桥区",
        "provinceId": "guangdong",
        "id": "xiangqiaoqu"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "溧阳市",
        "provinceId": "jiangsu",
        "id": "liyangshi"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "扶绥县",
        "provinceId": "guangxi",
        "id": "fusuixian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "南昌市",
        "provinceId": "jiangxi",
        "id": "nanchangshi"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "临城县",
        "provinceId": "hebei",
        "id": "linchengxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "延庆县",
        "provinceId": "beijin",
        "id": "yanqingxian"
    },
    {
        "cityId": "lBp7lb40QLiAB78ENiu4w1",
        "name": "雁江区",
        "provinceId": "sichuan",
        "id": "yanjiangqu"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "阳曲县",
        "provinceId": "shanxi1",
        "id": "yangquxian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "漾濞彝族自治县",
        "provinceId": "yunnan",
        "id": "yangbiyizuzizhixian"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "瑶海区",
        "provinceId": "anhui",
        "id": "yaohaiqu"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "依安县",
        "provinceId": "heilongjiang",
        "id": "yianxian"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "义马市",
        "provinceId": "henan",
        "id": "yimashi"
    },
    {
        "cityId": "Tk1UB4AqTvCRsZOwuNyefV",
        "name": "永定区",
        "provinceId": "hunan",
        "id": "yongdingqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "永和县",
        "provinceId": "shanxi1",
        "id": "yonghexian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "永靖县",
        "provinceId": "gansu",
        "id": "yongjingxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "永年县",
        "provinceId": "hebei",
        "id": "yongnianxian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "永泰县",
        "provinceId": "fujian",
        "id": "yongtaixian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "永新县",
        "provinceId": "jiangxi",
        "id": "yongxinxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "尤溪县",
        "provinceId": "fujian",
        "id": "youxixian"
    },
    {
        "cityId": "HjQvlY6yR2SLEMHabOtCwF",
        "name": "盂县",
        "provinceId": "shanxi1",
        "id": "yuxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "余干县",
        "provinceId": "jiangxi",
        "id": "yuganxian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "玉环县",
        "provinceId": "zhejiang",
        "id": "yuhuanxian"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "玉门市",
        "provinceId": "gansu",
        "id": "yumenshi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "裕华区",
        "provinceId": "hebei",
        "id": "yuhuaqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "元氏县",
        "provinceId": "hebei",
        "id": "yuanshixian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "元阳县",
        "provinceId": "yunnan",
        "id": "yuanyangxian"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "袁州区",
        "provinceId": "jiangxi",
        "id": "yuanzhouqu"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "岳池县",
        "provinceId": "sichuan",
        "id": "yuechixian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "云龙区",
        "provinceId": "jiangsu",
        "id": "yunlongqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "赞皇县",
        "provinceId": "hebei",
        "id": "zanhuangxian"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "凌源市",
        "provinceId": "liaoning",
        "id": "lingyuanshi"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "灵宝市",
        "provinceId": "henan",
        "id": "lingbaoshi"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "灵台县",
        "provinceId": "gansu",
        "id": "lingtaixian"
    },
    {
        "cityId": "6vIu3KV2RkmJEDNwtiX9hV",
        "name": "灵璧县",
        "provinceId": "anhui",
        "id": "lingbixian"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "龙井市",
        "provinceId": "jilin",
        "id": "longjingshi"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "陇西县",
        "provinceId": "gansu",
        "id": "longxixian"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "娄烦县",
        "provinceId": "shanxi1",
        "id": "loufanxian"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "卢龙县",
        "provinceId": "hebei",
        "id": "lulongxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "卢湾区",
        "provinceId": "shanghai",
        "id": "luwanqu"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "鲁甸县",
        "provinceId": "yunnan",
        "id": "ludianxian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "禄丰县",
        "provinceId": "yunnan",
        "id": "lufengxian"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "滦平县",
        "provinceId": "hebei",
        "id": "luanpingxian"
    },
    {
        "cityId": "gOy9XLexTCCgF0PbViIx0F",
        "name": "罗定市",
        "provinceId": "guangdong",
        "id": "luodingshi"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "洛川县",
        "provinceId": "shanxi2",
        "id": "luochuanxian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "洛南县",
        "provinceId": "shanxi2",
        "id": "luonanxian"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "洛浦县",
        "provinceId": "xinjiang",
        "id": "luopuxian"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "玛纳斯县",
        "provinceId": "xinjiang",
        "id": "manasixian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "茂县",
        "provinceId": "sichuan",
        "id": "maoxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "美姑县",
        "provinceId": "sichuan",
        "id": "meiguxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "弥勒县",
        "provinceId": "yunnan",
        "id": "milexian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "木兰县",
        "provinceId": "heilongjiang",
        "id": "mulanxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "木里藏族自治县",
        "provinceId": "sichuan",
        "id": "mulicangzuzizhixian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "那坡县",
        "provinceId": "guangxi",
        "id": "napoxian"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "纳雍县",
        "provinceId": "guizhou",
        "id": "nayongxian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "小金县",
        "provinceId": "sichuan",
        "id": "xiaojinxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "谢通门县",
        "provinceId": "xizang",
        "id": "xietongmenxian"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "新城区",
        "provinceId": "neimenggu",
        "id": "xinchengqu"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "新城区",
        "provinceId": "shanxi2",
        "id": "xinchengqu"
    },
    {
        "cityId": "6AAmciAeTsyV0Z1M2yt3YV",
        "name": "新余市",
        "provinceId": "jiangxi",
        "id": "xinyushi"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "新绛县",
        "provinceId": "shanxi1",
        "id": "xinjiangxian"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "兴化市",
        "provinceId": "jiangsu",
        "id": "xinghuashi"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "兴仁县",
        "provinceId": "guizhou",
        "id": "xingrenxian"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "兴义市",
        "provinceId": "guizhou",
        "id": "xingyishi"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "秀峰区",
        "provinceId": "guangxi",
        "id": "xiufengqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "平顺县",
        "provinceId": "shanxi1",
        "id": "pingshunxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "屏边苗族自治县",
        "provinceId": "yunnan",
        "id": "pingbianmiaozuzizhixian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "屏南县",
        "provinceId": "fujian",
        "id": "pingnanxian"
    },
    {
        "cityId": "Z7pWzlYDTuimk8Exq31NJV",
        "name": "祁连县",
        "provinceId": "qinghai",
        "id": "qilianxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "祁门县",
        "provinceId": "anhui",
        "id": "qimenxian"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "千山区",
        "provinceId": "liaoning",
        "id": "qianshanqu"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "秦安县",
        "provinceId": "gansu",
        "id": "qinanxian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "青山湖区",
        "provinceId": "jiangxi",
        "id": "qingshanhuqu"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "青原区",
        "provinceId": "jiangxi",
        "id": "qingyuanqu"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "清河区",
        "provinceId": "liaoning",
        "id": "qinghequ"
    },
    {
        "cityId": "LgxPtlJDRsOELF8nc8EfEl",
        "name": "琼山区",
        "provinceId": "hainan",
        "id": "qiongshanqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "曲沃县",
        "provinceId": "shanxi1",
        "id": "quwoxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "曲阳县",
        "provinceId": "hebei",
        "id": "quyangxian"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "仁化县",
        "provinceId": "guangdong",
        "id": "renhuaxian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "日土县",
        "provinceId": "xizang",
        "id": "rituxian"
    },
    {
        "cityId": "BwFCz7ULRqBCuEiC3Bofbl",
        "name": "荣成市",
        "provinceId": "shandong",
        "id": "rongchengshi"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "三山区",
        "provinceId": "anhui",
        "id": "sanshanqu"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "三台县",
        "provinceId": "sichuan",
        "id": "santaixian"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "沙河口区",
        "provinceId": "liaoning",
        "id": "shahekouqu"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "沙湾县",
        "provinceId": "xinjiang",
        "id": "shawanxian"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "商河县",
        "provinceId": "shandong",
        "id": "shanghexian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "上城区",
        "provinceId": "zhejiang",
        "id": "shangchengqu"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "上杭县",
        "provinceId": "fujian",
        "id": "shanghangxian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "邵阳县",
        "provinceId": "hunan",
        "id": "shaoyangxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "沈河区",
        "provinceId": "liaoning",
        "id": "shenhequ"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "石拐区",
        "provinceId": "neimenggu",
        "id": "shiguaiqu"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "石棉县",
        "provinceId": "sichuan",
        "id": "shimianxian"
    },
    {
        "cityId": "50UCMLklQk20BrhS3G9nb1",
        "name": "石台县",
        "provinceId": "anhui",
        "id": "shitaixian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "市中区",
        "provinceId": "sichuan",
        "id": "shizhongqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "松江区",
        "provinceId": "shanghai",
        "id": "songjiangqu"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "松潘县",
        "provinceId": "sichuan",
        "id": "songpanxian"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "苏尼特左旗",
        "provinceId": "neimenggu",
        "id": "sunitezuoqi"
    },
    {
        "cityId": "ib716QvfSBa4IRDCAkZ6TF",
        "name": "宿豫区",
        "provinceId": "jiangsu",
        "id": "suyuqu"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "绥芬河市",
        "provinceId": "heilongjiang",
        "id": "suifenheshi"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "遂川县",
        "provinceId": "jiangxi",
        "id": "suichuanxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "遂平县",
        "provinceId": "henan",
        "id": "suipingxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "遂溪县",
        "provinceId": "guangdong",
        "id": "suixixian"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "索县",
        "provinceId": "xizang",
        "id": "suoxian"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "太仓市",
        "provinceId": "jiangsu",
        "id": "taicangshi"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "塘沽区",
        "provinceId": "tianjin",
        "id": "tangguqu"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "天全县",
        "provinceId": "sichuan",
        "id": "tianquanxian"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "通川区",
        "provinceId": "sichuan",
        "id": "tongchuanqu"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "通州区",
        "provinceId": "beijin",
        "id": "tongzhouqu"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "铜鼓县",
        "provinceId": "jiangxi",
        "id": "tongguxian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "铜山县",
        "provinceId": "jiangsu",
        "id": "tongshanxian"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "图们市",
        "provinceId": "jilin",
        "id": "tumenshi"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "土默特左旗",
        "provinceId": "neimenggu",
        "id": "tumotezuoqi"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "团风县",
        "provinceId": "hubei",
        "id": "tuanfengxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "屯溪区",
        "provinceId": "anhui",
        "id": "tunxiqu"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "万柏林区",
        "provinceId": "shanxi1",
        "id": "wanbailinqu"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "翁牛特旗",
        "provinceId": "neimenggu",
        "id": "wengniuteqi"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "卧龙区",
        "provinceId": "henan",
        "id": "wolongqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "吴桥县",
        "provinceId": "hebei",
        "id": "wuqiaoxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "武侯区",
        "provinceId": "sichuan",
        "id": "wuhouqu"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "武江区",
        "provinceId": "guangdong",
        "id": "wujiangqu"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "五大连池市",
        "provinceId": "heilongjiang",
        "id": "wudalianchishi"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "五河县",
        "provinceId": "anhui",
        "id": "wuhexian"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "五原县",
        "provinceId": "neimenggu",
        "id": "wuyuanxian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "西湖区",
        "provinceId": "jiangxi",
        "id": "xihuqu"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "西乌珠穆沁旗",
        "provinceId": "neimenggu",
        "id": "xiwuzhumuqinqi"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "西秀区",
        "provinceId": "guizhou",
        "id": "xixiuqu"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "富顺县",
        "provinceId": "sichuan",
        "id": "fushunxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "长顺县",
        "provinceId": "guizhou",
        "id": "changshunxian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "当阳市",
        "provinceId": "hubei",
        "id": "dangyangshi"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "尼玛县",
        "provinceId": "xizang",
        "id": "nimaxian"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "宁安市",
        "provinceId": "heilongjiang",
        "id": "ninganshi"
    },
    {
        "cityId": "rMAnzsDQTbqnUH9sBCT7r1",
        "name": "蓬溪县",
        "provinceId": "sichuan",
        "id": "pengxixian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "广河县",
        "provinceId": "gansu",
        "id": "guanghexian"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "广宁县",
        "provinceId": "guangdong",
        "id": "guangningxian"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "和林格尔县",
        "provinceId": "neimenggu",
        "id": "helingeerxian"
    },
    {
        "cityId": "ulAZGrBFRXB317Z8wHsI41",
        "name": "花山区",
        "provinceId": "anhui",
        "id": "huashanqu"
    },
    {
        "cityId": "4nHh5JugSqB6IDyqzqVYrl",
        "name": "利通区",
        "provinceId": "ningxia",
        "id": "litongqu"
    },
    {
        "cityId": "SwentZd6RBeU78iyNd5921",
        "name": "乌恰县",
        "provinceId": "xinjiang",
        "id": "wuqiaxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "武清区",
        "provinceId": "tianjin",
        "id": "wuqingqu"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "锡山区",
        "provinceId": "jiangsu",
        "id": "xishanqu"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "彝良县",
        "provinceId": "yunnan",
        "id": "yiliangxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "留坝县",
        "provinceId": "shanxi2",
        "id": "liubaxian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "柳南区",
        "provinceId": "guangxi",
        "id": "liunanqu"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "龙胜各族自治县",
        "provinceId": "guangxi",
        "id": "longshenggezuzizhixian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "路桥区",
        "provinceId": "zhejiang",
        "id": "luqiaoqu"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "马边彝族自治县",
        "provinceId": "sichuan",
        "id": "mabianyizuzizhixian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "七星区",
        "provinceId": "guangxi",
        "id": "qixingqu"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "清徐县",
        "provinceId": "shanxi1",
        "id": "qingxuxian"
    },
    {
        "cityId": "Di6ZvoZsQ7mtBTAiXOAyuF",
        "name": "三亚市",
        "provinceId": "hainan",
        "id": "sanyashi"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "陕县",
        "provinceId": "henan",
        "id": "shanxian"
    },
    {
        "cityId": "obEnAt4WThiKceSx3hBz6V",
        "name": "韶山市",
        "provinceId": "hunan",
        "id": "shaoshanshi"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "突泉县",
        "provinceId": "neimenggu",
        "id": "tuquanxian"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "吴江市",
        "provinceId": "jiangsu",
        "id": "wujiangshi"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "西林区",
        "provinceId": "heilongjiang",
        "id": "xilinqu"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "西市区",
        "provinceId": "liaoning",
        "id": "xishiqu"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "西乡县",
        "provinceId": "shanxi2",
        "id": "xixiangxian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "峡江县",
        "provinceId": "jiangxi",
        "id": "xiajiangxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "越秀区",
        "provinceId": "guangdong",
        "id": "yuexiuqu"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "泽普县",
        "provinceId": "xinjiang",
        "id": "zepuxian"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "扎囊县",
        "provinceId": "xizang",
        "id": "zhanangxian"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "濮阳县",
        "provinceId": "henan",
        "id": "puyangxian"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "诸暨市",
        "provinceId": "zhejiang",
        "id": "zhujishi"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "扎兰屯市",
        "provinceId": "neimenggu",
        "id": "zhalantunshi"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "扎鲁特旗",
        "provinceId": "neimenggu",
        "id": "zhaluteqi"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "湛河区",
        "provinceId": "henan",
        "id": "zhanhequ"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "漳平市",
        "provinceId": "fujian",
        "id": "zhangpingshi"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "循化撒拉族自治县",
        "provinceId": "qinghai",
        "id": "xunhuasalazuzizhixian"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "肇源县",
        "provinceId": "heilongjiang",
        "id": "zhaoyuanxian"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "芝罘区",
        "provinceId": "shandong",
        "id": "zhifuqu"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "中站区",
        "provinceId": "henan",
        "id": "zhongzhanqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "忠县",
        "provinceId": "chongqing",
        "id": "zhongxian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "子洲县",
        "provinceId": "shanxi2",
        "id": "zizhouxian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "左贡县",
        "provinceId": "xizang",
        "id": "zuogongxian"
    },
    {
        "cityId": "x1BbMxgVTJiy8d0bx3Hj1l",
        "name": "谯城区",
        "provinceId": "anhui",
        "id": "qiaochengqu"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "郏县",
        "provinceId": "henan",
        "id": "jiaxian"
    },
    {
        "cityId": "dAQw9pwaRumZYH2QKlHctV",
        "name": "勐海县",
        "provinceId": "yunnan",
        "id": "menghaixian"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "荥经县",
        "provinceId": "sichuan",
        "id": "xingjingxian"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "莘县",
        "provinceId": "shandong",
        "id": "shenxian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "岚县",
        "provinceId": "shanxi1",
        "id": "lanxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "廛河回族区",
        "provinceId": "henan",
        "id": "chanhehuizuqu"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "沐川县",
        "provinceId": "sichuan",
        "id": "muchuanxian"
    },
    {
        "cityId": "6vIu3KV2RkmJEDNwtiX9hV",
        "name": "泗县",
        "provinceId": "anhui",
        "id": "sixian"
    },
    {
        "cityId": "L4LXKliRTYOZ3FPvmfayPF",
        "name": "淇滨区",
        "provinceId": "henan",
        "id": "qibinqu"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "澧县",
        "provinceId": "hunan",
        "id": "lixian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "绛县",
        "provinceId": "shanxi1",
        "id": "jiangxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "梓潼县",
        "provinceId": "sichuan",
        "id": "zitongxian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "犍为县",
        "provinceId": "sichuan",
        "id": "jianweixian"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "禅城区",
        "provinceId": "guangdong",
        "id": "chanchengqu"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "蛟河市",
        "provinceId": "jilin",
        "id": "jiaoheshi"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "麟游县",
        "provinceId": "shanxi2",
        "id": "linyouxian"
    },
    {
        "cityId": "FwdFCt5RRhmDAvuorgYsa1",
        "name": "额济纳旗",
        "provinceId": "neimenggu",
        "id": "ejinaqi"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "二道江区",
        "provinceId": "jilin",
        "id": "erdaojiangqu"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "番禺区",
        "provinceId": "guangdong",
        "id": "fanyuqu"
    },
    {
        "cityId": "lE56axJ3TKC2W8BjURVAe1",
        "name": "新兴区",
        "provinceId": "heilongjiang",
        "id": "xinxingqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "新洲区",
        "provinceId": "hubei",
        "id": "xinzhouqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "保定市",
        "provinceId": "hebei",
        "id": "baodingshi"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "长清区",
        "provinceId": "shandong",
        "id": "changqingqu"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "平果县",
        "provinceId": "guangxi",
        "id": "pingguoxian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "黄岛区",
        "provinceId": "shandong",
        "id": "huangdaoqu"
    },
    {
        "cityId": "ChvJPBZtTXySUcBJwktP0F",
        "name": "荔城区",
        "provinceId": "fujian",
        "id": "lichengqu"
    },
    {
        "cityId": "dfAvKljPRB2biVlaJj52AV",
        "name": "梁子湖区",
        "provinceId": "hubei",
        "id": "liangzihuqu"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "隆林各族自治县",
        "provinceId": "guangxi",
        "id": "longlingezuzizhixian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "陇县",
        "provinceId": "shanxi2",
        "id": "longxian"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "庐江县",
        "provinceId": "anhui",
        "id": "lujiangxian"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "沁源县",
        "provinceId": "shanxi1",
        "id": "qinyuanxian"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "四会市",
        "provinceId": "guangdong",
        "id": "sihuishi"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "乌马河区",
        "provinceId": "heilongjiang",
        "id": "wumahequ"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "易县",
        "provinceId": "hebei",
        "id": "yixian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "永川区",
        "provinceId": "chongqing",
        "id": "yongchuanqu"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "吉隆县",
        "provinceId": "xizang",
        "id": "jilongxian"
    },
    {
        "cityId": "113BPZgGRziC3DJIxl4VRl",
        "name": "嘉义县",
        "provinceId": "taiwan",
        "id": "jiayixian"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "嘉鱼县",
        "provinceId": "hubei",
        "id": "jiayuxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "建瓯市",
        "provinceId": "fujian",
        "id": "jianoushi"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "江安县",
        "provinceId": "sichuan",
        "id": "jianganxian"
    },
    {
        "cityId": "PBwO6KyOQqiByoANHs9zj1",
        "name": "江城区",
        "provinceId": "guangdong",
        "id": "jiangchengqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "江汉区",
        "provinceId": "hubei",
        "id": "jianghanqu"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "江孜县",
        "provinceId": "xizang",
        "id": "jiangzixian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "介休市",
        "provinceId": "shanxi1",
        "id": "jiexiushi"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "金安区",
        "provinceId": "anhui",
        "id": "jinanqu"
    },
    {
        "cityId": "DzhfMD2ZRiWJcZeC5eFLCl",
        "name": "金川区",
        "provinceId": "gansu",
        "id": "jinchuanqu"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "金凤区",
        "provinceId": "ningxia",
        "id": "jinfengqu"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "金湖县",
        "provinceId": "jiangsu",
        "id": "jinhuxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "金平苗族瑶族傣族自治县",
        "provinceId": "yunnan",
        "id": "jinpingmiaozuyaozudaizuzizhixian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "津市市",
        "provinceId": "hunan",
        "id": "jinshishi"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "锦江区",
        "provinceId": "sichuan",
        "id": "jinjiangqu"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "晋城市",
        "provinceId": "shanxi1",
        "id": "jinchengshi"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "荆州区",
        "provinceId": "hubei",
        "id": "jingzhouqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "井陉矿区",
        "provinceId": "hebei",
        "id": "jingxingkuangqu"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "景宁畲族自治县",
        "provinceId": "zhejiang",
        "id": "jingningyuzuzizhixian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "静乐县",
        "provinceId": "shanxi1",
        "id": "jinglexian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "九里区",
        "provinceId": "jiangsu",
        "id": "jiuliqu"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "居巢区",
        "provinceId": "anhui",
        "id": "juchaoqu"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "巨野县",
        "provinceId": "shandong",
        "id": "juyexian"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "句容市",
        "provinceId": "jiangsu",
        "id": "jurongshi"
    },
    {
        "cityId": "PxflkbAaQQWQ8BLKk1pJ01",
        "name": "莱城区",
        "provinceId": "shandong",
        "id": "laichengqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "浪卡子县",
        "provinceId": "xizang",
        "id": "langkazixian"
    },
    {
        "cityId": "nsbf5TURSWuJ2zCBxE80oV",
        "name": "冷水江市",
        "provinceId": "hunan",
        "id": "lengshuijiangshi"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "丽水市",
        "provinceId": "zhejiang",
        "id": "lishuishi"
    },
    {
        "cityId": "x1BbMxgVTJiy8d0bx3Hj1l",
        "name": "利辛县",
        "provinceId": "anhui",
        "id": "lixinxian"
    },
    {
        "cityId": "nsbf5TURSWuJ2zCBxE80oV",
        "name": "涟源市",
        "provinceId": "hunan",
        "id": "lianyuanshi"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "梁园区",
        "provinceId": "henan",
        "id": "liangyuanqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "临川区",
        "provinceId": "jiangxi",
        "id": "linchuanqu"
    },
    {
        "cityId": "aSNBVGzSTCW3UxyzJAkUJF",
        "name": "临高县",
        "provinceId": "hainan",
        "id": "lingaoxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "临桂县",
        "provinceId": "guangxi",
        "id": "linguixian"
    },
    {
        "cityId": "Xm5wHSV2SKB5rqXvjxeXcl",
        "name": "临颍县",
        "provinceId": "henan",
        "id": "linyingxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "得荣县",
        "provinceId": "sichuan",
        "id": "derongxian"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "鼎湖区",
        "provinceId": "guangdong",
        "id": "dinghuqu"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "定边县",
        "provinceId": "shanxi2",
        "id": "dingbianxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "定结县",
        "provinceId": "xizang",
        "id": "dingjiexian"
    },
    {
        "cityId": "VR9jIgIHQPO96UVKHMXjWF",
        "name": "东方市",
        "provinceId": "hainan",
        "id": "dongfangshi"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "东丽区",
        "provinceId": "tianjin",
        "id": "dongliqu"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "东源县",
        "provinceId": "guangdong",
        "id": "dongyuanxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "法库县",
        "provinceId": "liaoning",
        "id": "fakuxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "肥乡县",
        "provinceId": "hebei",
        "id": "feixiangxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "汾西县",
        "provinceId": "shanxi1",
        "id": "fenxixian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "丰县",
        "provinceId": "jiangsu",
        "id": "fengxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "峰峰矿区",
        "provinceId": "hebei",
        "id": "fengfengkuangqu"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "凤城市",
        "provinceId": "liaoning",
        "id": "fengchengshi"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "扶沟县",
        "provinceId": "henan",
        "id": "fugouxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "福泉市",
        "provinceId": "guizhou",
        "id": "fuquanshi"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "富平县",
        "provinceId": "shanxi2",
        "id": "fupingxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "甘洛县",
        "provinceId": "sichuan",
        "id": "ganluoxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "岗巴县",
        "provinceId": "xizang",
        "id": "gangbaxian"
    },
    {
        "cityId": "J0ws7MX5SxOPG0oM9M4DoF",
        "name": "高雄县",
        "provinceId": "taiwan",
        "id": "gaoxiongxian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "革吉县",
        "provinceId": "xizang",
        "id": "gejixian"
    },
    {
        "cityId": "V1nlY4TEQkSkNHJswPRTfV",
        "name": "格尔木市",
        "provinceId": "qinghai",
        "id": "geermushi"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "工农区",
        "provinceId": "heilongjiang",
        "id": "gongnongqu"
    },
    {
        "cityId": "6vIu3KV2RkmJEDNwtiX9hV",
        "name": "埇桥区",
        "provinceId": "anhui",
        "id": "qiaoqu"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "阿城区",
        "provinceId": "heilongjiang",
        "id": "achengqu"
    },
    {
        "cityId": "FwdFCt5RRhmDAvuorgYsa1",
        "name": "阿拉善左旗",
        "provinceId": "neimenggu",
        "id": "alashanzuoqi"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "阿鲁科尔沁旗",
        "provinceId": "neimenggu",
        "id": "alukeerqinqi"
    },
    {
        "cityId": "SwentZd6RBeU78iyNd5921",
        "name": "阿图什市",
        "provinceId": "xinjiang",
        "id": "atushenshi"
    },
    {
        "cityId": "BmhW0wAmRrqp0R3KHc5JPF",
        "name": "安吉县",
        "provinceId": "zhejiang",
        "id": "anjixian"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "安仁县",
        "provinceId": "hunan",
        "id": "anrenxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "安远县",
        "provinceId": "jiangxi",
        "id": "anyuanxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "白云区",
        "provinceId": "guangdong",
        "id": "baiyunqu"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "包河区",
        "provinceId": "anhui",
        "id": "baohequ"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "保康县",
        "provinceId": "hubei",
        "id": "baokangxian"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "北镇市",
        "provinceId": "liaoning",
        "id": "beizhenshi"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "毕节市",
        "provinceId": "guizhou",
        "id": "bijieshi"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "宾县",
        "provinceId": "heilongjiang",
        "id": "binxian"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "博兴县",
        "provinceId": "shandong",
        "id": "boxingxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "长洲区",
        "provinceId": "guangxi",
        "id": "changzhouqu"
    },
    {
        "cityId": "jUxovkChQMO0BYIkse3jU1",
        "name": "潮安县",
        "provinceId": "guangdong",
        "id": "chaoanxian"
    },
    {
        "cityId": "jUxovkChQMO0BYIkse3jU1",
        "name": "潮州市",
        "provinceId": "guangdong",
        "id": "chaozhoushi"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "城关区",
        "provinceId": "xizang",
        "id": "chengguanqu"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "成武县",
        "provinceId": "shandong",
        "id": "chengwuxian"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "澄海区",
        "provinceId": "guangdong",
        "id": "chenghaiqu"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "赤壁市",
        "provinceId": "hubei",
        "id": "chibishi"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "赤水市",
        "provinceId": "guizhou",
        "id": "chishuishi"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "崇明县",
        "provinceId": "shanghai",
        "id": "chongmingxian"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "崇仁县",
        "provinceId": "jiangxi",
        "id": "chongrenxian"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "崇阳县",
        "provinceId": "hubei",
        "id": "chongyangxian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "船营区",
        "provinceId": "jilin",
        "id": "chuanyingqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "淳化县",
        "provinceId": "shanxi2",
        "id": "chunhuaxian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "达拉特旗",
        "provinceId": "neimenggu",
        "id": "dalateqi"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "大关县",
        "provinceId": "yunnan",
        "id": "daguanxian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "大理市",
        "provinceId": "yunnan",
        "id": "dalishi"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "大名县",
        "provinceId": "hebei",
        "id": "damingxian"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "郸城县",
        "provinceId": "henan",
        "id": "danchengxian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "德化县",
        "provinceId": "fujian",
        "id": "dehuaxian"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "南长区",
        "provinceId": "jiangsu",
        "id": "nanchangqu"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "南靖县",
        "provinceId": "fujian",
        "id": "nanjingxian"
    },
    {
        "cityId": "bTPQ6jG4Q3CSvKw9vHEaXV",
        "name": "南沙群岛",
        "provinceId": "hainan",
        "id": "nanshaqundao"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "南漳县",
        "provinceId": "hubei",
        "id": "nanzhangxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "内丘县",
        "provinceId": "hebei",
        "id": "neiqiuxian"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "嫩江县",
        "provinceId": "heilongjiang",
        "id": "nenjiangxian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "宁海县",
        "provinceId": "zhejiang",
        "id": "ninghaixian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "宁河县",
        "provinceId": "tianjin",
        "id": "ninghexian"
    },
    {
        "cityId": "xFEk36jYRuWwRknzZfEnUV",
        "name": "彭阳县",
        "provinceId": "ningxia",
        "id": "pengyangxian"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "萍乡市",
        "provinceId": "jiangxi",
        "id": "pingxiangshi"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "沽源县",
        "provinceId": "hebei",
        "id": "guyuanxian"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "古蔺县",
        "provinceId": "sichuan",
        "id": "gulinxian"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "广昌县",
        "provinceId": "jiangxi",
        "id": "guangchangxian"
    },
    {
        "cityId": "5fwU4TARQ2Chx9G8Z1NsdF",
        "name": "贵南县",
        "provinceId": "qinghai",
        "id": "guinanxian"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "海沧区",
        "provinceId": "fujian",
        "id": "haicangqu"
    },
    {
        "cityId": "EwCUBDHnTH2S4usWvzmIO1",
        "name": "海城区",
        "provinceId": "guangxi",
        "id": "haichengqu"
    },
    {
        "cityId": "hvCobrAESv6UY2PSf5FjMl",
        "name": "海南区",
        "provinceId": "neimenggu",
        "id": "hainanqu"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "海州区",
        "provinceId": "jiangsu",
        "id": "haizhouqu"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "汉阴县",
        "provinceId": "shanxi2",
        "id": "hanyinxian"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "合江县",
        "provinceId": "sichuan",
        "id": "hejiangxian"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "合山市",
        "provinceId": "guangxi",
        "id": "heshanshi"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "河口瑶族自治县",
        "provinceId": "yunnan",
        "id": "hekouyaozuzizhixian"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "赫山区",
        "provinceId": "hunan",
        "id": "heshanqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "红旗区",
        "provinceId": "henan",
        "id": "hongqiqu"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "红原县",
        "provinceId": "sichuan",
        "id": "hongyuanxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "侯马市",
        "provinceId": "shanxi1",
        "id": "houmashi"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "花溪区",
        "provinceId": "guizhou",
        "id": "huaxiqu"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "怀远县",
        "provinceId": "anhui",
        "id": "huaiyuanxian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "黄骅市",
        "provinceId": "hebei",
        "id": "huanghuashi"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "辉南县",
        "provinceId": "jilin",
        "id": "huinanxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "徽州区",
        "provinceId": "anhui",
        "id": "huizhouqu"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "会理县",
        "provinceId": "sichuan",
        "id": "huilixian"
    },
    {
        "cityId": "jx55ydxfQKmNqB4ADMsaeF",
        "name": "会宁县",
        "provinceId": "gansu",
        "id": "huiningxian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "霞浦县",
        "provinceId": "fujian",
        "id": "xiapuxian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "下城区",
        "provinceId": "zhejiang",
        "id": "xiachengqu"
    },
    {
        "cityId": "PPAnTn3AQ76mm0lPJWuv6l",
        "name": "香洲区",
        "provinceId": "guangdong",
        "id": "xiangzhouqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "襄垣县",
        "provinceId": "shanxi1",
        "id": "xiangyuanxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "乡宁县",
        "provinceId": "shanxi1",
        "id": "xiangningxian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "小河区",
        "provinceId": "guizhou",
        "id": "xiaohequ"
    },
    {
        "cityId": "HVMTanysROWMSUw8sclwdF",
        "name": "濉溪县",
        "provinceId": "anhui",
        "id": "suixixian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "杞县",
        "provinceId": "henan",
        "id": "qixian"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "旌德县",
        "provinceId": "anhui",
        "id": "jingdexian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "鼎城区",
        "provinceId": "hunan",
        "id": "dingchengqu"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "巢湖市",
        "provinceId": "anhui",
        "id": "chaohushi"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "古塔区",
        "provinceId": "liaoning",
        "id": "gutaqu"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "槐荫区",
        "provinceId": "shandong",
        "id": "huaiyinqu"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "江山市",
        "provinceId": "zhejiang",
        "id": "jiangshanshi"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "科尔沁区",
        "provinceId": "neimenggu",
        "id": "keerqinqu"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "临潼区",
        "provinceId": "shanxi2",
        "id": "lintongqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "兴宁区",
        "provinceId": "guangxi",
        "id": "xingningqu"
    },
    {
        "cityId": "Le5W5bxsSKaO0oiwOMp4W1",
        "name": "盐边县",
        "provinceId": "sichuan",
        "id": "yanbianxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "炎陵县",
        "provinceId": "hunan",
        "id": "yanlingxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "杨浦区",
        "provinceId": "shanghai",
        "id": "yangpuqu"
    },
    {
        "cityId": "PBwO6KyOQqiByoANHs9zj1",
        "name": "阳春市",
        "provinceId": "guangdong",
        "id": "yangchunshi"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "阳高县",
        "provinceId": "shanxi1",
        "id": "yanggaoxian"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "阳谷县",
        "provinceId": "shandong",
        "id": "yangguxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "阳朔县",
        "provinceId": "guangxi",
        "id": "yangshuoxian"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "阳信县",
        "provinceId": "shandong",
        "id": "yangxinxian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "仪陇县",
        "provinceId": "sichuan",
        "id": "yilongxian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "宜宾县",
        "provinceId": "sichuan",
        "id": "yibinxian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "宜良县",
        "provinceId": "yunnan",
        "id": "yiliangxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "宜州市",
        "provinceId": "guangxi",
        "id": "yizhoushi"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "英吉沙县",
        "provinceId": "xinjiang",
        "id": "yingjishaxian"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "永德县",
        "provinceId": "yunnan",
        "id": "yongdexian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "永福县",
        "provinceId": "guangxi",
        "id": "yongfuxian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "永平县",
        "provinceId": "yunnan",
        "id": "yongpingxian"
    },
    {
        "cityId": "uOjDrnIaR3OAlM1KbbA4nl",
        "name": "永胜县",
        "provinceId": "yunnan",
        "id": "yongshengxian"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "友谊县",
        "provinceId": "heilongjiang",
        "id": "youyixian"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "右玉县",
        "provinceId": "shanxi1",
        "id": "youyuxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "于洪区",
        "provinceId": "liaoning",
        "id": "yuhongqu"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "榆社县",
        "provinceId": "shanxi1",
        "id": "yushexian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "榆阳区",
        "provinceId": "shanxi2",
        "id": "yuyangqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "渝北区",
        "provinceId": "chongqing",
        "id": "yubeiqu"
    },
    {
        "cityId": "gOy9XLexTCCgF0PbViIx0F",
        "name": "郁南县",
        "provinceId": "guangdong",
        "id": "yunanxian"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "裕民县",
        "provinceId": "xinjiang",
        "id": "yuminxian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "垣曲县",
        "provinceId": "shanxi1",
        "id": "yuanquxian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "原平市",
        "provinceId": "shanxi1",
        "id": "yuanpingshi"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "岳麓区",
        "provinceId": "hunan",
        "id": "yueluqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "灵寿县",
        "provinceId": "hebei",
        "id": "lingshouxian"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "陵川县",
        "provinceId": "shanxi1",
        "id": "lingchuanxian"
    },
    {
        "cityId": "UpFvFTldRTqUsNlvvUP0AF",
        "name": "六枝特区",
        "provinceId": "guizhou",
        "id": "liuzhitequ"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "龙泉市",
        "provinceId": "zhejiang",
        "id": "longquanshi"
    },
    {
        "cityId": "xFEk36jYRuWwRknzZfEnUV",
        "name": "隆德县",
        "provinceId": "ningxia",
        "id": "longdexian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "隆回县",
        "provinceId": "hunan",
        "id": "longhuixian"
    },
    {
        "cityId": "fJRLv6LJTcy0jRylxEvLWF",
        "name": "隆阳区",
        "provinceId": "yunnan",
        "id": "longyangqu"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "卢氏县",
        "provinceId": "henan",
        "id": "lushixian"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "碌曲县",
        "provinceId": "gansu",
        "id": "luquxian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "路南区",
        "provinceId": "hebei",
        "id": "lunanqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "鹿泉市",
        "provinceId": "hebei",
        "id": "luquanshi"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "禄劝彝族苗族自治县",
        "provinceId": "yunnan",
        "id": "luquanyizumiaozuzizhixian"
    },
    {
        "cityId": "m9aTiCwVRpqnrQz2vMTfgF",
        "name": "陆河县",
        "provinceId": "guangdong",
        "id": "luhexian"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "旅顺口区",
        "provinceId": "liaoning",
        "id": "lvshunkouqu"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "罗甸县",
        "provinceId": "guizhou",
        "id": "luodianxian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "洛江区",
        "provinceId": "fujian",
        "id": "luojiangqu"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "洛龙区",
        "provinceId": "henan",
        "id": "luolongqu"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "洛宁县",
        "provinceId": "henan",
        "id": "luoningxian"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "洛扎县",
        "provinceId": "xizang",
        "id": "luozhaxian"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "梅河口市",
        "provinceId": "jilin",
        "id": "meihekoushi"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "密山市",
        "provinceId": "heilongjiang",
        "id": "mishanshi"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "闽侯县",
        "provinceId": "fujian",
        "id": "minhouxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "莫力达瓦达斡尔族自治旗",
        "provinceId": "neimenggu",
        "id": "molidawadawoerzuzizhiqi"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "墨玉县",
        "provinceId": "xinjiang",
        "id": "moyuxian"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "孝昌县",
        "provinceId": "hubei",
        "id": "xiaochangxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "新巴尔虎右旗",
        "provinceId": "neimenggu",
        "id": "xinbaerhuyouqi"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "新宾满族自治县",
        "provinceId": "liaoning",
        "id": "xinbinmanzuzizhixian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "新蔡县",
        "provinceId": "henan",
        "id": "xincaixian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "新干县",
        "provinceId": "jiangxi",
        "id": "xinganxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "新河县",
        "provinceId": "hebei",
        "id": "xinhexian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "新晃侗族自治县",
        "provinceId": "hunan",
        "id": "xinhuangdongzuzizhixian"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "新会区",
        "provinceId": "guangdong",
        "id": "xinhuiqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "新津县",
        "provinceId": "sichuan",
        "id": "xinjinxian"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "新邱区",
        "provinceId": "liaoning",
        "id": "xinqiuqu"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "兴国县",
        "provinceId": "jiangxi",
        "id": "xingguoxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "邢台县",
        "provinceId": "hebei",
        "id": "xingtaixian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "雅江县",
        "provinceId": "sichuan",
        "id": "yajiangxian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "平遥县",
        "provinceId": "shanxi1",
        "id": "pingyaoxian"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "兴安区",
        "provinceId": "heilongjiang",
        "id": "xinganqu"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "栖霞市",
        "provinceId": "shandong",
        "id": "qixiashi"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "七里河区",
        "provinceId": "gansu",
        "id": "qilihequ"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "乾安县",
        "provinceId": "jilin",
        "id": "qiananxian"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "乾县",
        "provinceId": "shanxi2",
        "id": "qianxian"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "前郭尔罗斯蒙古族自治县",
        "provinceId": "jilin",
        "id": "qianguoerluosimengguzuzizhixian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "桥西区",
        "provinceId": "hebei",
        "id": "qiaoxiqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "青浦区",
        "provinceId": "shanghai",
        "id": "qingpuqu"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "清河门区",
        "provinceId": "liaoning",
        "id": "qinghemenqu"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "清浦区",
        "provinceId": "jiangsu",
        "id": "qingpuqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "琼结县",
        "provinceId": "xizang",
        "id": "qiongjiexian"
    },
    {
        "cityId": "sqEJqAhWQteCfxLQ5iZbP1",
        "name": "琼中黎族苗族自治县",
        "provinceId": "hainan",
        "id": "qiongzhonglizumiaozuzizhixian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "曲阜市",
        "provinceId": "shandong",
        "id": "qufushi"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "曲松县",
        "provinceId": "xizang",
        "id": "qusongxian"
    },
    {
        "cityId": "jUxovkChQMO0BYIkse3jU1",
        "name": "饶平县",
        "provinceId": "guangdong",
        "id": "raopingxian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "任丘市",
        "provinceId": "hebei",
        "id": "renqiushi"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "如皋市",
        "provinceId": "jiangsu",
        "id": "rugaoshi"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "汝州市",
        "provinceId": "henan",
        "id": "ruzhoushi"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "沙湾区",
        "provinceId": "sichuan",
        "id": "shawanqu"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "尚志市",
        "provinceId": "heilongjiang",
        "id": "shangzhishi"
    },
    {
        "cityId": "rMAnzsDQTbqnUH9sBCT7r1",
        "name": "射洪县",
        "provinceId": "sichuan",
        "id": "shehongxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "深州市",
        "provinceId": "hebei",
        "id": "shenzhoushi"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "石阡县",
        "provinceId": "guizhou",
        "id": "shiqianxian"
    },
    {
        "cityId": "VVz6UniQT3CjyoTu0REV9F",
        "name": "市中区",
        "provinceId": "sichuan",
        "id": "shizhongqu"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "市中区",
        "provinceId": "shandong",
        "id": "shizhongqu"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "顺昌县",
        "provinceId": "fujian",
        "id": "shunchangxian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "顺庆区",
        "provinceId": "sichuan",
        "id": "shunqingqu"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "思南县",
        "provinceId": "guizhou",
        "id": "sinanxian"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "肃南裕固族自治县",
        "provinceId": "gansu",
        "id": "sunanyuguzuzizhixian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "绥宁县",
        "provinceId": "hunan",
        "id": "suiningxian"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "塔城市",
        "provinceId": "xinjiang",
        "id": "tachengshi"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "太和区",
        "provinceId": "liaoning",
        "id": "taihequ"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "太康县",
        "provinceId": "henan",
        "id": "taikangxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "桃城区",
        "provinceId": "hebei",
        "id": "taochengqu"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "桃江县",
        "provinceId": "hunan",
        "id": "taojiangxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "天峨县",
        "provinceId": "guangxi",
        "id": "tianexian"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "天山区",
        "provinceId": "xinjiang",
        "id": "tianshanqu"
    },
    {
        "cityId": "G3wtsJdtTDeyBCxb7qFttV",
        "name": "天祝藏族自治县",
        "provinceId": "gansu",
        "id": "tianzhucangzuzizhixian"
    },
    {
        "cityId": "BHzC8cI3ShBae0kMjRGTAl",
        "name": "通江县",
        "provinceId": "sichuan",
        "id": "tongjiangxian"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "通州市",
        "provinceId": "jiangsu",
        "id": "tongzhoushi"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "万山特区",
        "provinceId": "guizhou",
        "id": "wanshantequ"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "万秀区",
        "provinceId": "guangxi",
        "id": "wanxiuqu"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "旺苍县",
        "provinceId": "sichuan",
        "id": "wangcangxian"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "望谟县",
        "provinceId": "guizhou",
        "id": "wangmoxian"
    },
    {
        "cityId": "BwFCz7ULRqBCuEiC3Bofbl",
        "name": "威海市",
        "provinceId": "shandong",
        "id": "weihaishi"
    },
    {
        "cityId": "VVz6UniQT3CjyoTu0REV9F",
        "name": "威远县",
        "provinceId": "sichuan",
        "id": "weiyuanxian"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "围场满族蒙古族自治县",
        "provinceId": "hebei",
        "id": "weichangmanzumengguzuzizhixian"
    },
    {
        "cityId": "jA7wZ4PcTwu0OavGBsvDql",
        "name": "维西傈僳族自治县",
        "provinceId": "yunnan",
        "id": "weixilisuzuzizhixian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "魏县",
        "provinceId": "hebei",
        "id": "weixian"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "渭城区",
        "provinceId": "shanxi2",
        "id": "weichengqu"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "卫东区",
        "provinceId": "henan",
        "id": "weidongqu"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "乌鲁木齐县",
        "provinceId": "xinjiang",
        "id": "wulumuqixian"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "乌苏市",
        "provinceId": "xinjiang",
        "id": "wusushi"
    },
    {
        "cityId": "BmhW0wAmRrqp0R3KHc5JPF",
        "name": "吴兴区",
        "provinceId": "zhejiang",
        "id": "wuxingqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "武鸣县",
        "provinceId": "guangxi",
        "id": "wumingxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "武宁县",
        "provinceId": "jiangxi",
        "id": "wuningxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "武强县",
        "provinceId": "hebei",
        "id": "wuqiangxian"
    },
    {
        "cityId": "gp316aHzQA6uFE5BKbEi3F",
        "name": "五家渠市",
        "provinceId": "xinjiang",
        "id": "wujiaqushi"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "西华县",
        "provinceId": "henan",
        "id": "xihuaxian"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "赣榆县",
        "provinceId": "jiangsu",
        "id": "ganyuxian"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "高唐县",
        "provinceId": "shandong",
        "id": "gaotangxian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "城中区",
        "provinceId": "guangxi",
        "id": "chengzhongqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "大渡口区",
        "provinceId": "chongqing",
        "id": "dadukouqu"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "大兴安岭地区新林区",
        "provinceId": "heilongjiang",
        "id": "daxinganlingdiquxinlinqu"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "盘龙区",
        "provinceId": "yunnan",
        "id": "panlongqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "彭水苗族土家族自治县",
        "provinceId": "chongqing",
        "id": "pengshuimiaozutujiazuzizhixian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "平陆县",
        "provinceId": "shanxi1",
        "id": "pingluxian"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "汉源县",
        "provinceId": "sichuan",
        "id": "hanyuanxian"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "和田市",
        "provinceId": "xinjiang",
        "id": "hetianshi"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "华阴市",
        "provinceId": "shanxi2",
        "id": "huayinshi"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "江华瑶族自治县",
        "provinceId": "hunan",
        "id": "jianghuayaozuzizhixian"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "江阴市",
        "provinceId": "jiangsu",
        "id": "jiangyinshi"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "晋源区",
        "provinceId": "shanxi1",
        "id": "jinyuanqu"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "连江县",
        "provinceId": "fujian",
        "id": "lianjiangxian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "平山区",
        "provinceId": "liaoning",
        "id": "pingshanqu"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "沁阳市",
        "provinceId": "henan",
        "id": "qinyangshi"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "沙雅县",
        "provinceId": "xinjiang",
        "id": "shayaxian"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "市中区",
        "provinceId": "shandong",
        "id": "shizhongqu"
    },
    {
        "cityId": "zC3zA3APRsabdm7lkhllnV",
        "name": "托克逊县",
        "provinceId": "xinjiang",
        "id": "tuokexunxian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "务川仡佬族苗族自治县",
        "provinceId": "guizhou",
        "id": "wuchuangelaozumiaozuzizhixian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "盐都区",
        "provinceId": "jiangsu",
        "id": "yanduqu"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "正蓝旗",
        "provinceId": "neimenggu",
        "id": "zhenglanqi"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "驿城区",
        "provinceId": "henan",
        "id": "yichengqu"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "龙城区",
        "provinceId": "liaoning",
        "id": "longchengqu"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "龙口市",
        "provinceId": "shandong",
        "id": "longkoushi"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "隆尧县",
        "provinceId": "hebei",
        "id": "longyaoxian"
    },
    {
        "cityId": "nsbf5TURSWuJ2zCBxE80oV",
        "name": "娄星区",
        "provinceId": "hunan",
        "id": "louxingqu"
    },
    {
        "cityId": "Le5W5bxsSKaO0oiwOMp4W1",
        "name": "米易县",
        "provinceId": "sichuan",
        "id": "miyixian"
    },
    {
        "cityId": "11I5tsIGRKBzlflehFdq31",
        "name": "潜江市",
        "provinceId": "hubei",
        "id": "qianjiangshi"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "色达县",
        "provinceId": "sichuan",
        "id": "sedaxian"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "沙市区",
        "provinceId": "hubei",
        "id": "shashiqu"
    },
    {
        "cityId": "JTu5vyd0TKKIoV4rAeOnYF",
        "name": "双台子区",
        "provinceId": "liaoning",
        "id": "shuangtaiziqu"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "朔城区",
        "provinceId": "shanxi1",
        "id": "shuochengqu"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "天水市",
        "provinceId": "gansu",
        "id": "tianshuishi"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "天柱县",
        "provinceId": "guizhou",
        "id": "tianzhuxian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "通道侗族自治县",
        "provinceId": "hunan",
        "id": "tongdaodongzuzizhixian"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "无为县",
        "provinceId": "anhui",
        "id": "wuweixian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "西充县",
        "provinceId": "sichuan",
        "id": "xichongxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "咸丰县",
        "provinceId": "hubei",
        "id": "xianfengxian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "象山县",
        "provinceId": "zhejiang",
        "id": "xiangshanxian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "柳林县",
        "provinceId": "shanxi1",
        "id": "liulinxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "沂源县",
        "provinceId": "shandong",
        "id": "yiyuanxian"
    },
    {
        "cityId": "UpFvFTldRTqUsNlvvUP0AF",
        "name": "钟山区",
        "provinceId": "guizhou",
        "id": "zhongshanqu"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "阆中市",
        "provinceId": "sichuan",
        "id": "langzhongshi"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "汉中市",
        "provinceId": "shanxi2",
        "id": "hanzhongshi"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "沾益县",
        "provinceId": "yunnan",
        "id": "zhanyixian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "章贡区",
        "provinceId": "jiangxi",
        "id": "zhanggongqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "张北县",
        "provinceId": "hebei",
        "id": "zhangbeixian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "昭觉县",
        "provinceId": "sichuan",
        "id": "zhaojuexian"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "振安区",
        "provinceId": "liaoning",
        "id": "zhenanqu"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "振兴区",
        "provinceId": "liaoning",
        "id": "zhenxingqu"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "镇坪县",
        "provinceId": "shanxi2",
        "id": "zhenpingxian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "蒸湘区",
        "provinceId": "hunan",
        "id": "zhengxiangqu"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "正安县",
        "provinceId": "guizhou",
        "id": "zhenganxian"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "织金县",
        "provinceId": "guizhou",
        "id": "zhijinxian"
    },
    {
        "cityId": "pzyDfLLvRW623comq63RsV",
        "name": "钟祥市",
        "provinceId": "hubei",
        "id": "zhongxiangshi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "资兴市",
        "provinceId": "hunan",
        "id": "zixingshi"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "紫阳县",
        "provinceId": "shanxi2",
        "id": "ziyangxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "子长县",
        "provinceId": "shanxi2",
        "id": "zichangxian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "左权县",
        "provinceId": "shanxi1",
        "id": "zuoquanxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "攸县",
        "provinceId": "hunan",
        "id": "youxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "隰县",
        "provinceId": "shanxi1",
        "id": "xixian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "邛崃市",
        "provinceId": "sichuan",
        "id": "qionglaishi"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "郫县",
        "provinceId": "sichuan",
        "id": "pixian"
    },
    {
        "cityId": "zC3zA3APRsabdm7lkhllnV",
        "name": "鄯善县",
        "provinceId": "xinjiang",
        "id": "shanshanxian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "芮城县",
        "provinceId": "shanxi1",
        "id": "ruichengxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "弋阳县",
        "provinceId": "jiangxi",
        "id": "yiyangxian"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "岷县",
        "provinceId": "gansu",
        "id": "minxian"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "崆峒区",
        "provinceId": "gansu",
        "id": "kongdongqu"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "沅江市",
        "provinceId": "hunan",
        "id": "yuanjiangshi"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "浏阳市",
        "provinceId": "hunan",
        "id": "liuyangshi"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "浔阳区",
        "provinceId": "jiangxi",
        "id": "xunyangqu"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "淅川县",
        "provinceId": "henan",
        "id": "xichuanxian"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "渑池县",
        "provinceId": "henan",
        "id": "mianchixian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "湄潭县",
        "provinceId": "guizhou",
        "id": "meitanxian"
    },
    {
        "cityId": "pq9RAGRDSJeRDVfzOMFCX1",
        "name": "榕城区",
        "provinceId": "guangdong",
        "id": "rongchengqu"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "旌阳区",
        "provinceId": "sichuan",
        "id": "jingyangqu"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "鸠江区",
        "provinceId": "anhui",
        "id": "jiujiangqu"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "醴陵市",
        "provinceId": "hunan",
        "id": "lilingshi"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "麒麟区",
        "provinceId": "yunnan",
        "id": "qilinqu"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "黟县",
        "provinceId": "anhui",
        "id": "yixian"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "多伦县",
        "provinceId": "neimenggu",
        "id": "duolunxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "方城县",
        "provinceId": "henan",
        "id": "fangchengxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "费县",
        "provinceId": "shandong",
        "id": "feixian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "高坪区",
        "provinceId": "sichuan",
        "id": "gaopingqu"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "公安县",
        "provinceId": "hubei",
        "id": "gonganxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "柏乡县",
        "provinceId": "hebei",
        "id": "baixiangxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "宝塔区",
        "provinceId": "shanxi2",
        "id": "baotaqu"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "德兴市",
        "provinceId": "jiangxi",
        "id": "dexingshi"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "彭山县",
        "provinceId": "sichuan",
        "id": "pengshanxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "寒亭区",
        "provinceId": "shandong",
        "id": "hantingqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "黄平县",
        "provinceId": "guizhou",
        "id": "huangpingxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "九台市",
        "provinceId": "jilin",
        "id": "jiutaishi"
    },
    {
        "cityId": "7afkA2JpT5SKCITM1PzbdF",
        "name": "连江",
        "provinceId": "taiwan",
        "id": "lianjiang"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "林西县",
        "provinceId": "neimenggu",
        "id": "linxixian"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "龙子湖区",
        "provinceId": "anhui",
        "id": "longzihuqu"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "修文县",
        "provinceId": "guizhou",
        "id": "xiuwenxian"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "秀洲区",
        "provinceId": "zhejiang",
        "id": "xiuzhouqu"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "青神县",
        "provinceId": "sichuan",
        "id": "qingshenxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "青羊区",
        "provinceId": "sichuan",
        "id": "qingyangqu"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "山丹县",
        "provinceId": "gansu",
        "id": "shandanxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "休宁县",
        "provinceId": "anhui",
        "id": "xiuningxian"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "铁山区",
        "provinceId": "hubei",
        "id": "tieshanqu"
    },
    {
        "cityId": "8C6McygDSgqiE3AdSkKiNF",
        "name": "仙桃市",
        "provinceId": "hubei",
        "id": "xiantaoshi"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "永定县",
        "provinceId": "fujian",
        "id": "yongdingxian"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "东西湖区",
        "provinceId": "hubei",
        "id": "dongxihuqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "霍州市",
        "provinceId": "shanxi1",
        "id": "huozhoushi"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "蓟县",
        "provinceId": "tianjin",
        "id": "jixian"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "嘉黎县",
        "provinceId": "xizang",
        "id": "jialixian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "佳县",
        "provinceId": "shanxi2",
        "id": "jiaxian"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "监利县",
        "provinceId": "hubei",
        "id": "jianlixian"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "剑阁县",
        "provinceId": "sichuan",
        "id": "jiangexian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "建湖县",
        "provinceId": "jiangsu",
        "id": "jianhuxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "江津区",
        "provinceId": "chongqing",
        "id": "jiangjinqu"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "江口县",
        "provinceId": "guizhou",
        "id": "jiangkouxian"
    },
    {
        "cityId": "pq9RAGRDSJeRDVfzOMFCX1",
        "name": "揭西县",
        "provinceId": "guangdong",
        "id": "jiexixian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "金华市",
        "provinceId": "zhejiang",
        "id": "jinhuashi"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "金台区",
        "provinceId": "shanxi2",
        "id": "jintaiqu"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "金乡县",
        "provinceId": "shandong",
        "id": "jinxiangxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "晋州市",
        "provinceId": "hebei",
        "id": "jinzhoushi"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "静海县",
        "provinceId": "tianjin",
        "id": "jinghaixian"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "镜湖区",
        "provinceId": "anhui",
        "id": "jinghuqu"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "靖宇县",
        "provinceId": "jilin",
        "id": "jingyuxian"
    },
    {
        "cityId": "jx55ydxfQKmNqB4ADMsaeF",
        "name": "靖远县",
        "provinceId": "gansu",
        "id": "jingyuanxian"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "科尔沁右翼中旗",
        "provinceId": "neimenggu",
        "id": "keerqinyouyizhongqi"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "矿区",
        "provinceId": "shanxi1",
        "id": "kuangqu"
    },
    {
        "cityId": "HjQvlY6yR2SLEMHabOtCwF",
        "name": "矿区",
        "provinceId": "shanxi1",
        "id": "kuangqu"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "来安县",
        "provinceId": "anhui",
        "id": "laianxian"
    },
    {
        "cityId": "94GWNu4NTDOQ7tZ3BRNYX1",
        "name": "兰坪白族普米族自治县",
        "provinceId": "yunnan",
        "id": "lanpingbaizupumizuzizhixian"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "老河口市",
        "provinceId": "hubei",
        "id": "laohekoushi"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "乐安县",
        "provinceId": "jiangxi",
        "id": "leanxian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "鲤城区",
        "provinceId": "fujian",
        "id": "lichengqu"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "礼县",
        "provinceId": "gansu",
        "id": "lixian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "荔波县",
        "provinceId": "guizhou",
        "id": "liboxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "莲湖区",
        "provinceId": "shanxi2",
        "id": "lianhuqu"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "临渭区",
        "provinceId": "shanxi2",
        "id": "linweiqu"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "临县",
        "provinceId": "shanxi1",
        "id": "linxian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "临湘市",
        "provinceId": "hunan",
        "id": "linxiangshi"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "临邑县",
        "provinceId": "shandong",
        "id": "linyixian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "临淄区",
        "provinceId": "shandong",
        "id": "linziqu"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "凌海市",
        "provinceId": "liaoning",
        "id": "linghaishi"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "登封市",
        "provinceId": "henan",
        "id": "dengfengshi"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "丁青县",
        "provinceId": "xizang",
        "id": "dingqingxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "定日县",
        "provinceId": "xizang",
        "id": "dingrixian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "定陶县",
        "provinceId": "shandong",
        "id": "dingtaoxian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "定襄县",
        "provinceId": "shanxi1",
        "id": "dingxiangxian"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "东安县",
        "provinceId": "hunan",
        "id": "donganxian"
    },
    {
        "cityId": "3VTGDoaaQEKK6qoV8J9p91",
        "name": "东丰县",
        "provinceId": "jilin",
        "id": "dongfengxian"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "东港市",
        "provinceId": "liaoning",
        "id": "donggangshi"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "东陵区",
        "provinceId": "liaoning",
        "id": "donglingqu"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "东山区",
        "provinceId": "heilongjiang",
        "id": "dongshanqu"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "东阳市",
        "provinceId": "zhejiang",
        "id": "dongyangshi"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "东洲区",
        "provinceId": "liaoning",
        "id": "dongzhouqu"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "洞头县",
        "provinceId": "zhejiang",
        "id": "dongtouxian"
    },
    {
        "cityId": "V1nlY4TEQkSkNHJswPRTfV",
        "name": "都兰县",
        "provinceId": "qinghai",
        "id": "dulanxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "独山县",
        "provinceId": "guizhou",
        "id": "dushanxian"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "敦化市",
        "provinceId": "jilin",
        "id": "dunhuashi"
    },
    {
        "cityId": "pzyDfLLvRW623comq63RsV",
        "name": "掇刀区",
        "provinceId": "hubei",
        "id": "duodaoqu"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "鄂托克旗",
        "provinceId": "neimenggu",
        "id": "etuokeqi"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "恩平市",
        "provinceId": "guangdong",
        "id": "enpingshi"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "汾阳市",
        "provinceId": "shanxi1",
        "id": "fenyangshi"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "丰台区",
        "provinceId": "beijin",
        "id": "fengtaiqu"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "丰镇市",
        "provinceId": "neimenggu",
        "id": "fengzhenshi"
    },
    {
        "cityId": "QsOAp3AtQlyLAHEL1MJ2Bl",
        "name": "浮梁县",
        "provinceId": "jiangxi",
        "id": "fuliangxian"
    },
    {
        "cityId": "94GWNu4NTDOQ7tZ3BRNYX1",
        "name": "福贡县",
        "provinceId": "yunnan",
        "id": "fugongxian"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "抚远县",
        "provinceId": "heilongjiang",
        "id": "fuyuanxian"
    },
    {
        "cityId": "rswwRd2wSDWRZWtDSShtlV",
        "name": "富川瑶族自治县",
        "provinceId": "guangxi",
        "id": "fuchuanyaozuzizhixian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "富拉尔基区",
        "provinceId": "heilongjiang",
        "id": "fulaerjiqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "富阳市",
        "provinceId": "zhejiang",
        "id": "fuyangshi"
    },
    {
        "cityId": "6MuDnmqlQxSAalOo2s0zBl",
        "name": "港北区",
        "provinceId": "guangxi",
        "id": "gangbeiqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "高淳县",
        "provinceId": "jiangsu",
        "id": "gaochunxian"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "阿克塞哈萨克族自治县",
        "provinceId": "gansu",
        "id": "akesaihasakezuzizhixian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "安达市",
        "provinceId": "heilongjiang",
        "id": "andashi"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "安化县",
        "provinceId": "hunan",
        "id": "anhuaxian"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "安宁区",
        "provinceId": "gansu",
        "id": "anningqu"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "安溪县",
        "provinceId": "fujian",
        "id": "anxixian"
    },
    {
        "cityId": "lBp7lb40QLiAB78ENiu4w1",
        "name": "安岳县",
        "provinceId": "sichuan",
        "id": "anyuexian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "巴楚县",
        "provinceId": "xinjiang",
        "id": "bachuxian"
    },
    {
        "cityId": "8YxtNda0TyqJ4SPA4XUn1F",
        "name": "巴里坤哈萨克自治县",
        "provinceId": "xinjiang",
        "id": "balikunhasakezizhixian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "巴林左旗",
        "provinceId": "neimenggu",
        "id": "balinzuoqi"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "巴马瑶族自治县",
        "provinceId": "guangxi",
        "id": "bamayaozuzizhixian"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "白下区",
        "provinceId": "jiangsu",
        "id": "baixiaqu"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "拜城县",
        "provinceId": "xinjiang",
        "id": "baichengxian"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "宝应县",
        "provinceId": "jiangsu",
        "id": "baoyingxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "碑林区",
        "provinceId": "shanxi2",
        "id": "beilinqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "北碚区",
        "provinceId": "chongqing",
        "id": "beibeiqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "彬县",
        "provinceId": "shanxi2",
        "id": "binxian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "滨海县",
        "provinceId": "jiangsu",
        "id": "binhaixian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "博爱县",
        "provinceId": "henan",
        "id": "boaixian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "布拖县",
        "provinceId": "sichuan",
        "id": "butuoxian"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "蔡甸区",
        "provinceId": "hubei",
        "id": "caidianqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "沧县",
        "provinceId": "hebei",
        "id": "cangxian"
    },
    {
        "cityId": "WmeedtAWSSWt7HLOZk0g9F",
        "name": "昌江黎族自治县",
        "provinceId": "hainan",
        "id": "changjianglizuzizhixian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "昌邑区",
        "provinceId": "jilin",
        "id": "changyiqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "长安区",
        "provinceId": "hebei",
        "id": "changanqu"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "长春市",
        "provinceId": "jilin",
        "id": "changchunshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "长寿区",
        "provinceId": "chongqing",
        "id": "changshouqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "长子县",
        "provinceId": "shanxi1",
        "id": "changzixian"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "城关区",
        "provinceId": "gansu",
        "id": "chengguanqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "城区",
        "provinceId": "shanxi1",
        "id": "chengqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "赤城县",
        "provinceId": "hebei",
        "id": "chichengxian"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "崇安区",
        "provinceId": "jiangsu",
        "id": "chonganqu"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "崇信县",
        "provinceId": "gansu",
        "id": "chongxinxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "崇义县",
        "provinceId": "jiangxi",
        "id": "chongyixian"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "楚州区",
        "provinceId": "jiangsu",
        "id": "chuzhouqu"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "慈溪市",
        "provinceId": "zhejiang",
        "id": "cixishi"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "翠屏区",
        "provinceId": "sichuan",
        "id": "cuipingqu"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "达坂城区",
        "provinceId": "xinjiang",
        "id": "dabanchengqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "大同县",
        "provinceId": "shanxi1",
        "id": "datongxian"
    },
    {
        "cityId": "JTu5vyd0TKKIoV4rAeOnYF",
        "name": "大洼县",
        "provinceId": "liaoning",
        "id": "dawaxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "大足县",
        "provinceId": "chongqing",
        "id": "dazuxian"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "丹江口市",
        "provinceId": "hubei",
        "id": "danjiangkoushi"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "丹寨县",
        "provinceId": "guizhou",
        "id": "danzhaixian"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "奈曼旗",
        "provinceId": "neimenggu",
        "id": "naimanqi"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "南部县",
        "provinceId": "sichuan",
        "id": "nanbuxian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "南岔区",
        "provinceId": "heilongjiang",
        "id": "nanchaqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "南丰县",
        "provinceId": "jiangxi",
        "id": "nanfengxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "南关区",
        "provinceId": "jilin",
        "id": "nanguanqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "南郊区",
        "provinceId": "shanxi1",
        "id": "nanjiaoqu"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "南沙区",
        "provinceId": "guangdong",
        "id": "nanshaqu"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "南山区",
        "provinceId": "guangdong",
        "id": "nanshanqu"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "南县",
        "provinceId": "hunan",
        "id": "nanxian"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "南雄市",
        "provinceId": "guangdong",
        "id": "nanxiongshi"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "碾子山区",
        "provinceId": "heilongjiang",
        "id": "nianzishanqu"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "宁城县",
        "provinceId": "neimenggu",
        "id": "ningchengxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "宁南县",
        "provinceId": "sichuan",
        "id": "ningnanxian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "宁陕县",
        "provinceId": "shanxi2",
        "id": "ningshanxian"
    },
    {
        "cityId": "UpFvFTldRTqUsNlvvUP0AF",
        "name": "盘县",
        "provinceId": "guizhou",
        "id": "panxian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "沛县",
        "provinceId": "jiangsu",
        "id": "peixian"
    },
    {
        "cityId": "BpTU5qTERR2Sw3F72O79i1",
        "name": "澎湖县",
        "provinceId": "taiwan",
        "id": "penghuxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "平房区",
        "provinceId": "heilongjiang",
        "id": "pingfangqu"
    },
    {
        "cityId": "5fwU4TARQ2Chx9G8Z1NsdF",
        "name": "共和县",
        "provinceId": "qinghai",
        "id": "gonghexian"
    },
    {
        "cityId": "G3wtsJdtTDeyBCxb7qFttV",
        "name": "古浪县",
        "provinceId": "gansu",
        "id": "gulangxian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "古冶区",
        "provinceId": "hebei",
        "id": "guyequ"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "冠县",
        "provinceId": "shandong",
        "id": "guanxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "馆陶县",
        "provinceId": "hebei",
        "id": "guantaoxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "桂林市",
        "provinceId": "guangxi",
        "id": "guilinshi"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "海淀区",
        "provinceId": "beijin",
        "id": "haidianqu"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "海林市",
        "provinceId": "heilongjiang",
        "id": "hailinshi"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "海曙区",
        "provinceId": "zhejiang",
        "id": "haishuqu"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "邯山区",
        "provinceId": "hebei",
        "id": "hanshanqu"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "汉沽区",
        "provinceId": "tianjin",
        "id": "hanguqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "汉阳区",
        "provinceId": "hubei",
        "id": "hanyangqu"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "河北区",
        "provinceId": "tianjin",
        "id": "hebeiqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "河间市",
        "provinceId": "hebei",
        "id": "hejianshi"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "鹤庆县",
        "provinceId": "yunnan",
        "id": "heqingxian"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "贺兰县",
        "provinceId": "ningxia",
        "id": "helanxian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "衡阳县",
        "provinceId": "hunan",
        "id": "hengyangxian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "红安县",
        "provinceId": "hubei",
        "id": "honganxian"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "红岗区",
        "provinceId": "heilongjiang",
        "id": "honggangqu"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "红河县",
        "provinceId": "yunnan",
        "id": "honghexian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "红花岗区",
        "provinceId": "guizhou",
        "id": "honghuagangqu"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "红桥区",
        "provinceId": "tianjin",
        "id": "hongqiaoqu"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "呼兰区",
        "provinceId": "heilongjiang",
        "id": "hulanqu"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "呼玛县",
        "provinceId": "heilongjiang",
        "id": "humaxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "湖口县",
        "provinceId": "jiangxi",
        "id": "hukouxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "户县",
        "provinceId": "shanxi2",
        "id": "huxian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "桓仁满族自治县",
        "provinceId": "liaoning",
        "id": "huanrenmanzuzizhixian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "皇姑区",
        "provinceId": "liaoning",
        "id": "huangguqu"
    },
    {
        "cityId": "VyGjK2N3TVBa3zO8a32Rl1",
        "name": "惠农区",
        "provinceId": "ningxia",
        "id": "huinongqu"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "息烽县",
        "provinceId": "guizhou",
        "id": "xifengxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "象山区",
        "provinceId": "guangxi",
        "id": "xiangshanqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "阜平县",
        "provinceId": "hebei",
        "id": "fupingxian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "安阳县",
        "provinceId": "henan",
        "id": "anyangxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "崇州市",
        "provinceId": "sichuan",
        "id": "chongzhoushi"
    },
    {
        "cityId": "VyGjK2N3TVBa3zO8a32Rl1",
        "name": "大武口区",
        "provinceId": "ningxia",
        "id": "dawukouqu"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "黄州区",
        "provinceId": "hubei",
        "id": "huangzhouqu"
    },
    {
        "cityId": "5OFHnsfIQdOKa50lhtlBmV",
        "name": "精河县",
        "provinceId": "xinjiang",
        "id": "jinghexian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "罗平县",
        "provinceId": "yunnan",
        "id": "luopingxian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "马尔康县",
        "provinceId": "sichuan",
        "id": "maerkangxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "蒙阴县",
        "provinceId": "shandong",
        "id": "mengyinxian"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "焉耆回族自治县",
        "provinceId": "xinjiang",
        "id": "yanqihuizuzizhixian"
    },
    {
        "cityId": "4nHh5JugSqB6IDyqzqVYrl",
        "name": "盐池县",
        "provinceId": "ningxia",
        "id": "yanchixian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "延长县",
        "provinceId": "shanxi2",
        "id": "yanchangxian"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "延津县",
        "provinceId": "henan",
        "id": "yanjinxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "阎良区",
        "provinceId": "shanxi2",
        "id": "yanliangqu"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "沿滩区",
        "provinceId": "sichuan",
        "id": "yantanqu"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "砚山县",
        "provinceId": "yunnan",
        "id": "yanshanxian"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "阳新县",
        "provinceId": "hubei",
        "id": "yangxinxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "尧都区",
        "provinceId": "shanxi1",
        "id": "yaoduqu"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "叶县",
        "provinceId": "henan",
        "id": "yexian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "沂水县",
        "provinceId": "shandong",
        "id": "yishuixian"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "宜城市",
        "provinceId": "hubei",
        "id": "yichengshi"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "宜黄县",
        "provinceId": "jiangxi",
        "id": "yihuangxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "宜秀区",
        "provinceId": "anhui",
        "id": "yixiuqu"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "殷都区",
        "provinceId": "henan",
        "id": "yinduqu"
    },
    {
        "cityId": "EwCUBDHnTH2S4usWvzmIO1",
        "name": "银海区",
        "provinceId": "guangxi",
        "id": "yinhaiqu"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "应城市",
        "provinceId": "hubei",
        "id": "yingchengshi"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "永寿县",
        "provinceId": "shanxi2",
        "id": "yongshouxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "永修县",
        "provinceId": "jiangxi",
        "id": "yongxiuxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "于都县",
        "provinceId": "jiangxi",
        "id": "yuduxian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "榆次区",
        "provinceId": "shanxi1",
        "id": "yuciqu"
    },
    {
        "cityId": "ulAZGrBFRXB317Z8wHsI41",
        "name": "雨山区",
        "provinceId": "anhui",
        "id": "yushanqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "原阳县",
        "provinceId": "henan",
        "id": "yuanyangxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "越西县",
        "provinceId": "sichuan",
        "id": "yuexixian"
    },
    {
        "cityId": "obEnAt4WThiKceSx3hBz6V",
        "name": "岳塘区",
        "provinceId": "hunan",
        "id": "yuetangqu"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "凌河区",
        "provinceId": "liaoning",
        "id": "linghequ"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "灵丘县",
        "provinceId": "shanxi1",
        "id": "lingqiuxian"
    },
    {
        "cityId": "mpxhqA5gQZBMdCzowxAK8V",
        "name": "陵水黎族自治县",
        "provinceId": "hainan",
        "id": "lingshuilizuzizhixian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "陵县",
        "provinceId": "shandong",
        "id": "lingxian"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "六合区",
        "provinceId": "jiangsu",
        "id": "liuhequ"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "龙州县",
        "provinceId": "guangxi",
        "id": "longzhouxian"
    },
    {
        "cityId": "3Kw7SNqMSK2QNlxk2MsAAl",
        "name": "陇川县",
        "provinceId": "yunnan",
        "id": "longchuanxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "绿春县",
        "provinceId": "yunnan",
        "id": "lvchunxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "绿园区",
        "provinceId": "jilin",
        "id": "lvyuanqu"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "滦南县",
        "provinceId": "hebei",
        "id": "luannanxian"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "罗江县",
        "provinceId": "sichuan",
        "id": "luojiangxian"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "梅县",
        "provinceId": "guangdong",
        "id": "meixian"
    },
    {
        "cityId": "x1BbMxgVTJiy8d0bx3Hj1l",
        "name": "蒙城县",
        "provinceId": "anhui",
        "id": "mengchengxian"
    },
    {
        "cityId": "bbu48iSZR2yLVKiwnsJmil",
        "name": "蒙山县",
        "provinceId": "guangxi",
        "id": "mengshanxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "勉县",
        "provinceId": "shanxi2",
        "id": "mianxian"
    },
    {
        "cityId": "G3wtsJdtTDeyBCxb7qFttV",
        "name": "民勤县",
        "provinceId": "gansu",
        "id": "minqinxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "明水县",
        "provinceId": "heilongjiang",
        "id": "mingshuixian"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "穆棱市",
        "provinceId": "heilongjiang",
        "id": "mulengshi"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "新抚区",
        "provinceId": "liaoning",
        "id": "xinfuqu"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "新华区",
        "provinceId": "henan",
        "id": "xinhuaqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "新乡县",
        "provinceId": "henan",
        "id": "xinxiangxian"
    },
    {
        "cityId": "LsXZ7b57SueGobyV5hf2dV",
        "name": "新竹县",
        "provinceId": "taiwan",
        "id": "xinzhuxian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "兴山县",
        "provinceId": "hubei",
        "id": "xingshanxian"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "杏花岭区",
        "provinceId": "shanxi1",
        "id": "xinghualingqu"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "叙永县",
        "provinceId": "sichuan",
        "id": "xuyongxian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "屏山县",
        "provinceId": "sichuan",
        "id": "pingshanxian"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "蒲城县",
        "provinceId": "shanxi2",
        "id": "puchengxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "普格县",
        "provinceId": "sichuan",
        "id": "pugexian"
    },
    {
        "cityId": "pq9RAGRDSJeRDVfzOMFCX1",
        "name": "普宁市",
        "provinceId": "guangdong",
        "id": "puningshi"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "忻府区",
        "provinceId": "shanxi1",
        "id": "xinfuqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "栖霞区",
        "provinceId": "jiangsu",
        "id": "qixiaqu"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "齐河县",
        "provinceId": "shandong",
        "id": "qihexian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "迁安市",
        "provinceId": "hebei",
        "id": "qiananshi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "桥东区",
        "provinceId": "hebei",
        "id": "qiaodongqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "青白江区",
        "provinceId": "sichuan",
        "id": "qingbaijiangqu"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "青田县",
        "provinceId": "zhejiang",
        "id": "qingtianxian"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "晴隆县",
        "provinceId": "guizhou",
        "id": "qinglongxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "庆安县",
        "provinceId": "heilongjiang",
        "id": "qinganxian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "庆云县",
        "provinceId": "shandong",
        "id": "qingyunxian"
    },
    {
        "cityId": "dxlOyhAtSkOcKpkKJJ0rz1",
        "name": "琼海市",
        "provinceId": "hainan",
        "id": "qionghaishi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "汝城县",
        "provinceId": "hunan",
        "id": "ruchengxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "萨迦县",
        "provinceId": "xizang",
        "id": "sajiaxian"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "赛罕区",
        "provinceId": "neimenggu",
        "id": "saihanqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "三穗县",
        "provinceId": "guizhou",
        "id": "sansuixian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "沙坪坝区",
        "provinceId": "chongqing",
        "id": "shapingbaqu"
    },
    {
        "cityId": "35AlZXKAQ7ijgGj3GIwyGl",
        "name": "沙坡头区",
        "provinceId": "ningxia",
        "id": "shapotouqu"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "上街区",
        "provinceId": "henan",
        "id": "shangjiequ"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "邵武市",
        "provinceId": "fujian",
        "id": "shaowushi"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "涉县",
        "provinceId": "hebei",
        "id": "shexian"
    },
    {
        "cityId": "jwjqAEXkQdqEeAh1fJGURV",
        "name": "狮子山区",
        "provinceId": "anhui",
        "id": "shizishanqu"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "石景山区",
        "provinceId": "beijin",
        "id": "shijingshanqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "石柱土家族自治县",
        "provinceId": "chongqing",
        "id": "shizhutujiazuzizhixian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "寿宁县",
        "provinceId": "fujian",
        "id": "shouningxian"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "舒城县",
        "provinceId": "anhui",
        "id": "shuchengxian"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "双牌县",
        "provinceId": "hunan",
        "id": "shuangpaixian"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "双塔区",
        "provinceId": "liaoning",
        "id": "shuangtaqu"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "水磨沟区",
        "provinceId": "xinjiang",
        "id": "shuimogouqu"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "顺德区",
        "provinceId": "guangdong",
        "id": "shundequ"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "四方区",
        "provinceId": "shandong",
        "id": "sifangqu"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "四方台区",
        "provinceId": "heilongjiang",
        "id": "sifangtaiqu"
    },
    {
        "cityId": "aGlipUWnTqOKtM8SAvxmjl",
        "name": "台北县",
        "provinceId": "taiwan",
        "id": "taibeixian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "台江区",
        "provinceId": "fujian",
        "id": "taijiangqu"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "台州市",
        "provinceId": "zhejiang",
        "id": "taizhoushi"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "泰来县",
        "provinceId": "heilongjiang",
        "id": "tailaixian"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "泰山区",
        "provinceId": "shandong",
        "id": "taishanqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "汤旺河区",
        "provinceId": "heilongjiang",
        "id": "tangwanghequ"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "汤阴县",
        "provinceId": "henan",
        "id": "tangyinxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "唐河县",
        "provinceId": "henan",
        "id": "tanghexian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "天台县",
        "provinceId": "zhejiang",
        "id": "tiantaixian"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "天心区",
        "provinceId": "hunan",
        "id": "tianxinqu"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "铁东区",
        "provinceId": "jilin",
        "id": "tiedongqu"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "桐乡市",
        "provinceId": "zhejiang",
        "id": "tongxiangshi"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "铜仁地区万山特区",
        "provinceId": "guizhou",
        "id": "tongrendiquwanshantequ"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "万源市",
        "provinceId": "sichuan",
        "id": "wanyuanshi"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "汪清县",
        "provinceId": "jilin",
        "id": "wangqingxian"
    },
    {
        "cityId": "LA0kTGegSdy8EQvN16Ddfl",
        "name": "王益区",
        "provinceId": "shanxi2",
        "id": "wangyiqu"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "望城县",
        "provinceId": "hunan",
        "id": "wangchengxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "望奎县",
        "provinceId": "heilongjiang",
        "id": "wangkuixian"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "威宁彝族回族苗族自治县",
        "provinceId": "guizhou",
        "id": "weiningyizuhuizumiaozuzizhixian"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "尉犁县",
        "provinceId": "xinjiang",
        "id": "weilixian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "温岭市",
        "provinceId": "zhejiang",
        "id": "wenlingshi"
    },
    {
        "cityId": "V1nlY4TEQkSkNHJswPRTfV",
        "name": "乌兰县",
        "provinceId": "qinghai",
        "id": "wulanxian"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "乌什县",
        "provinceId": "xinjiang",
        "id": "wushenxian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "武城县",
        "provinceId": "shandong",
        "id": "wuchengxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "武夷山市",
        "provinceId": "fujian",
        "id": "wuyishanshi"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "五台县",
        "provinceId": "shanxi1",
        "id": "wutaixian"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "西安区",
        "provinceId": "heilongjiang",
        "id": "xianqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "西陵区",
        "provinceId": "hubei",
        "id": "xilingqu"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "西塞山区",
        "provinceId": "hubei",
        "id": "xisaishanqu"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "耿马傣族佤族自治县",
        "provinceId": "yunnan",
        "id": "gengmadaizuwazuzizhixian"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "班玛县",
        "provinceId": "qinghai",
        "id": "banmaxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "宝坻区",
        "provinceId": "tianjin",
        "id": "baodiqu"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "昌吉市",
        "provinceId": "xinjiang",
        "id": "changjishi"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "朝阳县",
        "provinceId": "liaoning",
        "id": "chaoyangxian"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "丹阳市",
        "provinceId": "jiangsu",
        "id": "danyangshi"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "哈巴河县",
        "provinceId": "xinjiang",
        "id": "habahexian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "海伦市",
        "provinceId": "heilongjiang",
        "id": "hailunshi"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "邯郸县",
        "provinceId": "hebei",
        "id": "handanxian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "淮滨县",
        "provinceId": "henan",
        "id": "huaibinxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "环江毛南族自治县",
        "provinceId": "guangxi",
        "id": "huanjiangmaonanzuzizhixian"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "吉木萨尔县",
        "provinceId": "xinjiang",
        "id": "jimusaerxian"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "尖山区",
        "provinceId": "heilongjiang",
        "id": "jianshanqu"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "江城哈尼族彝族自治县",
        "provinceId": "yunnan",
        "id": "jiangchenghanizuyizuzizhixian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "康定县",
        "provinceId": "sichuan",
        "id": "kangdingxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "良庆区",
        "provinceId": "guangxi",
        "id": "liangqingqu"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "清原满族自治县",
        "provinceId": "liaoning",
        "id": "qingyuanmanzuzizhixian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "文安县",
        "provinceId": "hebei",
        "id": "wenanxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "闸北区",
        "provinceId": "shanghai",
        "id": "zhabeiqu"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "衢江区",
        "provinceId": "zhejiang",
        "id": "qujiangqu"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "绵竹市",
        "provinceId": "sichuan",
        "id": "mianzhushi"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "黔西县",
        "provinceId": "guizhou",
        "id": "qianxixian"
    },
    {
        "cityId": "eiyesojLS2mYJCmT8dCGwV",
        "name": "日照市",
        "provinceId": "shandong",
        "id": "rizhaoshi"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "顺城区",
        "provinceId": "liaoning",
        "id": "shunchengqu"
    },
    {
        "cityId": "EwCUBDHnTH2S4usWvzmIO1",
        "name": "铁山港区",
        "provinceId": "guangxi",
        "id": "tieshangangqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "温江区",
        "provinceId": "sichuan",
        "id": "wenjiangqu"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "文成县",
        "provinceId": "zhejiang",
        "id": "wenchengxian"
    },
    {
        "cityId": "jA7wZ4PcTwu0OavGBsvDql",
        "name": "香格里拉县",
        "provinceId": "yunnan",
        "id": "xianggelilaxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "伊川县",
        "provinceId": "henan",
        "id": "yichuanxian"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "印江土家族苗族自治县",
        "provinceId": "guizhou",
        "id": "yinjiangtujiazumiaozuzizhixian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "永嘉县",
        "provinceId": "zhejiang",
        "id": "yongjiaxian"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "禹会区",
        "provinceId": "anhui",
        "id": "yuhuiqu"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "元坝区",
        "provinceId": "sichuan",
        "id": "yuanbaqu"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "元江哈尼族彝族傣族自治县",
        "provinceId": "yunnan",
        "id": "yuanjianghanizuyizudaizuzizhixian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "中阳县",
        "provinceId": "shanxi1",
        "id": "zhongyangxian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "兖州市",
        "provinceId": "shandong",
        "id": "yanzhoushi"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "莒南县",
        "provinceId": "shandong",
        "id": "junanxian"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "柘城县",
        "provinceId": "henan",
        "id": "zhechengxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "栾川县",
        "provinceId": "henan",
        "id": "luanchuanxian"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "张家川回族自治县",
        "provinceId": "gansu",
        "id": "zhangjiachuanhuizuzizhixian"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "招远市",
        "provinceId": "shandong",
        "id": "zhaoyuanshi"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "昭苏县",
        "provinceId": "xinjiang",
        "id": "zhaosuxian"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "镇江市",
        "provinceId": "jiangsu",
        "id": "zhenjiangshi"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "镇康县",
        "provinceId": "yunnan",
        "id": "zhenkangxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "镇雄县",
        "provinceId": "yunnan",
        "id": "zhenxiongxian"
    },
    {
        "cityId": "EnKWQIIDQSuqb94JBnAOG1",
        "name": "镇赉县",
        "provinceId": "jilin",
        "id": "zhenlaixian"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "正镶白旗",
        "provinceId": "neimenggu",
        "id": "zhengxiangbaiqi"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "正阳县",
        "provinceId": "henan",
        "id": "zhengyangxian"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "庄浪县",
        "provinceId": "gansu",
        "id": "zhuanglangxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "偃师市",
        "provinceId": "henan",
        "id": "yanshishi"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "诏安县",
        "provinceId": "fujian",
        "id": "zhaoanxian"
    },
    {
        "cityId": "Xm5wHSV2SKB5rqXvjxeXcl",
        "name": "郾城区",
        "provinceId": "henan",
        "id": "yanchengqu"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "弋江区",
        "provinceId": "anhui",
        "id": "yijiangqu"
    },
    {
        "cityId": "ifJP0Ai0TpGeUi0xfeKxv1",
        "name": "岱山县",
        "provinceId": "zhejiang",
        "id": "daishanxian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "溆浦县",
        "provinceId": "hunan",
        "id": "xupuxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "灞桥区",
        "provinceId": "shanxi2",
        "id": "baqiaoqu"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "枞阳县",
        "provinceId": "anhui",
        "id": "congyangxian"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "睢阳区",
        "provinceId": "henan",
        "id": "suiyangqu"
    },
    {
        "cityId": "6MuDnmqlQxSAalOo2s0zBl",
        "name": "覃塘区",
        "provinceId": "guangxi",
        "id": "tantangqu"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "颍泉区",
        "provinceId": "anhui",
        "id": "yingquanqu"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "颍州区",
        "provinceId": "anhui",
        "id": "yingzhouqu"
    },
    {
        "cityId": "U2fzxZ4gTIqmfAyDz769cV",
        "name": "港口区",
        "provinceId": "guangxi",
        "id": "gangkouqu"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "大兴安岭市",
        "provinceId": "heilongjiang",
        "id": "daxinganlingshi"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "道县",
        "provinceId": "hunan",
        "id": "daoxian"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "宁明县",
        "provinceId": "guangxi",
        "id": "ningmingxian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "宁县",
        "provinceId": "gansu",
        "id": "ningxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "海拉尔区",
        "provinceId": "neimenggu",
        "id": "hailaerqu"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "和政县",
        "provinceId": "gansu",
        "id": "hezhengxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "信丰县",
        "provinceId": "jiangxi",
        "id": "xinfengxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "巨鹿县",
        "provinceId": "hebei",
        "id": "juluxian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "喀喇沁旗",
        "provinceId": "neimenggu",
        "id": "kalaqinqi"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "康保县",
        "provinceId": "hebei",
        "id": "kangbaoxian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "明山区",
        "provinceId": "liaoning",
        "id": "mingshanqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "行唐县",
        "provinceId": "hebei",
        "id": "hangtangxian"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "秦淮区",
        "provinceId": "jiangsu",
        "id": "qinhuaiqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "兴平市",
        "provinceId": "shanxi2",
        "id": "xingpingshi"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "铁锋区",
        "provinceId": "heilongjiang",
        "id": "tiefengqu"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "项城市",
        "provinceId": "henan",
        "id": "xiangchengshi"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "岳阳县",
        "provinceId": "hunan",
        "id": "yueyangxian"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "云县",
        "provinceId": "yunnan",
        "id": "yunxian"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "郧县",
        "provinceId": "hubei",
        "id": "yunxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "枣强县",
        "provinceId": "hebei",
        "id": "zaoqiangxian"
    },
    {
        "cityId": "szaG7dxGShSrvWPX9Szk41",
        "name": "资阳区",
        "provinceId": "hunan",
        "id": "ziyangqu"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "鄂伦春自治旗",
        "provinceId": "neimenggu",
        "id": "elunchunzizhiqi"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "佛山市",
        "provinceId": "guangdong",
        "id": "foshanshi"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "抚顺县",
        "provinceId": "liaoning",
        "id": "fushunxian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "积石山保安族东乡族撒拉族自治县",
        "provinceId": "gansu",
        "id": "jishishanbaoanzudongxiangzusalazuzizhixian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "吉利区",
        "provinceId": "henan",
        "id": "jiliqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "加查县",
        "provinceId": "xizang",
        "id": "jiachaxian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "贾汪区",
        "provinceId": "jiangsu",
        "id": "jiawangqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "建德市",
        "provinceId": "zhejiang",
        "id": "jiandeshi"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "建邺区",
        "provinceId": "jiangsu",
        "id": "jianyequ"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "江达县",
        "provinceId": "xizang",
        "id": "jiangdaxian"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "江陵县",
        "provinceId": "hubei",
        "id": "jianglingxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "江南区",
        "provinceId": "guangxi",
        "id": "jiangnanqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "江宁区",
        "provinceId": "jiangsu",
        "id": "jiangningqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "江夏区",
        "provinceId": "hubei",
        "id": "jiangxiaqu"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "蕉岭县",
        "provinceId": "guangdong",
        "id": "jiaolingxian"
    },
    {
        "cityId": "HjQvlY6yR2SLEMHabOtCwF",
        "name": "郊区",
        "provinceId": "shanxi1",
        "id": "jiaoqu"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "界首市",
        "provinceId": "anhui",
        "id": "jieshoushi"
    },
    {
        "cityId": "0xxYBJxvRKiKbvhz45VZf1",
        "name": "金门",
        "provinceId": "taiwan",
        "id": "jinmen"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "金平区",
        "provinceId": "guangdong",
        "id": "jinpingqu"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "金沙县",
        "provinceId": "guizhou",
        "id": "jinshaxian"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "金水区",
        "provinceId": "henan",
        "id": "jinshuiqu"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "金塔县",
        "provinceId": "gansu",
        "id": "jintaxian"
    },
    {
        "cityId": "PPAnTn3AQ76mm0lPJWuv6l",
        "name": "金湾区",
        "provinceId": "guangdong",
        "id": "jinwanqu"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "金秀瑶族自治县",
        "provinceId": "guangxi",
        "id": "jinxiuyaozuzizhixian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "晋宁县",
        "provinceId": "yunnan",
        "id": "jinningxian"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "景谷傣族彝族自治县",
        "provinceId": "yunnan",
        "id": "jinggudaizuyizuzizhixian"
    },
    {
        "cityId": "L4LXKliRTYOZ3FPvmfayPF",
        "name": "浚县",
        "provinceId": "henan",
        "id": "junxian"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "喀喇沁左翼蒙古族自治县",
        "provinceId": "liaoning",
        "id": "kalaqinzuoyimengguzuzizhixian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "喀什市",
        "provinceId": "xinjiang",
        "id": "kashenshi"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "开平区",
        "provinceId": "hebei",
        "id": "kaipingqu"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "康马县",
        "provinceId": "xizang",
        "id": "kangmaxian"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "科尔沁左翼中旗",
        "provinceId": "neimenggu",
        "id": "keerqinzuoyizhongqi"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "库车县",
        "provinceId": "xinjiang",
        "id": "kuchexian"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "库尔勒市",
        "provinceId": "xinjiang",
        "id": "kuerleshi"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "库伦旗",
        "provinceId": "neimenggu",
        "id": "kulunqi"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "宽城满族自治县",
        "provinceId": "hebei",
        "id": "kuanchengmanzuzizhixian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "昆都仑区",
        "provinceId": "neimenggu",
        "id": "kundulunqu"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "莱西市",
        "provinceId": "shandong",
        "id": "laixishi"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "来凤县",
        "provinceId": "hubei",
        "id": "laifengxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "兰西县",
        "provinceId": "heilongjiang",
        "id": "lanxixian"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "乐昌市",
        "provinceId": "guangdong",
        "id": "lechangshi"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "冷水滩区",
        "provinceId": "hunan",
        "id": "lengshuitanqu"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "连州市",
        "provinceId": "guangdong",
        "id": "lianzhoushi"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "梁山县",
        "provinceId": "shandong",
        "id": "liangshanxian"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "临翔区",
        "provinceId": "yunnan",
        "id": "linxiangqu"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "调兵山市",
        "provinceId": "liaoning",
        "id": "tiaobingshanshi"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "定州市",
        "provinceId": "hebei",
        "id": "dingzhoushi"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "东昌府区",
        "provinceId": "shandong",
        "id": "dongchangfuqu"
    },
    {
        "cityId": "3VTGDoaaQEKK6qoV8J9p91",
        "name": "东辽县",
        "provinceId": "jilin",
        "id": "dongliaoxian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "东山县",
        "provinceId": "fujian",
        "id": "dongshanxian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "东乡族自治县",
        "provinceId": "gansu",
        "id": "dongxiangzuzizhixian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "都江堰市",
        "provinceId": "sichuan",
        "id": "dujiangyanshi"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "堆龙德庆县",
        "provinceId": "xizang",
        "id": "duilongdeqingxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "额尔古纳市",
        "provinceId": "neimenggu",
        "id": "eergunashi"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "二七区",
        "provinceId": "henan",
        "id": "erqiqu"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "方正县",
        "provinceId": "heilongjiang",
        "id": "fangzhengxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "房山区",
        "provinceId": "beijin",
        "id": "fangshanqu"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "丰城市",
        "provinceId": "jiangxi",
        "id": "fengchengshi"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "封丘县",
        "provinceId": "henan",
        "id": "fengqiuxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "奉节县",
        "provinceId": "chongqing",
        "id": "fengjiexian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "奉贤区",
        "provinceId": "shanghai",
        "id": "fengxianqu"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "凤冈县",
        "provinceId": "guizhou",
        "id": "fenggangxian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "凤凰县",
        "provinceId": "hunan",
        "id": "fenghuangxian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "凤翔县",
        "provinceId": "shanxi2",
        "id": "fengxiangxian"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "佛冈县",
        "provinceId": "guangdong",
        "id": "fogangxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "佛坪县",
        "provinceId": "shanxi2",
        "id": "fopingxian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "扶风县",
        "provinceId": "shanxi2",
        "id": "fufengxian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "福鼎市",
        "provinceId": "fujian",
        "id": "fudingshi"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "福山区",
        "provinceId": "shandong",
        "id": "fushanqu"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "阜康市",
        "provinceId": "xinjiang",
        "id": "fukangshi"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "富民县",
        "provinceId": "yunnan",
        "id": "fuminxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "富裕县",
        "provinceId": "heilongjiang",
        "id": "fuyuxian"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "盖州市",
        "provinceId": "liaoning",
        "id": "gaizhoushi"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "甘德县",
        "provinceId": "qinghai",
        "id": "gandexian"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "高台县",
        "provinceId": "gansu",
        "id": "gaotaixian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "浉河区",
        "provinceId": "henan",
        "id": "hequ"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "阿巴嘎旗",
        "provinceId": "neimenggu",
        "id": "abagaqi"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "阿尔山市",
        "provinceId": "neimenggu",
        "id": "aershanshi"
    },
    {
        "cityId": "d9RcznG7RvGN2i4POFVgz1",
        "name": "阿拉尔市",
        "provinceId": "xinjiang",
        "id": "alaershi"
    },
    {
        "cityId": "FwdFCt5RRhmDAvuorgYsa1",
        "name": "阿拉善右旗",
        "provinceId": "neimenggu",
        "id": "alashanyouqi"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "阿荣旗",
        "provinceId": "neimenggu",
        "id": "arongqi"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "爱民区",
        "provinceId": "heilongjiang",
        "id": "aiminqu"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "东昌区",
        "provinceId": "jilin",
        "id": "dongchangqu"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "安次区",
        "provinceId": "hebei",
        "id": "anciqu"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "安多县",
        "provinceId": "xizang",
        "id": "anduoxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "安国市",
        "provinceId": "hebei",
        "id": "anguoshi"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "安平县",
        "provinceId": "hebei",
        "id": "anpingxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "安丘市",
        "provinceId": "shandong",
        "id": "anqiushi"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "安新县",
        "provinceId": "hebei",
        "id": "anxinxian"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "安源区",
        "provinceId": "jiangxi",
        "id": "anyuanqu"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "昂昂溪区",
        "provinceId": "heilongjiang",
        "id": "angangxiqu"
    },
    {
        "cityId": "FG3QwGPQQvGevZvQK2W8Nl",
        "name": "澳门离岛",
        "provinceId": "aomen",
        "id": "aomenlidao"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "巴塘县",
        "provinceId": "sichuan",
        "id": "batangxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "巴彦县",
        "provinceId": "heilongjiang",
        "id": "bayanxian"
    },
    {
        "cityId": "SDpY6V2ITICBLWBft5UiIF",
        "name": "白碱滩区",
        "provinceId": "xinjiang",
        "id": "baijiantanqu"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "北道区",
        "provinceId": "gansu",
        "id": "beidaoqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "北市区",
        "provinceId": "hebei",
        "id": "beishiqu"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "北塘区",
        "provinceId": "jiangsu",
        "id": "beitangqu"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "本溪满族自治县",
        "provinceId": "liaoning",
        "id": "benximanzuzizhixian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "本溪市",
        "provinceId": "liaoning",
        "id": "benxishi"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "滨城区",
        "provinceId": "shandong",
        "id": "binchengqu"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "滨湖区",
        "provinceId": "jiangsu",
        "id": "binhuqu"
    },
    {
        "cityId": "bbu48iSZR2yLVKiwnsJmil",
        "name": "苍梧县",
        "provinceId": "guangxi",
        "id": "cangwuxian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "察哈尔右翼后旗",
        "provinceId": "neimenggu",
        "id": "chahaeryouyihouqi"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "昌平区",
        "provinceId": "beijin",
        "id": "changpingqu"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "常熟市",
        "provinceId": "jiangsu",
        "id": "changshushi"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "长沙县",
        "provinceId": "hunan",
        "id": "changshaxian"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "长武县",
        "provinceId": "shanxi2",
        "id": "changwuxian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "称多县",
        "provinceId": "qinghai",
        "id": "chengduoxian"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "城北区",
        "provinceId": "qinghai",
        "id": "chengbeiqu"
    },
    {
        "cityId": "m9aTiCwVRpqnrQz2vMTfgF",
        "name": "城区",
        "provinceId": "guangdong",
        "id": "chengqu"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "成县",
        "provinceId": "gansu",
        "id": "chengxian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "呈贡县",
        "provinceId": "yunnan",
        "id": "chenggongxian"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "澄江县",
        "provinceId": "yunnan",
        "id": "chengjiangxian"
    },
    {
        "cityId": "gsYX8ODARwabnUcZZh3fHF",
        "name": "澄迈县",
        "provinceId": "hainan",
        "id": "chengmaixian"
    },
    {
        "cityId": "Tk1UB4AqTvCRsZOwuNyefV",
        "name": "慈利县",
        "provinceId": "hunan",
        "id": "cilixian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "措勤县",
        "provinceId": "xizang",
        "id": "cuoqinxian"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "达孜县",
        "provinceId": "xizang",
        "id": "dazixian"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "大方县",
        "provinceId": "guizhou",
        "id": "dafangxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "大港区",
        "provinceId": "tianjin",
        "id": "dagangqu"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "大同区",
        "provinceId": "heilongjiang",
        "id": "datongqu"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "大姚县",
        "provinceId": "yunnan",
        "id": "dayaoxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "道里区",
        "provinceId": "heilongjiang",
        "id": "daoliqu"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "南安市",
        "provinceId": "fujian",
        "id": "nananshi"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "南澳县",
        "provinceId": "guangdong",
        "id": "nanaoxian"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "南城县",
        "provinceId": "jiangxi",
        "id": "nanchengxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "南岗区",
        "provinceId": "heilongjiang",
        "id": "nangangqu"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "南岳区",
        "provinceId": "hunan",
        "id": "nanyuequ"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "南召县",
        "provinceId": "henan",
        "id": "nanzhaoxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "南郑县",
        "provinceId": "shanxi2",
        "id": "nanzhengxian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "囊谦县",
        "provinceId": "qinghai",
        "id": "nangqianxian"
    },
    {
        "cityId": "uOjDrnIaR3OAlM1KbbA4nl",
        "name": "宁蒗彝族自治县",
        "provinceId": "yunnan",
        "id": "ninglangyizuzizhixian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "彭泽县",
        "provinceId": "jiangxi",
        "id": "pengzexian"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "皮山县",
        "provinceId": "xinjiang",
        "id": "pishanxian"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "平坝县",
        "provinceId": "guizhou",
        "id": "pingbaxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "平谷区",
        "provinceId": "beijin",
        "id": "pingguqu"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "固始县",
        "provinceId": "henan",
        "id": "gushixian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "官渡区",
        "provinceId": "yunnan",
        "id": "guanduqu"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "广安市",
        "provinceId": "sichuan",
        "id": "guanganshi"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "广德县",
        "provinceId": "anhui",
        "id": "guangdexian"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "广汉市",
        "provinceId": "sichuan",
        "id": "guanghanshi"
    },
    {
        "cityId": "XfhdbpurRseET5JRyL6uo1",
        "name": "广水市",
        "provinceId": "hubei",
        "id": "guangshuishi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "桂东县",
        "provinceId": "hunan",
        "id": "guidongxian"
    },
    {
        "cityId": "5fwU4TARQ2Chx9G8Z1NsdF",
        "name": "贵德县",
        "provinceId": "qinghai",
        "id": "guidexian"
    },
    {
        "cityId": "m9aTiCwVRpqnrQz2vMTfgF",
        "name": "海丰县",
        "provinceId": "guangdong",
        "id": "haifengxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "荷塘区",
        "provinceId": "hunan",
        "id": "hetangqu"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "和平区",
        "provinceId": "liaoning",
        "id": "hepingqu"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "和平县",
        "provinceId": "guangdong",
        "id": "hepingxian"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "和县",
        "provinceId": "anhui",
        "id": "hexian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "合水县",
        "provinceId": "gansu",
        "id": "heshuixian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "鹤城区",
        "provinceId": "hunan",
        "id": "hechengqu"
    },
    {
        "cityId": "L4LXKliRTYOZ3FPvmfayPF",
        "name": "鹤山区",
        "provinceId": "henan",
        "id": "heshanqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "洪洞县",
        "provinceId": "shanxi1",
        "id": "hongdongxian"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "红古区",
        "provinceId": "gansu",
        "id": "hongguqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "红星区",
        "provinceId": "heilongjiang",
        "id": "hongxingqu"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "虎丘区",
        "provinceId": "jiangsu",
        "id": "huqiuqu"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "华蓥市",
        "provinceId": "sichuan",
        "id": "huayingshi"
    },
    {
        "cityId": "HNNAWbhDT1SjB4ywB4BJuF",
        "name": "惠东县",
        "provinceId": "guangdong",
        "id": "huidongxian"
    },
    {
        "cityId": "HNNAWbhDT1SjB4ywB4BJuF",
        "name": "惠阳区",
        "provinceId": "guangdong",
        "id": "huiyangqu"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "霍邱县",
        "provinceId": "anhui",
        "id": "huoqiuxian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "溪湖区",
        "provinceId": "liaoning",
        "id": "xihuqu"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "喜德县",
        "provinceId": "sichuan",
        "id": "xidexian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "下花园区",
        "provinceId": "hebei",
        "id": "xiahuayuanqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "萧山区",
        "provinceId": "zhejiang",
        "id": "xiaoshanqu"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "邗江区",
        "provinceId": "jiangsu",
        "id": "hanjiangqu"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "湟源县",
        "provinceId": "qinghai",
        "id": "huangyuanxian"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "缙云县",
        "provinceId": "zhejiang",
        "id": "jinyunxian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "榕江县",
        "provinceId": "guizhou",
        "id": "rongjiangxian"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "工布江达县",
        "provinceId": "xizang",
        "id": "gongbujiangdaxian"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "宝丰县",
        "provinceId": "henan",
        "id": "baofengxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "茶陵县",
        "provinceId": "hunan",
        "id": "chalingxian"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "霍山县",
        "provinceId": "anhui",
        "id": "huoshanxian"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "科尔沁左翼后旗",
        "provinceId": "neimenggu",
        "id": "keerqinzuoyihouqi"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "蓝田县",
        "provinceId": "shanxi2",
        "id": "lantianxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "宣恩县",
        "provinceId": "hubei",
        "id": "xuanenxian"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "盐田区",
        "provinceId": "guangdong",
        "id": "yantianqu"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "延吉市",
        "provinceId": "jilin",
        "id": "yanjishi"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "扬中市",
        "provinceId": "jiangsu",
        "id": "yangzhongshi"
    },
    {
        "cityId": "PBwO6KyOQqiByoANHs9zj1",
        "name": "阳东县",
        "provinceId": "guangdong",
        "id": "yangdongxian"
    },
    {
        "cityId": "PBwO6KyOQqiByoANHs9zj1",
        "name": "阳西县",
        "provinceId": "guangdong",
        "id": "yangxixian"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "伊宁县",
        "provinceId": "xinjiang",
        "id": "yiningxian"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "宜春市",
        "provinceId": "jiangxi",
        "id": "yichunshi"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "宜丰县",
        "provinceId": "jiangxi",
        "id": "yifengxian"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "易门县",
        "provinceId": "yunnan",
        "id": "yimenxian"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "鹰手营子矿区",
        "provinceId": "hebei",
        "id": "yingshouyingzikuangqu"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "迎泽区",
        "provinceId": "shanxi1",
        "id": "yingzequ"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "永春县",
        "provinceId": "fujian",
        "id": "yongchunxian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "永康市",
        "provinceId": "zhejiang",
        "id": "yongkangshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "渝中区",
        "provinceId": "chongqing",
        "id": "yuzhongqu"
    },
    {
        "cityId": "obEnAt4WThiKceSx3hBz6V",
        "name": "雨湖区",
        "provinceId": "hunan",
        "id": "yuhuqu"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "雨花区",
        "provinceId": "hunan",
        "id": "yuhuaqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "雨花台区",
        "provinceId": "jiangsu",
        "id": "yuhuataiqu"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "禹州市",
        "provinceId": "henan",
        "id": "yuzhoushi"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "源城区",
        "provinceId": "guangdong",
        "id": "yuanchengqu"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "越城区",
        "provinceId": "zhejiang",
        "id": "yuechengqu"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "云龙县",
        "provinceId": "yunnan",
        "id": "yunlongxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "灵川县",
        "provinceId": "guangxi",
        "id": "lingchuanxian"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "岭东区",
        "provinceId": "heilongjiang",
        "id": "lingdongqu"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "龙湖区",
        "provinceId": "guangdong",
        "id": "longhuqu"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "龙马潭区",
        "provinceId": "sichuan",
        "id": "longmatanqu"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "鹿寨县",
        "provinceId": "guangxi",
        "id": "luzhaixian"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "茅箭区",
        "provinceId": "hubei",
        "id": "maojianqu"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "梅列区",
        "provinceId": "fujian",
        "id": "meiliequ"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "门头沟区",
        "provinceId": "beijin",
        "id": "mentougouqu"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "孟州市",
        "provinceId": "henan",
        "id": "mengzhoushi"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "闽清县",
        "provinceId": "fujian",
        "id": "minqingxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "新安县",
        "provinceId": "henan",
        "id": "xinanxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "新巴尔虎左旗",
        "provinceId": "neimenggu",
        "id": "xinbaerhuzuoqi"
    },
    {
        "cityId": "nsbf5TURSWuJ2zCBxE80oV",
        "name": "新化县",
        "provinceId": "hunan",
        "id": "xinhuaxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "新乐市",
        "provinceId": "hebei",
        "id": "xinleshi"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "新浦区",
        "provinceId": "jiangsu",
        "id": "xinpuqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "新荣区",
        "provinceId": "shanxi1",
        "id": "xinrongqu"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "兴宾区",
        "provinceId": "guangxi",
        "id": "xingbinqu"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "兴隆县",
        "provinceId": "hebei",
        "id": "xinglongxian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "兴文县",
        "provinceId": "sichuan",
        "id": "xingwenxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "雄县",
        "provinceId": "hebei",
        "id": "xiongxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "修水县",
        "provinceId": "jiangxi",
        "id": "xiushuixian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "宣威市",
        "provinceId": "yunnan",
        "id": "xuanweishi"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "宣武区",
        "provinceId": "beijin",
        "id": "xuanwuqu"
    },
    {
        "cityId": "6MuDnmqlQxSAalOo2s0zBl",
        "name": "平南县",
        "provinceId": "guangxi",
        "id": "pingnanxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "平塘县",
        "provinceId": "guizhou",
        "id": "pingtangxian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "平阳县",
        "provinceId": "zhejiang",
        "id": "pingyangxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "平邑县",
        "provinceId": "shandong",
        "id": "pingyixian"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "平阴县",
        "provinceId": "shandong",
        "id": "pingyinxian"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "平远县",
        "provinceId": "guangdong",
        "id": "pingyuanxian"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "启东市",
        "provinceId": "jiangsu",
        "id": "qidongshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "黔江区",
        "provinceId": "chongqing",
        "id": "qianjiangqu"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "前进区",
        "provinceId": "heilongjiang",
        "id": "qianjinqu"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "桥东区",
        "provinceId": "hebei",
        "id": "qiaodongqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "桥西区",
        "provinceId": "hebei",
        "id": "qiaoxiqu"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "秦城区",
        "provinceId": "gansu",
        "id": "qinchengqu"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "沁水县",
        "provinceId": "shanxi1",
        "id": "qinshuixian"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "青川县",
        "provinceId": "sichuan",
        "id": "qingchuanxian"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "清河区",
        "provinceId": "jiangsu",
        "id": "qinghequ"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "泉港区",
        "provinceId": "fujian",
        "id": "quangangqu"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "全椒县",
        "provinceId": "anhui",
        "id": "quanjiaoxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "确山县",
        "provinceId": "henan",
        "id": "queshanxian"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "让胡路区",
        "provinceId": "heilongjiang",
        "id": "ranghuluqu"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "饶河县",
        "provinceId": "heilongjiang",
        "id": "raohexian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "仁布县",
        "provinceId": "xizang",
        "id": "renbuxian"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "荣县",
        "provinceId": "sichuan",
        "id": "rongxian"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "润州区",
        "provinceId": "jiangsu",
        "id": "runzhouqu"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "三河市",
        "provinceId": "hebei",
        "id": "sanheshi"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "沙依巴克区",
        "provinceId": "xinjiang",
        "id": "shayibakequ"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "山海关区",
        "provinceId": "hebei",
        "id": "shanhaiguanqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "上甘岭区",
        "provinceId": "heilongjiang",
        "id": "shangganlingqu"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "上栗县",
        "provinceId": "jiangxi",
        "id": "shanglixian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "上饶县",
        "provinceId": "jiangxi",
        "id": "shangraoxian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "射阳县",
        "provinceId": "jiangsu",
        "id": "sheyangxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "社旗县",
        "provinceId": "henan",
        "id": "sheqixian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "寿光市",
        "provinceId": "shandong",
        "id": "shouguangshi"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "寿县",
        "provinceId": "anhui",
        "id": "shouxian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "疏附县",
        "provinceId": "xinjiang",
        "id": "shufuxian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "疏勒县",
        "provinceId": "xinjiang",
        "id": "shulexian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "双流县",
        "provinceId": "sichuan",
        "id": "shuangliuxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "顺义区",
        "provinceId": "beijin",
        "id": "shunyiqu"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "肃州区",
        "provinceId": "gansu",
        "id": "suzhouqu"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "绥阳县",
        "provinceId": "guizhou",
        "id": "suiyangxian"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "遂昌县",
        "provinceId": "zhejiang",
        "id": "suichangxian"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "孙吴县",
        "provinceId": "heilongjiang",
        "id": "sunwuxian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "台江县",
        "provinceId": "guizhou",
        "id": "taijiangxian"
    },
    {
        "cityId": "CBDHKAH6SjBUv7xdoa9mn1",
        "name": "台南县",
        "provinceId": "taiwan",
        "id": "tainanxian"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "汤原县",
        "provinceId": "heilongjiang",
        "id": "tangyuanxian"
    },
    {
        "cityId": "WRHu6BwwQHiDEy7gg1yB9l",
        "name": "桃园县",
        "provinceId": "taiwan",
        "id": "taoyuanxian"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "天等县",
        "provinceId": "guangxi",
        "id": "tiandengxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "天河区",
        "provinceId": "guangdong",
        "id": "tianhequ"
    },
    {
        "cityId": "V1nlY4TEQkSkNHJswPRTfV",
        "name": "天峻县",
        "provinceId": "qinghai",
        "id": "tianjunxian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "铁力市",
        "provinceId": "heilongjiang",
        "id": "tielishi"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "铁西区",
        "provinceId": "jilin",
        "id": "tiexiqu"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "铁西区",
        "provinceId": "liaoning",
        "id": "tiexiqu"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "托克托县",
        "provinceId": "neimenggu",
        "id": "tuoketuoxian"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "托里县",
        "provinceId": "xinjiang",
        "id": "tuolixian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "万安县",
        "provinceId": "jiangxi",
        "id": "wananxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "望江县",
        "provinceId": "anhui",
        "id": "wangjiangxian"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "维扬区",
        "provinceId": "jiangsu",
        "id": "weiyangqu"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "未央区",
        "provinceId": "shanxi2",
        "id": "weiyangqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "卫辉市",
        "provinceId": "henan",
        "id": "weihuishi"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "温宿县",
        "provinceId": "xinjiang",
        "id": "wensuxian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "文峰区",
        "provinceId": "henan",
        "id": "wenfengqu"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "文山县",
        "provinceId": "yunnan",
        "id": "wenshanxian"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "文县",
        "provinceId": "gansu",
        "id": "wenxian"
    },
    {
        "cityId": "hvCobrAESv6UY2PSf5FjMl",
        "name": "乌达区",
        "provinceId": "neimenggu",
        "id": "wudaqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "武乡县",
        "provinceId": "shanxi1",
        "id": "wuxiangxian"
    },
    {
        "cityId": "eiyesojLS2mYJCmT8dCGwV",
        "name": "五莲县",
        "provinceId": "shandong",
        "id": "wulianxian"
    },
    {
        "cityId": "sQeI6SDITaGsuYoyTCIfzl",
        "name": "五指山市",
        "provinceId": "hainan",
        "id": "wuzhishanshi"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "西峰区",
        "provinceId": "gansu",
        "id": "xifengqu"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "西和县",
        "provinceId": "gansu",
        "id": "xihexian"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "西盟佤族自治县",
        "provinceId": "yunnan",
        "id": "ximengwazuzizhixian"
    },
    {
        "cityId": "Le5W5bxsSKaO0oiwOMp4W1",
        "name": "西区",
        "provinceId": "sichuan",
        "id": "xiqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "西乡塘区",
        "provinceId": "guangxi",
        "id": "xixiangtangqu"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "阜新蒙古族自治县",
        "provinceId": "liaoning",
        "id": "fuxinmengguzuzizhixian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "白河县",
        "provinceId": "shanxi2",
        "id": "baihexian"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "昌黎县",
        "provinceId": "hebei",
        "id": "changlixian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "昌邑市",
        "provinceId": "shandong",
        "id": "changyishi"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "陈仓区",
        "provinceId": "shanxi2",
        "id": "chencangqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "大宁县",
        "provinceId": "shanxi1",
        "id": "daningxian"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "大通回族土族自治县",
        "provinceId": "qinghai",
        "id": "datonghuizutuzuzizhixian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "平和县",
        "provinceId": "fujian",
        "id": "pinghexian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "井冈山市",
        "provinceId": "jiangxi",
        "id": "jinggangshanshi"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "靖州苗族侗族自治县",
        "provinceId": "hunan",
        "id": "jingzhoumiaozudongzuzizhixian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "九龙县",
        "provinceId": "sichuan",
        "id": "jiulongxian"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "连云区",
        "provinceId": "jiangsu",
        "id": "lianyunqu"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "墨竹工卡县",
        "provinceId": "xizang",
        "id": "mozhugongkaxian"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "木垒哈萨克自治县",
        "provinceId": "xinjiang",
        "id": "muleihasakezizhixian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "浦江县",
        "provinceId": "zhejiang",
        "id": "pujiangxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "武隆县",
        "provinceId": "chongqing",
        "id": "wulongxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "香坊区",
        "provinceId": "heilongjiang",
        "id": "xiangfangqu"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "永丰县",
        "provinceId": "jiangxi",
        "id": "yongfengxian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "岳阳楼区",
        "provinceId": "hunan",
        "id": "yueyanglouqu"
    },
    {
        "cityId": "EnKWQIIDQSuqb94JBnAOG1",
        "name": "洮南市",
        "provinceId": "jilin",
        "id": "taonanshi"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "龙海市",
        "provinceId": "fujian",
        "id": "longhaishi"
    },
    {
        "cityId": "3Kw7SNqMSK2QNlxk2MsAAl",
        "name": "潞西市",
        "provinceId": "yunnan",
        "id": "luxishi"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "洛隆县",
        "provinceId": "xizang",
        "id": "luolongxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "满城县",
        "provinceId": "hebei",
        "id": "manchengxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "孟津县",
        "provinceId": "henan",
        "id": "mengjinxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "青冈县",
        "provinceId": "heilongjiang",
        "id": "qinggangxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "上林县",
        "provinceId": "guangxi",
        "id": "shanglinxian"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "苏尼特右旗",
        "provinceId": "neimenggu",
        "id": "suniteyouqi"
    },
    {
        "cityId": "jwjqAEXkQdqEeAh1fJGURV",
        "name": "铜陵县",
        "provinceId": "anhui",
        "id": "tonglingxian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "姚安县",
        "provinceId": "yunnan",
        "id": "yaoanxian"
    },
    {
        "cityId": "xFEk36jYRuWwRknzZfEnUV",
        "name": "原州区",
        "provinceId": "ningxia",
        "id": "yuanzhouqu"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "郧西县",
        "provinceId": "hubei",
        "id": "yunxixian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "汶川县",
        "provinceId": "sichuan",
        "id": "wenchuanxian"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "滕州市",
        "provinceId": "shandong",
        "id": "tengzhoushi"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "寻甸回族自治县",
        "provinceId": "yunnan",
        "id": "xundianhuizuzizhixian"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "清城区",
        "provinceId": "guangdong",
        "id": "qingchengqu"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "漳县",
        "provinceId": "gansu",
        "id": "zhangxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "张店区",
        "provinceId": "shandong",
        "id": "zhangdianqu"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "张湾区",
        "provinceId": "hubei",
        "id": "zhangwanqu"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "肇州县",
        "provinceId": "heilongjiang",
        "id": "zhaozhouxian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "镇海区",
        "provinceId": "zhejiang",
        "id": "zhenhaiqu"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "庄河市",
        "provinceId": "liaoning",
        "id": "zhuangheshi"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "遵义县",
        "provinceId": "guizhou",
        "id": "zunyixian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "鄄城县",
        "provinceId": "shandong",
        "id": "juanchengxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "鄱阳县",
        "provinceId": "jiangxi",
        "id": "poyangxian"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "岱岳区",
        "provinceId": "shandong",
        "id": "daiyuequ"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "嵊州市",
        "provinceId": "zhejiang",
        "id": "shengzhoushi"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "嵩县",
        "provinceId": "henan",
        "id": "songxian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "泸溪县",
        "provinceId": "hunan",
        "id": "luxixian"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "珲春市",
        "provinceId": "jilin",
        "id": "huichunshi"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "甘南县",
        "provinceId": "heilongjiang",
        "id": "gannanxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "高邑县",
        "provinceId": "hebei",
        "id": "gaoyixian"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "北流市",
        "provinceId": "guangxi",
        "id": "beiliushi"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "长泰县",
        "provinceId": "fujian",
        "id": "changtaixian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "朝阳区",
        "provinceId": "beijin",
        "id": "chaoyangqu"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "大祥区",
        "provinceId": "hunan",
        "id": "daxiangqu"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "淮阴区",
        "provinceId": "jiangsu",
        "id": "huaiyinqu"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "江川县",
        "provinceId": "yunnan",
        "id": "jiangchuanxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "兴安县",
        "provinceId": "guangxi",
        "id": "xinganxian"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "江洲区",
        "provinceId": "guangxi",
        "id": "jiangzhouqu"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "柯城区",
        "provinceId": "zhejiang",
        "id": "kechengqu"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "连山壮族瑶族自治县",
        "provinceId": "guangdong",
        "id": "lianshanzhuangzuyaozuzizhixian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "凉城县",
        "provinceId": "neimenggu",
        "id": "liangchengxian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "辽阳县",
        "provinceId": "liaoning",
        "id": "liaoyangxian"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "墨江哈尼族自治县",
        "provinceId": "yunnan",
        "id": "mojianghanizuzizhixian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "兴县",
        "provinceId": "shanxi1",
        "id": "xingxian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "商都县",
        "provinceId": "neimenggu",
        "id": "shangduxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "尚义县",
        "provinceId": "hebei",
        "id": "shangyixian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "顺平县",
        "provinceId": "hebei",
        "id": "shunpingxian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "田东县",
        "provinceId": "guangxi",
        "id": "tiandongxian"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "芜湖县",
        "provinceId": "anhui",
        "id": "wuhuxian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "武冈市",
        "provinceId": "hunan",
        "id": "wugangshi"
    },
    {
        "cityId": "LA0kTGegSdy8EQvN16Ddfl",
        "name": "宜君县",
        "provinceId": "shanxi2",
        "id": "yijunxian"
    },
    {
        "cityId": "LA0kTGegSdy8EQvN16Ddfl",
        "name": "印台区",
        "provinceId": "shanxi2",
        "id": "yintaiqu"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "永济市",
        "provinceId": "shanxi1",
        "id": "yongjishi"
    },
    {
        "cityId": "m4gWS4hDSBOMIqyCWYRzl1",
        "name": "云林县",
        "provinceId": "taiwan",
        "id": "yunlinxian"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "站前区",
        "provinceId": "liaoning",
        "id": "zhanqianqu"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "柞水县",
        "provinceId": "shanxi2",
        "id": "zhashuixian"
    },
    {
        "cityId": "6AAmciAeTsyV0Z1M2yt3YV",
        "name": "分宜县",
        "provinceId": "jiangxi",
        "id": "fenyixian"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "鸡冠区",
        "provinceId": "heilongjiang",
        "id": "jiguanqu"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "吉木乃县",
        "provinceId": "xinjiang",
        "id": "jimunaixian"
    },
    {
        "cityId": "TcipBdDPTUGDxi04CuzEKV",
        "name": "尖扎县",
        "provinceId": "qinghai",
        "id": "jianzhaxian"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "建平县",
        "provinceId": "liaoning",
        "id": "jianpingxian"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "姜堰市",
        "provinceId": "jiangsu",
        "id": "jiangyanshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "江北区",
        "provinceId": "chongqing",
        "id": "jiangbeiqu"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "江东区",
        "provinceId": "zhejiang",
        "id": "jiangdongqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "江干区",
        "provinceId": "zhejiang",
        "id": "jiangganqu"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "江油市",
        "provinceId": "sichuan",
        "id": "jiangyoushi"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "胶州市",
        "provinceId": "shandong",
        "id": "jiaozhoushi"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "郊区",
        "provinceId": "heilongjiang",
        "id": "jiaoqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "金牛区",
        "provinceId": "sichuan",
        "id": "jinniuqu"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "金州区",
        "provinceId": "liaoning",
        "id": "jinzhouqu"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "金阊区",
        "provinceId": "jiangsu",
        "id": "jinchangqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "锦屏县",
        "provinceId": "guizhou",
        "id": "jinpingxian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "井研县",
        "provinceId": "sichuan",
        "id": "jingyanxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "井陉县",
        "provinceId": "hebei",
        "id": "jingxingxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "静安区",
        "provinceId": "shanghai",
        "id": "jinganqu"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "久治县",
        "provinceId": "qinghai",
        "id": "jiuzhixian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "康乐县",
        "provinceId": "gansu",
        "id": "kanglexian"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "宽甸满族自治县",
        "provinceId": "liaoning",
        "id": "kuandianmanzuzizhixian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "乐陵市",
        "provinceId": "shandong",
        "id": "lelingshi"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "乐亭县",
        "provinceId": "hebei",
        "id": "letingxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "雷州市",
        "provinceId": "guangdong",
        "id": "leizhoushi"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "理县",
        "provinceId": "sichuan",
        "id": "lixian"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "连平县",
        "provinceId": "guangdong",
        "id": "lianpingxian"
    },
    {
        "cityId": "HVMTanysROWMSUw8sclwdF",
        "name": "烈山区",
        "provinceId": "anhui",
        "id": "lieshanqu"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "临河区",
        "provinceId": "neimenggu",
        "id": "linhequ"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "临猗县",
        "provinceId": "shanxi1",
        "id": "linyixian"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "零陵区",
        "provinceId": "hunan",
        "id": "linglingqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "点军区",
        "provinceId": "hubei",
        "id": "dianjunqu"
    },
    {
        "cityId": "Le5W5bxsSKaO0oiwOMp4W1",
        "name": "东区",
        "provinceId": "sichuan",
        "id": "dongqu"
    },
    {
        "cityId": "HVMTanysROWMSUw8sclwdF",
        "name": "杜集区",
        "provinceId": "anhui",
        "id": "dujiqu"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "额敏县",
        "provinceId": "xinjiang",
        "id": "eminxian"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "肥西县",
        "provinceId": "anhui",
        "id": "feixixian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "丰满区",
        "provinceId": "jilin",
        "id": "fengmanqu"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "丰南区",
        "provinceId": "hebei",
        "id": "fengnanqu"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "凤山县",
        "provinceId": "guangxi",
        "id": "fengshanxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "涪陵区",
        "provinceId": "chongqing",
        "id": "fulingqu"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "福清市",
        "provinceId": "fujian",
        "id": "fuqingshi"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "福田区",
        "provinceId": "guangdong",
        "id": "futianqu"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "高安市",
        "provinceId": "jiangxi",
        "id": "gaoanshi"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "高港区",
        "provinceId": "jiangsu",
        "id": "gaogangqu"
    },
    {
        "cityId": "SwentZd6RBeU78iyNd5921",
        "name": "阿合奇县",
        "provinceId": "xinjiang",
        "id": "aheqixian"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "阿克苏市",
        "provinceId": "xinjiang",
        "id": "akesushi"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "安定区",
        "provinceId": "gansu",
        "id": "andingqu"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "安福县",
        "provinceId": "jiangxi",
        "id": "anfuxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "安塞县",
        "provinceId": "shanxi2",
        "id": "ansaixian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "昂仁县",
        "provinceId": "xizang",
        "id": "angrenxian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "敖汉旗",
        "provinceId": "neimenggu",
        "id": "aohanqi"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "八道江区",
        "provinceId": "jilin",
        "id": "badaojiangqu"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "巴青县",
        "provinceId": "xizang",
        "id": "baqingxian"
    },
    {
        "cityId": "BHzC8cI3ShBae0kMjRGTAl",
        "name": "巴州区",
        "provinceId": "sichuan",
        "id": "bazhouqu"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "拜泉县",
        "provinceId": "heilongjiang",
        "id": "baiquanxian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "保德县",
        "provinceId": "shanxi1",
        "id": "baodexian"
    },
    {
        "cityId": "NCulC70eSGaq4rmi0wJi0F",
        "name": "北票市",
        "provinceId": "liaoning",
        "id": "beipiaoshi"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "北塔区",
        "provinceId": "hunan",
        "id": "beitaqu"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "波密县",
        "provinceId": "xizang",
        "id": "bomixian"
    },
    {
        "cityId": "lE56axJ3TKC2W8BjURVAe1",
        "name": "勃利县",
        "provinceId": "heilongjiang",
        "id": "bolixian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "泊头市",
        "provinceId": "hebei",
        "id": "botoushi"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "苍山县",
        "provinceId": "shandong",
        "id": "cangshanxian"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "苍溪县",
        "provinceId": "sichuan",
        "id": "cangxixian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "仓山区",
        "provinceId": "fujian",
        "id": "cangshanqu"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "察布查尔锡伯自治县",
        "provinceId": "xinjiang",
        "id": "chabuchaerxibozizhixian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "察哈尔右翼中旗",
        "provinceId": "neimenggu",
        "id": "chahaeryouyizhongqi"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "察雅县",
        "provinceId": "xizang",
        "id": "chayaxian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "长乐市",
        "provinceId": "fujian",
        "id": "changleshi"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "长治县",
        "provinceId": "shanxi1",
        "id": "changzhixian"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "朝天区",
        "provinceId": "sichuan",
        "id": "chaotianqu"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "朝阳区",
        "provinceId": "jilin",
        "id": "chaoyangqu"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "辰溪县",
        "provinceId": "hunan",
        "id": "chenxixian"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "城中区",
        "provinceId": "qinghai",
        "id": "chengzhongqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "崇礼县",
        "provinceId": "hebei",
        "id": "chonglixian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "崇文区",
        "provinceId": "beijin",
        "id": "chongwenqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "淳安县",
        "provinceId": "zhejiang",
        "id": "chunanxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "从化市",
        "provinceId": "guangdong",
        "id": "conghuashi"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "达日县",
        "provinceId": "qinghai",
        "id": "darixian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "大厂回族自治县",
        "provinceId": "hebei",
        "id": "dachanghuizuzizhixian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "大丰市",
        "provinceId": "jiangsu",
        "id": "dafengshi"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "大兴安岭地区松岭区",
        "provinceId": "heilongjiang",
        "id": "daxinganlingdiqusonglingqu"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "大冶市",
        "provinceId": "hubei",
        "id": "dayeshi"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "稻城县",
        "provinceId": "sichuan",
        "id": "daochengxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "道孚县",
        "provinceId": "sichuan",
        "id": "daofuxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "德格县",
        "provinceId": "sichuan",
        "id": "degexian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "南岸区",
        "provinceId": "chongqing",
        "id": "nananqu"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "南昌县",
        "provinceId": "jiangxi",
        "id": "nanchangxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "南开区",
        "provinceId": "tianjin",
        "id": "nankaiqu"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "南乐县",
        "provinceId": "henan",
        "id": "nanlexian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "南木林县",
        "provinceId": "xizang",
        "id": "nanmulinxian"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "南票区",
        "provinceId": "liaoning",
        "id": "nanpiaoqu"
    },
    {
        "cityId": "AkB0oUtLTvm2s3g9CjOI7F",
        "name": "南投县",
        "provinceId": "taiwan",
        "id": "nantouxian"
    },
    {
        "cityId": "BmhW0wAmRrqp0R3KHc5JPF",
        "name": "南浔区",
        "provinceId": "zhejiang",
        "id": "nanxunqu"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "宁阳县",
        "provinceId": "shandong",
        "id": "ningyangxian"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "蓬江区",
        "provinceId": "guangdong",
        "id": "pengjiangqu"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "平度市",
        "provinceId": "shandong",
        "id": "pingdushi"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "平乐县",
        "provinceId": "guangxi",
        "id": "pinglexian"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "巩义市",
        "provinceId": "henan",
        "id": "gongyishi"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "拱墅区",
        "provinceId": "zhejiang",
        "id": "gongshuqu"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "贡井区",
        "provinceId": "sichuan",
        "id": "gongjingqu"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "鼓楼区",
        "provinceId": "fujian",
        "id": "gulouqu"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "谷城县",
        "provinceId": "hubei",
        "id": "guchengxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "故城县",
        "provinceId": "hebei",
        "id": "guchengxian"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "瓜州县",
        "provinceId": "gansu",
        "id": "guazhouxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "广宗县",
        "provinceId": "hebei",
        "id": "guangzongxian"
    },
    {
        "cityId": "hvCobrAESv6UY2PSf5FjMl",
        "name": "海勃湾区",
        "provinceId": "neimenggu",
        "id": "haibowanqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "海兴县",
        "provinceId": "hebei",
        "id": "haixingxian"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "海阳市",
        "provinceId": "shandong",
        "id": "haiyangshi"
    },
    {
        "cityId": "ChvJPBZtTXySUcBJwktP0F",
        "name": "涵江区",
        "provinceId": "fujian",
        "id": "hanjiangqu"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "汉台区",
        "provinceId": "shanxi2",
        "id": "hantaiqu"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "杭锦旗",
        "provinceId": "neimenggu",
        "id": "hangjinqi"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "和平区",
        "provinceId": "tianjin",
        "id": "hepingqu"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "合作市",
        "provinceId": "gansu",
        "id": "hezuoshi"
    },
    {
        "cityId": "TcipBdDPTUGDxi04CuzEKV",
        "name": "河南蒙古族自治县",
        "provinceId": "qinghai",
        "id": "henanmengguzuzizhixian"
    },
    {
        "cityId": "rIYTldvBREehIRIzm83wE1",
        "name": "赫章县",
        "provinceId": "guizhou",
        "id": "hezhangxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "鹤峰县",
        "provinceId": "hubei",
        "id": "hefengxian"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "鹤山市",
        "provinceId": "guangdong",
        "id": "heshanshi"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "黑水县",
        "provinceId": "sichuan",
        "id": "heishuixian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "衡山县",
        "provinceId": "hunan",
        "id": "hengshanxian"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "洪湖市",
        "provinceId": "hubei",
        "id": "honghushi"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "红塔区",
        "provinceId": "yunnan",
        "id": "hongtaqu"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "华安县",
        "provinceId": "fujian",
        "id": "huaanxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "怀安县",
        "provinceId": "hebei",
        "id": "huaianxian"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "辉县市",
        "provinceId": "henan",
        "id": "huixianshi"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "回民区",
        "provinceId": "neimenggu",
        "id": "huiminqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "浑源县",
        "provinceId": "shanxi1",
        "id": "hunyuanxian"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "细河区",
        "provinceId": "liaoning",
        "id": "xihequ"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "下关区",
        "provinceId": "jiangsu",
        "id": "xiaguanqu"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "咸安区",
        "provinceId": "hubei",
        "id": "xiananqu"
    },
    {
        "cityId": "P7HJaADHQTaitM7eQaTnRl",
        "name": "咸宁市",
        "provinceId": "hubei",
        "id": "xianningshi"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "湘阴县",
        "provinceId": "hunan",
        "id": "xiangyinxian"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "长岛县",
        "provinceId": "shandong",
        "id": "changdaoxian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "汉滨区",
        "provinceId": "shanxi2",
        "id": "hanbinqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "壶关县",
        "provinceId": "shanxi1",
        "id": "huguanxian"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "建昌县",
        "provinceId": "liaoning",
        "id": "jianchangxian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "九原区",
        "provinceId": "neimenggu",
        "id": "jiuyuanqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "雷山县",
        "provinceId": "guizhou",
        "id": "leishanxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "龙沙区",
        "provinceId": "heilongjiang",
        "id": "longshaqu"
    },
    {
        "cityId": "gOy9XLexTCCgF0PbViIx0F",
        "name": "新兴县",
        "provinceId": "guangdong",
        "id": "xinxingxian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "盐山县",
        "provinceId": "hebei",
        "id": "yanshanxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "延寿县",
        "provinceId": "heilongjiang",
        "id": "yanshouxian"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "沿河土家族自治县",
        "provinceId": "guizhou",
        "id": "yanhetujiazuzizhixian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "雁峰区",
        "provinceId": "hunan",
        "id": "yanfengqu"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "阳明区",
        "provinceId": "heilongjiang",
        "id": "yangmingqu"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "叶城县",
        "provinceId": "xinjiang",
        "id": "yechengxian"
    },
    {
        "cityId": "u1bLs8ZqTCeU4gZKCNRaWV",
        "name": "宜兰县",
        "provinceId": "taiwan",
        "id": "yilanxian"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "营口市",
        "provinceId": "liaoning",
        "id": "yingkoushi"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "永城市",
        "provinceId": "henan",
        "id": "yongchengshi"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "永清县",
        "provinceId": "hebei",
        "id": "yongqingxian"
    },
    {
        "cityId": "6AAmciAeTsyV0Z1M2yt3YV",
        "name": "渝水区",
        "provinceId": "jiangxi",
        "id": "yushuiqu"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "禹城市",
        "provinceId": "shandong",
        "id": "yuchengshi"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "玉山县",
        "provinceId": "jiangxi",
        "id": "yushanxian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "元谋县",
        "provinceId": "yunnan",
        "id": "yuanmouxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "岳西县",
        "provinceId": "anhui",
        "id": "yuexixian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "云霄县",
        "provinceId": "fujian",
        "id": "yunxiaoxian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "运河区",
        "provinceId": "hebei",
        "id": "yunhequ"
    },
    {
        "cityId": "TcipBdDPTUGDxi04CuzEKV",
        "name": "泽库县",
        "provinceId": "qinghai",
        "id": "zekuxian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "龙安区",
        "provinceId": "henan",
        "id": "longanqu"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "龙凤区",
        "provinceId": "heilongjiang",
        "id": "longfengqu"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "龙岗区",
        "provinceId": "guangdong",
        "id": "longgangqu"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "龙江县",
        "provinceId": "heilongjiang",
        "id": "longjiangxian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "龙亭区",
        "provinceId": "henan",
        "id": "longtingqu"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "芦淞区",
        "provinceId": "hunan",
        "id": "lusongqu"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "路北区",
        "provinceId": "hebei",
        "id": "lubeiqu"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "罗田县",
        "provinceId": "hubei",
        "id": "luotianxian"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "麻栗坡县",
        "provinceId": "yunnan",
        "id": "malipoxian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "马村区",
        "provinceId": "henan",
        "id": "macunqu"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "马关县",
        "provinceId": "yunnan",
        "id": "maguanxian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "马龙县",
        "provinceId": "yunnan",
        "id": "malongxian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "马尾区",
        "provinceId": "fujian",
        "id": "maweiqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "美溪区",
        "provinceId": "heilongjiang",
        "id": "meixiqu"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "辛集市",
        "provinceId": "hebei",
        "id": "xinjishi"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "新建县",
        "provinceId": "jiangxi",
        "id": "xinjianxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "新民市",
        "provinceId": "liaoning",
        "id": "xinminshi"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "新平彝族傣族自治县",
        "provinceId": "yunnan",
        "id": "xinpingyizudaizuzizhixian"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "新郑市",
        "provinceId": "henan",
        "id": "xinzhengshi"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "忻城县",
        "provinceId": "guangxi",
        "id": "xinchengxian"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "兴宁市",
        "provinceId": "guangdong",
        "id": "xingningshi"
    },
    {
        "cityId": "LgxPtlJDRsOELF8nc8EfEl",
        "name": "秀英区",
        "provinceId": "hainan",
        "id": "xiuyingqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "徐水县",
        "provinceId": "hebei",
        "id": "xushuixian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "旬阳县",
        "provinceId": "shanxi2",
        "id": "xunyangxian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "平桥区",
        "provinceId": "henan",
        "id": "pingqiaoqu"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "平泉县",
        "provinceId": "hebei",
        "id": "pingquanxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "平武县",
        "provinceId": "sichuan",
        "id": "pingwuxian"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "凭祥市",
        "provinceId": "guangxi",
        "id": "pingxiangshi"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "蒲县",
        "provinceId": "shanxi1",
        "id": "puxian"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "信宜市",
        "provinceId": "guangdong",
        "id": "xinyishi"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "普陀区",
        "provinceId": "shanghai",
        "id": "putuoqu"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "祁阳县",
        "provinceId": "hunan",
        "id": "qiyangxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "潜山县",
        "provinceId": "anhui",
        "id": "qianshanxian"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "且末县",
        "provinceId": "xinjiang",
        "id": "qiemoxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "钦南区",
        "provinceId": "guangxi",
        "id": "qinnanqu"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "青龙满族自治县",
        "provinceId": "hebei",
        "id": "qinglongmanzuzizhixian"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "青山区",
        "provinceId": "hubei",
        "id": "qingshanqu"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "曲江区",
        "provinceId": "guangdong",
        "id": "qujiangqu"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "渠县",
        "provinceId": "sichuan",
        "id": "quxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "全南县",
        "provinceId": "jiangxi",
        "id": "quannanxian"
    },
    {
        "cityId": "Le5W5bxsSKaO0oiwOMp4W1",
        "name": "仁和区",
        "provinceId": "sichuan",
        "id": "renhequ"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "任城区",
        "provinceId": "shandong",
        "id": "renchengqu"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "融安县",
        "provinceId": "guangxi",
        "id": "ronganxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "容城县",
        "provinceId": "hebei",
        "id": "rongchengxian"
    },
    {
        "cityId": "Tk1UB4AqTvCRsZOwuNyefV",
        "name": "桑植县",
        "provinceId": "hunan",
        "id": "sangzhixian"
    },
    {
        "cityId": "YOow77pNTty3PMiDsBL7hV",
        "name": "神农架林区",
        "provinceId": "hubei",
        "id": "shennongjialinqu"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "沈丘县",
        "provinceId": "henan",
        "id": "shenqiuxian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "石林彝族自治县",
        "provinceId": "yunnan",
        "id": "shilinyizuzizhixian"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "石龙区",
        "provinceId": "henan",
        "id": "shilongqu"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "石楼县",
        "provinceId": "shanxi1",
        "id": "shilouxian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "石门县",
        "provinceId": "hunan",
        "id": "shimenxian"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "石屏县",
        "provinceId": "yunnan",
        "id": "shipingxian"
    },
    {
        "cityId": "6EaRBS9YS0mBnCPWKxiBJV",
        "name": "石首市",
        "provinceId": "hubei",
        "id": "shishoushi"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "双清区",
        "provinceId": "hunan",
        "id": "shuangqingqu"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "松桃苗族自治县",
        "provinceId": "guizhou",
        "id": "songtaomiaozuzizhixian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "肃宁县",
        "provinceId": "hebei",
        "id": "suningxian"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "塔河县",
        "provinceId": "heilongjiang",
        "id": "tahexian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "泰宁县",
        "provinceId": "fujian",
        "id": "tainingxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "太湖县",
        "provinceId": "anhui",
        "id": "taihuxian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "桃源县",
        "provinceId": "hunan",
        "id": "taoyuanxian"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "特克斯县",
        "provinceId": "xinjiang",
        "id": "tekesixian"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "天长市",
        "provinceId": "anhui",
        "id": "tianchangshi"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "通海县",
        "provinceId": "yunnan",
        "id": "tonghaixian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "通河县",
        "provinceId": "heilongjiang",
        "id": "tonghexian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "桐庐县",
        "provinceId": "zhejiang",
        "id": "tongluxian"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "同安区",
        "provinceId": "fujian",
        "id": "tonganqu"
    },
    {
        "cityId": "4nHh5JugSqB6IDyqzqVYrl",
        "name": "同心县",
        "provinceId": "ningxia",
        "id": "tongxinxian"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "头屯河区",
        "provinceId": "xinjiang",
        "id": "toutunhequ"
    },
    {
        "cityId": "z2BhKnKPRzB3QbHO4O5waV",
        "name": "屯昌县",
        "provinceId": "hainan",
        "id": "tunchangxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "万年县",
        "provinceId": "jiangxi",
        "id": "wannianxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "望都县",
        "provinceId": "hebei",
        "id": "wangduxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "威县",
        "provinceId": "hebei",
        "id": "weixian"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "魏都区",
        "provinceId": "henan",
        "id": "weiduqu"
    },
    {
        "cityId": "5OFHnsfIQdOKa50lhtlBmV",
        "name": "温泉县",
        "provinceId": "xinjiang",
        "id": "wenquanxian"
    },
    {
        "cityId": "2VDdO4RWSrBBYTv2Me3O9V",
        "name": "文昌市",
        "provinceId": "hainan",
        "id": "wenchangshi"
    },
    {
        "cityId": "BwFCz7ULRqBCuEiC3Bofbl",
        "name": "文登市",
        "provinceId": "shandong",
        "id": "wendengshi"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "闻喜县",
        "provinceId": "shanxi1",
        "id": "wenxixian"
    },
    {
        "cityId": "x1BbMxgVTJiy8d0bx3Hj1l",
        "name": "涡阳县",
        "provinceId": "anhui",
        "id": "woyangxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "巫山县",
        "provinceId": "chongqing",
        "id": "wushanxian"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "乌兰浩特市",
        "provinceId": "neimenggu",
        "id": "wulanhaoteshi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "无极县",
        "provinceId": "hebei",
        "id": "wujixian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "吴堡县",
        "provinceId": "shanxi2",
        "id": "wubaoxian"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "武平县",
        "provinceId": "fujian",
        "id": "wupingxian"
    },
    {
        "cityId": "9FCPBeGkTM2CoIHNVLAsMl",
        "name": "武胜县",
        "provinceId": "sichuan",
        "id": "wushengxian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "武穴市",
        "provinceId": "hubei",
        "id": "wuxueshi"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "五常市",
        "provinceId": "heilongjiang",
        "id": "wuchangshi"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "五华县",
        "provinceId": "guangdong",
        "id": "wuhuaxian"
    },
    {
        "cityId": "ZLQb0am1T9CHW7F3EhVku1",
        "name": "舞钢市",
        "provinceId": "henan",
        "id": "wugangshi"
    },
    {
        "cityId": "3VTGDoaaQEKK6qoV8J9p91",
        "name": "西安区",
        "provinceId": "jilin",
        "id": "xianqu"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "西固区",
        "provinceId": "gansu",
        "id": "xiguqu"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "西山区",
        "provinceId": "yunnan",
        "id": "xishanqu"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "西夏区",
        "provinceId": "ningxia",
        "id": "xixiaqu"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "册亨县",
        "provinceId": "guizhou",
        "id": "cehengxian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "察哈尔右翼前旗",
        "provinceId": "neimenggu",
        "id": "chahaeryouyiqianqi"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "大观区",
        "provinceId": "anhui",
        "id": "daguanqu"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "海城市",
        "provinceId": "liaoning",
        "id": "haichengshi"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "华龙区",
        "provinceId": "henan",
        "id": "hualongqu"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "济源市",
        "provinceId": "henan",
        "id": "jiyuanshi"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "靖安县",
        "provinceId": "jiangxi",
        "id": "jinganxian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "君山区",
        "provinceId": "hunan",
        "id": "junshanqu"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "类乌齐县",
        "provinceId": "xizang",
        "id": "leiwuqixian"
    },
    {
        "cityId": "G3wtsJdtTDeyBCxb7qFttV",
        "name": "凉州区",
        "provinceId": "gansu",
        "id": "liangzhouqu"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "上犹县",
        "provinceId": "jiangxi",
        "id": "shangyouxian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "余杭区",
        "provinceId": "zhejiang",
        "id": "yuhangqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "青县",
        "provinceId": "hebei",
        "id": "qingxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "青州市",
        "provinceId": "shandong",
        "id": "qingzhoushi"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "瑞昌市",
        "provinceId": "jiangxi",
        "id": "ruichangshi"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "上高县",
        "provinceId": "jiangxi",
        "id": "shanggaoxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "桐柏县",
        "provinceId": "henan",
        "id": "tongbaixian"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "武陵区",
        "provinceId": "hunan",
        "id": "wulingqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "伍家岗区",
        "provinceId": "hubei",
        "id": "wujiagangqu"
    },
    {
        "cityId": "obEnAt4WThiKceSx3hBz6V",
        "name": "湘潭县",
        "provinceId": "hunan",
        "id": "xiangtanxian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "宜都市",
        "provinceId": "hubei",
        "id": "yidushi"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "宜兴市",
        "provinceId": "jiangsu",
        "id": "yixingshi"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "义乌市",
        "provinceId": "zhejiang",
        "id": "yiwushi"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "樟树市",
        "provinceId": "jiangxi",
        "id": "zhangshushi"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "浈江区",
        "provinceId": "guangdong",
        "id": "zhenjiangqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "溧水县",
        "provinceId": "jiangsu",
        "id": "lishuixian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "睢宁县",
        "provinceId": "jiangsu",
        "id": "suiningxian"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "兴庆区",
        "provinceId": "ningxia",
        "id": "xingqingqu"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "米东区",
        "provinceId": "xinjiang",
        "id": "midongqu"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "张家港市",
        "provinceId": "jiangsu",
        "id": "zhangjiagangshi"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "张家口市",
        "provinceId": "hebei",
        "id": "zhangjiakoushi"
    },
    {
        "cityId": "rswwRd2wSDWRZWtDSShtlV",
        "name": "昭平县",
        "provinceId": "guangxi",
        "id": "zhaopingxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "昭阳区",
        "provinceId": "yunnan",
        "id": "zhaoyangqu"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "贞丰县",
        "provinceId": "guizhou",
        "id": "zhenfengxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "镇巴县",
        "provinceId": "shanxi2",
        "id": "zhenbaxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "政和县",
        "provinceId": "fujian",
        "id": "zhenghexian"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "中牟县",
        "provinceId": "henan",
        "id": "zhongmouxian"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "钟楼区",
        "provinceId": "jiangsu",
        "id": "zhonglouqu"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "舟曲县",
        "provinceId": "gansu",
        "id": "zhouquxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "株洲县",
        "provinceId": "hunan",
        "id": "zhuzhouxian"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "卓尼县",
        "provinceId": "gansu",
        "id": "zhuonixian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "资源县",
        "provinceId": "guangxi",
        "id": "ziyuanxian"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "鄢陵县",
        "provinceId": "henan",
        "id": "yanlingxian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "芗城区",
        "provinceId": "fujian",
        "id": "xiangchengqu"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "岑巩县",
        "provinceId": "guizhou",
        "id": "cengongxian"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "泸县",
        "provinceId": "sichuan",
        "id": "luxian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "泗水县",
        "provinceId": "shandong",
        "id": "sishuixian"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "泾县",
        "provinceId": "anhui",
        "id": "jingxian"
    },
    {
        "cityId": "xFEk36jYRuWwRknzZfEnUV",
        "name": "泾源县",
        "provinceId": "ningxia",
        "id": "jingyuanxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "涞水县",
        "provinceId": "hebei",
        "id": "laishuixian"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "湟中县",
        "provinceId": "qinghai",
        "id": "huangzhongxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "潼南县",
        "provinceId": "chongqing",
        "id": "tongnanxian"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "濠江区",
        "provinceId": "guangdong",
        "id": "haojiangqu"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "桦南县",
        "provinceId": "heilongjiang",
        "id": "huananxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "栾城县",
        "provinceId": "hebei",
        "id": "luanchengxian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "瓯海区",
        "provinceId": "zhejiang",
        "id": "ouhaiqu"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "耒阳市",
        "provinceId": "hunan",
        "id": "leiyangshi"
    },
    {
        "cityId": "UK3HGdjuSAWYbjLwe7BtE1",
        "name": "鲅鱼圈区",
        "provinceId": "liaoning",
        "id": "bayuquanqu"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "城东区",
        "provinceId": "qinghai",
        "id": "chengdongqu"
    },
    {
        "cityId": "ChvJPBZtTXySUcBJwktP0F",
        "name": "城厢区",
        "provinceId": "fujian",
        "id": "chengxiangqu"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "成安县",
        "provinceId": "hebei",
        "id": "chenganxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "丹巴县",
        "provinceId": "sichuan",
        "id": "danbaxian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "和顺县",
        "provinceId": "shanxi1",
        "id": "heshunxian"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "怀宁县",
        "provinceId": "anhui",
        "id": "huainingxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "建阳市",
        "provinceId": "fujian",
        "id": "jianyangshi"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "兴和县",
        "provinceId": "neimenggu",
        "id": "xinghexian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "龙湾区",
        "provinceId": "zhejiang",
        "id": "longwanqu"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "芦溪县",
        "provinceId": "jiangxi",
        "id": "luxixian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "鹿城区",
        "provinceId": "zhejiang",
        "id": "luchengqu"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "孟连傣族拉祜族佤族自治县",
        "provinceId": "yunnan",
        "id": "mengliandaizulahuzuwazuzizhixian"
    },
    {
        "cityId": "Gt1gm8hkR9GapBnXx0q5ll",
        "name": "民乐县",
        "provinceId": "gansu",
        "id": "minlexian"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "青河县",
        "provinceId": "xinjiang",
        "id": "qinghexian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "清涧县",
        "provinceId": "shanxi2",
        "id": "qingjianxian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "商州区",
        "provinceId": "shanxi2",
        "id": "shangzhouqu"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "绥棱县",
        "provinceId": "heilongjiang",
        "id": "suilengxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "秀山土家族苗族自治县",
        "provinceId": "chongqing",
        "id": "xiushantujiazumiaozuzizhixian"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "铜仁市",
        "provinceId": "guizhou",
        "id": "tongrenshi"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "武昌区",
        "provinceId": "hubei",
        "id": "wuchangqu"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "武进区",
        "provinceId": "jiangsu",
        "id": "wujinqu"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "襄城县",
        "provinceId": "henan",
        "id": "xiangchengxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "翼城县",
        "provinceId": "shanxi1",
        "id": "yichengxian"
    },
    {
        "cityId": "QsOAp3AtQlyLAHEL1MJ2Bl",
        "name": "珠山区",
        "provinceId": "jiangxi",
        "id": "zhushanqu"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "紫金县",
        "provinceId": "guangdong",
        "id": "zijinxian"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "东山区",
        "provinceId": "xinjiang",
        "id": "dongshanqu"
    },
    {
        "cityId": "CxC8XbcATk69iyhLx6hLiV",
        "name": "东莞市",
        "provinceId": "guangdong",
        "id": "dongguanshi"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "峨边彝族自治县",
        "provinceId": "sichuan",
        "id": "ebianyizuzizhixian"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "绩溪县",
        "provinceId": "anhui",
        "id": "jixixian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "吉县",
        "provinceId": "shanxi1",
        "id": "jixian"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "嘉善县",
        "provinceId": "zhejiang",
        "id": "jiashanxian"
    },
    {
        "cityId": "lBp7lb40QLiAB78ENiu4w1",
        "name": "简阳市",
        "provinceId": "sichuan",
        "id": "jianyangshi"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "江都市",
        "provinceId": "jiangsu",
        "id": "jiangdushi"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "金川县",
        "provinceId": "sichuan",
        "id": "jinchuanxian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "金口河区",
        "provinceId": "sichuan",
        "id": "jinkouhequ"
    },
    {
        "cityId": "izALokboTKK7BwsBgr4Fyl",
        "name": "京口区",
        "provinceId": "jiangsu",
        "id": "jingkouqu"
    },
    {
        "cityId": "pzyDfLLvRW623comq63RsV",
        "name": "京山县",
        "provinceId": "hubei",
        "id": "jingshanxian"
    },
    {
        "cityId": "dAQw9pwaRumZYH2QKlHctV",
        "name": "景洪市",
        "provinceId": "yunnan",
        "id": "jinghongshi"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "九江县",
        "provinceId": "jiangxi",
        "id": "jiujiangxian"
    },
    {
        "cityId": "5CMgNdvZSN2FJJmpRtZMl1",
        "name": "九龙城区",
        "provinceId": "xianggang",
        "id": "jiulongchengqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "九龙坡区",
        "provinceId": "chongqing",
        "id": "jiulongpoqu"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "九寨沟县",
        "provinceId": "sichuan",
        "id": "jiuzhaigouxian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "开阳县",
        "provinceId": "guizhou",
        "id": "kaiyangxian"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "开原市",
        "provinceId": "liaoning",
        "id": "kaiyuanshi"
    },
    {
        "cityId": "4fBxBqrtRcCbWvPaqj9NlF",
        "name": "垦利县",
        "provinceId": "shandong",
        "id": "kenlixian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "拉孜县",
        "provinceId": "xizang",
        "id": "lazixian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "兰溪市",
        "provinceId": "zhejiang",
        "id": "lanxishi"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "澜沧拉祜族自治县",
        "provinceId": "yunnan",
        "id": "lancanglahuzuzizhixian"
    },
    {
        "cityId": "jLM3a6rsQpyAicwmr6QU1V",
        "name": "乐东黎族自治县",
        "provinceId": "hainan",
        "id": "ledonglizuzizhixian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "雷波县",
        "provinceId": "sichuan",
        "id": "leiboxian"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "梨树区",
        "provinceId": "heilongjiang",
        "id": "lishuqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "黎川县",
        "provinceId": "jiangxi",
        "id": "lichuanxian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "黎平县",
        "provinceId": "guizhou",
        "id": "lipingxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "荔蒲县",
        "provinceId": "guangxi",
        "id": "lipuxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "利川市",
        "provinceId": "hubei",
        "id": "lichuanshi"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "连南瑶族自治县",
        "provinceId": "guangdong",
        "id": "liannanyaozuzizhixian"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "连山区",
        "provinceId": "liaoning",
        "id": "lianshanqu"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "涟水县",
        "provinceId": "jiangsu",
        "id": "lianshuixian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "临安市",
        "provinceId": "zhejiang",
        "id": "linanshi"
    },
    {
        "cityId": "dSI9Vc65RbCRpbzrIAFVcl",
        "name": "临江市",
        "provinceId": "jilin",
        "id": "linjiangshi"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "临泉县",
        "provinceId": "anhui",
        "id": "linquanxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "临沭县",
        "provinceId": "shandong",
        "id": "linshuxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "临朐县",
        "provinceId": "shandong",
        "id": "linquxian"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "电白县",
        "provinceId": "guangdong",
        "id": "dianbaixian"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "迭部县",
        "provinceId": "gansu",
        "id": "diebuxian"
    },
    {
        "cityId": "ifJP0Ai0TpGeUi0xfeKxv1",
        "name": "定海区",
        "provinceId": "zhejiang",
        "id": "dinghaiqu"
    },
    {
        "cityId": "eiyesojLS2mYJCmT8dCGwV",
        "name": "东港区",
        "provinceId": "shandong",
        "id": "donggangqu"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "东湖区",
        "provinceId": "jiangxi",
        "id": "donghuqu"
    },
    {
        "cityId": "4fBxBqrtRcCbWvPaqj9NlF",
        "name": "东营区",
        "provinceId": "shandong",
        "id": "dongyingqu"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "洞口县",
        "provinceId": "hunan",
        "id": "dongkouxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "都昌县",
        "provinceId": "jiangxi",
        "id": "duchangxian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "峨眉山市",
        "provinceId": "sichuan",
        "id": "emeishanshi"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "洱源县",
        "provinceId": "yunnan",
        "id": "eryuanxian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "方山县",
        "provinceId": "shanxi1",
        "id": "fangshanxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "丰都县",
        "provinceId": "chongqing",
        "id": "fengduxian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "丰泽区",
        "provinceId": "fujian",
        "id": "fengzequ"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "封开县",
        "provinceId": "guangdong",
        "id": "fengkaixian"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "凤泉区",
        "provinceId": "henan",
        "id": "fengquanqu"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "凤台县",
        "provinceId": "anhui",
        "id": "fengtaixian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "凤县",
        "provinceId": "shanxi2",
        "id": "fengxian"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "凤阳县",
        "provinceId": "anhui",
        "id": "fengyangxian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "福安市",
        "provinceId": "fujian",
        "id": "fuanshi"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "府谷县",
        "provinceId": "shanxi2",
        "id": "fuguxian"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "阜宁县",
        "provinceId": "jiangsu",
        "id": "funingxian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "富源县",
        "provinceId": "yunnan",
        "id": "fuyuanxian"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "甘谷县",
        "provinceId": "gansu",
        "id": "ganguxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "赣县",
        "provinceId": "jiangxi",
        "id": "ganxian"
    },
    {
        "cityId": "6MuDnmqlQxSAalOo2s0zBl",
        "name": "港南区",
        "provinceId": "guangxi",
        "id": "gangnanqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "高阳县",
        "provinceId": "hebei",
        "id": "gaoyangxian"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "高邮市",
        "provinceId": "jiangsu",
        "id": "gaoyoushi"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "恭城瑶族自治县",
        "provinceId": "guangxi",
        "id": "gongchengyaozuzizhixian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "弓长岭区",
        "provinceId": "liaoning",
        "id": "gongchanglingqu"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "巩留县",
        "provinceId": "xinjiang",
        "id": "gongliuxian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "阿坝县",
        "provinceId": "sichuan",
        "id": "abaxian"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "阿勒泰市",
        "provinceId": "xinjiang",
        "id": "aletaishi"
    },
    {
        "cityId": "rMAnzsDQTbqnUH9sBCT7r1",
        "name": "安居区",
        "provinceId": "sichuan",
        "id": "anjuqu"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "安宁市",
        "provinceId": "yunnan",
        "id": "anningshi"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "安乡县",
        "provinceId": "hunan",
        "id": "anxiangxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "白朗县",
        "provinceId": "xizang",
        "id": "bailangxian"
    },
    {
        "cityId": "SY7uuNGrS2u0A9IfxsM3eV",
        "name": "白沙黎族自治县",
        "provinceId": "hainan",
        "id": "baishalizuzizhixian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "白塔区",
        "provinceId": "liaoning",
        "id": "baitaqu"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "宝清县",
        "provinceId": "heilongjiang",
        "id": "baoqingxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "宝山区",
        "provinceId": "shanghai",
        "id": "baoshanqu"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "宝兴县",
        "provinceId": "sichuan",
        "id": "baoxingxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "北辰区",
        "provinceId": "tianjin",
        "id": "beichenqu"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "博白县",
        "provinceId": "guangxi",
        "id": "bobaixian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "博野县",
        "provinceId": "hebei",
        "id": "boyexian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "曹县",
        "provinceId": "shandong",
        "id": "caoxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "昌乐县",
        "provinceId": "shandong",
        "id": "changlexian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "常宁市",
        "provinceId": "hunan",
        "id": "changningshi"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "城步苗族自治县",
        "provinceId": "hunan",
        "id": "chengbumiaozuzizhixian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "赤坎区",
        "provinceId": "guangdong",
        "id": "chikanqu"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "磁县",
        "provinceId": "hebei",
        "id": "cixian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "从江县",
        "provinceId": "guizhou",
        "id": "congjiangxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "丛台区",
        "provinceId": "hebei",
        "id": "congtaiqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "翠峦区",
        "provinceId": "heilongjiang",
        "id": "cuiluanqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "措美县",
        "provinceId": "xizang",
        "id": "cuomeixian"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "错那县",
        "provinceId": "xizang",
        "id": "cuonaxian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "大城县",
        "provinceId": "hebei",
        "id": "dachengxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "大东区",
        "provinceId": "liaoning",
        "id": "dadongqu"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "大荔县",
        "provinceId": "shanxi2",
        "id": "dalixian"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "大悟县",
        "provinceId": "hubei",
        "id": "dawuxian"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "丹棱县",
        "provinceId": "sichuan",
        "id": "danlengxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "德安县",
        "provinceId": "jiangxi",
        "id": "deanxian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "德城区",
        "provinceId": "shandong",
        "id": "dechengqu"
    },
    {
        "cityId": "V1nlY4TEQkSkNHJswPRTfV",
        "name": "德令哈市",
        "provinceId": "qinghai",
        "id": "delinghashi"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "德庆县",
        "provinceId": "guangdong",
        "id": "deqingxian"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "南丹县",
        "provinceId": "guangxi",
        "id": "nandanxian"
    },
    {
        "cityId": "zVHAgUNBTnuweKy9FfTozV",
        "name": "南芬区",
        "provinceId": "liaoning",
        "id": "nanfenqu"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "南海区",
        "provinceId": "guangdong",
        "id": "nanhaiqu"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "南和县",
        "provinceId": "hebei",
        "id": "nanhexian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "南明区",
        "provinceId": "guizhou",
        "id": "nanmingqu"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "南谯区",
        "provinceId": "anhui",
        "id": "nanqiaoqu"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "内乡县",
        "provinceId": "henan",
        "id": "neixiangxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "聂拉木县",
        "provinceId": "xizang",
        "id": "nielamuxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "宁化县",
        "provinceId": "fujian",
        "id": "ninghuaxian"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "宁江区",
        "provinceId": "jilin",
        "id": "ningjiangqu"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "宁远县",
        "provinceId": "hunan",
        "id": "ningyuanxian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "磐安县",
        "provinceId": "zhejiang",
        "id": "pananxian"
    },
    {
        "cityId": "HjQvlY6yR2SLEMHabOtCwF",
        "name": "平定县",
        "provinceId": "shanxi1",
        "id": "pingdingxian"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "平鲁区",
        "provinceId": "shanxi1",
        "id": "pingluqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "贡嘎县",
        "provinceId": "xizang",
        "id": "gonggaxian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "贡觉县",
        "provinceId": "xizang",
        "id": "gongjuexian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "鼓楼区",
        "provinceId": "henan",
        "id": "gulouqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "鼓楼区",
        "provinceId": "jiangsu",
        "id": "gulouqu"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "古田县",
        "provinceId": "fujian",
        "id": "gutianxian"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "固镇县",
        "provinceId": "anhui",
        "id": "guzhenxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "灌阳县",
        "provinceId": "guangxi",
        "id": "guanyangxian"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "灌云县",
        "provinceId": "jiangsu",
        "id": "guanyunxian"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "广灵县",
        "provinceId": "shanxi1",
        "id": "guanglingxian"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "广南县",
        "provinceId": "yunnan",
        "id": "guangnanxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "广平县",
        "provinceId": "hebei",
        "id": "guangpingxian"
    },
    {
        "cityId": "50UCMLklQk20BrhS3G9nb1",
        "name": "贵池区",
        "provinceId": "anhui",
        "id": "guichiqu"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "海门市",
        "provinceId": "jiangsu",
        "id": "haimenshi"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "海珠区",
        "provinceId": "guangdong",
        "id": "haizhuqu"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "杭锦后旗",
        "provinceId": "neimenggu",
        "id": "hangjinhouqi"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "河东区",
        "provinceId": "shandong",
        "id": "hedongqu"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "东兰县",
        "provinceId": "guangxi",
        "id": "donglanxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "横县",
        "provinceId": "guangxi",
        "id": "hengxian"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "洪山区",
        "provinceId": "hubei",
        "id": "hongshanqu"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "洪泽县",
        "provinceId": "jiangsu",
        "id": "hongzexian"
    },
    {
        "cityId": "hSenHBIFTYSgBdNZgG31gF",
        "name": "湖滨区",
        "provinceId": "henan",
        "id": "hubinqu"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "互助土族自治县",
        "provinceId": "qinghai",
        "id": "huzhutuzuzizhixian"
    },
    {
        "cityId": "uabJYPqLS3yjwNDqbvurH1",
        "name": "花莲县",
        "provinceId": "taiwan",
        "id": "hualianxian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "滑县",
        "provinceId": "henan",
        "id": "huaxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "怀来县",
        "provinceId": "hebei",
        "id": "huailaixian"
    },
    {
        "cityId": "c7NBuS8uQTSj8eWvBkpsBV",
        "name": "淮上区",
        "provinceId": "anhui",
        "id": "huaishangqu"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "淮阳县",
        "provinceId": "henan",
        "id": "huaiyangxian"
    },
    {
        "cityId": "BwFCz7ULRqBCuEiC3Bofbl",
        "name": "环翠区",
        "provinceId": "shandong",
        "id": "huancuiqu"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "环县",
        "provinceId": "gansu",
        "id": "huanxian"
    },
    {
        "cityId": "YnrvOp7gQTapzsnCoBIsf1",
        "name": "桓台县",
        "provinceId": "shandong",
        "id": "huantaixian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "黄陵县",
        "provinceId": "shanxi2",
        "id": "huanglingxian"
    },
    {
        "cityId": "HNNAWbhDT1SjB4ywB4BJuF",
        "name": "惠城区",
        "provinceId": "guangdong",
        "id": "huichengqu"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "惠民县",
        "provinceId": "shandong",
        "id": "huiminxian"
    },
    {
        "cityId": "YBhHNMzDTwOjtS1fENhLHF",
        "name": "惠山区",
        "provinceId": "jiangsu",
        "id": "huishanqu"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "会昌县",
        "provinceId": "jiangxi",
        "id": "huichangxian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "会泽县",
        "provinceId": "yunnan",
        "id": "huizexian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "汇川区",
        "provinceId": "guizhou",
        "id": "huichuanqu"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "息县",
        "provinceId": "henan",
        "id": "xixian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "仙居县",
        "provinceId": "zhejiang",
        "id": "xianjuxian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "香河县",
        "provinceId": "hebei",
        "id": "xianghexian"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "襄城区",
        "provinceId": "hubei",
        "id": "xiangchengqu"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "襄汾县",
        "provinceId": "shanxi1",
        "id": "xiangfenxian"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "翔安区",
        "provinceId": "fujian",
        "id": "xianganqu"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "响水县",
        "provinceId": "jiangsu",
        "id": "xiangshuixian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "鄂温克族自治旗",
        "provinceId": "neimenggu",
        "id": "ewenkezuzizhiqi"
    },
    {
        "cityId": "Z7pWzlYDTuimk8Exq31NJV",
        "name": "刚察县",
        "provinceId": "qinghai",
        "id": "gangchaxian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "平江县",
        "provinceId": "hunan",
        "id": "pingjiangxian"
    },
    {
        "cityId": "4fBxBqrtRcCbWvPaqj9NlF",
        "name": "河口区",
        "provinceId": "shandong",
        "id": "hekouqu"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "徽县",
        "provinceId": "gansu",
        "id": "huixian"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "林芝县",
        "provinceId": "xizang",
        "id": "linzhixian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "盐津县",
        "provinceId": "yunnan",
        "id": "yanjinxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "盐亭县",
        "provinceId": "sichuan",
        "id": "yantingxian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "延平区",
        "provinceId": "fujian",
        "id": "yanpingqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "杨凌区",
        "provinceId": "shanxi2",
        "id": "yanglingqu"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "洋县",
        "provinceId": "shanxi2",
        "id": "yangxian"
    },
    {
        "cityId": "LA0kTGegSdy8EQvN16Ddfl",
        "name": "耀州区",
        "provinceId": "shanxi2",
        "id": "yaozhouqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "伊春区",
        "provinceId": "heilongjiang",
        "id": "yichunqu"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "伊宁市",
        "provinceId": "xinjiang",
        "id": "yiningshi"
    },
    {
        "cityId": "8YxtNda0TyqJ4SPA4XUn1F",
        "name": "伊吾县",
        "provinceId": "xinjiang",
        "id": "yiwuxian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "夷陵区",
        "provinceId": "hubei",
        "id": "yilingqu"
    },
    {
        "cityId": "XdVBIBwNTw2mIEbRBIfdbl",
        "name": "义县",
        "provinceId": "liaoning",
        "id": "yixian"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "银州区",
        "provinceId": "liaoning",
        "id": "yinzhouqu"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "英德市",
        "provinceId": "guangdong",
        "id": "yingdeshi"
    },
    {
        "cityId": "DzhfMD2ZRiWJcZeC5eFLCl",
        "name": "永昌县",
        "provinceId": "gansu",
        "id": "yongchangxian"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "永宁县",
        "provinceId": "ningxia",
        "id": "yongningxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "酉阳土家族苗族自治县",
        "provinceId": "chongqing",
        "id": "youyangtujiazumiaozuzizhixian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "友好区",
        "provinceId": "heilongjiang",
        "id": "youhaoqu"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "虞城县",
        "provinceId": "henan",
        "id": "yuchengxian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "鱼峰区",
        "provinceId": "guangxi",
        "id": "yufengqu"
    },
    {
        "cityId": "luOCfhU6R72OjnG58x9kBV",
        "name": "元宝区",
        "provinceId": "liaoning",
        "id": "yuanbaoqu"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "元宝山区",
        "provinceId": "neimenggu",
        "id": "yuanbaoshanqu"
    },
    {
        "cityId": "Iv4gXPOvSMmigNrEclsm9F",
        "name": "月湖区",
        "provinceId": "jiangxi",
        "id": "yuehuqu"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "云和县",
        "provinceId": "zhejiang",
        "id": "yunhexian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "云溪区",
        "provinceId": "hunan",
        "id": "yunxiqu"
    },
    {
        "cityId": "I8nXu6bRRa2duLwfE8C2ql",
        "name": "灵武市",
        "provinceId": "ningxia",
        "id": "lingwushi"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "柳北区",
        "provinceId": "guangxi",
        "id": "liubeiqu"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "龙港区",
        "provinceId": "liaoning",
        "id": "longgangqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "龙泉驿区",
        "provinceId": "sichuan",
        "id": "longquanyiqu"
    },
    {
        "cityId": "Js9NVTPHSZGLTEH4ZuqAnV",
        "name": "龙游县",
        "provinceId": "zhejiang",
        "id": "longyouxian"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "隆子县",
        "provinceId": "xizang",
        "id": "longzixian"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "芦山县",
        "provinceId": "sichuan",
        "id": "lushanxian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "炉霍县",
        "provinceId": "sichuan",
        "id": "luhuoxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "略阳县",
        "provinceId": "shanxi2",
        "id": "lueyangxian"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "轮台县",
        "provinceId": "xinjiang",
        "id": "luntaixian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "萝岗区",
        "provinceId": "guangdong",
        "id": "luogangqu"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "罗城仫佬族自治县",
        "provinceId": "guangxi",
        "id": "luochengmulaozuzizhixian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "罗山县",
        "provinceId": "henan",
        "id": "luoshanxian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "罗源县",
        "provinceId": "fujian",
        "id": "luoyuanxian"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "玛多县",
        "provinceId": "qinghai",
        "id": "maduoxian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "麦盖提县",
        "provinceId": "xinjiang",
        "id": "maigaitixian"
    },
    {
        "cityId": "LgxPtlJDRsOELF8nc8EfEl",
        "name": "美兰区",
        "provinceId": "hainan",
        "id": "meilanqu"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "孟村回族自治县",
        "provinceId": "hebei",
        "id": "mengcunhuizuzizhixian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "密云县",
        "provinceId": "beijin",
        "id": "miyunxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "绵阳市",
        "provinceId": "sichuan",
        "id": "mianyangshi"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "牟平区",
        "provinceId": "shandong",
        "id": "moupingqu"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "谢家集区",
        "provinceId": "anhui",
        "id": "xiejiajiqu"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "新丰县",
        "provinceId": "guangdong",
        "id": "xinfengxian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "新邵县",
        "provinceId": "hunan",
        "id": "xinshaoxian"
    },
    {
        "cityId": "BoPIl2ooTKWmSvVpf78PkF",
        "name": "新市区",
        "provinceId": "xinjiang",
        "id": "xinshiqu"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "新野县",
        "provinceId": "henan",
        "id": "xinyexian"
    },
    {
        "cityId": "JTu5vyd0TKKIoV4rAeOnYF",
        "name": "兴隆台区",
        "provinceId": "liaoning",
        "id": "xinglongtaiqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "徐汇区",
        "provinceId": "shanghai",
        "id": "xuhuiqu"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "薛城区",
        "provinceId": "shandong",
        "id": "xuechengqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "旬邑县",
        "provinceId": "shanxi2",
        "id": "xunyixian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "牙克石市",
        "provinceId": "neimenggu",
        "id": "yakeshishi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "平山县",
        "provinceId": "hebei",
        "id": "pingshanxian"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "平潭县",
        "provinceId": "fujian",
        "id": "pingtanxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "平乡县",
        "provinceId": "hebei",
        "id": "pingxiangxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "坡头区",
        "provinceId": "guangdong",
        "id": "potouqu"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "蒲江县",
        "provinceId": "sichuan",
        "id": "pujiangxian"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "普安县",
        "provinceId": "guizhou",
        "id": "puanxian"
    },
    {
        "cityId": "TAYos9MCQHqGUiBXAp0Kvl",
        "name": "普定县",
        "provinceId": "guizhou",
        "id": "pudingxian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "普兰县",
        "provinceId": "xizang",
        "id": "pulanxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "浦东新区",
        "provinceId": "shanghai",
        "id": "pudongxinqu"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "戚墅堰区",
        "provinceId": "jiangsu",
        "id": "qishuyanqu"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "祁东县",
        "provinceId": "hunan",
        "id": "qidongxian"
    },
    {
        "cityId": "lE56axJ3TKC2W8BjURVAe1",
        "name": "茄子河区",
        "provinceId": "heilongjiang",
        "id": "qiezihequ"
    },
    {
        "cityId": "UKif7im9RNGInBe0g3Dmg1",
        "name": "钦州市",
        "provinceId": "guangxi",
        "id": "qinzhoushi"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "沁县",
        "provinceId": "shanxi1",
        "id": "qinxian"
    },
    {
        "cityId": "50UCMLklQk20BrhS3G9nb1",
        "name": "青阳县",
        "provinceId": "anhui",
        "id": "qingyangxian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "青云谱区",
        "provinceId": "jiangxi",
        "id": "qingyunpuqu"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "清丰县",
        "provinceId": "henan",
        "id": "qingfengxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "清流县",
        "provinceId": "fujian",
        "id": "qingliuxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "清苑县",
        "provinceId": "hebei",
        "id": "qingyuanxian"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "曲水县",
        "provinceId": "xizang",
        "id": "qushuixian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "全州县",
        "provinceId": "guangxi",
        "id": "quanzhouxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "饶阳县",
        "provinceId": "hebei",
        "id": "raoyangxian"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "仁寿县",
        "provinceId": "sichuan",
        "id": "renshouxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "日喀则市",
        "provinceId": "xizang",
        "id": "rikazeshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "荣昌县",
        "provinceId": "chongqing",
        "id": "rongchangxian"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "容县",
        "provinceId": "guangxi",
        "id": "rongxian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "瑞安市",
        "provinceId": "zhejiang",
        "id": "ruianshi"
    },
    {
        "cityId": "sGZrd8KyRcSSETBbGqywK1",
        "name": "萨尔图区",
        "provinceId": "heilongjiang",
        "id": "saertuqu"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "三门县",
        "provinceId": "zhejiang",
        "id": "sanmenxian"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "三水区",
        "provinceId": "guangdong",
        "id": "sanshuiqu"
    },
    {
        "cityId": "aVygddPYREBFLhX8hc1oPF",
        "name": "桑日县",
        "provinceId": "xizang",
        "id": "sangrixian"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "莎车县",
        "provinceId": "xinjiang",
        "id": "shachexian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "山阳县",
        "provinceId": "shanxi2",
        "id": "shanyangxian"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "汕头市",
        "provinceId": "guangdong",
        "id": "shantoushi"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "商城县",
        "provinceId": "henan",
        "id": "shangchengxian"
    },
    {
        "cityId": "U2fzxZ4gTIqmfAyDz769cV",
        "name": "上思县",
        "provinceId": "guangxi",
        "id": "shangsixian"
    },
    {
        "cityId": "YOow77pNTty3PMiDsBL7hV",
        "name": "神农架林区",
        "provinceId": "hubei",
        "id": "shennongjialinqu"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "沈北新区",
        "provinceId": "liaoning",
        "id": "shenbeixinqu"
    },
    {
        "cityId": "hSTCfeYeRZyAICxK2KNfEF",
        "name": "什邡市",
        "provinceId": "sichuan",
        "id": "shenfangshi"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "市中区",
        "provinceId": "shandong",
        "id": "shizhongqu"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "蜀山区",
        "provinceId": "anhui",
        "id": "shushanqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "双桥区",
        "provinceId": "chongqing",
        "id": "shuangqiaoqu"
    },
    {
        "cityId": "UpFvFTldRTqUsNlvvUP0AF",
        "name": "水城县",
        "provinceId": "guizhou",
        "id": "shuichengxian"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "顺河回族区",
        "provinceId": "henan",
        "id": "shunhehuizuqu"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "四子王旗",
        "provinceId": "neimenggu",
        "id": "siziwangqi"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "苏家屯区",
        "provinceId": "liaoning",
        "id": "sujiatunqu"
    },
    {
        "cityId": "1FhRFP6wQjG5Ed2fh4Doi1",
        "name": "宿松县",
        "provinceId": "anhui",
        "id": "susongxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "绥江县",
        "provinceId": "yunnan",
        "id": "suijiangxian"
    },
    {
        "cityId": "reFzBLBASCyTxeIqn1WcM1",
        "name": "台东县",
        "provinceId": "taiwan",
        "id": "taidongxian"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "台前县",
        "provinceId": "henan",
        "id": "taiqianxian"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "台山市",
        "provinceId": "guangdong",
        "id": "taishanshi"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "太谷县",
        "provinceId": "shanxi1",
        "id": "taiguxian"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "太和县",
        "provinceId": "anhui",
        "id": "taihexian"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "太平区",
        "provinceId": "liaoning",
        "id": "taipingqu"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "太仆寺旗",
        "provinceId": "neimenggu",
        "id": "taipusiqi"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "唐县",
        "provinceId": "hebei",
        "id": "tangxian"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "天桥区",
        "provinceId": "shandong",
        "id": "tianqiaoqu"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "田家庵区",
        "provinceId": "anhui",
        "id": "tianjiaanqu"
    },
    {
        "cityId": "aJvw45JwQgmPW4glHesyrl",
        "name": "亭湖区",
        "provinceId": "jiangsu",
        "id": "tinghuqu"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "通辽市",
        "provinceId": "neimenggu",
        "id": "tongliaoshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "铜梁县",
        "provinceId": "chongqing",
        "id": "tongliangxian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "土默特右旗",
        "provinceId": "neimenggu",
        "id": "tumoteyouqi"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "瓦房店市",
        "provinceId": "liaoning",
        "id": "wafangdianshi"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "湾里区",
        "provinceId": "jiangxi",
        "id": "wanliqu"
    },
    {
        "cityId": "Jex4B2JZRbuV3uPQRmhLZF",
        "name": "万宁市",
        "provinceId": "hainan",
        "id": "wanningshi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "万州区",
        "provinceId": "chongqing",
        "id": "wanzhouqu"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "巍山彝族回族自治县",
        "provinceId": "yunnan",
        "id": "weishanyizuhuizuzizhixian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "温县",
        "provinceId": "henan",
        "id": "wenxian"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "翁源县",
        "provinceId": "guangdong",
        "id": "wengyuanxian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "乌审旗",
        "provinceId": "neimenggu",
        "id": "wushenqi"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "无棣县",
        "provinceId": "shandong",
        "id": "wudixian"
    },
    {
        "cityId": "bbu48iSZR2yLVKiwnsJmil",
        "name": "梧州市",
        "provinceId": "guangxi",
        "id": "wuzhoushi"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "吴川市",
        "provinceId": "guangdong",
        "id": "wuchuanshi"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "武安市",
        "provinceId": "hebei",
        "id": "wuanshi"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "武定县",
        "provinceId": "yunnan",
        "id": "wudingxian"
    },
    {
        "cityId": "ZzqgUfDWTYqKOjcjvkQ04F",
        "name": "武义县",
        "provinceId": "zhejiang",
        "id": "wuyixian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "武陟县",
        "provinceId": "henan",
        "id": "wuzhixian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "五营区",
        "provinceId": "heilongjiang",
        "id": "wuyingqu"
    },
    {
        "cityId": "Xm5wHSV2SKB5rqXvjxeXcl",
        "name": "舞阳县",
        "provinceId": "henan",
        "id": "wuyangxian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "西城区",
        "provinceId": "beijin",
        "id": "xichengqu"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "西林县",
        "provinceId": "guangxi",
        "id": "xilinxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "西峡县",
        "provinceId": "henan",
        "id": "xixiaxian"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "港闸区",
        "provinceId": "jiangsu",
        "id": "gangzhaqu"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "高密市",
        "provinceId": "shandong",
        "id": "gaomishi"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "高州市",
        "provinceId": "guangdong",
        "id": "gaozhoushi"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "白水县",
        "provinceId": "shanxi2",
        "id": "baishuixian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "白云矿区",
        "provinceId": "neimenggu",
        "id": "baiyunkuangqu"
    },
    {
        "cityId": "VBkIB7URQUehvfcHAdpAbl",
        "name": "保亭黎族苗族自治县",
        "provinceId": "hainan",
        "id": "baotinglizumiaozuzizhixian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "长安区",
        "provinceId": "shanxi2",
        "id": "changanqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "长宁区",
        "provinceId": "shanghai",
        "id": "changningqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "长阳土家族自治县",
        "provinceId": "hubei",
        "id": "changyangtujiazuzizhixian"
    },
    {
        "cityId": "jA7wZ4PcTwu0OavGBsvDql",
        "name": "德钦县",
        "provinceId": "yunnan",
        "id": "deqinxian"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "海盐县",
        "provinceId": "zhejiang",
        "id": "haiyanxian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "夹江县",
        "provinceId": "sichuan",
        "id": "jiajiangxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "建始县",
        "provinceId": "hubei",
        "id": "jianshixian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "将乐县",
        "provinceId": "fujian",
        "id": "jianglexian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "进贤县",
        "provinceId": "jiangxi",
        "id": "jinxianxian"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "景东彝族自治县",
        "provinceId": "yunnan",
        "id": "jingdongyizuzizhixian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "李沧区",
        "provinceId": "shandong",
        "id": "licangqu"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "普兰店市",
        "provinceId": "liaoning",
        "id": "pulandianshi"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "丘北县",
        "provinceId": "yunnan",
        "id": "qiubeixian"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "若尔盖县",
        "provinceId": "sichuan",
        "id": "ruoergaixian"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "泰顺县",
        "provinceId": "zhejiang",
        "id": "taishunxian"
    },
    {
        "cityId": "bbu48iSZR2yLVKiwnsJmil",
        "name": "藤县",
        "provinceId": "guangxi",
        "id": "tengxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "永善县",
        "provinceId": "yunnan",
        "id": "yongshanxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "梅里斯达斡尔族区",
        "provinceId": "heilongjiang",
        "id": "meilisidawoerzuqu"
    },
    {
        "cityId": "Z7pWzlYDTuimk8Exq31NJV",
        "name": "门源回族自治县",
        "provinceId": "qinghai",
        "id": "menyuanhuizuzizhixian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "桥西区",
        "provinceId": "hebei",
        "id": "qiaoxiqu"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "乳源瑶族自治县",
        "provinceId": "guangdong",
        "id": "ruyuanyaozuzizhixian"
    },
    {
        "cityId": "L4LXKliRTYOZ3FPvmfayPF",
        "name": "山城区",
        "provinceId": "henan",
        "id": "shanchengqu"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "舒兰市",
        "provinceId": "jilin",
        "id": "shulanshi"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "同江市",
        "provinceId": "heilongjiang",
        "id": "tongjiangshi"
    },
    {
        "cityId": "SDpY6V2ITICBLWBft5UiIF",
        "name": "乌尔禾区",
        "provinceId": "xinjiang",
        "id": "wuerhequ"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "习水县",
        "provinceId": "guizhou",
        "id": "xishuixian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "夏县",
        "provinceId": "shanxi1",
        "id": "xiaxian"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "墨脱县",
        "provinceId": "xizang",
        "id": "motuoxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "永安市",
        "provinceId": "fujian",
        "id": "yonganshi"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "永登县",
        "provinceId": "gansu",
        "id": "yongdengxian"
    },
    {
        "cityId": "gOy9XLexTCCgF0PbViIx0F",
        "name": "云安县",
        "provinceId": "guangdong",
        "id": "yunanxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "藁城市",
        "provinceId": "hebei",
        "id": "gaochengshi"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "岫岩满族自治县",
        "provinceId": "liaoning",
        "id": "xiuyanmanzuzizhixian"
    },
    {
        "cityId": "ifJP0Ai0TpGeUi0xfeKxv1",
        "name": "嵊泗县",
        "provinceId": "zhejiang",
        "id": "shengsixian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "涞源县",
        "provinceId": "hebei",
        "id": "laiyuanxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "涿州市",
        "provinceId": "hebei",
        "id": "zhuozhoushi"
    },
    {
        "cityId": "CJYn4NQrRcujQUeBeAQ6Ll",
        "name": "沾化县",
        "provinceId": "shandong",
        "id": "zhanhuaxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "赵县",
        "provinceId": "hebei",
        "id": "zhaoxian"
    },
    {
        "cityId": "ASszDCKmQNGFu05pb0UFfl",
        "name": "肇东市",
        "provinceId": "heilongjiang",
        "id": "zhaodongshi"
    },
    {
        "cityId": "Xm5wHSV2SKB5rqXvjxeXcl",
        "name": "召陵区",
        "provinceId": "henan",
        "id": "zhaolingqu"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "镇平县",
        "provinceId": "henan",
        "id": "zhenpingxian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "镇原县",
        "provinceId": "gansu",
        "id": "zhenyuanxian"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "正定县",
        "provinceId": "hebei",
        "id": "zhengdingxian"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "周至县",
        "provinceId": "shanxi2",
        "id": "zhouzhixian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "珠晖区",
        "provinceId": "hunan",
        "id": "zhuhuiqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "资溪县",
        "provinceId": "jiangxi",
        "id": "zixixian"
    },
    {
        "cityId": "VVz6UniQT3CjyoTu0REV9F",
        "name": "资中县",
        "provinceId": "sichuan",
        "id": "zizhongxian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "郓城县",
        "provinceId": "shandong",
        "id": "yunchengxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "郯城县",
        "provinceId": "shandong",
        "id": "tanchengxian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "鄞州区",
        "provinceId": "zhejiang",
        "id": "yinzhouqu"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "芷江侗族自治县",
        "provinceId": "hunan",
        "id": "zhijiangdongzuzizhixian"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "茌平县",
        "provinceId": "shandong",
        "id": "chipingxian"
    },
    {
        "cityId": "bbu48iSZR2yLVKiwnsJmil",
        "name": "岑溪市",
        "provinceId": "guangxi",
        "id": "cenxishi"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "嵩明县",
        "provinceId": "yunnan",
        "id": "songmingxian"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "汨罗市",
        "provinceId": "hunan",
        "id": "miluoshi"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "泸定县",
        "provinceId": "sichuan",
        "id": "ludingxian"
    },
    {
        "cityId": "ib716QvfSBa4IRDCAkZ6TF",
        "name": "泗洪县",
        "provinceId": "jiangsu",
        "id": "sihongxian"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "泾川县",
        "provinceId": "gansu",
        "id": "jingchuanxian"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "泾阳县",
        "provinceId": "shanxi2",
        "id": "jingyangxian"
    },
    {
        "cityId": "EnKWQIIDQSuqb94JBnAOG1",
        "name": "洮北区",
        "provinceId": "jilin",
        "id": "taobeiqu"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "潢川县",
        "provinceId": "henan",
        "id": "huangchuanxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "璧山县",
        "provinceId": "chongqing",
        "id": "bishanxian"
    },
    {
        "cityId": "jGAf9UwSTD6Iyief0g6s01",
        "name": "歙县",
        "provinceId": "anhui",
        "id": "xixian"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "磴口县",
        "provinceId": "neimenggu",
        "id": "dengkouxian"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "秭归县",
        "provinceId": "hubei",
        "id": "ziguixian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "稷山县",
        "provinceId": "shanxi1",
        "id": "jishanxian"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "颍上县",
        "provinceId": "anhui",
        "id": "yingshangxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "蠡县",
        "provinceId": "hebei",
        "id": "lixian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "鄂托克前旗",
        "provinceId": "neimenggu",
        "id": "etuokeqianqi"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "北安市",
        "provinceId": "heilongjiang",
        "id": "beianshi"
    },
    {
        "cityId": "ulAZGrBFRXB317Z8wHsI41",
        "name": "当涂县",
        "provinceId": "anhui",
        "id": "dangtuxian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "蓬安县",
        "provinceId": "sichuan",
        "id": "penganxian"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "海宁市",
        "provinceId": "zhejiang",
        "id": "hainingshi"
    },
    {
        "cityId": "uLGhTDvoQQepu1FbRpN6RF",
        "name": "汉寿县",
        "provinceId": "hunan",
        "id": "hanshouxian"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "江海区",
        "provinceId": "guangdong",
        "id": "jianghaiqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "开县",
        "provinceId": "chongqing",
        "id": "kaixian"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "清新县",
        "provinceId": "guangdong",
        "id": "qingxinxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "沙县",
        "provinceId": "fujian",
        "id": "shaxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "上海市",
        "provinceId": "shanghai",
        "id": "shanghaishi"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "思茅区",
        "provinceId": "yunnan",
        "id": "simaoqu"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "通许县",
        "provinceId": "henan",
        "id": "tongxuxian"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "夏河县",
        "provinceId": "gansu",
        "id": "xiahexian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "准格尔旗",
        "provinceId": "neimenggu",
        "id": "zhungeerqi"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "福海县",
        "provinceId": "xinjiang",
        "id": "fuhaixian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "阜城县",
        "provinceId": "hebei",
        "id": "fuchengxian"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "鸡东县",
        "provinceId": "heilongjiang",
        "id": "jidongxian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "吉安市",
        "provinceId": "jiangxi",
        "id": "jianshi"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "吉水县",
        "provinceId": "jiangxi",
        "id": "jishuixian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "吉州区",
        "provinceId": "jiangxi",
        "id": "jizhouqu"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "集安市",
        "provinceId": "jilin",
        "id": "jianshi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "嘉禾县",
        "provinceId": "hunan",
        "id": "jiahexian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "嘉荫县",
        "provinceId": "heilongjiang",
        "id": "jiayinxian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "剑川县",
        "provinceId": "yunnan",
        "id": "jianchuanxian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "椒江区",
        "provinceId": "zhejiang",
        "id": "jiaojiangqu"
    },
    {
        "cityId": "pq9RAGRDSJeRDVfzOMFCX1",
        "name": "揭东县",
        "provinceId": "guangdong",
        "id": "jiedongxian"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "金山区",
        "provinceId": "shanghai",
        "id": "jinshanqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "金山屯区",
        "provinceId": "heilongjiang",
        "id": "jinshantunqu"
    },
    {
        "cityId": "UrAb1aw5QZqL8EGSmaEaWV",
        "name": "晋安区",
        "provinceId": "fujian",
        "id": "jinanqu"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "靖边县",
        "provinceId": "shanxi2",
        "id": "jingbianxian"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "靖江市",
        "provinceId": "jiangsu",
        "id": "jingjiangshi"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "凯里市",
        "provinceId": "guizhou",
        "id": "kailishi"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "康平县",
        "provinceId": "liaoning",
        "id": "kangpingxian"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "科尔沁右翼前旗",
        "provinceId": "neimenggu",
        "id": "keerqinyouyiqianqi"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "宽城区",
        "provinceId": "jilin",
        "id": "kuanchengqu"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "莱州市",
        "provinceId": "shandong",
        "id": "laizhoushi"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "蓝山县",
        "provinceId": "hunan",
        "id": "lanshanxian"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "兰山区",
        "provinceId": "shandong",
        "id": "lanshanqu"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "朗县",
        "provinceId": "xizang",
        "id": "langxian"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "离石区",
        "provinceId": "shanxi1",
        "id": "lishiqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "礼泉县",
        "provinceId": "shanxi2",
        "id": "liquanxian"
    },
    {
        "cityId": "IwS8airmRPSNJD9EAULiWl",
        "name": "辽中县",
        "provinceId": "liaoning",
        "id": "liaozhongxian"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "林周县",
        "provinceId": "xizang",
        "id": "linzhouxian"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "临海市",
        "provinceId": "zhejiang",
        "id": "linhaishi"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "临清市",
        "provinceId": "shandong",
        "id": "linqingshi"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "临潭县",
        "provinceId": "gansu",
        "id": "lintanxian"
    },
    {
        "cityId": "nWltMkFAStqs9p1s52IeiV",
        "name": "临夏市",
        "provinceId": "gansu",
        "id": "linxiashi"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "临漳县",
        "provinceId": "hebei",
        "id": "linzhangxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "蝶山区",
        "provinceId": "guangxi",
        "id": "dieshanqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "定兴县",
        "provinceId": "hebei",
        "id": "dingxingxian"
    },
    {
        "cityId": "ZLBCMUd3StCAVkvThN1YvF",
        "name": "东阿县",
        "provinceId": "shandong",
        "id": "dongaxian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "东明县",
        "provinceId": "shandong",
        "id": "dongmingxian"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "东坡区",
        "provinceId": "sichuan",
        "id": "dongpoqu"
    },
    {
        "cityId": "uICYEf8QQBKo9xcjSkhBFl",
        "name": "敦煌市",
        "provinceId": "gansu",
        "id": "dunhuangshi"
    },
    {
        "cityId": "5DAAGFqfSgykAVPhz1wSsV",
        "name": "峨山彝族自治县",
        "provinceId": "yunnan",
        "id": "eshanyizuzizhixian"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "樊城区",
        "provinceId": "hubei",
        "id": "fanchengqu"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "繁峙县",
        "provinceId": "shanxi1",
        "id": "fanzhixian"
    },
    {
        "cityId": "D9hHTDwuSrW4wAgICoi4Sl",
        "name": "范县",
        "provinceId": "henan",
        "id": "fanxian"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "房县",
        "provinceId": "hubei",
        "id": "fangxian"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "肥东县",
        "provinceId": "anhui",
        "id": "feidongxian"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "扶余县",
        "provinceId": "jilin",
        "id": "fuyuxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "复兴区",
        "provinceId": "hebei",
        "id": "fuxingqu"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "富县",
        "provinceId": "shanxi2",
        "id": "fuxian"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "富蕴县",
        "provinceId": "xinjiang",
        "id": "fuyunxian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "改则县",
        "provinceId": "xizang",
        "id": "gaizexian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "甘泉县",
        "provinceId": "shanxi2",
        "id": "ganquanxian"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "高平市",
        "provinceId": "shanxi1",
        "id": "gaopingshi"
    },
    {
        "cityId": "tqkB64R4RAWNp55Pt8mbTF",
        "name": "高要市",
        "provinceId": "guangdong",
        "id": "gaoyaoshi"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "公主岭市",
        "provinceId": "jilin",
        "id": "gongzhulingshi"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "爱辉区",
        "provinceId": "heilongjiang",
        "id": "aihuiqu"
    },
    {
        "cityId": "TnTWoAYSTsCb0FGbFrfAEF",
        "name": "安龙县",
        "provinceId": "guizhou",
        "id": "anlongxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "安县",
        "provinceId": "sichuan",
        "id": "anxian"
    },
    {
        "cityId": "JNJsMOuaQ5m4WEDOBsGdeF",
        "name": "安义县",
        "provinceId": "jiangxi",
        "id": "anyixian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "八宿县",
        "provinceId": "xizang",
        "id": "basuxian"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "巴东县",
        "provinceId": "hubei",
        "id": "badongxian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "巴林右旗",
        "provinceId": "neimenggu",
        "id": "balinyouqi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "巴南区",
        "provinceId": "chongqing",
        "id": "bananqu"
    },
    {
        "cityId": "YYsmFCqOTaWwMcTxldbH4F",
        "name": "宝山区",
        "provinceId": "heilongjiang",
        "id": "baoshanqu"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "博湖县",
        "provinceId": "xinjiang",
        "id": "bohuxian"
    },
    {
        "cityId": "5OFHnsfIQdOKa50lhtlBmV",
        "name": "博乐市",
        "provinceId": "xinjiang",
        "id": "boleshi"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "沧浪区",
        "provinceId": "jiangsu",
        "id": "canglangqu"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "策勒县",
        "provinceId": "xinjiang",
        "id": "celexian"
    },
    {
        "cityId": "QsOAp3AtQlyLAHEL1MJ2Bl",
        "name": "昌江区",
        "provinceId": "jiangxi",
        "id": "changjiangqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "硚口区",
        "provinceId": "hubei",
        "id": "kouqu"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "长岭县",
        "provinceId": "jilin",
        "id": "changlingxian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "长宁县",
        "provinceId": "sichuan",
        "id": "changningxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "城口县",
        "provinceId": "chongqing",
        "id": "chengkouxian"
    },
    {
        "cityId": "HjQvlY6yR2SLEMHabOtCwF",
        "name": "城区",
        "provinceId": "shanxi1",
        "id": "chengqu"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "崇川区",
        "provinceId": "jiangsu",
        "id": "chongchuanqu"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "楚雄市",
        "provinceId": "yunnan",
        "id": "chuxiongshi"
    },
    {
        "cityId": "rMAnzsDQTbqnUH9sBCT7r1",
        "name": "船山区",
        "provinceId": "sichuan",
        "id": "chuanshanqu"
    },
    {
        "cityId": "EnKWQIIDQSuqb94JBnAOG1",
        "name": "大安市",
        "provinceId": "jilin",
        "id": "daanshi"
    },
    {
        "cityId": "kBRAAvSgS1aoQbDuLlmAbF",
        "name": "大化瑶族自治县",
        "provinceId": "guangxi",
        "id": "dahuayaozuzizhixian"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "大埔县",
        "provinceId": "guangdong",
        "id": "dapuxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "大邑县",
        "provinceId": "sichuan",
        "id": "dayixian"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "大竹县",
        "provinceId": "sichuan",
        "id": "dazhuxian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "带岭区",
        "provinceId": "heilongjiang",
        "id": "dailingqu"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "单县",
        "provinceId": "shandong",
        "id": "danxian"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "南陵县",
        "provinceId": "anhui",
        "id": "nanlingxian"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "南皮县",
        "provinceId": "hebei",
        "id": "nanpixian"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "南溪县",
        "provinceId": "sichuan",
        "id": "nanxixian"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "内黄县",
        "provinceId": "henan",
        "id": "neihuangxian"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "聂荣县",
        "provinceId": "xizang",
        "id": "nierongxian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "宁津县",
        "provinceId": "shandong",
        "id": "ningjinxian"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "蓬莱市",
        "provinceId": "shandong",
        "id": "penglaishi"
    },
    {
        "cityId": "a9RNTQB6Q42cdIVqkPDiDV",
        "name": "平安县",
        "provinceId": "qinghai",
        "id": "pinganxian"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "平江区",
        "provinceId": "jiangsu",
        "id": "pingjiangqu"
    },
    {
        "cityId": "94GWNu4NTDOQ7tZ3BRNYX1",
        "name": "贡山独龙族怒族自治县",
        "provinceId": "yunnan",
        "id": "gongshandulongzunuzuzizhixian"
    },
    {
        "cityId": "uOjDrnIaR3OAlM1KbbA4nl",
        "name": "古城区",
        "provinceId": "yunnan",
        "id": "guchengqu"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "管城回族区",
        "provinceId": "henan",
        "id": "guanchenghuizuqu"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "灌南县",
        "provinceId": "jiangsu",
        "id": "guannanxian"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "广陵区",
        "provinceId": "jiangsu",
        "id": "guanglingqu"
    },
    {
        "cityId": "4fBxBqrtRcCbWvPaqj9NlF",
        "name": "广饶县",
        "provinceId": "shandong",
        "id": "guangraoxian"
    },
    {
        "cityId": "6MuDnmqlQxSAalOo2s0zBl",
        "name": "桂平市",
        "provinceId": "guangxi",
        "id": "guipingshi"
    },
    {
        "cityId": "Iv4gXPOvSMmigNrEclsm9F",
        "name": "贵溪市",
        "provinceId": "jiangxi",
        "id": "guixishi"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "海港区",
        "provinceId": "hebei",
        "id": "haigangqu"
    },
    {
        "cityId": "7b5i6hAHRBSB9oDevgAu6l",
        "name": "海州区",
        "provinceId": "liaoning",
        "id": "haizhouqu"
    },
    {
        "cityId": "Z7pWzlYDTuimk8Exq31NJV",
        "name": "海晏县",
        "provinceId": "qinghai",
        "id": "haiyanxian"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "和田县",
        "provinceId": "xinjiang",
        "id": "hetianxian"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "合阳县",
        "provinceId": "shanxi2",
        "id": "heyangxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "河西区",
        "provinceId": "tianjin",
        "id": "hexiqu"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "东宁县",
        "provinceId": "heilongjiang",
        "id": "dongningxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "横峰县",
        "provinceId": "jiangxi",
        "id": "hengfengxian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "横山县",
        "provinceId": "shanxi2",
        "id": "hengshanxian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "衡东县",
        "provinceId": "hunan",
        "id": "hengdongxian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "衡南县",
        "provinceId": "hunan",
        "id": "hengnanxian"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "恒山区",
        "provinceId": "heilongjiang",
        "id": "hengshanqu"
    },
    {
        "cityId": "yVPV5tBGRi2iPCbjfOT9A1",
        "name": "洪雅县",
        "provinceId": "sichuan",
        "id": "hongyaxian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "宏伟区",
        "provinceId": "liaoning",
        "id": "hongweiqu"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "花垣县",
        "provinceId": "hunan",
        "id": "huayuanxian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "华池县",
        "provinceId": "gansu",
        "id": "huachixian"
    },
    {
        "cityId": "dfAvKljPRB2biVlaJj52AV",
        "name": "华容区",
        "provinceId": "hubei",
        "id": "huarongqu"
    },
    {
        "cityId": "59NfTXALRnyPyWod2n2HfV",
        "name": "华容县",
        "provinceId": "hunan",
        "id": "huarongxian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "化德县",
        "provinceId": "neimenggu",
        "id": "huadexian"
    },
    {
        "cityId": "SgGkHXTSRsBqGY3q3JNaP1",
        "name": "怀柔区",
        "provinceId": "beijin",
        "id": "huairouqu"
    },
    {
        "cityId": "HVi9qJvwTqaJTXJYaIcBF1",
        "name": "黄浦区",
        "provinceId": "shanghai",
        "id": "huangpuqu"
    },
    {
        "cityId": "N7AAS7KwSmyJzAs3aBIzCl",
        "name": "黄岩区",
        "provinceId": "zhejiang",
        "id": "huangyanqu"
    },
    {
        "cityId": "mTPhBOLeRcKWglIZDn9s5l",
        "name": "黄陂区",
        "provinceId": "hubei",
        "id": "huangbeiqu"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "惠济区",
        "provinceId": "henan",
        "id": "huijiqu"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "惠水县",
        "provinceId": "guizhou",
        "id": "huishuixian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "会同县",
        "provinceId": "hunan",
        "id": "huitongxian"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "霍城县",
        "provinceId": "xinjiang",
        "id": "huochengxian"
    },
    {
        "cityId": "1mCHwpjVRVe1qKdiISSsS1",
        "name": "霍林郭勒市",
        "provinceId": "neimenggu",
        "id": "huolinguoleshi"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "夏津县",
        "provinceId": "shandong",
        "id": "xiajinxian"
    },
    {
        "cityId": "HVMTanysROWMSUw8sclwdF",
        "name": "相山区",
        "provinceId": "anhui",
        "id": "xiangshanqu"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "襄阳市",
        "provinceId": "hubei",
        "id": "xiangyangshi"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "向阳区",
        "provinceId": "heilongjiang",
        "id": "xiangyangqu"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "向阳区",
        "provinceId": "heilongjiang",
        "id": "xiangyangqu"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "宕昌县",
        "provinceId": "gansu",
        "id": "danchangxian"
    },
    {
        "cityId": "P6eZe0srTMiRof1Cv89S7F",
        "name": "盱眙县",
        "provinceId": "jiangsu",
        "id": "xuyixian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "丰润区",
        "provinceId": "hebei",
        "id": "fengrunqu"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "道真仡佬族苗族自治县",
        "provinceId": "guizhou",
        "id": "daozhengelaozumiaozuzizhixian"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "潘集区",
        "provinceId": "anhui",
        "id": "panjiqu"
    },
    {
        "cityId": "8YxtNda0TyqJ4SPA4XUn1F",
        "name": "哈密市",
        "provinceId": "xinjiang",
        "id": "hamishi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "新华区",
        "provinceId": "hebei",
        "id": "xinhuaqu"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "盐湖区",
        "provinceId": "shanxi1",
        "id": "yanhuqu"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "延川县",
        "provinceId": "shanxi2",
        "id": "yanchuanxian"
    },
    {
        "cityId": "R2MGr3mAQuWJG400bFLQYV",
        "name": "雁山区",
        "provinceId": "guangxi",
        "id": "yanshanqu"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "雁塔区",
        "provinceId": "shanxi2",
        "id": "yantaqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "阳原县",
        "provinceId": "hebei",
        "id": "yangyuanxian"
    },
    {
        "cityId": "9RlojU6aSgOxIgBUWdfdGV",
        "name": "依兰县",
        "provinceId": "heilongjiang",
        "id": "yilanxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "宜川县",
        "provinceId": "shanxi2",
        "id": "yichuanxian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "英山县",
        "provinceId": "hubei",
        "id": "yingshanxian"
    },
    {
        "cityId": "DZJUE80dSaWETuvA0ROxbF",
        "name": "营山县",
        "provinceId": "sichuan",
        "id": "yingshanxian"
    },
    {
        "cityId": "3Kw7SNqMSK2QNlxk2MsAAl",
        "name": "盈江县",
        "provinceId": "yunnan",
        "id": "yingjiangxian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "永顺县",
        "provinceId": "hunan",
        "id": "yongshunxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "游仙区",
        "provinceId": "sichuan",
        "id": "youxianqu"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "右江区",
        "provinceId": "guangxi",
        "id": "youjiangqu"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "于田县",
        "provinceId": "xinjiang",
        "id": "yutianxian"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "榆中县",
        "provinceId": "gansu",
        "id": "yuzhongxian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "鱼台县",
        "provinceId": "shandong",
        "id": "yutaixian"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "玉林市",
        "provinceId": "guangxi",
        "id": "yulinshi"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "玉泉区",
        "provinceId": "neimenggu",
        "id": "yuquanqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "玉州区",
        "provinceId": "guangxi",
        "id": "yuzhouqu"
    },
    {
        "cityId": "Xm5wHSV2SKB5rqXvjxeXcl",
        "name": "源汇区",
        "provinceId": "henan",
        "id": "yuanhuiqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "远安县",
        "provinceId": "hubei",
        "id": "yuananxian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "云岩区",
        "provinceId": "guizhou",
        "id": "yunyanqu"
    },
    {
        "cityId": "gbQqO8U7QviiKfYKAXWbYl",
        "name": "枣阳市",
        "provinceId": "hubei",
        "id": "zaoyangshi"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "增城市",
        "provinceId": "guangdong",
        "id": "zengchengshi"
    },
    {
        "cityId": "XfhdbpurRseET5JRyL6uo1",
        "name": "曾都区",
        "provinceId": "hubei",
        "id": "cengduqu"
    },
    {
        "cityId": "UKif7im9RNGInBe0g3Dmg1",
        "name": "灵山县",
        "provinceId": "guangxi",
        "id": "lingshanxian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "柳城县",
        "provinceId": "guangxi",
        "id": "liuchengxian"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "柳河县",
        "provinceId": "jilin",
        "id": "liuhexian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "柳江县",
        "provinceId": "guangxi",
        "id": "liujiangxian"
    },
    {
        "cityId": "UpFvFTldRTqUsNlvvUP0AF",
        "name": "六枝特区",
        "provinceId": "guizhou",
        "id": "liuzhitequ"
    },
    {
        "cityId": "fJRLv6LJTcy0jRylxEvLWF",
        "name": "龙陵县",
        "provinceId": "yunnan",
        "id": "longlingxian"
    },
    {
        "cityId": "HNNAWbhDT1SjB4ywB4BJuF",
        "name": "龙门县",
        "provinceId": "guangdong",
        "id": "longmenxian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "龙潭区",
        "provinceId": "jilin",
        "id": "longtanqu"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "鹿邑县",
        "provinceId": "henan",
        "id": "luyixian"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "潞城市",
        "provinceId": "shanxi1",
        "id": "luchengshi"
    },
    {
        "cityId": "m9aTiCwVRpqnrQz2vMTfgF",
        "name": "陆丰市",
        "provinceId": "guangdong",
        "id": "lufengshi"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "陆良县",
        "provinceId": "yunnan",
        "id": "luliangxian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "滦县",
        "provinceId": "hebei",
        "id": "luanxian"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "罗湖区",
        "provinceId": "guangdong",
        "id": "luohuqu"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "罗庄区",
        "provinceId": "shandong",
        "id": "luozhuangqu"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "麻阳苗族自治县",
        "provinceId": "hunan",
        "id": "mayangmiaozuzizhixian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "马山县",
        "provinceId": "guangxi",
        "id": "mashanxian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "芒康县",
        "provinceId": "xizang",
        "id": "mangkangxian"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "茂港区",
        "provinceId": "guangdong",
        "id": "maogangqu"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "梅江区",
        "provinceId": "guangdong",
        "id": "meijiangqu"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "眉县",
        "provinceId": "shanxi2",
        "id": "meixian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "米脂县",
        "provinceId": "shanxi2",
        "id": "mizhixian"
    },
    {
        "cityId": "Np9UNulgQjerfE6TeDgZv1",
        "name": "苗栗县",
        "provinceId": "taiwan",
        "id": "miaolixian"
    },
    {
        "cityId": "ZxY3tBPjRHC6cJH1nSJslF",
        "name": "民丰县",
        "provinceId": "xinjiang",
        "id": "minfengxian"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "民权县",
        "provinceId": "henan",
        "id": "minquanxian"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "明光市",
        "provinceId": "anhui",
        "id": "mingguangshi"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "明溪县",
        "provinceId": "fujian",
        "id": "mingxixian"
    },
    {
        "cityId": "BsvdzjbUQYibBPmyKXgzU1",
        "name": "牡丹区",
        "provinceId": "shandong",
        "id": "mudanqu"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "纳溪区",
        "provinceId": "sichuan",
        "id": "naxiqu"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "孝感市",
        "provinceId": "hubei",
        "id": "xiaoganshi"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "孝南区",
        "provinceId": "hubei",
        "id": "xiaonanqu"
    },
    {
        "cityId": "ALuDH7cRRGe65K3KM5Zqy1",
        "name": "孝义市",
        "provinceId": "shanxi1",
        "id": "xiaoyishi"
    },
    {
        "cityId": "CeCKB4cGTYeWeY2LVLDDDF",
        "name": "新华区",
        "provinceId": "hebei",
        "id": "xinhuaqu"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "新罗区",
        "provinceId": "fujian",
        "id": "xinluoqu"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "新密市",
        "provinceId": "henan",
        "id": "xinmishi"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "新宁县",
        "provinceId": "hunan",
        "id": "xinningxian"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "新泰市",
        "provinceId": "shandong",
        "id": "xintaishi"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "新田县",
        "provinceId": "hunan",
        "id": "xintianxian"
    },
    {
        "cityId": "XQfeHu9vQhWB9nQDfNZuVl",
        "name": "新县",
        "provinceId": "henan",
        "id": "xinxian"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "兴城市",
        "provinceId": "liaoning",
        "id": "xingchengshi"
    },
    {
        "cityId": "5fwU4TARQ2Chx9G8Z1NsdF",
        "name": "兴海县",
        "provinceId": "qinghai",
        "id": "xinghaixian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "修武县",
        "provinceId": "henan",
        "id": "xiuwuxian"
    },
    {
        "cityId": "ChvJPBZtTXySUcBJwktP0F",
        "name": "秀屿区",
        "provinceId": "fujian",
        "id": "xiuyuqu"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "许昌县",
        "provinceId": "henan",
        "id": "xuchangxian"
    },
    {
        "cityId": "WdrmCWCgSMCsif86l6oQiV",
        "name": "逊克县",
        "provinceId": "heilongjiang",
        "id": "xunkexian"
    },
    {
        "cityId": "VyGjK2N3TVBa3zO8a32Rl1",
        "name": "平罗县",
        "provinceId": "ningxia",
        "id": "pingluoxian"
    },
    {
        "cityId": "hCBVBLECQOqM1yNAfyTCZ1",
        "name": "平原县",
        "provinceId": "shandong",
        "id": "pingyuanxian"
    },
    {
        "cityId": "J7Ek2sLQQCWuAG4XlEFizV",
        "name": "屏东县",
        "provinceId": "taiwan",
        "id": "pingdongxian"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "星子县",
        "provinceId": "jiangxi",
        "id": "xingzixian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "浦城县",
        "provinceId": "fujian",
        "id": "puchengxian"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "浦口区",
        "provinceId": "jiangsu",
        "id": "pukouqu"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "铅山县",
        "provinceId": "jiangxi",
        "id": "qianshanxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "巧家县",
        "provinceId": "yunnan",
        "id": "qiaojiaxian"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "秦都区",
        "provinceId": "shanxi2",
        "id": "qinduqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "青秀区",
        "provinceId": "guangxi",
        "id": "qingxiuqu"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "邱县",
        "provinceId": "hebei",
        "id": "qiuxian"
    },
    {
        "cityId": "QQoADPwbTQi01m0YqxdUe1",
        "name": "曲周县",
        "provinceId": "hebei",
        "id": "quzhouxian"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "泉山区",
        "provinceId": "jiangsu",
        "id": "quanshanqu"
    },
    {
        "cityId": "mij3ewMkTiuAsykQ7hEonV",
        "name": "壤塘县",
        "provinceId": "sichuan",
        "id": "rangtangxian"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "如东县",
        "provinceId": "jiangsu",
        "id": "rudongxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "汝南县",
        "provinceId": "henan",
        "id": "runanxian"
    },
    {
        "cityId": "3Kw7SNqMSK2QNlxk2MsAAl",
        "name": "瑞丽市",
        "provinceId": "yunnan",
        "id": "ruilishi"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "三元区",
        "provinceId": "fujian",
        "id": "sanyuanqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "三原县",
        "provinceId": "shanxi2",
        "id": "sanyuanxian"
    },
    {
        "cityId": "pzyDfLLvRW623comq63RsV",
        "name": "沙洋县",
        "provinceId": "hubei",
        "id": "shayangxian"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "山阳区",
        "provinceId": "henan",
        "id": "shanyangqu"
    },
    {
        "cityId": "ZDmm5ivhRmBOrQDn5R5DCV",
        "name": "商水县",
        "provinceId": "henan",
        "id": "shangshuixian"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "上虞市",
        "provinceId": "zhejiang",
        "id": "shangyushi"
    },
    {
        "cityId": "h34U4POBQamXAVpkwnaVZF",
        "name": "深泽县",
        "provinceId": "hebei",
        "id": "shenzexian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "神池县",
        "provinceId": "shanxi1",
        "id": "shenchixian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "石城县",
        "provinceId": "jiangxi",
        "id": "shichengxian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "石峰区",
        "provinceId": "hunan",
        "id": "shifengqu"
    },
    {
        "cityId": "2pDAa4BGQWCaHb7Y3uuBdV",
        "name": "石河子市",
        "provinceId": "xinjiang",
        "id": "shihezishi"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "石泉县",
        "provinceId": "shanxi2",
        "id": "shiquanxian"
    },
    {
        "cityId": "A2rjgBdcQOy4XgAJSt1OJ1",
        "name": "始兴县",
        "provinceId": "guangdong",
        "id": "shixingxian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "市南区",
        "provinceId": "shandong",
        "id": "shinanqu"
    },
    {
        "cityId": "tlxkofemRnKASAajPMj79V",
        "name": "市中区",
        "provinceId": "sichuan",
        "id": "shizhongqu"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "寿阳县",
        "provinceId": "shanxi1",
        "id": "shouyangxian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "双柏县",
        "provinceId": "yunnan",
        "id": "shuangbaixian"
    },
    {
        "cityId": "zomQN8bmRoC80Ia1GAwROl",
        "name": "双辽市",
        "provinceId": "jilin",
        "id": "shuangliaoshi"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "双滦区",
        "provinceId": "hebei",
        "id": "shuangluanqu"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "双桥区",
        "provinceId": "hebei",
        "id": "shuangqiaoqu"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "塔什库尔干塔吉克自治县",
        "provinceId": "xinjiang",
        "id": "tashenkuergantajikezizhixian"
    },
    {
        "cityId": "bKxqFjV6QSmTBs8nZxbh01",
        "name": "台中县",
        "provinceId": "taiwan",
        "id": "taizhongxian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "泰和县",
        "provinceId": "jiangxi",
        "id": "taihexian"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "泰兴市",
        "provinceId": "jiangsu",
        "id": "taixingshi"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "太子河区",
        "provinceId": "liaoning",
        "id": "taizihequ"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "唐海县",
        "provinceId": "hebei",
        "id": "tanghaixian"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "天宁区",
        "provinceId": "jiangsu",
        "id": "tianningqu"
    },
    {
        "cityId": "DUrxmkkjRS6QjpVc49RAIV",
        "name": "通化县",
        "provinceId": "jilin",
        "id": "tonghuaxian"
    },
    {
        "cityId": "TcipBdDPTUGDxi04CuzEKV",
        "name": "同仁县",
        "provinceId": "qinghai",
        "id": "tongrenxian"
    },
    {
        "cityId": "VHeQ5ehLQ0eS6Xw36XcOoF",
        "name": "图木舒克市",
        "provinceId": "xinjiang",
        "id": "tumushukeshi"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "屯留县",
        "provinceId": "shanxi1",
        "id": "tunliuxian"
    },
    {
        "cityId": "qWTdBgOLQpiyv50yUQwxyV",
        "name": "宛城区",
        "provinceId": "henan",
        "id": "wanchengqu"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "万全县",
        "provinceId": "hebei",
        "id": "wanquanxian"
    },
    {
        "cityId": "hCPYkqACRIiFlPBbkxZ8jV",
        "name": "万荣县",
        "provinceId": "shanxi1",
        "id": "wanrongxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "万盛区",
        "provinceId": "chongqing",
        "id": "wanshengqu"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "微山县",
        "provinceId": "shandong",
        "id": "weishanxian"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "渭滨区",
        "provinceId": "shanxi2",
        "id": "weibinqu"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "尉氏县",
        "provinceId": "henan",
        "id": "weishixian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "文圣区",
        "provinceId": "liaoning",
        "id": "wenshengqu"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "乌拉特后旗",
        "provinceId": "neimenggu",
        "id": "wulatehouqi"
    },
    {
        "cityId": "cAg6URukQ3WCr4rK4AnTsV",
        "name": "乌拉特前旗",
        "provinceId": "neimenggu",
        "id": "wulateqianqi"
    },
    {
        "cityId": "fgCYGCEESdBte2WiSUNAUF",
        "name": "吴中区",
        "provinceId": "jiangsu",
        "id": "wuzhongqu"
    },
    {
        "cityId": "Tk1UB4AqTvCRsZOwuNyefV",
        "name": "武陵源区",
        "provinceId": "hunan",
        "id": "wulingyuanqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "五峰土家族自治县",
        "provinceId": "hubei",
        "id": "wufengtujiazuzizhixian"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "五华区",
        "provinceId": "yunnan",
        "id": "wuhuaqu"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "五寨县",
        "provinceId": "shanxi1",
        "id": "wuzhaixian"
    },
    {
        "cityId": "8gpCmFveTdKysLa36r3ErV",
        "name": "西畴县",
        "provinceId": "yunnan",
        "id": "xichouxian"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "西丰县",
        "provinceId": "liaoning",
        "id": "xifengxian"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "西岗区",
        "provinceId": "liaoning",
        "id": "xigangqu"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "西湖区",
        "provinceId": "zhejiang",
        "id": "xihuqu"
    },
    {
        "cityId": "1cAwEZxmR5mSy0fUTsR3Dl",
        "name": "西沙群岛",
        "provinceId": "hainan",
        "id": "xishaqundao"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "锡林浩特市",
        "provinceId": "neimenggu",
        "id": "xilinhaoteshi"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "甘井子区",
        "provinceId": "liaoning",
        "id": "ganjingziqu"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "北戴河区",
        "provinceId": "hebei",
        "id": "beidaihequ"
    },
    {
        "cityId": "kNb36T9zQHSPRMuAekAE2F",
        "name": "长丰县",
        "provinceId": "anhui",
        "id": "changfengxian"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "城固县",
        "provinceId": "shanxi2",
        "id": "chengguxian"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "大兴安岭地区呼中区",
        "provinceId": "heilongjiang",
        "id": "daxinganlingdiquhuzhongqu"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "宁洱哈尼族彝族自治县",
        "provinceId": "yunnan",
        "id": "ningerhanizuyizuzizhixian"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "宁陵县",
        "provinceId": "henan",
        "id": "ninglingxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "广州市",
        "provinceId": "guangdong",
        "id": "guangzhoushi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "桂阳县",
        "provinceId": "hunan",
        "id": "guiyangxian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "黄梅县",
        "provinceId": "hubei",
        "id": "huangmeixian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "嘉祥县",
        "provinceId": "shandong",
        "id": "jiaxiangxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "涧西区",
        "provinceId": "henan",
        "id": "jianxiqu"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "蕉城区",
        "provinceId": "fujian",
        "id": "jiaochengqu"
    },
    {
        "cityId": "aEP8arzxQEG3mjNd1BfU1F",
        "name": "开平市",
        "provinceId": "guangdong",
        "id": "kaipingshi"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "黎城县",
        "provinceId": "shanxi1",
        "id": "lichengxian"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "迁西县",
        "provinceId": "hebei",
        "id": "qianxixian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "仁怀市",
        "provinceId": "guizhou",
        "id": "renhuaishi"
    },
    {
        "cityId": "eSdMZ6KLQmOwmxBpPZocx1",
        "name": "名山县",
        "provinceId": "sichuan",
        "id": "mingshanxian"
    },
    {
        "cityId": "BAj4I5l8QQmcBdABABjXBl",
        "name": "威信县",
        "provinceId": "yunnan",
        "id": "weixinxian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "仲巴县",
        "provinceId": "xizang",
        "id": "zhongbaxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "龙南县",
        "provinceId": "jiangxi",
        "id": "longnanxian"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "麻章区",
        "provinceId": "guangdong",
        "id": "mazhangqu"
    },
    {
        "cityId": "Qb8NyrtZSYmLlJKhLdgFz1",
        "name": "茂南区",
        "provinceId": "guangdong",
        "id": "maonanqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "钦北区",
        "provinceId": "guangxi",
        "id": "qinbeiqu"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "秦皇岛市",
        "provinceId": "hebei",
        "id": "qinhuangdaoshi"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "青山区",
        "provinceId": "neimenggu",
        "id": "qingshanqu"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "清河县",
        "provinceId": "hebei",
        "id": "qinghexian"
    },
    {
        "cityId": "X6Iy9AoTSCKRShptuWA84l",
        "name": "融水苗族自治县",
        "provinceId": "guangxi",
        "id": "rongshuimiaozuzizhixian"
    },
    {
        "cityId": "F4OJ0DDtRyuINwdtPjrMpV",
        "name": "萨嘎县",
        "provinceId": "xizang",
        "id": "sagaxian"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "双江拉祜族佤族布朗族傣族自治县",
        "provinceId": "yunnan",
        "id": "shuangjianglahuzuwazubulangzudaizuzizhixian"
    },
    {
        "cityId": "XL1LC7G0QBy0FcRD8AOngV",
        "name": "松溪县",
        "provinceId": "fujian",
        "id": "songxixian"
    },
    {
        "cityId": "lE56axJ3TKC2W8BjURVAe1",
        "name": "桃山区",
        "provinceId": "heilongjiang",
        "id": "taoshanqu"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "田阳县",
        "provinceId": "guangxi",
        "id": "tianyangxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "潍城区",
        "provinceId": "shandong",
        "id": "weichengqu"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "渭源县",
        "provinceId": "gansu",
        "id": "weiyuanxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "西工区",
        "provinceId": "henan",
        "id": "xigongqu"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "周宁县",
        "provinceId": "fujian",
        "id": "zhouningxian"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "竹山县",
        "provinceId": "hubei",
        "id": "zhushanxian"
    },
    {
        "cityId": "LMrXSgaAThGeHRwyV79fXV",
        "name": "卓资县",
        "provinceId": "neimenggu",
        "id": "zhuozixian"
    },
    {
        "cityId": "4ekeqXM4QuB40OVJzuBCAV",
        "name": "邹城市",
        "provinceId": "shandong",
        "id": "zouchengshi"
    },
    {
        "cityId": "ib716QvfSBa4IRDCAkZ6TF",
        "name": "泗阳县",
        "provinceId": "jiangsu",
        "id": "siyangxian"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "邕宁区",
        "provinceId": "guangxi",
        "id": "yongningqu"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "农安县",
        "provinceId": "jilin",
        "id": "nonganxian"
    },
    {
        "cityId": "cvwjYvPhSrKGnwT9b6zeGl",
        "name": "平利县",
        "provinceId": "shanxi2",
        "id": "pinglixian"
    },
    {
        "cityId": "R41NEg3RT6qzT8dMPSmXDF",
        "name": "札达县",
        "provinceId": "xizang",
        "id": "zhadaxian"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "章丘市",
        "provinceId": "shandong",
        "id": "zhangqiushi"
    },
    {
        "cityId": "iHAV6X69TWWySlQ8SxglX1",
        "name": "彰化县",
        "provinceId": "taiwan",
        "id": "zhanghuaxian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "镇安县",
        "provinceId": "shanxi2",
        "id": "zhenanxian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "镇远县",
        "provinceId": "guizhou",
        "id": "zhenyuanxian"
    },
    {
        "cityId": "7NJtL3VoTPWBt3ScI4ljxV",
        "name": "镇沅彝族哈尼族拉祜族自治县",
        "provinceId": "yunnan",
        "id": "zhenyuanyizuhanizulahuzuzizhixian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "正宁县",
        "provinceId": "gansu",
        "id": "zhengningxian"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "志丹县",
        "provinceId": "shanxi2",
        "id": "zhidanxian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "治多县",
        "provinceId": "qinghai",
        "id": "zhiduoxian"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "中方县",
        "provinceId": "hunan",
        "id": "zhongfangxian"
    },
    {
        "cityId": "35AlZXKAQ7ijgGj3GIwyGl",
        "name": "中宁县",
        "provinceId": "ningxia",
        "id": "zhongningxian"
    },
    {
        "cityId": "tY1IAsDLS7O5166XXxFspV",
        "name": "中山区",
        "provinceId": "liaoning",
        "id": "zhongshanqu"
    },
    {
        "cityId": "TGuf639YSEurha9Hr17L0l",
        "name": "中山市",
        "provinceId": "guangdong",
        "id": "zhongshanshi"
    },
    {
        "cityId": "rswwRd2wSDWRZWtDSShtlV",
        "name": "钟山县",
        "provinceId": "guangxi",
        "id": "zhongshanxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "诸城市",
        "provinceId": "shandong",
        "id": "zhuchengshi"
    },
    {
        "cityId": "ImVfBxCdT66QChcDAKen91",
        "name": "竹溪县",
        "provinceId": "hubei",
        "id": "zhuxixian"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "自流井区",
        "provinceId": "sichuan",
        "id": "ziliujingqu"
    },
    {
        "cityId": "zvr9L34hQAyPtDLKsL5aSl",
        "name": "遵化市",
        "provinceId": "hebei",
        "id": "zunhuashi"
    },
    {
        "cityId": "2tArbt8zTSGI11DFlLmwVl",
        "name": "伽师县",
        "provinceId": "xinjiang",
        "id": "jiashixian"
    },
    {
        "cityId": "H3L2EnG9RjKYuCu8cYt0BV",
        "name": "儋州市",
        "provinceId": "hainan",
        "id": "danzhoushi"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "邳州市",
        "provinceId": "jiangsu",
        "id": "pizhoushi"
    },
    {
        "cityId": "dAQw9pwaRumZYH2QKlHctV",
        "name": "勐腊县",
        "provinceId": "yunnan",
        "id": "menglaxian"
    },
    {
        "cityId": "qZZsxxHTTLmmfu6LUDf7c1",
        "name": "芙蓉区",
        "provinceId": "hunan",
        "id": "furongqu"
    },
    {
        "cityId": "ZZO6BoTsQIOywrL5swLBp1",
        "name": "荥阳市",
        "provinceId": "henan",
        "id": "xingyangshi"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "岐山县",
        "provinceId": "shanxi2",
        "id": "qishanxian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "崂山区",
        "provinceId": "shandong",
        "id": "laoshanqu"
    },
    {
        "cityId": "YSqcZ3boTcefiEaUFAbxrV",
        "name": "沅陵县",
        "provinceId": "hunan",
        "id": "yuanlingxian"
    },
    {
        "cityId": "ib716QvfSBa4IRDCAkZ6TF",
        "name": "沭阳县",
        "provinceId": "jiangsu",
        "id": "shuyangxian"
    },
    {
        "cityId": "L4LXKliRTYOZ3FPvmfayPF",
        "name": "淇县",
        "provinceId": "henan",
        "id": "qixian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "涿鹿县",
        "provinceId": "hebei",
        "id": "zhuoluxian"
    },
    {
        "cityId": "MsynoLvgRoiMxUqlvjndwl",
        "name": "柘荣县",
        "provinceId": "fujian",
        "id": "zherongxian"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "桦川县",
        "provinceId": "heilongjiang",
        "id": "huachuanxian"
    },
    {
        "cityId": "6vIu3KV2RkmJEDNwtiX9hV",
        "name": "砀山县",
        "provinceId": "anhui",
        "id": "dangshanxian"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "颍东区",
        "provinceId": "anhui",
        "id": "yingdongqu"
    },
    {
        "cityId": "A8DkDpZERzq8RnkC6EvTfl",
        "name": "筠连县",
        "provinceId": "sichuan",
        "id": "junlianxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "綦江县",
        "provinceId": "chongqing",
        "id": "qijiangxian"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "新市区",
        "provinceId": "hebei",
        "id": "xinshiqu"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "高碑店市",
        "provinceId": "hebei",
        "id": "gaobeidianshi"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "个旧市",
        "provinceId": "yunnan",
        "id": "gejiushi"
    },
    {
        "cityId": "UFUa2xpERgmtaI1qjBXOTV",
        "name": "宝安区",
        "provinceId": "guangdong",
        "id": "baoanqu"
    },
    {
        "cityId": "Tq9kjGzxRgOnHswnQSBE6l",
        "name": "北关区",
        "provinceId": "henan",
        "id": "beiguanqu"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "潮南区",
        "provinceId": "guangdong",
        "id": "chaonanqu"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "陈巴尔虎旗",
        "provinceId": "neimenggu",
        "id": "chenbaerhuqi"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "大余县",
        "provinceId": "jiangxi",
        "id": "dayuxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "德昌县",
        "provinceId": "sichuan",
        "id": "dechangxian"
    },
    {
        "cityId": "bQIKVB7xTJOAS93FhFKXKl",
        "name": "和布克赛尔蒙古自治县",
        "provinceId": "xinjiang",
        "id": "hebukesaiermengguzizhixian"
    },
    {
        "cityId": "27ZXGtbhTsyUzDkSSAsfql",
        "name": "华县",
        "provinceId": "shanxi2",
        "id": "huaxian"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "尖草坪区",
        "provinceId": "shanxi1",
        "id": "jiancaopingqu"
    },
    {
        "cityId": "1RZYHMuVRn67kqdB4EtXG1",
        "name": "江阳区",
        "provinceId": "sichuan",
        "id": "jiangyangqu"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "历下区",
        "provinceId": "shandong",
        "id": "lixiaqu"
    },
    {
        "cityId": "3VTGDoaaQEKK6qoV8J9p91",
        "name": "龙山区",
        "provinceId": "jilin",
        "id": "longshanqu"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "冕宁县",
        "provinceId": "sichuan",
        "id": "mianningxian"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "牧野区",
        "provinceId": "henan",
        "id": "muyequ"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "清镇市",
        "provinceId": "guizhou",
        "id": "qingzhenshi"
    },
    {
        "cityId": "cG86JYq6TsOk11vUydFk8V",
        "name": "山阴县",
        "provinceId": "shanxi1",
        "id": "shanyinxian"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "绥滨县",
        "provinceId": "heilongjiang",
        "id": "suibinxian"
    },
    {
        "cityId": "5fwU4TARQ2Chx9G8Z1NsdF",
        "name": "同德县",
        "provinceId": "qinghai",
        "id": "tongdexian"
    },
    {
        "cityId": "J9HyGz2nSD6f15HKnuVyDF",
        "name": "乌当区",
        "provinceId": "guizhou",
        "id": "wudangqu"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "乌伊岭区",
        "provinceId": "heilongjiang",
        "id": "wuyilingqu"
    },
    {
        "cityId": "SF0dLhAvSges9lw2aYUQ6F",
        "name": "吴起县",
        "provinceId": "shanxi2",
        "id": "wuqixian"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "湘东区",
        "provinceId": "jiangxi",
        "id": "xiangdongqu"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "象州县",
        "provinceId": "guangxi",
        "id": "xiangzhouxian"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "宜阳县",
        "provinceId": "henan",
        "id": "yiyangxian"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "泽州县",
        "provinceId": "shanxi1",
        "id": "zezhouxian"
    },
    {
        "cityId": "qHWiTAGhToCc8S1SYvnM6V",
        "name": "扎赉特旗",
        "provinceId": "neimenggu",
        "id": "zhalaiteqi"
    },
    {
        "cityId": "U2fzxZ4gTIqmfAyDz769cV",
        "name": "东兴市",
        "provinceId": "guangxi",
        "id": "dongxingshi"
    },
    {
        "cityId": "sc1Ao1EYRMmTrbgsxyheGV",
        "name": "二连浩特市",
        "provinceId": "neimenggu",
        "id": "erlianhaoteshi"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "浮山县",
        "provinceId": "shanxi1",
        "id": "fushanxian"
    },
    {
        "cityId": "24OAmYjuRRW48pZAVKZ3rV",
        "name": "吉安县",
        "provinceId": "jiangxi",
        "id": "jianxian"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "集美区",
        "provinceId": "fujian",
        "id": "jimeiqu"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "即墨市",
        "provinceId": "shandong",
        "id": "jimoshi"
    },
    {
        "cityId": "8icZNYO1QAev2J1oMcraGl",
        "name": "济阳县",
        "provinceId": "shandong",
        "id": "jiyangxian"
    },
    {
        "cityId": "0uzldFAERWKxrsxhBXyPKV",
        "name": "嘉峪关市",
        "provinceId": "gansu",
        "id": "jiayuguanshi"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "江北区",
        "provinceId": "zhejiang",
        "id": "jiangbeiqu"
    },
    {
        "cityId": "3ujjIpxUTN6BUFjKsME3Ml",
        "name": "江永县",
        "provinceId": "hunan",
        "id": "jiangyongxian"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "胶南市",
        "provinceId": "shandong",
        "id": "jiaonanshi"
    },
    {
        "cityId": "jwjqAEXkQdqEeAh1fJGURV",
        "name": "郊区",
        "provinceId": "anhui",
        "id": "jiaoqu"
    },
    {
        "cityId": "CPxaQseqRtKnBX8fWq2z3F",
        "name": "郊区",
        "provinceId": "shanxi1",
        "id": "jiaoqu"
    },
    {
        "cityId": "byUugnyxRMWVVlwy4YwqUV",
        "name": "解放区",
        "provinceId": "henan",
        "id": "jiefangqu"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "金坛市",
        "provinceId": "jiangsu",
        "id": "jintanshi"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "金阳县",
        "provinceId": "sichuan",
        "id": "jinyangxian"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "金寨县",
        "provinceId": "anhui",
        "id": "jinzhaixian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "津南区",
        "provinceId": "tianjin",
        "id": "jinnanqu"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "开江县",
        "provinceId": "sichuan",
        "id": "kaijiangxian"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "康县",
        "provinceId": "gansu",
        "id": "kangxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "克东县",
        "provinceId": "heilongjiang",
        "id": "kedongxian"
    },
    {
        "cityId": "28T4lYR8SNmZBYsCCuH9cl",
        "name": "克山县",
        "provinceId": "heilongjiang",
        "id": "keshanxian"
    },
    {
        "cityId": "ml32yqtISAOzqV45JLmKkF",
        "name": "奎文区",
        "provinceId": "shandong",
        "id": "kuiwenqu"
    },
    {
        "cityId": "wp22ZEzyQ1yo5MkukFCWMF",
        "name": "莱阳市",
        "provinceId": "shandong",
        "id": "laiyangshi"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "兰考县",
        "provinceId": "henan",
        "id": "lankaoxian"
    },
    {
        "cityId": "QTggD1EVS5u7EYTZMkmZiF",
        "name": "兰州市",
        "provinceId": "gansu",
        "id": "lanzhoushi"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "琅琊区",
        "provinceId": "anhui",
        "id": "langyaqu"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "老城区",
        "provinceId": "henan",
        "id": "laochengqu"
    },
    {
        "cityId": "QsOAp3AtQlyLAHEL1MJ2Bl",
        "name": "乐平市",
        "provinceId": "jiangxi",
        "id": "lepingshi"
    },
    {
        "cityId": "TgbkJY6qQQGfzx17k1MxKF",
        "name": "乐清市",
        "provinceId": "zhejiang",
        "id": "leqingshi"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "乐业县",
        "provinceId": "guangxi",
        "id": "leyexian"
    },
    {
        "cityId": "lBp7lb40QLiAB78ENiu4w1",
        "name": "乐至县",
        "provinceId": "sichuan",
        "id": "lezhixian"
    },
    {
        "cityId": "sVuEAYA0RzBWwGYBg2PrzV",
        "name": "莲花县",
        "provinceId": "jiangxi",
        "id": "lianhuaxian"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "连城县",
        "provinceId": "fujian",
        "id": "lianchengxian"
    },
    {
        "cityId": "3Kw7SNqMSK2QNlxk2MsAAl",
        "name": "梁河县",
        "provinceId": "yunnan",
        "id": "lianghexian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "梁平县",
        "provinceId": "chongqing",
        "id": "liangpingxian"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "临武县",
        "provinceId": "hunan",
        "id": "linwuxian"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "临西县",
        "provinceId": "hebei",
        "id": "linxixian"
    },
    {
        "cityId": "y7Chz2tIQMu3CQN5gPD3vF",
        "name": "灯塔市",
        "provinceId": "liaoning",
        "id": "dengtashi"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "滴道区",
        "provinceId": "heilongjiang",
        "id": "didaoqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "垫江县",
        "provinceId": "chongqing",
        "id": "dianjiangxian"
    },
    {
        "cityId": "2Q5vaBzoS7GUAb7hllE1SV",
        "name": "定远县",
        "provinceId": "anhui",
        "id": "dingyuanxian"
    },
    {
        "cityId": "9BU7lRKcRsBkx6mNARBsdF",
        "name": "东安区",
        "provinceId": "heilongjiang",
        "id": "donganqu"
    },
    {
        "cityId": "pzyDfLLvRW623comq63RsV",
        "name": "东宝区",
        "provinceId": "hubei",
        "id": "dongbaoqu"
    },
    {
        "cityId": "mjsuSJi3TqqyAqhMrAR5M1",
        "name": "东川区",
        "provinceId": "yunnan",
        "id": "dongchuanqu"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "东平县",
        "provinceId": "shandong",
        "id": "dongpingxian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "东胜区",
        "provinceId": "neimenggu",
        "id": "dongshengqu"
    },
    {
        "cityId": "K3HOS3CQQ32bG44VK7UVKl",
        "name": "东乡县",
        "provinceId": "jiangxi",
        "id": "dongxiangxian"
    },
    {
        "cityId": "PPAnTn3AQ76mm0lPJWuv6l",
        "name": "斗门区",
        "provinceId": "guangdong",
        "id": "doumenqu"
    },
    {
        "cityId": "hpGZ8VqLQ6q4MTz6S4Xlzl",
        "name": "恩施市",
        "provinceId": "hubei",
        "id": "enshishi"
    },
    {
        "cityId": "w6IyRb8dTPWAKWQX1DQ6Z1",
        "name": "繁昌县",
        "provinceId": "anhui",
        "id": "fanchangxian"
    },
    {
        "cityId": "PQoaB9ULTVqglp2Lhqkbr1",
        "name": "肥城市",
        "provinceId": "shandong",
        "id": "feichengshi"
    },
    {
        "cityId": "vyzmxosJRAqS4f53uB6ep1",
        "name": "丰顺县",
        "provinceId": "guangdong",
        "id": "fengshunxian"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "奉新县",
        "provinceId": "jiangxi",
        "id": "fengxinxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "涪城区",
        "provinceId": "sichuan",
        "id": "fuchengqu"
    },
    {
        "cityId": "pCsBAZ3cTBqcupy8ctIpVF",
        "name": "抚宁县",
        "provinceId": "hebei",
        "id": "funingxian"
    },
    {
        "cityId": "qB8SbIp6QNOpraCMUfI0x1",
        "name": "阜南县",
        "provinceId": "anhui",
        "id": "funanxian"
    },
    {
        "cityId": "J3LXgu61SAix3mINBLIKl1",
        "name": "富锦市",
        "provinceId": "heilongjiang",
        "id": "fujinshi"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "甘孜县",
        "provinceId": "sichuan",
        "id": "ganzixian"
    },
    {
        "cityId": "PxflkbAaQQWQ8BLKk1pJ01",
        "name": "钢城区",
        "provinceId": "shandong",
        "id": "gangchengqu"
    },
    {
        "cityId": "uHHyd6FpSuuyDBlnc1z6vF",
        "name": "高陵县",
        "provinceId": "shanxi2",
        "id": "gaolingxian"
    },
    {
        "cityId": "A1ZrUmaVSze8xYoiidNo0V",
        "name": "高明区",
        "provinceId": "guangdong",
        "id": "gaomingqu"
    },
    {
        "cityId": "C5sfzgOPRKy7X1xrRO7uBF",
        "name": "猇亭区",
        "provinceId": "hubei",
        "id": "tingqu"
    },
    {
        "cityId": "SwentZd6RBeU78iyNd5921",
        "name": "阿克陶县",
        "provinceId": "xinjiang",
        "id": "aketaoxian"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "阿瓦提县",
        "provinceId": "xinjiang",
        "id": "awatixian"
    },
    {
        "cityId": "6ICLFUIqQKO0P1GJLBzRHF",
        "name": "安陆市",
        "provinceId": "hubei",
        "id": "anlushi"
    },
    {
        "cityId": "SknXVAXvRo2Urf7R0VMBtV",
        "name": "安图县",
        "provinceId": "jilin",
        "id": "antuxian"
    },
    {
        "cityId": "YjGioDkRTd6gUvABloBbD1",
        "name": "安泽县",
        "provinceId": "shanxi1",
        "id": "anzexian"
    },
    {
        "cityId": "1n4xeYsISluBm6Tbu0zAsl",
        "name": "八公山区",
        "provinceId": "anhui",
        "id": "bagongshanqu"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "班戈县",
        "provinceId": "xizang",
        "id": "bangexian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "保靖县",
        "provinceId": "hunan",
        "id": "baojingxian"
    },
    {
        "cityId": "dUULyBxNRf6nd1yiBlnYrl",
        "name": "北川羌族自治县",
        "provinceId": "sichuan",
        "id": "beichuanqiangzuzizhixian"
    },
    {
        "cityId": "Y5dNnqC4Sm2vnm6omtyCZl",
        "name": "边坝县",
        "provinceId": "xizang",
        "id": "bianbaxian"
    },
    {
        "cityId": "HQL2kvvyQPiKTzFkL14fZF",
        "name": "滨江区",
        "provinceId": "zhejiang",
        "id": "binjiangqu"
    },
    {
        "cityId": "HNNAWbhDT1SjB4ywB4BJuF",
        "name": "博罗县",
        "provinceId": "guangdong",
        "id": "boluoxian"
    },
    {
        "cityId": "EntGxGbhSYC0LP9RAx4fu1",
        "name": "布尔津县",
        "provinceId": "xinjiang",
        "id": "buerjinxian"
    },
    {
        "cityId": "d32W1VEvS4GuFUhrEJ51EV",
        "name": "沧源佤族自治县",
        "provinceId": "yunnan",
        "id": "cangyuanwazuzizhixian"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "察隅县",
        "provinceId": "xizang",
        "id": "chayuxian"
    },
    {
        "cityId": "IrdbQxkkQAKPwOK9mdtYol",
        "name": "长葛市",
        "provinceId": "henan",
        "id": "changgeshi"
    },
    {
        "cityId": "dl43y3y4RX6jjhUgI61vB1",
        "name": "长汀县",
        "provinceId": "fujian",
        "id": "changtingxian"
    },
    {
        "cityId": "BmhW0wAmRrqp0R3KHc5JPF",
        "name": "长兴县",
        "provinceId": "zhejiang",
        "id": "changxingxian"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "长垣县",
        "provinceId": "henan",
        "id": "changyuanxian"
    },
    {
        "cityId": "k7lIOhoSS4S8WgrYzFYG4l",
        "name": "潮阳区",
        "provinceId": "guangdong",
        "id": "chaoyangqu"
    },
    {
        "cityId": "a5xyFiH9TymKqwzoLdde3F",
        "name": "城西区",
        "provinceId": "qinghai",
        "id": "chengxiqu"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "城子河区",
        "provinceId": "heilongjiang",
        "id": "chengzihequ"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "承德县",
        "provinceId": "hebei",
        "id": "chengdexian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "达尔罕茂明安联合旗",
        "provinceId": "neimenggu",
        "id": "daerhanmaominganlianheqi"
    },
    {
        "cityId": "8oT6fIqBQ4OJB8Muky5Nu1",
        "name": "达县",
        "provinceId": "sichuan",
        "id": "daxian"
    },
    {
        "cityId": "AfrQiip4QkSoSCWxcppKnF",
        "name": "大田县",
        "provinceId": "fujian",
        "id": "datianxian"
    },
    {
        "cityId": "rMN6FeShQQuBqTmClExyIF",
        "name": "大新县",
        "provinceId": "guangxi",
        "id": "daxinxian"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "大兴安岭地区加格达奇区",
        "provinceId": "heilongjiang",
        "id": "daxinganlingdiqujiagedaqiqu"
    },
    {
        "cityId": "rMAnzsDQTbqnUH9sBCT7r1",
        "name": "大英县",
        "provinceId": "sichuan",
        "id": "dayingxian"
    },
    {
        "cityId": "T9BHPbCEQqe1ZzrdMRwv7V",
        "name": "丹凤县",
        "provinceId": "shanxi2",
        "id": "danfengxian"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "当雄县",
        "provinceId": "xizang",
        "id": "dangxiongxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "德惠市",
        "provinceId": "jilin",
        "id": "dehuishi"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "南川区",
        "provinceId": "chongqing",
        "id": "nanchuanqu"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "南湖区",
        "provinceId": "zhejiang",
        "id": "nanhuqu"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "南涧彝族自治县",
        "provinceId": "yunnan",
        "id": "nanjianyizuzizhixian"
    },
    {
        "cityId": "BHzC8cI3ShBae0kMjRGTAl",
        "name": "南江县",
        "provinceId": "sichuan",
        "id": "nanjiangxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "南康市",
        "provinceId": "jiangxi",
        "id": "nankangshi"
    },
    {
        "cityId": "pfVBDMXSS4yDZqdmZlO6xl",
        "name": "南市区",
        "provinceId": "hebei",
        "id": "nanshiqu"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "南通市",
        "provinceId": "jiangsu",
        "id": "nantongshi"
    },
    {
        "cityId": "aw3zsPJAThqCaasxTwYABF",
        "name": "尼木县",
        "provinceId": "xizang",
        "id": "nimuxian"
    },
    {
        "cityId": "MT8U3gcKTyunhJIiajjdz1",
        "name": "宁国市",
        "provinceId": "anhui",
        "id": "ningguoshi"
    },
    {
        "cityId": "EypWQsI9RZBBWoH9gCfDAV",
        "name": "宁强县",
        "provinceId": "shanxi2",
        "id": "ningqiangxian"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "宁武县",
        "provinceId": "shanxi1",
        "id": "ningwuxian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "磐石市",
        "provinceId": "jilin",
        "id": "panshishi"
    },
    {
        "cityId": "jx55ydxfQKmNqB4ADMsaeF",
        "name": "平川区",
        "provinceId": "gansu",
        "id": "pingchuanqu"
    },
    {
        "cityId": "wCnfQOxOSPSaoDFePuzkDF",
        "name": "平湖市",
        "provinceId": "zhejiang",
        "id": "pinghushi"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "古丈县",
        "provinceId": "hunan",
        "id": "guzhangxian"
    },
    {
        "cityId": "kj38GTK8SbqExSdDWj0AUF",
        "name": "固阳县",
        "provinceId": "neimenggu",
        "id": "guyangxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "贵定县",
        "provinceId": "guizhou",
        "id": "guidingxian"
    },
    {
        "cityId": "AAHMSGjwSASpLXvLgjdLAF",
        "name": "海安县",
        "provinceId": "jiangsu",
        "id": "haianxian"
    },
    {
        "cityId": "GAF2VmxnRD2aYBy476EMlF",
        "name": "海陵区",
        "provinceId": "jiangsu",
        "id": "hailingqu"
    },
    {
        "cityId": "BRQEG3qjRxa6cmAbIzoqV1",
        "name": "含山县",
        "provinceId": "anhui",
        "id": "hanshanxian"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "合川区",
        "provinceId": "chongqing",
        "id": "hechuanqu"
    },
    {
        "cityId": "EwCUBDHnTH2S4usWvzmIO1",
        "name": "合浦县",
        "provinceId": "guangxi",
        "id": "hepuxian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "河东区",
        "provinceId": "tianjin",
        "id": "hedongqu"
    },
    {
        "cityId": "N3NIrMZGQLeNBfdY9A709V",
        "name": "河曲县",
        "provinceId": "shanxi1",
        "id": "hequxian"
    },
    {
        "cityId": "Y6fl4rWaQtyw1b9en2YNLl",
        "name": "红山区",
        "provinceId": "neimenggu",
        "id": "hongshanqu"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "湖里区",
        "provinceId": "fujian",
        "id": "huliqu"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "虎林市",
        "provinceId": "heilongjiang",
        "id": "hulinshi"
    },
    {
        "cityId": "M8oj7jlkQOq7LU7yZNBSk1",
        "name": "华亭县",
        "provinceId": "gansu",
        "id": "huatingxian"
    },
    {
        "cityId": "4YE91XXHTYyMcvPs3bkzkF",
        "name": "黄埔区",
        "provinceId": "guangdong",
        "id": "huangpuqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "获嘉县",
        "provinceId": "henan",
        "id": "huojiaxian"
    },
    {
        "cityId": "3TcAluBASIibs7Le2LToUV",
        "name": "下陆区",
        "provinceId": "hubei",
        "id": "xialuqu"
    },
    {
        "cityId": "7OJTjawIRUKCizYy2xp2UF",
        "name": "夏邑县",
        "provinceId": "henan",
        "id": "xiayixian"
    },
    {
        "cityId": "ChvJPBZtTXySUcBJwktP0F",
        "name": "仙游县",
        "provinceId": "fujian",
        "id": "xianyouxian"
    },
    {
        "cityId": "obEnAt4WThiKceSx3hBz6V",
        "name": "湘乡市",
        "provinceId": "hunan",
        "id": "xiangxiangshi"
    },
    {
        "cityId": "6vIu3KV2RkmJEDNwtiX9hV",
        "name": "萧县",
        "provinceId": "anhui",
        "id": "xiaoxian"
    },
    {
        "cityId": "hIAQGfE3RzufsAwYmCCjVl",
        "name": "小店区",
        "provinceId": "shanxi1",
        "id": "xiaodianqu"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "桦甸市",
        "provinceId": "jilin",
        "id": "huadianshi"
    },
    {
        "cityId": "A7lmXA7RT1qZ4URpIGkbzl",
        "name": "东海县",
        "provinceId": "jiangsu",
        "id": "donghaixian"
    },
    {
        "cityId": "50UCMLklQk20BrhS3G9nb1",
        "name": "东至县",
        "provinceId": "anhui",
        "id": "dongzhixian"
    },
    {
        "cityId": "TCeTeTU9Rla5AvhSku4uT1",
        "name": "霸州市",
        "provinceId": "hebei",
        "id": "bazhoushi"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "宾阳县",
        "provinceId": "guangxi",
        "id": "binyangxian"
    },
    {
        "cityId": "NffjLTMhQWahj4OqaTbNT1",
        "name": "大安区",
        "provinceId": "sichuan",
        "id": "daanqu"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "尼勒克县",
        "provinceId": "xinjiang",
        "id": "nilekexian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "广丰县",
        "provinceId": "jiangxi",
        "id": "guangfengxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "金堂县",
        "provinceId": "sichuan",
        "id": "jintangxian"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "莲都区",
        "provinceId": "zhejiang",
        "id": "lianduqu"
    },
    {
        "cityId": "fPBc9tidT8C9E2034eG07V",
        "name": "庐山区",
        "provinceId": "jiangxi",
        "id": "lushanqu"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "盐源县",
        "provinceId": "sichuan",
        "id": "yanyuanxian"
    },
    {
        "cityId": "KFXHBEwMSBqWU3Ge9vskIl",
        "name": "阳城县",
        "provinceId": "shanxi1",
        "id": "yangchengxian"
    },
    {
        "cityId": "IvGrAwIBRIChCR6sokcHyl",
        "name": "阳山县",
        "provinceId": "guangdong",
        "id": "yangshanxian"
    },
    {
        "cityId": "kBlPmPGiTGuWHIwGpB4to1",
        "name": "伊金霍洛旗",
        "provinceId": "neimenggu",
        "id": "yijinhuoluoqi"
    },
    {
        "cityId": "yBBgceGBQMmCPBLkj8QKx1",
        "name": "仪征市",
        "provinceId": "jiangsu",
        "id": "yizhengshi"
    },
    {
        "cityId": "jeDy7VpTQVqkmrrsCmy5GF",
        "name": "沂南县",
        "provinceId": "shandong",
        "id": "yinanxian"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "宜章县",
        "provinceId": "hunan",
        "id": "yizhangxian"
    },
    {
        "cityId": "FOttci5fTpm8Rw5K0xmBD1",
        "name": "永吉县",
        "provinceId": "jilin",
        "id": "yongjixian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "永仁县",
        "provinceId": "yunnan",
        "id": "yongrenxian"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "永兴县",
        "provinceId": "hunan",
        "id": "yongxingxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "榆树市",
        "provinceId": "jilin",
        "id": "yushushi"
    },
    {
        "cityId": "Iv4gXPOvSMmigNrEclsm9F",
        "name": "余江县",
        "provinceId": "jiangxi",
        "id": "yujiangxian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "余庆县",
        "provinceId": "guizhou",
        "id": "yuqingxian"
    },
    {
        "cityId": "AS6BjjieQRSSsdLsjG1Kgl",
        "name": "余姚市",
        "provinceId": "zhejiang",
        "id": "yuyaoshi"
    },
    {
        "cityId": "A5vyLFKpR6iqAM9z6kwqPV",
        "name": "禹王台区",
        "provinceId": "henan",
        "id": "yuwangtaiqu"
    },
    {
        "cityId": "njkAG5IDSbOzpaNvz8yWTl",
        "name": "玉屏侗族自治县",
        "provinceId": "guizhou",
        "id": "yupingdongzuzizhixian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "玉树县",
        "provinceId": "qinghai",
        "id": "yushuxian"
    },
    {
        "cityId": "W05E7DMrQNmXCeaMm59RFV",
        "name": "裕安区",
        "provinceId": "anhui",
        "id": "yuanqu"
    },
    {
        "cityId": "gOy9XLexTCCgF0PbViIx0F",
        "name": "云城区",
        "provinceId": "guangdong",
        "id": "yunchengqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "云阳县",
        "provinceId": "chongqing",
        "id": "yunyangxian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "杂多县",
        "provinceId": "qinghai",
        "id": "zaduoxian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "凌云县",
        "provinceId": "guangxi",
        "id": "lingyunxian"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "灵石县",
        "provinceId": "shanxi1",
        "id": "lingshixian"
    },
    {
        "cityId": "Wj0ZhoBFQV2H2ZsJCLlAdF",
        "name": "龙川县",
        "provinceId": "guangdong",
        "id": "longchuanxian"
    },
    {
        "cityId": "LgxPtlJDRsOELF8nc8EfEl",
        "name": "龙华区",
        "provinceId": "hainan",
        "id": "longhuaqu"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "龙里县",
        "provinceId": "guizhou",
        "id": "longlixian"
    },
    {
        "cityId": "dEsGLUzLSra6BIfUxKKKBV",
        "name": "龙山县",
        "provinceId": "hunan",
        "id": "longshanxian"
    },
    {
        "cityId": "WmPuDBqeQaB4Il8DgYtDr1",
        "name": "龙文区",
        "provinceId": "fujian",
        "id": "longwenqu"
    },
    {
        "cityId": "7gJXLvGRSABkLfRuAHSuXF",
        "name": "隆安县",
        "provinceId": "guangxi",
        "id": "longanxian"
    },
    {
        "cityId": "tMCQRvSHTtS8n9cupl7agl",
        "name": "隆化县",
        "provinceId": "hebei",
        "id": "longhuaxian"
    },
    {
        "cityId": "lrio6w7hTsqoyLy8VSYjBV",
        "name": "陆川县",
        "provinceId": "guangxi",
        "id": "luchuanxian"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "萝北县",
        "provinceId": "heilongjiang",
        "id": "luobeixian"
    },
    {
        "cityId": "OckAmUaaQwuJZBJQFdS8OV",
        "name": "麻城市",
        "provinceId": "hubei",
        "id": "machengshi"
    },
    {
        "cityId": "dfcs5qbnRLGBB3ovNc94Jl",
        "name": "麻山区",
        "provinceId": "heilongjiang",
        "id": "mashanqu"
    },
    {
        "cityId": "uwEoISagSrOiAUuotAiAn1",
        "name": "玛沁县",
        "provinceId": "qinghai",
        "id": "maqinxian"
    },
    {
        "cityId": "JDpwdXIVT1yPuqTBqWKdBF",
        "name": "玛曲县",
        "provinceId": "gansu",
        "id": "maquxian"
    },
    {
        "cityId": "eYvnCSvGSiBe6WnxBXTL4F",
        "name": "满洲里市",
        "provinceId": "neimenggu",
        "id": "manzhoulishi"
    },
    {
        "cityId": "DjpawhJUSLiqJPEnX0nYBV",
        "name": "蒙自县",
        "provinceId": "yunnan",
        "id": "mengzixian"
    },
    {
        "cityId": "ccvxzMeVT9qC5R0RKcINmV",
        "name": "弥渡县",
        "provinceId": "yunnan",
        "id": "miduxian"
    },
    {
        "cityId": "hEPtHDoaQdqluFAWsMw001",
        "name": "米林县",
        "provinceId": "xizang",
        "id": "milinxian"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "米泉市",
        "provinceId": "xinjiang",
        "id": "miquanshi"
    },
    {
        "cityId": "p3Bv66xgQS249PrdvAjmBV",
        "name": "漠河县",
        "provinceId": "heilongjiang",
        "id": "mohexian"
    },
    {
        "cityId": "WywsyCALSdSxB6tAyoEVZV",
        "name": "牟定县",
        "provinceId": "yunnan",
        "id": "moudingxian"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "那曲县",
        "provinceId": "xizang",
        "id": "naquxian"
    },
    {
        "cityId": "X3zjD7METaCjHB1r24SSeF",
        "name": "新北区",
        "provinceId": "jiangsu",
        "id": "xinbeiqu"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "新昌县",
        "provinceId": "zhejiang",
        "id": "xinchangxian"
    },
    {
        "cityId": "uIMcazYzTxeHdTDrBk7ril",
        "name": "新都区",
        "provinceId": "sichuan",
        "id": "xinduqu"
    },
    {
        "cityId": "4Q5qeZM0RTe6xw16ABMuD1",
        "name": "新和县",
        "provinceId": "xinjiang",
        "id": "xinhexian"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "新龙县",
        "provinceId": "sichuan",
        "id": "xinlongxian"
    },
    {
        "cityId": "5P5tr8GrTBK1bylIowlOwF",
        "name": "新青区",
        "provinceId": "heilongjiang",
        "id": "xinqingqu"
    },
    {
        "cityId": "nPIpLHk5RJWHHJrBHIuykV",
        "name": "新沂市",
        "provinceId": "jiangsu",
        "id": "xinyishi"
    },
    {
        "cityId": "oisrBxZGQoaXu9s2vKpsJF",
        "name": "新源县",
        "provinceId": "xinjiang",
        "id": "xinyuanxian"
    },
    {
        "cityId": "uousCrk2RPSSoo3XLhS0BV",
        "name": "兴山区",
        "provinceId": "heilongjiang",
        "id": "xingshanqu"
    },
    {
        "cityId": "w56zI9dNScmVFb93cj4A9F",
        "name": "徐闻县",
        "provinceId": "guangdong",
        "id": "xuwenxian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "宣化区",
        "provinceId": "hebei",
        "id": "xuanhuaqu"
    },
    {
        "cityId": "aWPzXWtBSIyQbzdu1MIdDV",
        "name": "玄武区",
        "provinceId": "jiangsu",
        "id": "xuanwuqu"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "寻乌县",
        "provinceId": "jiangxi",
        "id": "xunwuxian"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "平舆县",
        "provinceId": "henan",
        "id": "pingyuxian"
    },
    {
        "cityId": "cLjmbvsiSpGMWBya00W2CF",
        "name": "信州区",
        "provinceId": "jiangxi",
        "id": "xinzhouqu"
    },
    {
        "cityId": "ifJP0Ai0TpGeUi0xfeKxv1",
        "name": "普陀区",
        "provinceId": "zhejiang",
        "id": "putuoqu"
    },
    {
        "cityId": "UKif7im9RNGInBe0g3Dmg1",
        "name": "浦北县",
        "provinceId": "guangxi",
        "id": "pubeixian"
    },
    {
        "cityId": "96NGQhBVRBe6JPAfACUZ1F",
        "name": "奇台县",
        "provinceId": "xinjiang",
        "id": "qitaixian"
    },
    {
        "cityId": "mqzqtUoETjuNy7Y8sM9YjF",
        "name": "桥东区",
        "provinceId": "hebei",
        "id": "qiaodongqu"
    },
    {
        "cityId": "4nHh5JugSqB6IDyqzqVYrl",
        "name": "青铜峡市",
        "provinceId": "ningxia",
        "id": "qingtongxiashi"
    },
    {
        "cityId": "K92FeAvSTy2U59aCzlEjjV",
        "name": "清水河县",
        "provinceId": "neimenggu",
        "id": "qingshuihexian"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "清水县",
        "provinceId": "gansu",
        "id": "qingshuixian"
    },
    {
        "cityId": "i35uUQtyRv6fBcX1qcldbF",
        "name": "庆城县",
        "provinceId": "gansu",
        "id": "qingchengxian"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "庆元县",
        "provinceId": "zhejiang",
        "id": "qingyuanxian"
    },
    {
        "cityId": "KDqpU54GQMy9qMfGBMzz21",
        "name": "曲麻莱县",
        "provinceId": "qinghai",
        "id": "qumalaixian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "泉州市",
        "provinceId": "fujian",
        "id": "quanzhoushi"
    },
    {
        "cityId": "iKGbyXUvRLeBEwyTIlIhwV",
        "name": "任县",
        "provinceId": "hebei",
        "id": "renxian"
    },
    {
        "cityId": "BwFCz7ULRqBCuEiC3Bofbl",
        "name": "乳山市",
        "provinceId": "shandong",
        "id": "rushanshi"
    },
    {
        "cityId": "0OR3RAgWQnWb1Uq95bWSOV",
        "name": "汝阳县",
        "provinceId": "henan",
        "id": "ruyangxian"
    },
    {
        "cityId": "MnqoMAgpQeCmiKHe23vXlV",
        "name": "瑞金市",
        "provinceId": "jiangxi",
        "id": "ruijinshi"
    },
    {
        "cityId": "GR1MFlWPQbiVAV0AWq9MXl",
        "name": "若羌县",
        "provinceId": "xinjiang",
        "id": "ruoqiangxian"
    },
    {
        "cityId": "JQcQFod1QSSdO9bMRtryOF",
        "name": "三都水族自治县",
        "provinceId": "guizhou",
        "id": "sandushuizuzizhixian"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "山亭区",
        "provinceId": "shandong",
        "id": "shantingqu"
    },
    {
        "cityId": "RBw1assKR8arutdsLGp6RF",
        "name": "上蔡县",
        "provinceId": "henan",
        "id": "shangcaixian"
    },
    {
        "cityId": "FDPH1bbiTVKgYLaBdbjz5l",
        "name": "邵东县",
        "provinceId": "hunan",
        "id": "shaodongxian"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "绍兴市",
        "provinceId": "zhejiang",
        "id": "shaoxingshi"
    },
    {
        "cityId": "EIvPqKbATiBBJafF7V0p9V",
        "name": "绍兴县",
        "provinceId": "zhejiang",
        "id": "shaoxingxian"
    },
    {
        "cityId": "AOdoBgSQTp6GKcd45CO5iF",
        "name": "申扎县",
        "provinceId": "xizang",
        "id": "shenzhaxian"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "神木县",
        "provinceId": "shanxi2",
        "id": "shenmuxian"
    },
    {
        "cityId": "3QvsGIeUQRCNvoABA9tPAF",
        "name": "师宗县",
        "provinceId": "yunnan",
        "id": "shizongxian"
    },
    {
        "cityId": "34OIgwojRIyEpkfAlCVoXF",
        "name": "施秉县",
        "provinceId": "guizhou",
        "id": "shibingxian"
    },
    {
        "cityId": "zu313KWATnOWZ2DaurStBF",
        "name": "石鼓区",
        "provinceId": "hunan",
        "id": "shiguqu"
    },
    {
        "cityId": "NwvrQuLlRzWv5h7wCjKTp1",
        "name": "石渠县",
        "provinceId": "sichuan",
        "id": "shiquxian"
    },
    {
        "cityId": "7vqG01JzTRuC5awk5nuqAl",
        "name": "石狮市",
        "provinceId": "fujian",
        "id": "shishishi"
    },
    {
        "cityId": "S6037PkXT1BBG47fVpJlNl",
        "name": "市北区",
        "provinceId": "shandong",
        "id": "shibeiqu"
    },
    {
        "cityId": "nsbf5TURSWuJ2zCBxE80oV",
        "name": "双峰县",
        "provinceId": "hunan",
        "id": "shuangfengxian"
    },
    {
        "cityId": "E4q3lD4JSEy6p1URH36T6F",
        "name": "双阳区",
        "provinceId": "jilin",
        "id": "shuangyangqu"
    },
    {
        "cityId": "6o5zYebaQMqH6MUkjcgAeF",
        "name": "思明区",
        "provinceId": "fujian",
        "id": "simingqu"
    },
    {
        "cityId": "tgVAVrDMQmBcjQ4q7iLeHF",
        "name": "松阳县",
        "provinceId": "zhejiang",
        "id": "songyangxian"
    },
    {
        "cityId": "NezJrMtGSF2eBAhTXU5Atl",
        "name": "松原市",
        "provinceId": "jilin",
        "id": "songyuanshi"
    },
    {
        "cityId": "a03KwWMyRBSNFyUnBJfnUF",
        "name": "苏仙区",
        "provinceId": "hunan",
        "id": "suxianqu"
    },
    {
        "cityId": "dN3aFk4tSq61fMlTMWldcF",
        "name": "绥德县",
        "provinceId": "shanxi2",
        "id": "suidexian"
    },
    {
        "cityId": "QKXZ2pGnSBWdNpyg2QzJGF",
        "name": "绥中县",
        "provinceId": "liaoning",
        "id": "suizhongxian"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "台安县",
        "provinceId": "liaoning",
        "id": "taianxian"
    },
    {
        "cityId": "sEGLTzhCTYBvPe1UT6c0R1",
        "name": "台儿庄区",
        "provinceId": "shandong",
        "id": "taierzhuangqu"
    },
    {
        "cityId": "c0YoZBy8QFeh9DpqqK4HRV",
        "name": "太白县",
        "provinceId": "shanxi2",
        "id": "taibaixian"
    },
    {
        "cityId": "AGAQcq3gQMqZJMkFlgjBm1",
        "name": "天元区",
        "provinceId": "hunan",
        "id": "tianyuanqu"
    },
    {
        "cityId": "9HXUnAfnRqexzOSNtBRw8V",
        "name": "天镇县",
        "provinceId": "shanxi1",
        "id": "tianzhenxian"
    },
    {
        "cityId": "jSuSh4LBQBu7qZkvnAzKwl",
        "name": "田林县",
        "provinceId": "guangxi",
        "id": "tianlinxian"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "铁东区",
        "provinceId": "liaoning",
        "id": "tiedongqu"
    },
    {
        "cityId": "yCUSNlBATOO6BpSaYcqSzV",
        "name": "铁岭县",
        "provinceId": "liaoning",
        "id": "tielingxian"
    },
    {
        "cityId": "l48offAsSyC8iAdGkqKuj1",
        "name": "铁西区",
        "provinceId": "liaoning",
        "id": "tiexiqu"
    },
    {
        "cityId": "naEoZ2XdTnyS2eLdAh0xKF",
        "name": "通渭县",
        "provinceId": "gansu",
        "id": "tongweixian"
    },
    {
        "cityId": "EnKWQIIDQSuqb94JBnAOG1",
        "name": "通榆县",
        "provinceId": "jilin",
        "id": "tongyuxian"
    },
    {
        "cityId": "jI37MKrmTzanEJMGBiZJZF",
        "name": "桐梓县",
        "provinceId": "guizhou",
        "id": "tongzixian"
    },
    {
        "cityId": "zC3zA3APRsabdm7lkhllnV",
        "name": "吐鲁番市",
        "provinceId": "xinjiang",
        "id": "tulufanshi"
    },
    {
        "cityId": "A5m0Tlh3TOaKBODFRg0WM1",
        "name": "万载县",
        "provinceId": "jiangxi",
        "id": "wanzaixian"
    },
    {
        "cityId": "hUfHtzpXQdSU7XZRQJyRsV",
        "name": "望花区",
        "provinceId": "liaoning",
        "id": "wanghuaqu"
    },
    {
        "cityId": "Axmd5hINReyPfKHFESzrb1",
        "name": "卫滨区",
        "provinceId": "henan",
        "id": "weibinqu"
    },
    {
        "cityId": "qqaXeuzHTxyrLTQtGA6Ezl",
        "name": "巫溪县",
        "provinceId": "chongqing",
        "id": "wuxixian"
    },
    {
        "cityId": "0uG8VaWFQRK5sRh7xY0PVV",
        "name": "武都区",
        "provinceId": "gansu",
        "id": "wuduqu"
    },
    {
        "cityId": "wk9pVPAqTpyodRWvsUcSTV",
        "name": "武功县",
        "provinceId": "shanxi2",
        "id": "wugongxian"
    },
    {
        "cityId": "DxfSCBXdShyefl9L5QDUyF",
        "name": "武山县",
        "provinceId": "gansu",
        "id": "wushanxian"
    },
    {
        "cityId": "cF71GRkwRlaH99fDDyKSNl",
        "name": "武宣县",
        "provinceId": "guangxi",
        "id": "wuxuanxian"
    },
    {
        "cityId": "62BC1RhISA26JNdY5OecEF",
        "name": "武邑县",
        "provinceId": "hebei",
        "id": "wuyixian"
    },
    {
        "cityId": "uiqgEsO2T2uczD28qFJBSF",
        "name": "五通桥区",
        "provinceId": "sichuan",
        "id": "wutongqiaoqu"
    },
    {
        "cityId": "bBgOCmPGRgKJ2GFP4NCqyV",
        "name": "昔阳县",
        "provinceId": "shanxi1",
        "id": "xiyangxian"
    },
    {
        "cityId": "7aMwhXomT3GqRKNxI4IDO1",
        "name": "西昌市",
        "provinceId": "sichuan",
        "id": "xichangshi"
    },
    {
        "cityId": "xFEk36jYRuWwRknzZfEnUV",
        "name": "西吉县",
        "provinceId": "ningxia",
        "id": "xijixian"
    },
    {
        "cityId": "xSRnHPR9Q42VL0bHzTFhCF",
        "name": "西青区",
        "provinceId": "tianjin",
        "id": "xiqingqu",
    }];
    $.each(allCounty, function () {
        var countyArr = allCountyMap.get(this.cityId);
        if (!countyArr) {
            countyArr = [];
        }
        countyArr.push({
            "id": this.id,
            "name": this.name
        });
        allCountyMap.put(this.cityId, countyArr);
    });
}

function Map() {
    this.container = {};
}
Map.prototype.put = function (key, value) {
    try {
        if (key != null && key != "") this.container[key] = value;
    } catch (e) {
        return e;
    }
};
Map.prototype.get = function (key) {
    try {
        return this.container[key];
    } catch (e) {
        return e;
    }
};
Map.prototype.containsKey = function (key) {
    try {
        for (var p in this.container) {
            if (p == key) return true;
        }
        return false;
    } catch (e) {
        return e;
    }
}
Map.prototype.containsValue = function (value) {
    try {
        for (var p in this.container) {
            if (this.container[p] === value) return true;
        }
        return false;
    } catch (e) {
        return e;
    }
};
Map.prototype.remove = function (key) {
    try {
        delete this.container[key];
    } catch (e) {
        return e;
    }
};
Map.prototype.clear = function () {
    try {
        delete this.container;
        this.container = {};
    } catch (e) {
        return e;
    }
};
Map.prototype.isEmpty = function () {
    if (this.keyArray().length == 0) return true;
    else return false;
};
Map.prototype.size = function () {
    return this.keyArray().length;
}
Map.prototype.keyArray = function () {
    var keys = new Array();
    for (var p in this.container) {
        keys.push(p);
    }
    return keys;
}
Map.prototype.valueArray = function () {
    var values = new Array();
    var keys = this.keyArray();
    for (var i = 0; i < keys.length; i++) {
        values.push(this.container[keys[i]]);
    }
    return values;
}