public with sharing class IT_NewOrderController {
    
    @AuraEnabled
    public static Id createNewContract(){
        Contract contract = new Contract();

        contract.AccountId = getAccount();
        contract.Status = 'Draft';
        contract.StartDate = Date.today();
        contract.ContractTerm = 1;
        contract.Pricebook2Id = getStandardPricebook();

        System.debug(contract);
        insert contract;
        return contract.Id;

    }

    @AuraEnabled
    public static Id getAccount(){
        Account account = [SELECT Id FROM Account WHERE Name = 'Shop Account'];

        return account.Id;
    }

    @AuraEnabled
    public static Id getStandardPricebook(){
        Pricebook2 pricebook = new Pricebook2();

        pricebook = [SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];

        return pricebook.Id;
    }

    @AuraEnabled
    public static String addOrderItem(String orderId){
        List<ProductCartWrapper> allProducts = new List<ProductCartWrapper>();
        allProducts =  (List<ProductCartWrapper>)Cache.Session.get('ShopingCart');

        System.debug(allProducts);

        Set<Id> productsIds = new Set<Id>();
        for(Integer i = 0 ; i<allProducts.size(); i++){
            productsIds.add(allProducts[i].prodId);
        }

        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];
        List<PricebookEntry> pricebookEntries = [SELECT Id, UnitPrice, Product2Id FROM PricebookEntry WHERE Pricebook2Id =: pricebook.Id AND Product2Id IN :productsIds];


        List<OrderItem> orderItems = new List<OrderItem>();

        for(Integer i = 0 ; i < allProducts.size(); i ++ ){
            
            for(Integer j = 0; j < pricebookEntries.size(); j++){
                if(allProducts[i].prodId == pricebookEntries[j].Product2Id){

                    OrderItem orderItem = new OrderItem();
                    orderItem.Product2Id = allProducts[i].prodId;
                    orderItem.Quantity = allProducts[i].quantity;
                    orderItem.OrderId = orderId;
                    orderItem.UnitPrice = allProducts[i].price;
                    orderItem.PricebookEntryId = pricebookEntries[j].Id;

                    orderItems.add(orderItem);
                }

            }

        }
        Order orderNumber = [SELECT OrderNumber FROM Order WHERE Id =: orderId ];
        
        insert orderItems;


        return orderNumber.OrderNumber;
    }

    @AuraEnabled
    public static void clearCache(){
        List<ProductCartWrapper> prodList = new List<ProductCartWrapper>();
        Cache.Session.put('ShopingCart', prodList);
    }

}
