'use strict';

var userdetails = angular.module('QA97App.userdetails', ['ngRoute'])

askquestion.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/Profile', {
        templateUrl: 'user/profile.html',
        controller: 'AddUserController'
    });

    $routeProvider.when('/Profile/:id', {
        templateUrl: 'user/profile.html',
        controller: 'AddUserController'
    });
}]);

userdetails.controller('AddUserController', function ($scope, $location, $routeParams, $rootScope, TeacherService, Upload, localStorageService) {

    $scope.loggedInData = angular.fromJson(localStorageService.get("loggedInUser"));
    if ($routeParams.id == undefined)
        $scope.paramUserName = $scope.loggedInData.userName;
    else
        $scope.paramUserName = $routeParams.id;
    $rootScope.bodystyle = 'bodywithoutimage';
    
    $scope.basicInfo = 1;
    getUserProfile();
    $scope.showpassworddivflag = false;
    getUserImage();

    $scope.showpassworddiv = function () {

        if ($scope.showpassworddivflag == true)
            $scope.showpassworddivflag = false;
        else
            $scope.showpassworddivflag = true;

    }
    $scope.testTab = function (id) {
        var lis = document.getElementById("profileNav").getElementsByTagName("li");
        if (id == 0) {
            $scope.basicInfo = 1;
            $scope.questionsAsked = 0;
            $scope.answersData = 0;
        }    
        else if (id == 1) {
            $scope.basicInfo = 0;
            $scope.questionsAsked = 1;
            if (!$scope.questions)
                getQuestionsByUser();
            $scope.answersData = 0;
        }
        else if (id == 2) {
            $scope.basicInfo = 0;
            $scope.questionsAsked = 0;
            $scope.answersData = 1;
            if (!$scope.answers)
                getAnswersByUser();
        }
        for (var i = 0; i < lis.length; i++) {
            if (i == id)
                lis[i].className = 'active';
            else
                lis[i].className = '';
        }
    }

    $scope.updatepassword = function () {
        var pass = {
            OldPassword : $scope.oldPass,
            NewPassword: $scope.newPass,
            ConfirmPassword : $scope.confirmPass
        };
        TeacherService.changePassword(pass, $scope.loggedInData.token)
.success(function (data) {
    $scope.oldPass = '';
    $scope.newPass = '';
    $scope.confirmPass = '';
    $scope.pwdChangeMsg = "Password Changed successfully";
})
            .error(function (error) {
                $scope.pwdChangeMsg = 'Unable to change Password : ' + error.Message;
            });
    }

    $scope.upload = function () {
var inputImg = document.createElement('input');                 
                    inputImg.type = "file";
                    inputImg.accept = "image/*"; //allow image files
                    inputImg.click();
                    inputImg.onchange = function () {
                        if (inputImg.files && inputImg.files[0]) {
                            if (inputImg.files[0].size < 4194304) { //max file size 4mb
                                var allowedExtensions = new Array("jpg", "JPG", "jpeg", "JPEG", "png", "PNG"); //list of allowed extensions
                                var FileUploadPath = this.value;
                                var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
                                var fileAllowed = 0;
                                for (var i = 0; i < allowedExtensions.length; i++) {
                                    if (allowedExtensions[i] == Extension)
                                        fileAllowed = 1;
                                }
                                if (fileAllowed == 1) { //validating image files only
                                    $scope.imageUrl = "../../Content/images/loading.gif";
                                    Upload.upload({
                                        url: 'http://qa97service.azurewebsites.net/api/ImageUpload',
                                        file: inputImg.files[0],
                                        fields: { 'username': $scope.loggedInData.userName },
                                        method: 'POST'
                                    }).success(function (data) {
                                        getUserImage();
                                    });
                                }
                                else
                                    alert("Choose image type only");
                            }
                            else
                                alert("File too big to upload");
                        }
                    };
    };



    function getUserImage() {
        TeacherService.getUserImage($scope.paramUserName)
        .success(function (data) {
            if (data)
                $scope.imageUrl = data;
            else
                $scope.imageUrl = "../../Content/images/avatar_default.png";
        })
                    .error(function (error) {
                        $scope.status = 'Unable to load image : ' + error.message;

                    });
    };

    function getUserProfile() {
        TeacherService.getUserProfile($scope.paramUserName)
        .success(function (data) {
                $scope.profile = data;
        })
                    .error(function (error) {
                        $scope.status = 'Unable to load image : ' + error.message;

                    });
    };


function getQuestionsByUser (){
    TeacherService.questionsByUser($scope.paramUserName)
.success(function (data) {
                $scope.questions = data;
            })
            .error(function (error) {
                $scope.status = 'Unable to load questions : ' + error.message;

            });
};



function getAnswersByUser() {
    TeacherService.answersByUser($scope.paramUserName)
    .success(function (data) {
        $scope.answers = data;
    })
                .error(function (error) {
                    $scope.status = 'Unable to load answers : ' + error.message;

                });
};

    $scope.navigatetoquestiondetails = function (id) {
        $location.path('/questiondetails/' + id);
    }
    

});
