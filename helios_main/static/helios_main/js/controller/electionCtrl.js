'use strict';

heliosStudyMainApp.controller("electionCtrl", function ($scope, $routeParams, $location, Backend, $rootScope) {

    var choiceBackground = "00";
    var hashBackground;
    var encrypted_vote = "";
    $scope.auditClick = false;

    //Do when page loaded
    Backend.assign($routeParams['id']).success(function (data) {
        var result = angular.fromJson(data);
        if ("Error" in result) {
            $location.path('/error/' + $routeParams['id'] + '/' + result["Error"]);
        }

        //TODO Why is this not displayed?
        $scope.subject = $routeParams['id'];
        console.log($routeParams['id']);
        $scope.experimentData = result;
        $scope.options = result.question_data.options;
        $scope.startTimeAll = Date.now();

    });
    
    
    $scope.saveChoice = function (code, choice) {
        choiceBackground = code;
        $rootScope.choice = choice;
        console.log('Choice is ' + choiceBackground);
    };


    //Pseudo-encryption of the vote. Well, the option code is hidden between random values.
     function encrypt() {
        for (var i=0; i<100; i++){
            encrypted_vote += Math.floor( Math.random() * (10));
        }
        encrypted_vote += choiceBackground;

         for (var i=0; i<100; i++){
            encrypted_vote += Math.floor( Math.random() * (10));
        }

        //"Hashing" the encrypted vote. No seriously this is not a hash.
         //TODO Trim the hash to 43
         hashBackground = btoa(encrypted_vote);
         console.log(encrypted_vote);

    }
    

    //From election to review
    $scope.proceedButton = function () {
        //$scope.startTime = Date.now();

        encrypt();

        console.log(encrypted_vote);

        $rootScope.ballot_tracker = hashBackground.toString();

        console.log('Hash is ' + hashBackground);
        console.log('Hash in scope ' + $scope.ballot_tracker);
        $location.path('review/' + $routeParams['id']);
    }

    //From displays audit info
    $scope.auditButton = function () {
        if ($scope.auditClick==false) {
            $scope.auditClick=true;
        } else {
            $scope.auditClick=false
        }

    };

    //From review to audit
     $scope.verifyButton = function () {
        $location.path('institute/' + $routeParams['id']);
    };

    //From review to final overview
    $scope.submitVoteButton = function () {
        $location.path('final/' + $routeParams['id']);
    };

    //From review to election
    $scope.backToElectionButton = function () {
        $location.path('election/' + $routeParams['id']);
    };

    //Redirect to new tab with institutes
    $scope.chooseInstitute = function () {
        //$location.path('institute/' + $routeParams['id']);
    };

    //From institutes back to review
    $scope.backToReviewButton = function () {
        $location.path('review/' + $routeParams['id']);
    };

    $scope.cancelButton = function () {
    };

    $scope.castButton = function () {
        $location.path('cast/' + $routeParams['id']);
    };
});
