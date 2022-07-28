public with sharing class IT_FAQFormController {
    @AuraEnabled(cacheable = true)
    public static List<Knowledge__DataCategorySelection> getKnowledgeRecord(){
        List<Knowledge__DataCategorySelection> knowledgeList = new List<Knowledge__DataCategorySelection>();
        knowledgeList = [SELECT ParentId, DataCategoryGroupName, Parent.Answer__c, Parent.Question__c FROM Knowledge__DataCategorySelection 
                            WHERE Parent.isLatestVersion = true];
        System.debug(knowledgeList);
        return knowledgeList; 
   }
}
