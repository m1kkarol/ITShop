public with sharing class IT_CaseHistoryWrapper {
    
    @AuraEnabled
    public String productName{get;set;}
    @AuraEnabled
    public String productModel{get;set;}
    @AuraEnabled
    public String reason{get;set;}
    @AuraEnabled
    public String status{get;set;}
    @AuraEnabled
    public Datetime createdDate{get;set;}
    @AuraEnabled
    public String description{get;set;}
    @AuraEnabled
    public String displayUrl{get;set;}
    @AuraEnabled
    public String caseNumber{get;set;}


    public IT_CaseHistoryWrapper(){

    }

    public IT_CaseHistoryWrapper(String productName, String reason, String status, Datetime createdDate, String description, String displayUrl, String caseNumber) {
        this.productName = productName;
        this.reason = reason;
        this.status = status;
        this.createdDate = createdDate;
        this.description = description;
        this.displayUrl = displayUrl;
        this.caseNumber = caseNumber;
    }

}
