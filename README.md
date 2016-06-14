# TransitPassApp
This application is used to buy and use the transit pass for different transit modes and users.

Coding Exercise

A metropolitan transporatation authority : Commuter Pass System

This project is developed using angular JS, HTML and CSS.
In order to store the data required for the application, angular service called appDataService is created.
Jasmine Framework is used for doing unit testing.

User can buy the pass, use the pass and check balance for particular pass usign this system.
In order to achieve the specified requirements in document given, project work can be divided into 3 sprints as follows:

Sprint 1: 
Following points should be covered in this sprint
1. Analyze the Requirements.
2. Design the project structure.
3. Decide and technology / platform to be used.
4. Design data service which will act as database for this application.
5. Create functions related to getting data for "Buy Pass" functionality
6. Apply unit testing for the functions created in service.
7. Design structure layout for UI and create HTML template page using angularJS
8. Create angular js controller which will be associated with particular HTML template page.
9. Intgration testing for whole application. Manual / Automated.

Sprint 2: 
Following points should be covered in this sprint
1. Associate service data with controller and show it on UI side.
2. Apply validation as per user selection on UI side.
3. Apply discounts as per user selection on UI side.
4. Implement Buy pass / Generate Pass functionality with proper validations and discounts applied as per pass category.
5. Apply unit testing for the functions in controller.
6. Create lay out for other functionality and associate it with controller.
7. Create a method in service to implement Use pass Functionality.
8. Apply Unit testing for the method created.
9. Intgration testing for whole application. Manual / Automated.

Sprint 3:
Following points should be covered in this sprint
1. Implement the use pass functionality by associating service method to controller
2. Apply unit testing as required.
3. Design and implement the show balance functionality using existing logic.
4. Recharge card functionality can be added for which create a method in service to update the existing pass amount.
5. Design UI to accept user inputs required to recharge the card and associate information in controller.
6. Unit test the functionality.
7. Design UX and Apply proper styling as needed.
8. Intgration testing for whole application. Manual / Automated.
9. Change the data in Service and test the application.


In this working prototype almost all the requirements are covered as specified in the document.
Application Data is kept in separate service so in case in future prices and discounts are changed, only this service will be updated.
No significant changes will be required to be done in other parts of application.
I have tried to maintain MVC structure in this application.

How to Use the Application:
Acces the application URL usig 
http://sushil9936.github.io/TransitPassApp/index.html

Actions that can be done using Application
Use can Buy Pass, Use Pass or Check Balance for existing pass using PASS ID
Note : For using Pass or checking balance we will need to note the 6 digit pass number which will generated when the pass is issued for the first time.

Buy Pass Section:
  User may select mode of transpot, type of user and type of pass (monthly / prepaid)
    If user selects transportation-worker special pass with no other details can be generated.
  If user selects type of user as students / elderly and pass type as monthly : specified discount for each category will be applied and cost for pass will be updated.
  If the user selects type of pass as prepaid, he will be allowed to enter the pass amount to be upload on card.
  Finally user will create the pass by clicking getPass button.
  
  Generated pass will be shown where user should note down the pass number genereated.
  
Use Pass Section:
 Select the transit mode for which you want to use the pass.
 Enter the pass number you noted for your generated pass.
 Swipe the card to use the pass.
 
Check Balance Section
 Enter the pass number you noted down and get the balance for specific card.
 
Regarding Unit Tests:

For applying unit tests , Jasmine is used which is popular for unit testing angularJS apps.
specs files conrresponding to each js file i.e. controller and service are created and unitTest.html file will run the the unit tests specified in the specs.
Each and every method in both controller and service are called using some selelcted values and output is tested by passing expected values.
You can run the Unit tests using
http://sushil9936.github.io/TransitPassApp/test/unitTest.html

In future, application can be made more interactive by using advanced styling.
We may create separate controller for separate sections on page or angular directives in order to have independent component on UI side.
However, future changes in data can be easily accomodated since we just have to change the appDataService.js.

