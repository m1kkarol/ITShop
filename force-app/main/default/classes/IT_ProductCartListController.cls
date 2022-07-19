public with sharing class IT_ProductCartListController {

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
    public static List<Product2> getProductsDetails(List<String> productIds) {
        List<Product2> prodDetails = new List<Product2>();
        System.debug(productIds);

        prodDetails = [SELECT Id, Name, Product_Brand__c, Family, Product_Model__c, Description, DisplayUrl FROM Product2 WHERE Id IN: productIds];
        
        System.debug(prodDetails);
       

        
        return prodDetails;
    }

    @AuraEnabled
    public static void updateQuantity(String prodId, Integer quantity) {
        List<ProductCartWrapper> allProducts = new List<ProductCartWrapper>();

        allProducts = (List<ProductCartWrapper>)Cache.Session.get('ShopingCart');

        for(Integer i = 0; i < allProducts.size(); i++){
            if(allProducts[i].prodId == prodId){
                allProducts[i].quantity = quantity;
            }
        }

        Cache.Session.put('ShopingCart', allProducts);
    }

    @AuraEnabled
    public static void removeProduct(String prodId) {
        List<ProductCartWrapper> allProducts = new List<ProductCartWrapper>();

        allProducts = (List<ProductCartWrapper>)Cache.Session.get('ShopingCart');

        for(Integer i = 0; i < allProducts.size(); i++){
            if(allProducts[i].prodId == prodId){
                allProducts.remove(i);
            }
        }

        Cache.Session.put('ShopingCart', allProducts);
    }
}
