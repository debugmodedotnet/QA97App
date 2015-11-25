/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var resetPassword = angular.module('QA97App.resetPassword', ['ngRoute'])

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ResetPassword', {
        templateUrl: 'resetpassword/resetpassword.html',
        controller: 'ResetPasswordController'
    });
}]);

resetPassword.controller('ResetPasswordController', function ($scope, $location, $routeParams, $rootScope, TeacherService) {

    $scope.id = getParameterByName("id");
    $scope.token = getParameterByName("token");
    $scope.code = $routeParams.code;
    $scope.resetPassFlag = 1;

    if ($scope.id == '' || $scope.code == undefined){
        if ($scope.id != '' && $scope.token != '') {
            $scope.resetPassFlag = 2;
        }
        else if($scope.code != undefined) {
            if ($scope.code == 0)
                alert("Password Updated");
            else if ($scope.code == 1)
                alert("Invalid URL");
            else if ($scope.code == 2)
                alert("Invalid token");

            $location.path('/login');
        }
    }

    $scope.ForgetPassword = function () {
        TeacherService.ForgetPassword($scope.email)
        .success(function (response) {
            $scope.message = "Reset link sent to your mail";
        })
        .error(function (response) {
            $scope.message = "Something went wrong";
        });
    };


    $scope.ResetPassword = function () {
        TeacherService.ResetPassword($scope.id, $scope.token, $scope.confirmPassword)
        .success(function (response) {
            $scope.message = "Password Updated";
        })
        .error(function (response) {
            $scope.message = "Something went wrong";
        });
    };

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});