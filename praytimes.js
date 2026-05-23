/*
 * PrayTimes.js - مكتبة حساب مواقيت الصلاة
 * مبنية على خوارزمية PrayTimes.org مع تعديلات لطريقة أم القرى
 * 
 * الإحداثيات الافتراضية: منى / مكة المكرمة
 * خط العرض: 21.4125° شمالاً
 * خط الطول: 39.8943° شرقاً
 * المنطقة الزمنية: +3 (توقيت مكة المكرمة)
 */

var PrayTimes = (function() {
    'use strict';

    // ---- إعدادات الحساب ----
    var
        // طريقة أم القرى (Umm al-Qura)
        // الفجر: 18.5 درجة | العشاء: 90 دقيقة بعد المغرب (في رمضان 120 دقيقة)
        settings = {
            imsak    : {degree: 18.5, minutes: null},
            fajr     : {degree: 18.5, minutes: null},
            sunrise  : {degree: 0.833, minutes: null},
            dhuhr    : {degree: null, minutes: 0},
            asr      : {factor: 1}, // المذهب الشافعي (ظل المثل)
            maghrib  : {degree: 0.833, minutes: null},
            isha     : {degree: null, minutes: 90},
            midnight : 'Standard'
        },

        // إعدادات الموقع الافتراضي (منى - مكة المكرمة)
        lat = 21.4125,
        lng = 39.8943,
        timezone = 3,
        elv = 300, // الارتفاع بالمتر

        // ثوابت
        DEG = Math.PI / 180,
        RAD = 180 / Math.PI;

    // ---- دوال رياضية فلكية ----

    function sin(d) { return Math.sin(d * DEG); }
    function cos(d) { return Math.cos(d * DEG); }
    function tan(d) { return Math.tan(d * DEG); }
    function arcsin(x) { return RAD * Math.asin(x); }
    function arccos(x) { return RAD * Math.acos(x); }
    function arctan(x) { return RAD * Math.atan(x); }
    function arccot(x) { return RAD * Math.atan(1/x); }
    function arctan2(y, x) { return RAD * Math.atan2(y, x); }
    function fix(a, b) { a = a - b * Math.floor(a / b); return (a < 0) ? a + b : a; }
    function fixAngle(a) { return fix(a, 360); }
    function fixHour(a) { return fix(a, 24); }

    // ---- حسابات الشمس ----

    function julianDate(year, month, day) {
        if (month <= 2) { year -= 1; month += 12; }
        var A = Math.floor(year / 100);
        var B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    }

    function sunPosition(jd) {
        var D = jd - 2451545.0;
        var g = fixAngle(357.529 + 0.98560028 * D);
        var q = fixAngle(280.459 + 0.98564736 * D);
        var L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
        var e = 23.439 - 0.00000036 * D;
        var RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
        var eqt = q / 15 - fixHour(RA);
        var decl = arcsin(sin(e) * sin(L));
        return { declination: decl, equation: eqt };
    }

    // ---- حساب أوقات الصلاة ----

    function sunAngleTime(angle, time, direction) {
        var decl = sunPosition(jDate + time).declination;
        var noon = midDay(time);
        var t = 1/15 * arccos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat)));
        return noon + (direction === 'ccw' ? -t : t);
    }

    function midDay(time) {
        var eqt = sunPosition(jDate + time).equation;
        return fixHour(12 - eqt);
    }

    function asrTime(factor, time) {
        var decl = sunPosition(jDate + time).declination;
        var angle = -arccot(factor + tan(Math.abs(lat - decl)));
        return sunAngleTime(angle, time, 'cw');
    }

    // ---- المتغيرات ----
    var jDate;

    // ---- الحساب الرئيسي ----

    function computeTimes() {
        var times = {
            imsak: 5, fajr: 5, sunrise: 6,
            dhuhr: 12, asr: 13,
            sunset: 18, maghrib: 18, isha: 18
        };

        for (var i = 1; i <= 3; i++) { // تكرار لتحسين الدقة
            times.imsak   = sunAngleTime(settings.imsak.degree, times.imsak, 'ccw');
            times.fajr    = sunAngleTime(settings.fajr.degree, times.fajr, 'ccw');
            times.sunrise = sunAngleTime(riseSetAngle(), times.sunrise, 'ccw');
            times.dhuhr   = midDay(times.dhuhr);
            times.asr     = asrTime(settings.asr.factor, times.asr);
            times.sunset  = sunAngleTime(riseSetAngle(), times.sunset, 'cw');
            times.maghrib = sunAngleTime(settings.maghrib.degree, times.maghrib, 'cw');
            times.isha    = times.maghrib + settings.isha.minutes / 60; // أم القرى: 90 دقيقة بعد المغرب
        }

        return times;
    }

    function riseSetAngle() {
        var angle = 0.0347 * Math.sqrt(elv);
        return 0.833 + angle;
    }

    function adjustTimes(times) {
        for (var key in times) {
            times[key] += timezone - lng / 15;
        }

        // الظهر: إضافة دقائق
        if (settings.dhuhr.minutes) {
            times.dhuhr += settings.dhuhr.minutes / 60;
        }

        // المغرب = غروب الشمس
        times.maghrib = times.sunset;

        // العشاء: 90 دقيقة بعد المغرب (طريقة أم القرى)
        if (settings.isha.minutes) {
            times.isha = times.maghrib + settings.isha.minutes / 60;
        }

        return times;
    }

    function formatTime(time) {
        if (isNaN(time)) return '--:--';
        time = fixHour(time); // قطع مباشر كأم القرى الرسمي (بدون تقريب للأعلى)
        var hours = Math.floor(time);
        var minutes = Math.floor((time - hours) * 60);
        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    }

    // ---- الواجهة العامة ----

    return {
        /**
         * حساب مواقيت الصلاة لتاريخ معين
         * @param {Date} date - التاريخ
         * @param {number} latitude - خط العرض (اختياري)
         * @param {number} longitude - خط الطول (اختياري)
         * @param {number} tz - المنطقة الزمنية (اختياري)
         * @returns {Object} مواقيت الصلاة
         */
        getTimes: function(date, latitude, longitude, tz) {
            if (latitude !== undefined) lat = latitude;
            if (longitude !== undefined) lng = longitude;
            if (tz !== undefined) timezone = tz;

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            jDate = julianDate(year, month, day) - longitude / (15 * 24);

            var times = computeTimes();
            times = adjustTimes(times);

            return {
                fajr:    formatTime(times.fajr),
                sunrise: formatTime(times.sunrise),
                dhuhr:   formatTime(times.dhuhr),
                asr:     formatTime(times.asr),
                maghrib: formatTime(times.maghrib),
                isha:    formatTime(times.isha),
                // أوقات خام (بالساعات) للمقارنة
                _raw: {
                    fajr:    times.fajr,
                    sunrise: times.sunrise,
                    dhuhr:   times.dhuhr,
                    asr:     times.asr,
                    maghrib: times.maghrib,
                    isha:    times.isha
                }
            };
        },

        /**
         * تغيير طريقة حساب العصر
         * @param {number} factor - 1 للشافعي، 2 للحنفي
         */
        setAsrMethod: function(factor) {
            settings.asr.factor = factor;
        },

        /**
         * تغيير دقائق العشاء
         * @param {number} minutes - عدد الدقائق بعد المغرب
         */
        setIshaMinutes: function(minutes) {
            settings.isha.minutes = minutes;
        },

        /**
         * الحصول على الإعدادات الحالية
         */
        getSettings: function() {
            return {
                method: 'Umm al-Qura',
                location: { lat: lat, lng: lng, elevation: elv },
                timezone: timezone,
                asrFactor: settings.asr.factor,
                ishaMinutes: settings.isha.minutes
            };
        }
    };
})();
