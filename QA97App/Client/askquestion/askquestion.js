/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var askquestion = angular.module('QA97App.askquestion', ['ngRoute', 'textAngular', 'LocalStorageModule', 'igniteui-directives']);

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/askquestion', {
        templateUrl: 'askquestion/askquestion.html',
        controller: 'AskQuestionController'
    });
}]);


askquestion.controller('AskQuestionController', function ($scope, $location, $rootScope, TeacherService, localStorageService, $modal) {
    
   
    $scope.questiontitleerrormessage;
    $scope.questiondetailerrormessage;
    $scope.flagaddquestion = false;
    $scope.userid = undefined;
    $scope.questiontitle = $rootScope.qtitle;
    //$scope.loginflagclass = undefined;
    //$scope.subjectId = undefined;
    //$scope.selectedSubject = "Select Subject";
    //$scope.selectSubject = function (name, id) {
       
    //    $scope.selectedSubject = name;
    //    $scope.subjectId = id;
    //}

    //$scope.selectedClass = "Select Class";
    //$scope.classId = undefined;
    //$scope.selectClass = function (name, id) {

    //    $scope.selectedClass = name;
    //    $scope.classId = id;
    //}
    //$scope.navigatetoquestiondetails = function (id) {


    //    $location.path('/questiondetails/' + id);
    //}

    $scope.selectedSubject = {};
    $scope.selectedClass = {};
    $scope.classes = undefined;
    getClasses();
    function getClasses() {
        TeacherService.getClasses()
            .success(function (classes) {
                $scope.classes = classes;


            })
            .error(function (error) {
                $scope.status = 'Unable to load class data: ' + error.message;

            });
    };


    $scope.subjects = undefined;
    getSubjects();
    function getSubjects() {
        TeacherService.getSubjects()
            .success(function (subjects) {
                $scope.subjects = subjects;
                // console.log($scope.subjects);

            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });
    };


    

    $scope.clearemailstatusmessage = function () {

        $scope.questiondetailerrormessage = undefined;
        $scope.questiontitleerrormessage = undefined;
        $scope.flagaddquestion = false;

    }



    $scope.isQuestionSaved = localStorageService.get("questionToAskSaved");

    if ($scope.isQuestionSaved) {
      //  alert("hahah");
        $scope.k = angular.fromJson($scope.isQuestionSaved);
    //    alert($scope.k);
        $scope.questiontitle = $scope.k.QuestionTitle;
     //   alert($scope.questiontitle);
        $scope.questionDetailRichText = $scope.k.QuestionDetailRichText;
        $scope.selectedClass.Id = $scope.k.ClassId;
        $scope.selectedSubject.Id = $scope.k.SubjectId;
    }





    $scope.AskQuestions = function () {




            if ($scope.questiontitle) {
                if ($scope.questionDetailRichText) {

                   $scope.questionToAsk = {
                        QuestionTitle: $scope.questiontitle,
                        ClassId: $scope.selectedClass.Id,
                        SubjectId: $scope.selectedSubject.Id,
                        UserId: $rootScope.userName,
                        QuestionDetailRichText: $scope.questionDetailRichText,
                        QuestionDetailPlainText: $scope.htmlToPlaintext($scope.questionDetailRichText),


                    };
                    //var questionToAsk = {
                    //    QuestionTitle: $scope.questiontitle,
                    //    ClassId: 1,
                    //    SubjectId: 1,
                    //    UserId: '4b1b95af-79b7-4fb1-b7b2-2d900c3e859e',
                    //    QuestionDetail: $scope.questiondetail

                    //};


                   if ($rootScope.isLoggedIn) {

                    TeacherService.addQuestions($scope.questionToAsk)
                       .success(function () {

                           alert("question added");                          
                       }).
                       error(function (error) {
                           $scope.flagaddquestion = true;
                       });



                }

                else {

                    if (localStorageService.isSupported) {
                        localStorageService.set('questionToAskSaved', angular.toJson($scope.questionToAsk));                       

                    }
                    else {
                        alert('something went wrong');
                    }
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'QA97LoginAlert.html',
                        controller: 'QA97LoginAlertController',
                        size: '',
                        //resolve: {
                        //    items: function () {

                        //        return $scope.questionToAsk;
                        //    }
                        //}
                    });

                }



                }
                else {
                    $scope.questiondetailerrormessage = "Please enter question in the detail";

                }
            }
            else {
                $scope.questiontitleerrormessage = "Please enter question title";
            }

       


 }
        
   

   
    $scope.htmlToPlaintext= function htmlToPlaintext(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    }


});

askquestion.controller('QA97LoginAlertController', function ($scope, $modalInstance, $location) {

  
   // $scope.a = items;
    $scope.ok = function () {

       

      
        $location.path('/login');
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})