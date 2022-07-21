public with sharing class IT_OrderHistoryController {
    
    @AuraEnabled(cacheable = true)
    public static List<Order> getOrders(Id userId){
        List<Order> orders = [SELECT Id, EffectiveDate, TotalAmount , Status, OrderNumber FROM Order WHERE CreatedById =: userId ORDER BY EffectiveDate DESC];

        return orders;
    }

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
                    orderItemWrap.unitPrice = orderItems[i].UnitPrice;
                    orderItemWrap.quantity = orderItems[i].Quantity;
                    orderItemsWrap.add(orderItemWrap);
                }

                
           }
        }

        return orderItemsWrap;
    }
}
