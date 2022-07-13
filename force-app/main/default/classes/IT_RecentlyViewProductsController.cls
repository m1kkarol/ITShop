public with sharing class IT_RecentlyViewProductsController {
    @AuraEnabled
    public static List<Product2> getRecentlyView() {
        List<RecentlyViewed> recentlyViewedProductsId = [SELECT Id FROM RecentlyViewed WHERE Type = 'Product2' AND LastViewedDate = LAST_N_DAYS:7 ORDER BY LastViewedDate DESC LIMIT 3];

        Set<Id> productsId = new Set<Id>();
        for(RecentlyViewed recv : recentlyViewedProductsId) {
            productsId.add(recv.Id);
        }

        return [SELECT Id, Name, Product_Brand__c, Family,  Product_Model__c, DisplayUrl FROM Product2 WHERE ID in :productsId ORDER BY Name];
    } 
}
