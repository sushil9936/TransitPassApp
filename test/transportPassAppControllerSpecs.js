describe('transport-pass-system', function () {
    'use strict';
    var scope,
        controller,
        testService;
    beforeEach(function () {
        module('transport-pass-system');
    });

    describe('transportPassAppController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();

            controller = $controller('transportPassAppController', {
                '$scope': scope
            });
        }));
        it('Controller loaded : array of set of Actions should not be populated', function () {
            expect(controller.passActions.length).toBe(0);
        });

        it('call the init method : All variables should be initialized', function () {
            controller.init();
            scope.$digest();
            expect(controller.buyPassSection).toBe(false);
            expect(controller.usePassSection).toBe(false);
            expect(controller.checkBalanceSection).toBe(false);
            expect(controller.passBtn).toBe(false);
            expect(controller.isTWorker).toBe(false);
            expect(controller.isMonthly).toBe(false);
            expect(controller.selectedMode).toBe("");
            expect(controller.selectedPassType).toBe("");
            expect(controller.selectedDiscountType).toBe("");
            expect(controller.passCost).toBe("");
            expect(controller.passID).toBe("");
        });
        it('Call the getActions method : passActions array should be populated', function () {
            controller.getActions();
            scope.$digest();
            expect(controller.passActions.length).toBe(3);
        });
        it('Call the takeAction method : Data Corresponding to Buy Pass actions should be set from service calls', function () {
            controller.takeAction("Buy Pass");
            scope.$digest();
            expect(controller.transportData.length).toBe(3);
            expect(controller.selectedMode).toBe(controller.transportData[0].type);
            expect(controller.passTypes.length).toBe(2);
            expect(controller.selectedPassType).toBe(controller.passTypes[0]);
            expect(controller.userTypes.length).toBe(4);
            expect(controller.selectedUserType).toBe(controller.userTypes[0]);
            expect(controller.checkBalanceSection).toBe(false);
            expect(controller.buyPassSection).toBe(true);
            expect(controller.checkBalanceSection).toBe(false);

        });
        it('Call the getDiscount method : Monthly pass cost corresponding to mode selected should be fetched and displayed. Discount should be applied if applicable from service call.', function () {
            controller.takeAction("Buy Pass");
            controller.selectedPassType = "Monthly";
            controller.selectedMode = "SubWay";
            controller.selectedUserType = "Regular";
            controller.getDiscount();
            scope.$digest();
            expect(controller.passBtn).toBe(true);
            expect(controller.isTWorker).toBe(false);
            expect(controller.isMonthly).toBe(true);
            expect(controller.passCost).toBe(200);
        });
        it('Call the getDiscount method : Check whether student Discount Applied for the given mode', function () {
            controller.takeAction("Buy Pass");
            controller.selectedPassType = "Monthly";
            controller.selectedMode = "SubWay";
            controller.selectedUserType = "Students";
            controller.getDiscount();
            scope.$digest();
            expect(controller.passBtn).toBe(true);
            expect(controller.isTWorker).toBe(false);
            expect(controller.isMonthly).toBe(true);
            expect(controller.passCost).toBe(100);
        });
        it('Call the getDiscount method : Check whether elderly discoun Applied for given mode', function () {
            controller.takeAction("Buy Pass");
            controller.selectedPassType = "Monthly";
            controller.selectedMode = "Bus";
            controller.selectedUserType = "Elderly";
            controller.getDiscount();
            scope.$digest();
            expect(controller.passBtn).toBe(true);
            expect(controller.isTWorker).toBe(false);
            expect(controller.isMonthly).toBe(true);
            expect(controller.passCost).toBe(75);
        });
        it('Call the getDiscount method : Check whether user is Tranportation-workers and issue special pass', function () {
            controller.takeAction("Buy Pass");
            controller.selectedUserType = "Tranportation-workers";
            controller.getDiscount();
            scope.$digest();
            expect(controller.passBtn).toBe(true);
            expect(controller.isTWorker).toBe(true);
        });

        it('call checkCost : restrict used from entering characters other that numbers and disable generate pass button if input string is ""', function () {
            controller.passCost = "#$#DDFJHKJ";
            controller.checkCost();
            scope.$digest();
            expect(controller.passCost).toBe("");
            controller.passCost = "";
            expect(controller.passBtn).toBe(false);
        });
        it('call checkPassID : restrict used from entering characters other that numbers and disable swipe pass button if input string is ""', function () {
            controller.passID = "#$#DDFJHKJ";
            controller.checkPassID();
            scope.$digest();
            expect(controller.passID).toBe("");
            controller.passID = "";
            expect(controller.passInfoBtn).toBe(false);
        });
        it('call generatePass : Monthly Pass Should be generated with the parameters passed', function () {
            controller.selectedUserType = "Regular";
            controller.selectedPassType = "Monthly";
            controller.selectedMode = "Bus";
            controller.generatePass();
            scope.$digest();
            expect(controller.newPass).toNotBe(undefined);
            expect(controller.newPass.passNumber).toNotBe(undefined);
            expect(controller.newPass.type).toBe("Monthly");
            expect(controller.newPass.transportMode).toBe("Bus");
            expect(controller.newPass.userType).toBe("Regular");
            expect(controller.newPass.startDate).toNotBe(undefined);
            expect(controller.newPass.endDate).toNotBe(undefined);
        });
        it('call generatePass() : Prepaid Pass Should be generated with the parameters passed', function () {
            controller.selectedUserType = "Regular";
            controller.selectedPassType = "Prepaid";
            controller.selectedMode = "Bus";
            controller.passCost = "30";
            controller.generatePass();
            scope.$digest();
            expect(controller.newPass).toNotBe(undefined);
            expect(controller.newPass.passNumber).toNotBe(undefined);
            expect(controller.newPass.type).toBe("Prepaid");
            expect(controller.newPass.transportMode).toBe("Bus");
            expect(controller.newPass.userType).toBe("Regular");
            expect(controller.newPass.passAmount).toBe(30);
        });
        it('call getBalance() : Pass  details corresponding to ID passed should be returned from service', function () {
            controller.passID = "123456";
            controller.getBalance();
            scope.$digest();
            expect(controller.newPass).toNotBe(undefined);
            expect(controller.newPass.passAmount).toBe(20);
        });
         it('call getBalance() called with passID that does not exist : Service should return undefined ', function () {
            controller.passID = "556612";
            controller.getBalance();
            scope.$digest();
            expect(controller.newPass).toBe(undefined);
            expect(controller.noPassFlag).toBe(true);
        });
        it('call swipeCard() : Pass  should validated against details and other sections should be disabled', function () {
            controller.passID = "123456";
            controller.selectedMode = "Bus";
            controller.swipeCard();
            scope.$digest();
            expect(controller.returnMsg.swipeMsg.length).toNotBe(0);
            expect(controller.returnMsg.successFlag).toBe(true);
            expect(controller.passID).toBe("");
            expect(controller.passInfoBtn).toBe(false);
        });
         it('call swipeCard() card swiped with passID that does not exist : Return respons should consist of error message and successflag.', function () {
            controller.passID = "545456";
            controller.selectedMode = "Bus";
            controller.swipeCard();
            scope.$digest();
            expect(controller.returnMsg.swipeMsg.length).toNotBe(0);
            expect(controller.returnMsg.successFlag).toBe(false);
            expect(controller.passID).toBe("");
            expect(controller.passInfoBtn).toBe(false);
        });

    });
});
