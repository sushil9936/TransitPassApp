/*jslint browser: true*/
/*global angular, console, alert*/
(function () {
    'use strict';
    var myApp = angular.module('transport-pass-system', []);

    myApp.controller('transportPassAppController', ['$scope', 'appDataService', function ($scope, appDataService) {
        var vm = this;
        vm.passActions = [];
        //initialize all variable required during use of application.
        vm.init = function () {
            vm.buyPassSection = false;
            vm.usePassSection = false;
            vm.checkBalanceSection = false;
            vm.passBtn = false;
            vm.selectedMode = "";
            vm.selectedPassType = "";
            vm.selectedDiscountType = "";
            vm.passCost = "";
            vm.passTypes = [];
            vm.userTypes = [];
            vm.transportData = [];
            vm.isTWorker = false;
            vm.isMonthly = false;
            vm.returnMsg = {};
            vm.passID = "";
            vm.newPass = "";
            vm.passInfoBtn = false;
            vm.noPassFlag = false;
            vm.noPassMsg = "";
            vm.passGenerated = false;
        };
        // fetches actions from service
        vm.getActions = function () {
            vm.passActions = appDataService.getPassActions();
        };
        // takes actions which is specified and this method is called on click of particular action button
        vm.takeAction = function (action) {
            vm.init();
            if (action === "Buy Pass") {
                vm.transportData = appDataService.getTransportDetails();
                vm.selectedMode = vm.transportData[0].type;
                vm.passTypes = appDataService.getPassTypes();
                vm.selectedPassType = vm.passTypes[0];
                vm.userTypes = appDataService.getUserTypes();
                vm.selectedUserType = vm.userTypes[0];
                vm.checkBalanceSection = false;
                vm.buyPassSection = true;
                vm.usePassSection = false;
                vm.checkBalanceSection = false;
            }
            if (action === "Use Pass") {
                vm.transportData = appDataService.getTransportDetails();
                vm.selectedMode = vm.transportData[0].type;
                vm.buyPassSection = false;
                vm.usePassSection = true;
                vm.checkBalanceSection = false;
            }
            if (action === "Check Balance") {
                vm.checkBalanceSection = true;
                vm.buyPassSection = false;
                vm.usePassSection = false;
            }
        };
        //calculates discount according to user selectio on UI. This function will be called wheneve user changes options in drop down
        // down menu
        vm.getDiscount = function () {
            var typeData;
            if (vm.buyPassSection) {
                if (vm.selectedUserType === "Tranportation-workers") {
                    vm.passBtn = true;
                    vm.isTWorker = true;
                } else if (vm.selectedPassType === "Monthly") {
                    for (typeData in vm.transportData) {
                        if (vm.transportData[typeData].type === vm.selectedMode) {
                            vm.passCost = vm.transportData[typeData].rate_details["Monthly (Unlimited)"];
                        }
                    }
                    if (vm.selectedUserType !== "Regular") {
                        vm.passCost = appDataService.calculatePassCost(vm.passCost, vm.selectedUserType);
                    }
                    vm.isMonthly = true;
                    vm.passBtn = true;
                    vm.isTWorker = false;
                } else {
                    vm.isMonthly = false;
                    vm.passBtn = false;
                    vm.passCost = "";
                    vm.isTWorker = false;
                }
            }
        };
        // while adding the cost through input only digits and . should be allowed to be entered.
        vm.checkCost = function () {
            vm.passCost = vm.passCost.replace(/[^-0-9\.]/g, '');
            if (vm.passCost !== "") {
                vm.passBtn = true;
            } else {
                vm.passBtn = false;
            }
        };
        //while entering the pass id only digit should be allowed to be entered.
        vm.checkPassID = function () {
            vm.passID = vm.passID.replace(/[^-0-9]/g, '');
            if (vm.passID !== "") {
                vm.passInfoBtn = true;
                vm.returnMsg = {};
                vm.noPassFlag = false;
                vm.noPassMsg = "";
            } else {
                vm.passInfoBtn = false;
            }
        };
        // to generate the pass according to user selection.
        vm.generatePass = function () {
            vm.newPass = appDataService.createPassForUser(vm.selectedUserType, vm.selectedPassType, vm.selectedMode, vm.passCost);
            if (vm.newPass !== undefined || vm.newPass !== null) {
                vm.passGenerated = true;
                vm.buyPassSection = false;
                vm.usePassSection = false;
            }
        };
        // to fetch out the pass info corresponding to passed passID
        vm.getBalance = function () {
            vm.newPass = appDataService.getPassInfo(vm.passID);
            if (vm.newPass !== undefined) {
                vm.passGenerated = true;
            } else {
                vm.noPassFlag = true;
                vm.noPassMsg = "Pass doesnot exist Please buy a new pass";
            }
            vm.passID = "";
            vm.passInfoBtn = false;

        };
        // use/swipe the card by using passID and get the message from service whether it was valid or invalid.
        vm.swipeCard = function () {
            vm.returnMsg = appDataService.useTransitPass(vm.passID, vm.selectedMode);
            vm.passID = "";
            vm.passInfoBtn = false;
        };

    }]);

}());