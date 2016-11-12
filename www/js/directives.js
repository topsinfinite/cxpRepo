angular.module('starter.directives', [])
.directive('xpsmileycheck', function () {
    return {
          restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var elementId = 0;
                //attrs.$observe('data-elementid', function (value) {
                //    if (value) {
                //        elementId = value;
                //    }
                //});
                elementId = attrs.elementid;
                var els = angular.element('button[data-elementid=' + elementId + ']');
                angular.forEach(els, function (el) {
                    var elchid = angular.element(el);
                    // elchid.prop('disabled', false);
                    elchid.removeClass('disabled');
                    elchid.addClass('inner-btn');
                });
                element.addClass('disabled');
                element.removeClass('inner-btn');
            });
        } //DOM manipulation
    }
});