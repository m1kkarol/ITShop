public with sharing class IT_ProductDetailsController {
    
    @AuraEnabled(cacheable = true)
    public static List<Product2> getProductDetails(String productId) {
        List<Product2> prodDetails = new List<Product2>();

        prodDetails = [SELECT Id, Name, Product_Brand__c, Family, Product_Model__c, DisplayUrl FROM Product2 WHERE Id =: productId LIMIT 1];

        if(prodDetails.size() <= 0) {
            return prodDetails;
        } else { 
            return prodDetails;
        }
   
    }

    @AuraEnabled(cacheable = true) 
    public static List<ContentVersion> getDetailsImg(String productId){
            return [
        SELECT
                Id,
                ContentDocumentId,
                FirstPublishLocationId
        FROM ContentVersion
        WHERE FirstPublishLocationId =:productId
        ];
    
    }
}
