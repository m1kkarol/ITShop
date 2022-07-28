public without sharing class IT_CaseController {
    @AuraEnabled(cacheable = true)
    public static List<OrderItemDetailsWrapper> getOrderItems(Id orderId) {
        List<OrderItem> orderItems = [SELECT Id, Product2Id, Quantity, UnitPrice FROM OrderItem WHERE OrderId =: orderId];

        Set<Id> prodIds = new Set<Id>();
        for(Integer i = 0; i < orderItems.size(); i ++){
            prodIds.add(orderItems[i].Product2Id);
        }

        List<Product2> products = [SELECT Name, Product_Brand__c, Product_Model__c, DisplayUrl FROM Product2 WHERE Id IN: prodIds];



        List<OrderItemDetailsWrapper> orderItemsWrap = new List<OrderItemDetailsWrapper>();

        for(Integer i = 0; i < orderItems.size(); i++){
            for(Integer j = 0; j < products.size(); j++){
                if(orderItems[i].Product2Id == products[j].Id){
                    OrderItemDetailsWrapper orderItemWrap = new OrderItemDetailsWrapper();
                
                    orderItemWrap.orderItemId = orderItems[i].Id;
                    orderItemWrap.productId = products[j].Id;
                    orderItemWrap.productName = products[j].Name;
                    orderItemWrap.productModel = products[j].Product_Model__c;
                    orderItemWrap.displayUrl = products[j].DisplayUrl;
                    orderItemWrap.quantity = orderItems[i].Quantity;
                    orderItemsWrap.add(orderItemWrap);
                }

                
           }
        }

        return orderItemsWrap;
    }

    @AuraEnabled
    public static Id getAccount(){
        Account account = [SELECT Id FROM Account WHERE Name = 'Shop Account'];

        return account.Id;
    }

    public static Id getContactId(String userId) {
        List<User> u = new List<User>();
        u = [SELECT u.ContactId FROM User u WHERE u.Id =: userId LIMIT 1];
        
        return u[0].ContactId;
    }

    @AuraEnabled
    public static void createCase(String productsCase){
    
        AssignmentRule AR = new AssignmentRule();
        AR = [SELECT Id FROM AssignmentRule WHERE SobjectType = 'Case' AND Active = true LIMIT 1];


        Database.DMLOptions dmlOpts = new Database.DMLOptions();
        dmlOpts.assignmentRuleHeader.assignmentRuleId = AR.Id;

        List<Object> cases = (List<Object>)JSON.deserializeUntyped(productsCase);
        List<Case> newCases = new List<Case>();

        for(Object c: cases){
            Map<String, Object> caseData = (Map<String, Object>)c;
            String userId = (String)caseData.get('userId');
            String orderId = (String)caseData.get('orderId');
            String productId = (String)caseData.get('productId');
            String description = (String)caseData.get('description');
            String caseReason = (String)caseData.get('caseReason');

            Case productCase = new Case();
            productCase.AccountId = getAccount();
            productCase.ContactId = getContactId(userId);   
            productCase.Order__c = orderId;
            productCase.Description = description;
            productCase.Reason = caseReason;
            productCase.Status = 'New';
            productCase.Origin = 'Web';
            productCase.ProductId = productId;
            productCase.setOptions(dmlOpts);
        

        

            newCases.add(productCase);

        }

        
        
        insert newCases;
    }

}
