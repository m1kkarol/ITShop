public with sharing class IT_PricebookManagerController {

    @AuraEnabled
    public static List<Pricebook2> getPricebooks(String pricebookName) {
        
        List<Pricebook2> pricebooks = new List<Pricebook2>();
        String query = 'SELECT Id, Name, isActive, IsStandard, Description, Start_Date__c, End_Date__c FROM Pricebook2 WHERE Name LIKE \'%' + String.escapeSingleQuotes(pricebookName) + '%\'';
        
        pricebooks = Database.query(query);

        return pricebooks;

    }

    @AuraEnabled 
    public static List<Product2> getProducts(String productName) {
        List<Product2> products = new List<Product2>();
        String query = 'SELECT Id, Product_Brand__c, Product_Model__c, Name FROM Product2 WHERE Name LIKE \'%' + String.escapeSingleQuotes(productName) + '%\'';

        products = Database.query(query);
        
        return products;
    }

    @AuraEnabled
    public static List<PricebookEntry> getAllProductPrices() {
        Pricebook2 standard = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];

        return [SELECT Product2.Name, PricebookEntry.UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: standard.Id];

    }

    @AuraEnabled
    public static List<PricebookEntry> updatePricebookCurrency(List<String> ids, String pricebookId, Double price) {
        
        System.debug(ids);

        List<PricebookEntry> pbEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: ids]) {
            pricebookEntry.UnitPrice += price;
            pbEntries.add(pricebookEntry);
        }

        update pbEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
    }

    @AuraEnabled
    public static List<PricebookEntry> updatePricebookPercent(List<String> ids, String pricebookId, Double price) {
        
        List<PricebookEntry> pbEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: ids]) {
            pricebookEntry.UnitPrice = pricebookEntry.UnitPrice * ( 1- (price/100));
            pbEntries.add(pricebookEntry);
        }

        update pbEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
    }

    @AuraEnabled 
    public static List<PricebookEntry> updatePricebookNewPrice(List<String> ids, String pricebookId, Double newPrice) {
        List<PricebookEntry> pbEntries = new List<PricebookEntry>();

        for(PricebookEntry pricebookEntry : [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Id IN: ids]) {
            pricebookEntry.UnitPrice = newPrice;
            pbEntries.add(pricebookEntry);
        }

        update pbEntries;

        return [SELECT Id, UnitPrice, Pricebook2Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
    }
    

    @AuraEnabled
    public static List<PricebookEntry> getAllPricebookEntries(String recordId) {

        return [SELECT Id, Product2.Name, PricebookEntry.UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: recordId];
    }

    @AuraEnabled
    public static List<Product2> getAllProducts() {
        return [SELECT Id, Name, Product_Brand__c, Product_Model__c FROM Product2 WHERE Id != null];
    }


    @AuraEnabled
    public static void addProductsToPricebook(String pricebookId, List<String> productId) {
        
        Pricebook2 standard = [SELECT Id FROM Pricebook2 WHERE IsStandard=true];

        List<PricebookEntry> standardEntry = [SELECT Product2.Name, PricebookEntry.UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: standard.Id];

        List<PricebookEntry> newPricebookEntries = new List<PricebookEntry>();

        for(String id: productId) {
            PricebookEntry pricebookEntry = new PricebookEntry();
            
            pricebookEntry.Pricebook2Id = pricebookId;
            pricebookEntry.Product2Id = id; 
            

            for(PricebookEntry pricebook: standardEntry) {
                if(pricebook.Product2Id == pricebookEntry.Product2Id) { 
                    pricebookEntry.UnitPrice = pricebook.UnitPrice;
                }
            }


            newPricebookEntries.add(pricebookEntry);

        }

        insert newPricebookEntries;
    }

}
