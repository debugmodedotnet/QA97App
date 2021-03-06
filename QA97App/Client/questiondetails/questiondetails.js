﻿/// <reference path="C:\Work\Project\HTApp\HTApp\HTApp\Scripts/angular.js" />
'use strict';

var questiondetails = angular.module('QA97App.questiondetails', ['ngRoute', 'LocalStorageModule']);

register.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/questiondetails/:id', {
        templateUrl: 'questiondetails/questiondetails.html',
        controller: 'QuestionDetailsController'
    });
}]);

questiondetails.controller('QuestionDetailsController', function ($scope, $location, $rootScope, $routeParams, TeacherService, localStorageService, $modal) {
   
    $scope.loggedInData = angular.fromJson(localStorageService.get("loggedInUser"));
    $scope.qid = $routeParams.id;
    $scope.question;
    $scope.answers;
    $scope.userid = undefined;
    //$scope.userid = 'eed28966-02df-447d-9b9e-6c69c218e310';
    $scope.open = false;
    $scope.uservote;

    getQuestion($scope.qid);

    getAnswers($scope.qid);
    function getAnswers(qid) {
        TeacherService.getAnswers(qid)
            .success(function (answers) {
                // alert(answers);
                $scope.answers = answers;


            })
            .error(function (error) {
                $scope.status = 'Unable to load answer data: ';

            });
    };

    function getQuestion(qid) {
        TeacherService.getQuestion(qid)
            .success(function (question) {
                // alert(question);
                $scope.question = question;


            })
            .error(function (error) {
                $scope.status = 'Unable to load Question data: ' + error.message;

            });
    };




    $scope.isAnswerSaved = localStorageService.get("answerSaved");

    if ($scope.isAnswerSaved) {
        $scope.k = angular.fromJson($scope.isAnswerSaved);       
        $scope.answerDetailRichText = $scope.k.AnswerDetailRichText;
        $scope.htmlToPlaintext = $scope.k.AnswerDetailPlainText;
        
    }


    $rootScope.onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);



    function routeChange(event, newUrl, oldUrl) {
       
       
        if ($rootScope.isLoggedIn) {

            if (localStorageService.questionToAskSaved)
            {
                localStorageService.remove("questionToAskSaved");
            }
            
            if ($scope.answerDetailRichText.length > 0) {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'QA97Alert.html',
                    controller: 'QA97AlertController',
                    size: '',
                    resolve: {
                        item: function () {

                            return newUrl;
                        }
                    }
                });


                event.preventDefault();
            }
        }
        //else
        //{

        //    var answerToAdd = {
        //        QuestionId: $scope.qid,
        //        UserId: $rootScope.userName,
        //        AnswerDetailRichText: $scope.answerDetailRichText,
        //        AnswerDetailPlainText: $scope.htmlToPlaintext($scope.answerDetailRichText)
        //    };

        //    if (localStorageService.isSupported) {
        //        localStorageService.set('answerSaved', angular.toJson($scope.answerToAdd));

        //    }
        //    else {
        //        alert('something went wrong');
        //    }

        //}
        //return;
        

    }




    $scope.markasAnswer = function (answerId, userId) {

        $scope.answerId = answerId;
        $scope.userId = userId;
        alert($scope.answerId);
        alert($scope.userId);

        var answerToUpdate = {
            Id: $scope.answerId,
            UserId: $scope.userId,
            isAcceptedAnswer: true
        };
        TeacherService.markAsAcceptedAnswer(answerToUpdate)
                   .success(function (ans) {
                       alert("answer updated");


                   }).
                   error(function (error) {
                       alert("error in updating");
                   });



    }




    $scope.AddAnswer = function () {


         $scope.answerToAdd = {
            QuestionId: $scope.qid,
            UserId: $rootScope.userName,
            AnswerDetailRichText: $scope.answerDetailRichText,
            AnswerDetailPlainText: $scope.htmlToPlaintext($scope.answerDetailRichText)
        };

        if ($rootScope.isLoggedIn) {
            TeacherService.addAnswer($scope.answerToAdd)
                       .success(function (ans) {
                           alert("answer added");
                           $scope.answerDetailRichText = undefined;
                           //ans.UserName = $rootScope.userName;
                           //$scope.answers.push(ans);
                           getAnswers($scope.qid);
                           localStorageService.remove("answerSaved");
                       }).
                       error(function (error) {
                           alert("error in adding");
                       });
        }
        else {

            if (localStorageService.isSupported) {
                alert($scope.answerToAdd);
                localStorageService.set('answerSaved', angular.toJson($scope.answerToAdd));

            }
            else {
                alert('something went wrong');
            }
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'QA97LoginAlert.html',
                controller: 'QA97AnswerLoginAlertController',
                size: '',
                //resolve: {
                //    items: function () {

                //        return $scope.questionToAsk;
                //    }
                //}
            });

        }
    }



    $scope.savetoPDF = function (q, a) {
        var pdf = new jsPDF('p', 'pt', 'letter');
        pdf.setTextColor(255, 127, 80);
        pdf.text(20, 30, "QA97 - Header Text");
        pdf.setTextColor(0, 0, 0);
        var exportContent = "<b>Question: </b>" +
                                q.DetailRichText +
                                "<br><br><b>Answer: </b>" +
                                  a +
                                    "<footer><i>Answer exported via QA97</i> Full discussion at " + window.location.href + "</footer>";
        var iDiv = document.createElement('div');
        iDiv.id = 'export';
        iDiv.style.display = 'none';
        iDiv.innerHTML = exportContent;
        document.getElementsByTagName('body')[0].appendChild(iDiv);
        $scope.changeImageSize(iDiv);
        pdf.fromHTML($('#export').get(0), 40, 40, {
            'width': 522
        },
        function (dispose) {
            pdf.save('QA97 - Question ' + q.Id + '.pdf');
            iDiv.innerHTML = '';
            document.getElementsByTagName('body')[0].removeChild(iDiv);
        });



    };
    $scope.changeImageSize = function (content) {
        var imgs = content.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            var maxWidth = 400; // Max width for the image
            var maxHeight = 200;    // Max height for the image
            var ratio = 0;  // Used for aspect ratio
            var width = imgs[i].width;    // Current image width
            var height = imgs[i].height;  // Current image height

            // Check if the current width is larger than the max
            if (width > maxWidth) {
                ratio = maxWidth / width;   // get ratio for scaling image
                height = height * ratio;    // Reset height to match scaled image
                width = width * ratio;    // Reset width to match scaled image
            }

            // Check if current height is larger than max
            if (height > maxHeight) {
                ratio = maxHeight / height; // get ratio for scaling image
                width = width * ratio;    // Reset width to match scaled image
                height = height * ratio;    // Reset height to match scaled image
            }
            if (width == 0 || height == 0) {
                width = 200;
                height = 200;
            }
            imgs[i].width = width;
            imgs[i].height = height;
        }
    };

    $scope.changeVote = function (score) {
        if ($rootScope.isLoggedIn) {

            $scope.uservote = score;

            TeacherService.castquestionvote($scope.uservote, $rootScope.userName, $scope.qid)
            .success(function (returnedscore) {

                if (returnedscore == 0) {
                    alert("you have already voted")
                }
                else {
                    alert("Thanks for voting" + returnedscore);
                    $scope.question.Score = $scope.question.Score + returnedscore;
                }


            })
            .error(function (error) {
                $scope.status = 'Unable to load Question data: ';

            });

        }
        else {
            alert("Login to vote");
        }


    };

    $scope.htmlToPlaintext = function htmlToPlaintext(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };

    $scope.smsWarning = function smsWarning(text) {
        if (text.length > 10)
            return true;
        else
            return false;
    };

    $scope.showComments = 0;

    $scope.toggleComments = function () {
        if ($scope.showComments == 0) {
            $scope.showComments = 1;
            $scope.getComments();
        }
        else
            $scope.showComments = 0;

    };

    $scope.getComments = function () {
        TeacherService.getCommentsOfQuestion($scope.qid)
        .success(function (data) {
            $scope.comments = data;
        })
        .error(function (error) {
            $scope.status = 'Unable to load comments';
        });
    };

    $scope.addComment = function () {
        var comment = {
            CreatedBy: $scope.loggedInData.userName,
            commentText: $scope.commentText,
            QuestionId: $scope.qid
        };
        TeacherService.addComment(comment)
        .success(function (data) {
            $scope.status = 'Comment added';
            $scope.getComments();
        })
        .error(function (error) {
            $scope.status = 'Unable to add comment';
        });
    };

    $scope.navigateToQuestion = function () {


        $rootScope.redirectsourceview = '/questiondetails/' + $scope.qid;
        $location.path('/login');
    }

});


questiondetails.controller('QA97AnswerLoginAlertController', function ($scope, $modalInstance, $location, $rootScope, $routeParams) {


    // $scope.a = items;
    $scope.ok = function () {

        $rootScope.redirectsourceview = '/questiondetails/' + $routeParams.id;
        $location.path('/login');
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

questiondetails.controller('QA97AlertController', function ($scope,item, $modalInstance, $location, $rootScope, $routeParams) {


 
    $scope.ok = function () {
        $rootScope.onRouteChangeOff();
       // var a = item.$$route;
       // alert(item);
        var routetonavigate = $location.url(item).hash();
      //  alert(routetonavigate);
        $location.path(routetonavigate);
        $modalInstance.dismiss('cancel');
       
    };

    $scope.cancel = function () {
       
        $modalInstance.dismiss('cancel');
       
    };
})