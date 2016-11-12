// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.directives', 'starter.controllers', 'starter.services'])
.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])
.run(function ($ionicPlatform, $ionicPopup, $timeout, $state, $rootScope, $ionicLoading, ExpService) {
    $timeout(function () {
       //navigator.splashscreen.hide();
        $state.go('app.home');
    }, 5000);
   
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        //if (navigator.splashscreen) {
        //    navigator.splashscreen.hide();
        //}
        $rootScope.feedbacks = []; 
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                })
                .then(function (result) {
                    if (!result) {
                        ionic.Platform.exitApp();
                    }
                });
            }
        }
    });
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        })
    })

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
    })
    $rootScope.$on('response:error', function () {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: ' Loading failed!!',
            content: '<br /> Please check your internet connection..'
            //templateUrl: 'templates/alert.html'
        });
        alertPopup.then(function () {
            return;
        });

    });
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.defaults.timeout = 5000;
    $httpProvider.interceptors.push(function ($rootScope) {
        return {
            request: function (config) {
                $rootScope.$broadcast('loading:show')
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide')
                return response
            },
            responseError: function (response) {
                $rootScope.$broadcast('loading:hide')
                $rootScope.$broadcast('response:error')
                return response

            },
            requestError: function (response) {
                $rootScope.$broadcast('loading:hide')
                $rootScope.$broadcast('response:error')
                return response
            }
        }
    });

    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
      })

      .state('app.eventmetric', {
          url: '/metric/:metricIndex',
          views: {
              'menuContent': {
                  templateUrl: 'templates/eventmetric.html',
                  controller: 'EventMetricCtrl',
                  params: { 'metricIndex': null, }
              }
          }
      })

     .state('app.contact', {
         url: '/contact',
         views: {
             'menuContent': {
                 templateUrl: 'templates/contact.html',
                 controller: 'EventMetricCtrl'
             }
         }
     })

      .state('app.home', {
          url: '/home',
          views: {
              'menuContent': {
                  templateUrl: 'templates/home.html',
                  controller: 'HomeCtrl'
              }
          }
      })

      .state('app.event', {
          url: '/event',
          views: {
              'menuContent': {
                  templateUrl: 'templates/eventcode.html',
                  controller: 'HomeCtrl'
              }
          }
      })
    // if none of the above states are matched, use this as the fallback
   // $urlRouterProvider.otherwise('/app/home.html');
    $urlRouterProvider.otherwise('/app/eventcode.html');
});



