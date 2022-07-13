public without sharing class IT_ProductsController {

    @AuraEnabled
    public static List<Product2> getNewestProduct() { 
        return [SELECT Id, Name, Product_Brand__c, Family, Product_Model__c, DisplayUrl FROM Product2 WHERE CreatedDate != NULL ORDER BY CreatedDate DESC Limit 6];
    }
}
