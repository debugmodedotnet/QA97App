/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var confirmEmail = angular.module('QA97App.confirmEmail', ['ngRoute'])

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ConfirmEmail/:code', {
        templateUrl: 'confirmemail/confirmemail.html',
        controller: 'ConfirmEmailController'
    });
}]);

confirmEmail.controller('ConfirmEmailController', function ($scope, $location, $routeParams, $rootScope, TeacherService) {

    $scope.code = $routeParams.code;
    if ($scope.code == 0)
        alert("Email Confirmed");
    else if ($scope.code == 1)
        alert("Invalid Confirmation URL");
    else if ($scope.code == 2)
        alert("Invalid Confirmation token");

    $location.path('/Home');

});