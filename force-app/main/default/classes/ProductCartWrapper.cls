public with sharing class ProductCartWrapper {
   
    @AuraEnabled
    public String prodId{get;set;}
    @AuraEnabled
    public Integer quantity{get;set;}
    @AuraEnabled
    public Double price {get;set;}

    public ProductCartWrapper(){

    }

    public ProductCartWrapper(String prodId, Integer quantity, Double price) {
        this.prodId = prodId;
        this.quantity = quantity;
        this.price = price;
    }
}
