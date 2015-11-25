/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var register = angular.module('QA97App.register', ['ngRoute']);
//Creating route for register
register.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'register/register.html',
        controller: 'RegisterUserController'
    });
}]);

register.controller('RegisterUserController', function ($scope,$rootScope, $location, TeacherService) {

    $rootScope.bodystyle = 'bodywithoutimage';
    // $scope.errormessageemail = undefined;
    $scope.errorMessageEmail = undefined;
    $scope.errormessagepassword = undefined;
    $scope.emialloginlinkflag = false;

 

    $scope.clearerrormessage = function () {
  
        $scope.emialloginlinkflag = false;
        $scope.errorMessageEmail = undefined;
        $scope.errormessagepassword = undefined;
    }

    $scope.AddUser = function () {

         
        if ($scope.adduser.$valid) {
            
            var userToAdd = {
                Email: $scope.useremail,
                Password: $scope.userpassword,
                ConfirmPassword: $scope.userpassword,
                FullName: $scope.userfullName
            };

            if ($scope.useremail) {
                TeacherService.addUser(userToAdd)
                   .success(function (response) {                       
                       alert("user added")
                       $location.path('/login');
                   }).
                   error(function (response) {                    

                       $scope.errors = $scope.parseErrors(response);
                       if ($scope.errors.length > 1)
                       {
                           $scope.errormessage = $scope.errors[1];
                           $scope.errorMessageEmail = $scope.errormessage;
                           $scope.emialloginlinkflag = true;
                       }
                       else
                       {
                           $scope.errormessage = $scope.errors[0];
                          $scope.errormessagepassword = $scope.errormessage;

                       }
                       //to delete later 
                       console.log($scope.errors[0]);
                       console.log($scope.errors[1]);
                       console.log($scope.errors[2]);
                       console.log($scope.errors[3]);
                   });

            }
            else {
                alert('invalid');
                $scope.errorMessageEmail = "Invalid Email";
            }
        }
        }
       
    $scope.parseErrors = function parseErrors(response) {
        var errors = [];
        for (var key in response.ModelState) {
            for (var i = 0; i < response.ModelState[key].length; i++) {
                errors.push(response.ModelState[key][i]);
            }
        }
        return errors;
    }


});