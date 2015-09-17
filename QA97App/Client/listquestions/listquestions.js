/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var listquestions = angular.module('QA97App.listquestions', ['ngRoute'])

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/questions', {
        templateUrl: 'listquestions/listquestions.html',
        controller: 'ListQuestionsController'
    });
}]);

listquestions.controller('ListQuestionsController', function ($scope, $location, $rootScope, TeacherService) {

    $scope.score;
    $scope.isLoadMoreButtonDisabled = false;
    $scope.questiontitleerrormessage;
    $scope.questiondetailerrormessage;
    $scope.flagaddquestion = false;
    $scope.userid = '45c14c05-1d53-4ae5-a93d-b23d5e22f768';
    $scope.gid = -1;
    $scope.sid = -1;
    $scope.pageno = 1;
    $scope.pagesize = 10;
    $scope.questiontitle = $rootScope.qtitle;
    $scope.subjectId = undefined;
    $scope.selectedSubject = "Select Subject";
    $scope.selectSubject = function (name, id) {


        $scope.selectedSubject = name;
        $scope.subjectId = id;

        //getQuestionsInSubject(id);
    }

    $scope.selectedClass = "Select Class";
    $scope.classId = undefined;
    $scope.selectClass = function (name, id) {

        $scope.selectedClass = name;
        $scope.classId = id;

        // getQuestionsInGrade(id);
    }

    $scope.loadmorequestions = function () {
        //alert("Loading more questions");

        loadQuestions($scope.pageno, $scope.pagesize, $scope.gid, $scope.sid);
        console.log($scope.questions);
    }


    $scope.classes = undefined;
    $scope.questions = undefined;
    $scope.subjects = undefined;
    getClasses();
    getSubjects();
    // getQuestions();

    $scope.applyFilter = function () {
        //defualt 
        $scope.pageno = 1;
        $scope.pagesize = 10;
        //$scope.sid = $scope.subjectId;
        //$scope.gid = $scope.classId;
        $scope.isLoadMoreButtonDisabled = false;

        if ($scope.classId) {

            $scope.gid = $scope.classId;
        }
        else {

            $scope.gid = -1;
        }

        if ($scope.subjectId) {
            $scope.sid = $scope.subjectId;

        }
        else {
            $scope.sid = -1;

        }




        loadQuestions($scope.pageno, $scope.pagesize, $scope.gid, $scope.sid);
    }

    loadQuestions($scope.pageno, $scope.pagesize, $scope.gid, $scope.sid);
    function loadQuestions(pageno, pagesize, gid, sid) {
        TeacherService.listQuestions(pageno, pagesize, gid, sid)
          .success(function (questions) {
              console.log(questions)
              if (questions.length == 0) {
                  alert("No More Questions!");
                  $scope.isLoadMoreButtonDisabled = true;
              }
              // $scope.questions.push(questions);
              if ($scope.pageno == 1) {
                  $scope.questions = questions;
              }
              else {
                  $scope.questions.push.apply($scope.questions, questions)
              }

              $scope.pageno = $scope.pageno + 1;

          })
          .error(function (error) {
              $scope.status = 'Unable to load customer data: ' + error.message;

          });
    }
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
    function getClasses() {
        TeacherService.getClasses()
            .success(function (classes) {
                $scope.classes = classes;


            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });
    };

    function getQuestionsInSubject(sid) {
        TeacherService.getQuestionsInSubject(sid)
            .success(function (questions) {
                $scope.questions = questions;


            })
            .error(function (error) {
                $scope.status = 'Unable to load Questions for a subject: ' + error.message;

            });
    };

    function getQuestionsInGrade(gid) {
        TeacherService.getQuestionsInGrade(gid)
            .success(function (questions) {
                $scope.questions = questions;


            })
            .error(function (error) {
                $scope.status = 'Unable to load Questions for a subject: ' + error.message;

            });
    };

    function getQuestions() {
        TeacherService.getAllQuestions()
            .success(function (questions) {
                $scope.questions = questions;


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

    $scope.navigatetoquestiondetails = function (id) {

     
        $location.path('/questiondetails/' + id);
    }

    $scope.navigateToQuestion = function () {

        $location.path('/askquestion');
    }
});