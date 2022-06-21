@isTest
public with sharing class WebToLeadControllerTest {
    @isTest
    public static void shouldSuccess() {
        ApexPages.currentPage().getParameters().put('success', 'true');
        WebToLeadController test = new WebToLeadController();
        System.assertEquals(WebToLeadController.successValue, true);
    }
}