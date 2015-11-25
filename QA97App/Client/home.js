/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />

'use strict';
var MyApp = angular.module('MyApp', ['HTAppServiceModule',
    'QA97App.askquestion',
    'QA97App.listquestions',
    'QA97App.login',
    'QA97App.register',
    'QA97App.questiondetails',
    'QA97App.schooladminhome',
    'QA97App.userdetails',
    'QA97App.confirmEmail',
    'QA97App.resetPassword',
    'ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'uiSwitch',
    'LocalStorageModule',
    'ngFileUpload',
    'igniteui-directives'
]);

MyApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/Home', {
            templateUrl: 'views/home.html',
              controller: 'HomeController'
          }).
        otherwise({
            redirectTo: '/Home'
        });

  }]);


MyApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('QA97')
      .setStorageType('localStorage')
      .setNotify(true, true)
});

MyApp.controller('HomeController', function ($scope, $location, $rootScope, TeacherService) {

    $rootScope.redirectsourceview = '/Home';
   
    $scope.navigatetoquestiondetails = function (id) {


        $location.path('/questiondetails/' + id);
    }

    $scope.navigatetoaskquestion = function () {


        $location.path('/askquestion');
    }

   
    $scope.navigateToSearch = function () {
        
        if ($scope.selectedaction.id === "0") {
            $location.path('/askquestion');
            alert("ask question");
        }
        if ($scope.selectedaction.id === "1") {
            $location.path('/questions');
            alert("select question");
        }
        if ($scope.selectedaction.id === "2") {

            alert("coming soon");
        }

        
       
    }
   
    // Load questions second div 


    $scope.pageno = 1;
    $scope.pagesize = 5;
    $scope.gid = -1;
    $scope.sid = -1;
    $scope.questions;
    loadQuestions($scope.pageno, $scope.pagesize, $scope.gid, $scope.sid);
    function loadQuestions(pageno, pagesize, gid, sid) {
        TeacherService.listQuestions(pageno, pagesize, gid, sid)
          .success(function (questions) {            
              console.log(questions)
              $scope.questions = questions;

             

          })
          .error(function (error) {
              $scope.status = 'Unable to load  data: ' + error.message;

          });
    }


    $scope.navigateToBrowseQuestion = function()
    {
        $location.path('/questions');
    }
   
   
});


MyApp.controller('MenuController', function ($scope, $location, $rootScope, $modal, localStorageService) {

    // $scope.isUserLoggedIn = false;
    // $scope.loggedInUserName = undefined;




 

    $scope.usercss = 'skins';

    $scope.selectTheme = function(theme)
    {
        $scope.usercss = theme; 
    }
    $scope.l = localStorageService.get("loggedInUser");

    if ($scope.l) {
        $scope.k = angular.fromJson($scope.l);
        $rootScope.isLoggedIn = $scope.k.isLoggedIn;
        $rootScope.userName = $scope.k.userName;
    }


    $scope.userLogOut = function () {
        
        // $scope.isUserLoggedIn = false;
        $rootScope.isLoggedIn = false;
        $rootScope.userName = undefined;
        localStorageService.remove("loggedInUser");
        $location.path(window.location);

    }

    $scope.navigateToUserProfile = function () {
        $location.path('/Profile');
    }

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            // templateUrl: '/Client/login/login.html',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    }

});



MyApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $location, TeacherService) {

    

    $scope.ok = function () {
      
        //  $modalInstance.close($scope.selected.item);
      
        $location.path('/schooladminhome');
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    $scope.selectedSchool = "Select School"
    $scope.schoolId = undefined;
    $scope.selectSchool = function (name, id) {

        $scope.selectedSchool = name;
        $scope.schoolId = id;
    }
    $scope.schools = undefined;
    getSchools();
    function getSchools() {
        TeacherService.getSchools()
            .success(function (schools) {
                $scope.schools = schools;
                // console.log($scope.subjects);

            })
            .error(function (error) {
                $scope.status = 'Unable to load schools :' + error.message;

            });
    };
});




















