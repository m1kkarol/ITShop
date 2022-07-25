public with sharing class IT_CaseHistoryController {
    

    @AuraEnabled(cacheable = true)
    public static List<IT_CaseHistoryWrapper> getCaseHistory(String orderId){
       
        List<Case> casesHistory = new List<Case>();
        List<IT_CaseHistoryWrapper> casesHistoryWrap = new List<IT_CaseHistoryWrapper>();
        casesHistory = [SELECT Id, Reason, Status, ProductId, CreatedDate, Description, CaseNumber FROM Case WHERE Order__c =: orderId];

        Set<Id> productsIds = new Set<Id>();
        for(Integer i = 0; i < casesHistory.size(); i++){
            productsIds.add(casesHistory[i].ProductId);
        }

        List<Product2> products = [SELECT Name, Product_Model__c, DisplayUrl FROM Product2 WHERE Id IN: productsIds];

        for(Integer i = 0 ; i < casesHistory.size(); i++){
            for(Integer j = 0; j < products.size(); j++){
                
                if(casesHistory[i].ProductId == products[j].Id) {
                
                    IT_CaseHistoryWrapper caseHistoryWrapper = new IT_CaseHistoryWrapper();

                    caseHistoryWrapper.productName = products[j].Name;
                    caseHistoryWrapper.productModel = products[j].Product_Model__c;
                    caseHistoryWrapper.displayUrl = products[j].DisplayUrl;
                    caseHistoryWrapper.reason = casesHistory[i].Reason;
                    caseHistoryWrapper.status = casesHistory[i].Status;
                    caseHistoryWrapper.createdDate = casesHistory[i].CreatedDate;
                    caseHistoryWrapper.description = casesHistory[i].Description;
                    caseHistoryWrapper.caseNumber = casesHistory[i].CaseNumber;

                    casesHistoryWrap.add(caseHistoryWrapper);
                }
            }
        }

        

       
        return casesHistoryWrap;
    }

}
