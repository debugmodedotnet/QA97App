/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var schooladminhome = angular.module('QA97App.schooladminhome', ['ngRoute']);
//Creating route for register
register.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/schooladminhome', {
        templateUrl: 'schooladminhome/schooladminhome.html',
        controller: 'SchoolAdminHomeController'
    });
}]);

schooladminhome.controller('SchoolAdminHomeController', function ($scope, $location, $rootScope, TeacherService) {

    $rootScope.bodystyle = 'bodywithoutimage';
    //$scope.data = [
	//	    { "Subject": "Physics", "Pop1995": 1216, "Pop2005": 1297, "Pop2015": 1361, "Pop2025": 1394 },
	//	    { "Subject": "Maths", "Pop1995": 920, "Pop2005": 1090, "Pop2015": 1251, "Pop2025": 1396 },
	//	    { "Subject": "English", "Pop1995": 266, "Pop2005": 295, "Pop2015": 322, "Pop2025": 351 },
	//	    { "Subject": "History", "Pop1995": 197, "Pop2005": 229, "Pop2015": 256, "Pop2025": 277 },
	//	    { "Subject": "Geography", "Pop1995": 161, "Pop2005": 186, "Pop2015": 204, "Pop2025": 218 }
    //];

    $scope.data = [
           { "Subject": "Physics", "July": 100},
           { "Subject": "Maths","July": 88 },
           { "Subject": "English", "July": 96},
           { "Subject": "History", "July": 110},
           { "Subject": "Geography", "July": 92}
    ];
    $scope.dataChart = $scope.data;

    $scope.data1 = [
          { "Grade": "6-8", "July": 43 },
          { "Grade": "9-10", "July": 84 },
          { "Grade": "11", "July": 65 },
          { "Grade": "12", "July": 56 },
    ];
    $scope.dataChart1 = $scope.data1;
});