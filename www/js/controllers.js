angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ExpService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
    //});
    //navigator.splashscreen.hide();
    $scope.baseImgUrl = ExpService.baseImg();
    ExpService.getMetricItem().then(function (data) {
        $scope.metrics = data;
    });
    
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HomeCtrl', function ($scope, $rootScope, $state, $ionicLoading,$ionicSideMenuDelegate, ExpService) {
    $scope.baseImgUrl = ExpService.baseImg();

    ExpService.baseData();//load the data into localstorage
    $ionicSideMenuDelegate.canDragContent(true);
    ExpService.getHomeSetting().then(function (label) {
        $scope.homeLabel = label.Title;
        $scope.eventId = label.EventId;
    }, function (reason) {
        alert('Failed: ' + reason);
    });
    ExpService.getHomeSmiley().then(function (data) {
        $scope.homeSmiley = angular.fromJson(data.smilies);
       
       // $ionicLoading.hide();
    });
    
    $scope.onClick = function (evt,smiley) {
       
            var eventfeedback=
            {
                eventid: evt.target.getAttribute('data-evt'),
                feedbackval: evt.target.getAttribute('data-type'),
                email: "",
                phone: "",
                fullname: "",
                comment: "",
                dateadded: ExpService.currentDate(),
               // dateadded: "11/11/2015 1:30:00",
                gender: ""
            }
            $rootScope.evtObj = eventfeedback,
           
           // console.log($rootScope.evtObj);
            $state.go('app.eventmetric', { "metricIndex": 0 });//the 
    }
})

.controller('EventMetricCtrl', function ($scope,$rootScope, $state, $stateParams,$ionicPopup,$ionicLoading, $ionicSideMenuDelegate, ExpService) {
     
    var index = $stateParams.metricIndex;
    $scope.pageIndex = index;
    $scope.isDisabled = false;
    $scope.formInfo = {};
   
    $ionicSideMenuDelegate.canDragContent(true);
    ExpService.getMetricItem().then(function (data) {
        $scope.metric = data[index];
        if (parseInt(index) < data.length) {
            $scope.metricElement = data[index].elements;
        }
        $scope.baseImgUrl = ExpService.baseImg();
        $scope.metricLength = data.length;
    });
    
    ExpService.getHomeSmiley().then(function (data) {
        $scope.homeSmiley = angular.fromJson(data.smilies);
        $scope.eventId = data.eventId;
       // $ionicLoading.hide();
    }, function (reason) {
        alert('Failed: ' + reason)
    });

    $scope.onNextClick = function () {
        var idx = parseInt($scope.pageIndex);
        var mleg = parseInt($scope.metricLength);
        var val = idx + 1;
        if (val < mleg) {
            $state.go('app.eventmetric', { "metricIndex": val });//the 
        }
        if (val === mleg) {
            $state.go('app.contact');//the
        }
    };
    $scope.onElementClick = function ($event, smiley) {

        var eleObj = {
             
            eventid: $event.currentTarget.getAttribute('data-eventid'),
            metricid: $event.currentTarget.getAttribute('data-metric'),
            elementid: $event.currentTarget.getAttribute('data-elementid'),
            feedbackval: smiley.type,
            smileyid: smiley.id,
            smileytype: smiley.type
        }
        var feeds = $rootScope.feedbacks; var newfeed = [];
        if (feeds.length > 0) {
            var isSet = false;
            for (i = 0; i < feeds.length; i++) {
                var obj = feeds[i];
                if (obj.elementid === eleObj.elementid) {
                    var pos = i;
                    feeds.splice(pos, 1, eleObj);
                    isSet = true;
                }  
            }
            if (isSet == false) {
                feeds.push(eleObj);
            }
        } else {
            $rootScope.feedbacks.push(eleObj);
        }
        $rootScope.feedbacks = feeds;
       
    };

    $scope.onFeedbackSubmit = function () {
        var postData = {};
       // var feedheader = $rootScope.evtObj;
        $rootScope.evtObj.email = $scope.formInfo.Email;
        $rootScope.evtObj.fullname = $scope.formInfo.FullName;
        $rootScope.evtObj.phone = $scope.formInfo.Mobile;
        $rootScope.evtObj.comment=$scope.formInfo.Comment;

        postData.eventfeedback = $rootScope.evtObj;
        postData.feedbacks = $rootScope.feedbacks
        //console.log($scope.formInfo);
       // console.log(JSON.stringify(postData));
        ExpService.postFeedback(JSON.stringify(postData));
        var alertPopup = $ionicPopup.alert({
            title: ' Thank You For Your Feeback!!',
            content: '<strong>Success!</strong><br /> Your feedback has been sent.'
            //templateUrl: 'templates/alert.html'
        });
        alertPopup.then(function (res) {
            var els = angular.element('button[data-elementid]');
            angular.forEach(els, function (el) {
                var elchid = angular.element(el);
                elchid.removeClass('disabled');
                elchid.addClass('inner-btn');
            });
            $rootScope.feedbacks = [];
            $state.go('app.home');
           // console.log('Thanks for your feedback');
        });
    };
});
