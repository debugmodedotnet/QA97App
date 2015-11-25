var HTAppServiceModule = angular.module('HTAppServiceModule', []);

//HTAppServiceModule.service('LogedinUserService', function () {
//    var LoggedInUser = {
//        loggedInUserEmail: '',
//        isUserLoggedIn: ''
//    };
//    return LoggedInUser;
//});

HTAppServiceModule.service('LogedinUserService', function () {
    var LoggedInUser = {
        token: '',
        loggedInUserEmail: '',
        isUserLoggedIn: ''
    };
    return LoggedInUser;
});

HTAppServiceModule.factory('TeacherService', ['$http', function ($http) {

    //choosing API url for localhost testing and Azure
    if (window.location.host == "qa97app.azurewebsites.net")
        var urlBase = 'http://qa97service.azurewebsites.net/api';
    else
        var urlBase = 'http://localhost:8458/api';

    var TeacherService = {};

    TeacherService.getSubjects = function () {
        return $http.get(urlBase + '/Subjects');
    };
    TeacherService.getClasses = function () {
        return $http.get(urlBase + '/Classes');
    };
    TeacherService.getSchools = function () {
        return $http.get(urlBase + '/Schools');
    };

    TeacherService.getSubjectClasses = function (id) {
        return $http.get(urlBase + '/SubjectClasses/' + id);
    };
   

    TeacherService.addUser = function (user) {       
       
        var request = $http({
            method: 'post',
            url: urlBase + '/account/Register',
            data: user
        });
        return request;       
    };

    function  transformRequest(data) {
        var str = [];
        for (var a in data) {
            str.push(encodeURIComponent(a) + '=' +
                encodeURIComponent(data[a]));
        }
        return str.join("&");
    }


    TeacherService.loginUser = function (data) {

        var request = $http({
            method: 'post',
            url: 'http://qa97service.azurewebsites.net/Token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: transformRequest(data)
        });
        return request;
    };
    
    TeacherService.castquestionvote = function (score, userid, questionid) {
       
        return $http.get(urlBase + '/questions/CastVote?score=' + score + '&userid=' + userid + '&questionid=' + questionid);
    };
  

    TeacherService.markAsAcceptedAnswer = function (answerToUpdate) {
       
        var request = $http({
            method: 'put',
            url: urlBase + '/Answers/',
            data: answerToUpdate
        });
        return request;
    };

    TeacherService.addQuestions = function (question) {
       
        return $http.post(urlBase + '/Questions/', question);
      
    };
    TeacherService.addAnswer = function (answer) {
        return $http.post(urlBase + '/Answers/', answer);
    };
    TeacherService.getAnswers = function (qid) {
       
        return $http.get(urlBase + '/Answers/GetAnswersOfAQuestion?qid=' + qid);
    };

    TeacherService.getAllQuestions = function () {
        return $http.get(urlBase + '/Questions');
    };
    TeacherService.listQuestions = function (pageno, pagesize, gid, sid) {
        return $http.get(urlBase + '/Questions/ListQuestions?pageno=' + pageno + '&pagesize=' + pagesize + '&gid=' + gid + '&sid='+sid);
    };
    TeacherService.getQuestionsInSubject = function (sid) {
        return $http.get(urlBase + '/Questions/QuestionsinSubject?sid=' + sid);
    };
    TeacherService.getQuestionsInGrade = function (gid) {
        return $http.get(urlBase + '/Questions/QuestionsinGrades?gid=' + gid);
    };
    TeacherService.getQuestion = function (id) {
        return $http.get(urlBase + '/Questions/GetQuestion/'+id);
    };

    TeacherService.answersByUser = function (id) {
        return $http.get(urlBase + '/Answers/GetAnswersOfAUser?userName=' + id);
    }

    TeacherService.questionsByUser = function (id) {
        return $http.get(urlBase + '/Questions/QuestionsbyUser?userName=' + id);
    }

    TeacherService.getUserImage = function (id) {
        return $http.get(urlBase + '/UserImages/GetParticularUserImage?username=' + id);
    }

    TeacherService.getUserProfile = function (id) {
        return $http.get(urlBase + '/Account/GetUserInfoCustom?id=' + id);
    };

    TeacherService.changePassword = function (data, token) {
        var request = $http({
            method: 'post',
            headers: { 'Authorization': 'bearer ' + token },
            url: urlBase + '/account/ChangePassword',
            data: data
        });
        return request;
    };


    TeacherService.addComment = function (comment) {
        return $http.post(urlBase + '/Comments/', comment);
    };

    TeacherService.getCommentsOfQuestion = function (qid) {
        return $http.get(urlBase + '/Comments/GetCommentsbyQuestion?id=' + qid);
    };

    TeacherService.ForgetPassword = function (userName) {
        return $http.get(urlBase + '/Account/GenerateForgetPasswordToken?userName=' + userName);
    };

    TeacherService.ResetPassword = function (userid, token, password) {
        return $http.get(urlBase + '/Account/ResetPassword?userId=' + userid + '&token=' + token + '&newPassword=' + password);
    };

    return TeacherService;
}]);



