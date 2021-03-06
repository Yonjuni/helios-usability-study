'use strict';

heliosStudyMainApp.controller("electionCtrl", function ($scope, $routeParams, $location, Backend, $rootScope, $window) {

    var encrypted_vote = "";
    $scope.auditClick = false;
    $scope.show_progress = true;

    $rootScope.choice;
    $rootScope.selected_code;

    switch ($location.path().split("/")[1]) {
        case "election":
            $scope.show_progress = true;
            $scope.current_step = 1;
            break;
        case "review":
            $scope.show_progress = true;
            $scope.current_step = 2;
            break;
        case "final":
            $scope.show_progress = true;
            $scope.current_step = 3;
            break;
        case "audit_osze":
            $scope.show_progress = false;
            break;
        case "audit_bsi":
            $scope.show_progress = false;
            break;
        case "auditdone":
            $scope.show_progress = false;
            break;
        case "cast":
            $scope.show_progress = false;
            break;
        case "institute":
            $scope.show_progress = false;
            break;
        default:
            $scope.show_progress = true;
            $scope.current_step = 0;
    }

    $rootScope.subject = $routeParams['id'];
    console.log("Subject:" + $rootScope.subject);

    //Do when page loaded
    Backend.assign($routeParams['id']).success(function (data) {
        var result = angular.fromJson(data);
        if ("Error" in result) {
            $location.path('/error/' + $routeParams['id'] + '/' + result["Error"]);
        }

        console.log($routeParams['id']);
        $scope.experimentData = result;
        $scope.options = result.question_data.options;
    });


    $scope.saveChoice = function (code, choice) {

        if ($rootScope.selected_code == code) {
            $rootScope.selected_code = null;
        } else {
            $rootScope.selected_code = code;
            $rootScope.choice = choice;
            console.log('Choice is ' + $rootScope.choice);
        }
    };

    //Pseudo-encryption of the vote. Well, the option code is hidden between random values.
    function encrypt() {

        encrypted_vote = "";
        $rootScope.auditData = "";

        for (var i = 0; i < 100; i++) {
            encrypted_vote += Math.floor(Math.random() * (10));
        }
        encrypted_vote += $rootScope.selected_code;

        for (var j = 0; j < 100; j++) {
            encrypted_vote += Math.floor(Math.random() * (10));
        }

        //"Hashing" the encrypted vote. No seriously, this is not a hash.
        var temp_tracker = deconfuse(btoa(encrypted_vote).toString().substr(0, 43), dictionaryBase64);

        $rootScope.ballot_tracker = split43In4s(temp_tracker);
        $rootScope.auditData = buildBallot(encrypted_vote);
        console.log($rootScope.auditData);
        console.log(encrypted_vote);
        console.log('Hash in scope ' + $scope.ballot_tracker);
    }

    var dictionaryBase64 = {"O": 'o', "I": 'i', "l": 'L'};
    var dictionaryOutside = {"O": '*', "I": '#', "l": '?'};

    function deconfuse(regularBase64Hash, dictionary) {
        var res = regularBase64Hash.replace(/O/g, dictionary.O);
        res = res.replace(/I/g, dictionary.I);
        res = res.replace(/l/g, dictionary.l);
        return res;
    }


    function split43In4s(hash43Base64) {
        var res = hash43Base64.substr(0, 4);
        var separator = "-";
        for (var i = 1; i < 11; i++) {
            res += separator + hash43Base64.substr(i * 4, 4);
        }
        return res;
    }

    //From election to review
    $scope.proceedButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Old: Election end");
        encrypt();
        $location.path('review/' + $routeParams['id']);
    };

    //From displays audit info
    $scope.auditButton = function () {
        if ($scope.auditClick == false) {
            $scope.auditClick = true;
        } else {
            $scope.auditClick = false
        }

    };

    //Opens new tab for printing the ballot tracker
    $scope.printButton = function () {
        $window.open('print/' + $rootScope.ballot_tracker, '_blank');
    };

    //Selection of textarea in audit
    $scope.selectTextArea = function () {
        console.log(document.getElementsByName("auditDataTextArea")[0]);
        document.getElementsByName("auditDataTextArea")[0].select();
    };

    //From review to audit
    $scope.verifyButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Old: Audit start");
        $location.path('institute/' + $routeParams['id']);
    };

    //From review to login for casting
    $scope.submitVoteButton = function () {
        $location.path('final/' + $routeParams['id']);
    };

    //From review to election
    $scope.backToElectionButton = function () {
        $location.path('election/' + $routeParams['id']);
    };

    //Redirect while verifiying
    $scope.redirectButton = function () {
        $rootScope.selected_code = "22";
        $location.path('auditdone/' + $routeParams['id']);
    };

    $scope.redirectToInstituteBsiButton = function () {
        $location.path('audit_bsi/' + $routeParams['id']);
    };

    $scope.redirectToInstituteOszeButton = function () {
        $location.path('audit_osze/' + $routeParams['id']);
    };

    //From institutes back to review
    $scope.backToReviewButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Old: Audit abort");
        $location.path('review/' + $routeParams['id']);
    };

    $scope.backToVotingButton = function () {
        $location.path('election/' + $routeParams['id']);
        $rootScope.selected_code = "00";
    };

    $scope.cancelButton = function () {
        $location.path('/' + $routeParams['id']);
        $rootScope.selected_code = "00";
    };

    $scope.castButton = function () {
        if ($scope.userid == 'k5k6j2kfL4' && $scope.userpass == '23kg!k?f%v') {
            Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Old: Overall end");
            $location.path('cast/' + "final");
        } else {
            alert("Sie haben Ihren Benutzernamen oder Ihr Passwort falsch eingegeben. Bitte geben Sie es erneut ein.");
        }
    };

    function buildBallot(encrypted_vote) {
        return "{\"answers\": [{\"choices\": [" + makeAlphaBeta() + ", " + makeAlphaBeta() + ", " + makeAlphaBeta() +
            "], \"individual_proofs\": [[" + makeCCR() + ", " + makeCCR() + "], [" + makeCCR() + ", " + makeCCR() + "], [" + makeCCR() + ", "
            + makeCCR() + "]], \"overall_proof\": [" + makeCCR() + ", " + makeCCR() + "], \"answer\": [0], \"randomness\": \"" +
            encrypted_vote + "\"}]}";
    }

    function makeAlphaBeta() {
        return "{\"alpha\": " + makeXRandoms(616) + ", \"beta\": " + makeXRandoms(616) + "}";
    }

    function makeCCR() {
        return "{\"challenge\": " + makeXRandoms(77) + ", \"commitment\": {\"A\": " + makeXRandoms(616) + ", \"B\": " +
            makeXRandoms(616) + "}, \"response\": " + makeXRandoms(77) + "}";
    }

    function makeXRandoms(count) {
        var res = "\"";
        for (var i = 0; i < count; i++) {
            res += Math.floor(Math.random() * (10));
        }
        res += "\"";
        return res;
    }

});
