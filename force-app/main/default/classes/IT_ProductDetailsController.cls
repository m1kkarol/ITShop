public without sharing class IT_ProductDetailsController {
    
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

        String query = 'SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = :productId';
    return Database.query(query);
    
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

    @AuraEnabled 
    public static List<ProductReview__c> getProductReviews(String prodId) {
        List<ProductReview__c> allReviews = [SELECT 
                                                Id,
                                                Name,
                                                ReviewContent__c,
                                                Rating__c,
                                                LastModifiedDate,
                                                CreatedDate,
                                                CreatedBy.Name,
                                                CreatedBy.SmallPhotoUrl,
                                                OwnerId
                                            FROM
                                                ProductReview__c
                                            WHERE 
                                                Product__c =: prodId
                                                AND isApproved__c = true];

        return allReviews; 
    }

    @AuraEnabled
    public static void deleteComment(String commentId){
        try {
            ProductReview__c prodRev = [SELECT Id FROM ProductReview__c WHERE Id=:commentId LIMIT 1];
            delete prodRev;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static ProductReview__c getCommentToEdit(String commentId) {
        ProductReview__c prodRev = [SELECT Id, Rating__c, ReviewContent__c FROM ProductReview__c WHERE Id=:commentId LIMIT 1];
        return prodRev;        
    }

    @AuraEnabled
    public static void updateComment(String commentId, String newContent, Integer newRating) {
        ProductReview__c prodRev = [SELECT Id, Rating__c, ReviewContent__c, isApproved__c FROM ProductReview__c WHERE Id=:commentId LIMIT 1];
        prodRev.Rating__c = newRating;
        prodRev.ReviewContent__c = newContent;
        prodRev.isApproved__c = false;
        update prodRev;
    }

    @AuraEnabled
    public static AggregateResult[] getRatingValue(String productId){

        AggregateResult[] groupedResults = [SELECT AVG(Rating__c) FROM ProductReview__c WHERE Product__c =: productId AND isApproved__c = true];
        
        return groupedResults;
    }

    @AuraEnabled(cacheable = true)
    public static AggregateResult[] getProductPrice(String productId) {
     
        AggregateResult[] groupedResults = [SELECT MIN(UnitPrice) FROM PricebookEntry WHERE Product2Id =: productId AND Pricebook2.isActive = true];

        return groupedResults;

    }

    @AuraEnabled(cacheable = true)
    public static PricebookEntry getStandardPrice(String productId){
        PricebookEntry standardPrice = [SELECT UnitPrice FROM PricebookEntry WHERE Pricebook2.isStandard = true AND Product2Id =: productId LIMIT 1];
        return standardPrice;
    }

    @AuraEnabled
    public static void addProductToCart(String prodId, Double price, Integer quantity){

        ProductCartWrapper product = new ProductCartWrapper();
        product.prodId = prodId;
        product.quantity = quantity;
        product.price = price;

        Boolean addToCart = true;

        List<ProductCartWrapper> products = new List<ProductCartWrapper>();

        if(Cache.Session.contains('ShopingCart')) {
            products = (List<ProductCartWrapper>)Cache.Session.get('ShopingCart');
            for(Integer i = 0 ; i<products.size(); i++) {
                if(products[i].prodId == product.prodId){
                    products[i].quantity += product.quantity;
                    addToCart = false;
                }
            }
            if(addToCart){
               products.add(product);
            }
            Cache.Session.put('ShopingCart', products);
        } else{
            List<ProductCartWrapper> newProdList = new List<ProductCartWrapper>();
            newProdList.add(product); 
            Cache.Session.put('ShopingCart', products);
        }   

    }

    @AuraEnabled
    public static List<ProductCartWrapper> getCache(){
        List<ProductCartWrapper> allProducts = new List<ProductCartWrapper>();

        if(Cache.Session.contains('ShopingCart')) {
             allProducts =  (List<ProductCartWrapper>)Cache.Session.get('ShopingCart');
        } else{
            System.debug('empty');
        }

        return allProducts;
    }

    @AuraEnabled
    public static List<ProductReview__c> checkComments(String userId, String productId) {
        
        List<ProductReview__c> prodRev = [SELECT Id FROM ProductReview__c WHERE OwnerId =:userId AND Product__c =: productId];
        
        return prodRev;
    }
    
}

