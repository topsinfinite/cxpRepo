angular.module('starter.services', ['ngResource'])

 .factory('ExpService', function ($resource, $location, $q, $localstorage) {
     var loc = $location.search();
     var Id = loc.deviceId; 
    // var res = "http://54.191.88.221/exp-api/event?deviceid=000000000000000";
     var res = "http://52.178.45.128/exp-api/event?deviceid=000000000000000";
     var posturl = "http://52.178.45.128/exp-api/feedback";
     var baseUrl = 'http://52.178.45.128/CustomerXperiencePlatform/';
     var expService= $resource(res,{}, {
         query: { method: "GET", isArray: false }
     })
     var expPostService = $resource(posturl, {}, {
         save: {method: "POST"}
     });
     return {
         baseData: function () {
             var deferred = $q.defer();
             expService.query(function (data) {
                 $localstorage.setObject('dataObj', data);
             });
         },
         postFeedback: function (feedbackData) {
             var deferred = $q.defer();
             expPostService.save(feedbackData);
             //expPostService.save(feedbackData, function (data) {
             //    deferred.resolve(data);
             //}, function () { deferred.reject('error occurred....'); })
         },
         currentDate: function () {
                 fullDate = new Date();
                 //Thu May 19 2011 17:25:38 GMT+1000 {}
                 //convert month to 2 digits
                 var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : (fullDate.getMonth() + 1);

                 var currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear() + " " + fullDate.getHours() + ":" + fullDate.getMinutes() + ":" + fullDate.getSeconds();
                 //console.log(currentDate);
                 return currentDate;
         },
         baseImg:function () {
             return baseUrl;
         },
         getHomeSetting: function () {
             var deferred = $q.defer();
             var event = {};
             var data = $localstorage.getObject('dataObj');
             if (data) {
                 event.Title = data.settings.title;
                 event.EventId = data.settings.id;
                 deferred.resolve(event);
             } else {
                 expService.query(function (data) {

                     event.Title = data.settings.title;
                     event.EventId = data.settings.id;
                     deferred.resolve(event);
                 });
             }
             return deferred.promise;
         },
         getHomeSmiley: function () {
             var deferred = $q.defer();
             var dt = {};
             var data = $localstorage.getObject('dataObj');
             if (data) {
                 dt.eventId = data.settings.id;
                 dt.smilies = data.settings.smilies
                 deferred.resolve(dt);
             }else{
             expService.query(function (data) {
                 dt.eventId = data.settings.id;
                 dt.smilies = data.settings.smilies
                 deferred.resolve(dt);
             });
             }
             return deferred.promise;
         },
         getMetricItem: function () {
             var deferred = $q.defer();
             var data = $localstorage.getObject('dataObj');
             if (data) {
                 deferred.resolve(data.metrics);
             } else {
                 expService.query(function (data) {
                     deferred.resolve(data.metrics);

                 });
             }
             return deferred.promise;
         },
         //getMetricElement: function (index) {
         //    var deferred = $q.defer();
         //    expService.query(function (data) {
         //        deferred.resolve(data.metrics[index].elements);
         //    });

         //    return deferred.promise;
         //}
     }
 });