/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var login = angular.module('QA97App.login', ['ngRoute','LocalStorageModule']);

login.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginController'
    });
}]);


login.controller('LoginController', function ($scope, $rootScope, $location, TeacherService, localStorageService) {

    $rootScope.bodystyle = 'bodywithoutimage';
    $scope.loginerrormessage = undefined;
    $scope.loginerrorflag = false;
    $scope.isLoggedIn = false;
    $scope

    $scope.clearloginerrormessage = function () {
        $scope.loginerrormessage = undefined;
        $scope.loginerrorflag = false;
    }

    $scope.ValidateUser = function () {     

        var userToLogin= {
            Password: $scope.userpassword,
            grant_type:'password',
            UserName:$scope.useremail
        };
      

        if ($scope.useremail) {
            
                TeacherService.loginUser(userToLogin)
                   .success(function (data) {
                       $scope.token = data.access_token;
                       $scope.username = data.userName;
                       $scope.isLoggedIn = true; 
                      
                       $scope.loggedInUser = {
                           token: $scope.token,
                           userName: $scope.username,
                           isLoggedIn: $scope.isLoggedIn
                       };
                       if (localStorageService.isSupported) {
                           localStorageService.set('loggedInUser', angular.toJson($scope.loggedInUser));
                           $rootScope.isLoggedIn = true;
                           $rootScope.userName = $scope.username;                          
                           
                       }
                       else
                       {
                           alert('something went wrong');
                       }
                    
                   }).
                   error(function (response) {
                    
                       $scope.loginerrormessage = response.error_description;
                       $scope.loginerrorflag = true;
                      
                   });

            }

            else {
                $scope.flagregisteruser = true;
            }
      
        
    }


})

