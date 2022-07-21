public with sharing class OrderItemDetailsWrapper {

    @AuraEnabled
    public Id orderItemId{get;set;}

    @AuraEnabled
    public Id productId{get;set;}
    
    @AuraEnabled
    public String productName{get;set;}
    
    @AuraEnabled
    public String productModel{get;set;}
    
    @AuraEnabled
    public String displayUrl{get;set;}
    
    @AuraEnabled
    public Double unitPrice{get;set;}
    
    @AuraEnabled
    public Decimal quantity{get;set;}
    
    public OrderItemDetailsWrapper(){

    }

    public OrderItemDetailsWrapper(Id orderItemId, Id productId, String productName, String productModel, String displayUrl, Double unitPrice, Decimal quantity) {
        orderItemId = this.orderItemId;
        productId = this.productId;
        productName = this.productName;
        productModel = this.productModel;
        displayUrl = this.displayUrl;
        unitPrice = this.unitPrice;
        quantity = this.quantity;
    }

}
