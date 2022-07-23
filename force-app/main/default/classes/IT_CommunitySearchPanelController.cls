public with sharing class IT_CommunitySearchPanelController {
   
    @AuraEnabled
    public static List<Product2> searchProducts(String prodName){

        List<Product2> products = new List<Product2>();

        String query = 'SELECT Id, Name,Product_Model__c, Family, Product_Brand__c, ProductCode, DisplayUrl FROM Product2 WHERE Id != NULL AND Name LIKE \'%' + prodName + '%\'';

        products = Database.query(query);

        System.debug(products);


        return products;
    }
}
