describe('appDataService Test', function () {
    'use strict';
    var testService;
    beforeEach(module('transport-pass-system'));

    beforeEach(inject(function (_appDataService_) {
        testService = _appDataService_;
    }));
    it('Service  Method getPassActions() Called : array of set of Actions should be returned', function () {
        var passActions = testService.getPassActions();
        expect(passActions.length).toBe(3);
        expect(passActions[0]).toBe("Buy Pass");
        expect(passActions[1]).toBe("Use Pass");
        expect(passActions[2]).toBe("Check Balance");
    });
    it('Service  Method getTransportDetails() Called : array of set of transport modes and details should be returned', function () {
        var transportData = testService.getTransportDetails();
        expect(transportData.length).toBe(3);
        expect(transportData[0].type).toBe("Bus");
        expect(transportData[1].type).toBe("SubWay");
        expect(transportData[2].type).toBe("Commuter-Rail");
    });
    it('Service  Method getPassTypes() Called : array of set of passTypes should be returned', function () {
        var passTypes = testService.getPassTypes();
        expect(passTypes.length).toBe(2);
        expect(passTypes[0]).toBe("Prepaid");
        expect(passTypes[1]).toBe("Monthly");
    });
    it('Service  Method getUserTypes() Called : array of set of userTypes should be returned', function () {
        var userTypes = testService.getUserTypes();
        expect(userTypes.length).toBe(4);
        expect(userTypes[0]).toBe("Regular");
        expect(userTypes[1]).toBe("Students");
        expect(userTypes[2]).toBe("Elderly");
        expect(userTypes[3]).toBe("Tranportation-workers");
    });
    it('Service  Method createPassForUser() Called : Pass with specified parameters should be generated and returned', function () {
        var newPass = testService.createPassForUser("Students", "Prepaid", "SubWay", "30");
        expect(newPass).toNotBe(undefined);
        expect(newPass.passNumber).toNotBe(undefined);
        expect(newPass.type).toBe("Prepaid");
        expect(newPass.transportMode).toBe("SubWay");
        expect(newPass.userType).toBe("Students");
        expect(newPass.passAmount).toBe(30);
    });
    it('Service  Method getPassInfo() Called : Pass corresponding to ID passed should be returned', function () {
        var newPass = testService.getPassInfo("123456");
        expect(newPass).toNotBe(undefined);
        expect(newPass.passNumber).toBe(123456);
        expect(newPass.type).toBe("Prepaid");
        expect(newPass.userType).toBe("Regular");
    });
    it('Service  Method calculatePassCost() Called : Specified discount should be applied and result value should be returned', function () {
        var discountedCost = testService.calculatePassCost(100, "Students");
        expect(discountedCost).toBe(50);
    });
    it('Service  Method useTransitPass() Called : Pass should be validated, corresponding discount should be applied and then success return message should be generated', function () {
        var returnMsg = testService.useTransitPass(123456, "Bus");
        expect(returnMsg.swipeMsg.length).toNotBe(0);
        expect(returnMsg.swipeMsg.successFlag).toNotBe(false);
    });


});