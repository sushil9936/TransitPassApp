/*jslint browser: true*/
/*global angular*/

(function () {
    'use strict';
    // this service consist of application specific data required for pass generating application.
    // other manipulations on according to user actions such as buy pass, use pass and check balance 
    // will be handled in this service by different functions.
    // Data will be provided and stored to the application using this service.
    // in future this data can be altered which will not have impact on application usage.
    
    var myApp = angular.module('transport-pass-system'),
        passActions = ["Buy Pass", "Use Pass", "Check Balance"],

        transportDetails = [
            {
                "type": "Bus",
                "rate_details": {
                    "Monthly (Unlimited)": 150,
                    "Prepaid (Per-Ride)": 3
                }
            },
            {
                "type": "SubWay",
                "rate_details": {
                    "Monthly (Unlimited)": 200,
                    "Prepaid (Per-Ride)": 4
                }
            },
            {
                "type": "Commuter-Rail",
                "rate_details": {
                    "Monthly (Unlimited)": 300,
                    "Prepaid (Per-Ride)": 8
                }
            }
        ],
        discounts = [
            {
                "type": "Students",
                "discount": 50
            },
            {
                "type": "Elderly",
                discount: 50
            },
            {
                "type": "Tranportation-workers",
                "discount": 0
            },
            {
                "type": "Weekend",
                "discount": 75
            }
        ],
        passTypes = ["Prepaid", "Monthly"],
        generatedPasses = [{
            "passNumber": 123456,
            "userType": "Regular",
            "type": "Prepaid",
            "passAmount": 20,
            "transportMode": "Bus"

        }],
        userTypes = ["Regular", "Students", "Elderly", "Tranportation-workers"];
    // above specified data can be changed in future as per requirement.
    // following service will be storing and returning the data required by application.
    myApp.service('appDataService', [function () {
        this.getPassActions = function () {
            return passActions;
        };
        this.getTransportDetails = function () {
            return transportDetails;
        };
        this.getPassTypes = function () {
            return passTypes;
        };
        this.getUserTypes = function () {
            return userTypes;
        };
        this.getDiscountsData = function () {
            return discounts;
        };
        this.createPassForUser = function (userType, passType, mode, passCost) {
            var newPass,
                pId = Math.floor(100000 + Math.random() * 900000),
                sDate,
                eDate;
            // for tranporation-workers special pass is created 
            if (userType === "Tranportation-workers") {
                newPass = {
                    "passNumber": pId,
                    "userType": userType
                };
            } else if (passType === "Monthly") {
                // for monthly pass we need start date and end data to check the validity during each usage.
                sDate = new Date();
                eDate = new Date(sDate);
                eDate.setDate(eDate.getDate() + 30);
                newPass = {
                    "passNumber": pId,
                    "type": passType,
                    "startDate": sDate,
                    "endDate": eDate,
                    "transportMode": mode,
                    "passAmount": parseInt(passCost),
                    "userType": userType
                };
            } else {
                //for prepaid pass we will store the information that user has selected on UI
                newPass = {
                    "passNumber": pId,
                    "type": passType,
                    "transportMode": mode,
                    "passAmount": parseInt(passCost),
                    "userType": userType
                };
            }
            // formed object will be push into the array consisting existing generated passes.
            generatedPasses.push(newPass);
            // generated pass is returned in order to show its information to user.
            return newPass;
        };
        //pass information corresponding to passID passed can be fetched out using this function.
        this.getPassInfo = function (passID) {
            var no;
            if (passID !== undefined) {
                for (no in generatedPasses) {
                    if (generatedPasses[no].passNumber === parseInt(passID)) {
                        return generatedPasses[no];
                    }
                }
            }
        };
        // discount will be applied as per the type of the user specified in pass using this function.
        this.calculatePassCost = function (passCost, usrType) {
            var dsData;
            for (dsData in discounts) {
                if (discounts[dsData].type === usrType) {
                    passCost = (passCost * discounts[dsData].discount) / 100;
                }
            }
            return passCost;
        };
        // inf order to use the transit pass, passID and mode of transport selected are passed to this function.
        this.useTransitPass = function (passID, mode) {
            var tPass = this.getPassInfo(passID),
                swipeMsg = "",
                rideCharge,
                typeData,
                today = new Date(),
                successFlag = false,
                returnMsg = {};
            
            //return error message in case pass does not exist on record.
            if (tPass === undefined || tPass === null) {
                swipeMsg = swipeMsg + "Pass doesnot exist Please buy a new pass";
                successFlag = false;
                returnMsg.swipeMsg = swipeMsg;
                returnMsg.successFlag = successFlag;
                return returnMsg;
            }
            
            // in care of transportation workers, allow them to use any kind of transit service.
            if (tPass.userType === "Tranportation-workers") {
                swipeMsg = "Tranportation-workers card is Active and can be used for any transport.";
                successFlag = true;
                
            } else if (tPass.type === "Prepaid") {
                for (typeData in transportDetails) {
                    //in case of prepaid passed fetch out cost for particular mode of transit.
                    if (transportDetails[typeData].type === mode) {
                        rideCharge = transportDetails[typeData].rate_details["Prepaid (Per-Ride)"];
                    }
                }
                
                //check whether its weekend or not.
                
                if (today.getDay() === 6 || today.getDay() === 0) {
                    swipeMsg = swipeMsg + "Weekend Discount Applied";
                    //apply weekend discount by passing the rideCharge for selelcted mode and weekend as parameter.
                    rideCharge = this.calculatePassCost(rideCharge, "Weekend");
                }
                
                // apply discount according to user type such as students / elderly
                
                rideCharge = this.calculatePassCost(rideCharge, tPass.userType);
                
                //update the cost on pass
                tPass.passAmount = tPass.passAmount - rideCharge;
                if (tPass.passAmount > 0) {
                    
                    swipeMsg = swipeMsg + tPass.userType + " Discount Applied. Card charged for transport mode " + mode + ". Your Balance is " + tPass.passAmount + " Enjoy your Journey";
                    successFlag = true;
                    
                } else {
                    
                    //if passAmount goes below 0 return error message 
                    swipeMsg = "InSufficient Balance!! Buy new Card.";
                    successFlag = false;
                }
                
            } else if (tPass.type === "Monthly") {
                //in case if the pass is monthly pass check the date range validitiy and allowed transport mode.
                if (today >= tPass.startDate && today <= tPass.endDate && mode === tPass.transportMode) {
                    swipeMsg = "Monthly Pass Valid. Thanks for using. Enjoy your Journey.";
                    successFlag = true;
                } else {
                    swipeMsg = "Monthly Pass Expired or Invalid for selected Transit Mode.";
                    successFlag = false;
                }
            }
            returnMsg.swipeMsg = swipeMsg;
            returnMsg.successFlag = successFlag;
            return returnMsg;
        };
    }]);

}());