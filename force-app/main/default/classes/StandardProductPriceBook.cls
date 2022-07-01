public with sharing class StandardProductPriceBook {
    
    @AuraEnabled
    public static Boolean setPrice(Id prodId, Double prodPrice){
        
        

        PricebookEntry pricebookentry = new PricebookEntry();

        PriceBook2 priceBookId = [SELECT Id FROM PriceBook2 WHERE IsStandard = true LIMIT 1];
        
        pricebookentry.Pricebook2Id = priceBookId.Id;
        pricebookentry.UnitPrice = prodPrice;
        pricebookentry.Product2Id = prodId;

        Database.SaveResult savePrice = Database.insert(pricebookentry, false);

        if(savePrice.isSuccess()) {
            return true;
        } else { 
            return false;
        }

        
    }
    @AuraEnabled
    public static Boolean upDatePrice(Id prodId, Double prodPrice){
        
        

        PriceBook2 priceBookId = [SELECT Id FROM PriceBook2 WHERE IsStandard = true LIMIT 1];

        PricebookEntry pricebookentry1 = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: priceBookId.Id AND Product2Id =: prodId];

        pricebookentry1.UnitPrice = prodPrice;
        
    
        Database.SaveResult savePrice = Database.update(pricebookentry1, false);

        if(savePrice.isSuccess()) {
            return true;
        } else { 
            return false;
        }

        
    }



    @AuraEnabled
    public static Double getPrice(Id prodId) {

        PricebookEntry pricebookentry  = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id =: prodId ];
        system.debug(pricebookentry);
        return pricebookentry.UnitPrice;
    }
}
