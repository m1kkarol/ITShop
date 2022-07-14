public with sharing class IT_ProductDetailsController {
    
    @AuraEnabled(cacheable = true)
    public static List<Product2> getProductDetails(String productId) {
        List<Product2> prodDetails = new List<Product2>();

        prodDetails = [SELECT Id, Name, Product_Brand__c, Family, Product_Model__c, Description, DisplayUrl FROM Product2 WHERE Id =: productId LIMIT 1];

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

    @AuraEnabled
    public static void addProductReviews(String prodId, String userId, Integer rating, String commentContent) {

        Product2 prod = [SELECT Id, Name FROM Product2 WHERE Id =: prodId];

        System.debug('test apex review');

        ProductReview__c prodRev = new ProductReview__c();

        prodRev.Product__c = prod.Id;
        prodRev.Rating__c = rating;
        prodRev.ReviewContent__c = commentContent;
  

        insert prodRev;

    }

    @AuraEnabled(cacheable = true) 
    public static List<ProductReview__c> getProductReviews(String prodId) {
        List<ProductReview__c> allReviews = [SELECT 
                                                Id,
                                                Name,
                                                ReviewContent__c,
                                                Rating__c,
                                                LastModifiedDate,
                                                CreatedDate,
                                                CreatedBy.Name,
                                                CreatedBy.SmallPhotoUrl
                                            FROM
                                                ProductReview__c
                                            WHERE 
                                                Product__c =: prodId];

        return allReviews; 
    }

    @AuraEnabled
    public static AggregateResult[] getRatingValue(String productId){

        AggregateResult[] groupedResults = [SELECT AVG(Rating__c) FROM ProductReview__c WHERE Product__c =: productId];
        
        return groupedResults;
    }

    @AuraEnabled(cacheable = true)
    public static AggregateResult[] getProductPrice(String productId) {
     
        AggregateResult[] groupedResults = [SELECT MIN(UnitPrice) FROM PricebookEntry WHERE Product2Id =: productId AND Pricebook2.isActive = true];

        return groupedResults;

    }
}

