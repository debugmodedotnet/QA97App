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

    $scope.loginerrormessage = undefined;
    $scope.loginerrorflag = false;
    $scope.isLoggedIn = false;
    

    $scope.clearloginerrormessage = function () {
        $scope.loginerrormessage = undefined;
        $scope.loginerrorflag = false;
    }

    $scope.ValidateUser = function () {     
        //alert("user");
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
                      // alert($scope.token);
                       $scope.loggedInUser = {
                           token: $scope.token,
                           userName: $scope.username,
                           isLoggedIn: $scope.isLoggedIn
                       };
                       if (localStorageService.isSupported) {
                           localStorageService.set('loggedInUser', angular.toJson($scope.loggedInUser));
                           $rootScope.isLoggedIn = true;
                           $rootScope.userName = $scope.username;
                           if ($rootScope.redirectsourceview === undefined)
                               $rootScope.redirectsourceview = "/Home";
                           $location.path($rootScope.redirectsourceview);
                           
                           
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

