/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var askquestion = angular.module('QA97App.askquestion', ['ngRoute','textAngular']);

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/askquestion', {
        templateUrl: 'askquestion/askquestion.html',
        controller: 'AskQuestionController'
    });
}]);


askquestion.controller('AskQuestionController', function ($scope, $location, $rootScope, TeacherService) {
    
   
    $scope.questiontitleerrormessage;
    $scope.questiondetailerrormessage;
    $scope.flagaddquestion = false;
    $scope.userid = undefined;
    $scope.questiontitle = $rootScope.qtitle;
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
    $scope.navigatetoquestiondetails = function (id) {


        $location.path('/questiondetails/' + id);
    }

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
                $scope.status = 'Unable to load customer data: ' + error.message;

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



    $scope.AskQuestions = function () {

       

       // $rootScope.isLoggedIn = $scope.k.isLoggedIn;
       // $rootScope.userName = $scope.k.userName;

        if ($rootScope.isLoggedIn)
        {


            if ($scope.questiontitle) {
                if ($scope.questionDetailRichText) {

                    var questionToAsk = {
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
                    TeacherService.addQuestions(questionToAsk)
                       .success(function () {

                           alert("question added");                          
                       }).
                       error(function (error) {
                           $scope.flagaddquestion = true;
                       });

                }
                else {
                    $scope.questiondetailerrormessage = "Please enter question in the detail";

                }
            }
            else {
                $scope.questiontitleerrormessage = "Please enter question title";
            }

        }

        else
        {
            alert("Please logged in to ask question");
        }
        

    }

   
    $scope.htmlToPlaintext= function htmlToPlaintext(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    }

});