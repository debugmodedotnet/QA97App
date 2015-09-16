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
   
    $scope.selectedaction = { "title": "Ask a Question", "id": "0" };
    $scope.actions = [
        { "title": "Ask a Question", "id": "0" },
        { "title": "Search in Questions", "id": "1" },
        { "title": "Search a Tutor", "id": "2" },
    ];
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
    //$scope.navigateToAllQuestions = function () {
      
    //    $location.path('/questions');
    //}


   
   
});


MyApp.controller('MenuController', function ($scope, $location, $rootScope, $modal, localStorageService) {

    // $scope.isUserLoggedIn = false;
    // $scope.loggedInUserName = undefined;
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



//MyApp.controller('AddUserController', function ($scope, $location, $rootScope, TeacherService,Upload) {
   
//   // $scope.upload = [];
//    $scope.showpassworddivflag = false;
//    $scope.isTeacher = false;
//    $scope.isTeacherButtonText = "Become a Teacher"
//    $scope.userprofile;
//    FetchUserProfile();

//    //$scope.$watch('files', function () {
//    //    $scope.upload($scope.files);
//    //});
//    $scope.upload = function (file) {

//        //  alert("selecting file");
//       // alert(file);
//        $scope.fileUploadObj = { testString1: "Test string 1", testString2: "Test string 2" };
//        if (file)
//        {
//          //  alert('in file');
//            Upload.upload({
//                url: "http://localhost:25221/api/ImageUpload", // webapi url
//                method: "POST",
//                //data: { fileUploadObj: $scope.fileUploadObj },
//                file: file
//            }).progress(function (evt) {
//                // get upload percentage
//                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//            }).success(function (data, status, headers, config) {
//                // file is uploaded successfully
//                console.log(data);
//            }).error(function (data, status, headers, config) {
//                // file failed to upload
//                console.log(data);
//            });

//       }
//    }
    
//    $scope.showpassworddiv = function () {

//        $scope.showpassworddivflag = true;

//    }
//    $scope.hidepassworddiv = function () {
//        $scope.currentpassword = undefined;
//        $scope.updatedpassword = undefined;       
//        $scope.showpassworddivflag = false;

//    }
//    $scope.updatepassword = function () {
             
//        TeacherService.validateUser($scope.userprofile.Email, $scope.currentpassword)
//                  .success(function (passwordvalid) {
                      
//                      if (passwordvalid == 0) {
//                          alert('current password is wrong');                         
//                      }
//                      else {

//                          $scope.userprofile.Password = $scope.updatedpassword;

//                          var passwordtoupdate = {
//                              Email: $scope.userprofile.Email,
//                              Password: $scope.updatedpassword,
//                          };

//                          TeacherService.updatepassword(passwordtoupdate)
//                             .success(function () {
//                                 alert("password updated");
//                                 $scope.currentpassword = undefined;
//                                 $scope.updatedpassword = undefined;
//                                 $scope.showpassworddivflag = false;

//                             }).
//                             error(function (error) {
//                                 alert('error in updating password');
//                             });
                         
//                      }
//                  }).
//                  error(function (error) {
//                      $scope.flagregisteruser = true;
//           });
//}
    
//    $scope.selectCity = function (name, id) {
       
//    }
//    function FetchUserProfile() {
        
//        TeacherService.getUserProfile($rootScope.loggedInUserEmail)
//            .success(function (user) {
//                $scope.userprofile = user;
//                if ($scope.userprofile.isTeacher == true) {
//                    $scope.isTeacher = true;
//                    $scope.isTeacherButtonText = "You are aTeacher"

//                }

//            })
//            .error(function (error) {
//                $scope.status = 'Unable to load user data: ' + error.message;

//            });
//    };
//    getCity();
//    function getCity() {
//        TeacherService.getCities()
//            .success(function (cities) {
//                $scope.cities = cities;
//                // console.log($scope.subjects);

//            })
//            .error(function (error) {
//                $scope.status = 'Unable to load city data: ' + error.message;

//            });
//    };

//    $scope.chnageroletoteacher = function () {
//        $scope.isTeacher = true;
//    }

//    $scope.subjects = undefined;
//    getSubjects();
//    function getSubjects() {
//        TeacherService.getSubjects()
//            .success(function (subjects) {
//                $scope.subjects = subjects;
//                // console.log($scope.subjects);

//            })
//            .error(function (error) {
//                $scope.status = 'Unable to load customer data: ' + error.message;

//            });
//    };

//    $scope.classes = undefined;
//    getClasses();
//    function getClasses() {
//        TeacherService.getClasses()
//            .success(function (classes) {
//                $scope.classes = classes;


//            })
//            .error(function (error) {
//                $scope.status = 'Unable to load customer data: ' + error.message;

//            });
//    };

//})


















