trigger IT_CreateContentDocumentLink on ContentDocumentLink (after insert)  {
 List <ContentDocumentLink> contenDocLinkToUpdate = new List<ContentDocumentLink>();
    String idOfRecord = '';
    for(ContentDocumentLink c: Trigger.New){
        idOfRecord = c.Id; 
    }
    System.debug(idOfRecord);
   
    List<ContentDocumentLink> contDocLink = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE Id =:idOfRecord];

    Set<Id> ids = new Set<Id>();
    for(Integer i = 0; i < contDocLink.size(); i++){
        ids.add(contDocLink[i].ContentDocumentId);
    } 
    System.debug(ids);
    
    List<ContentDistribution> contDistrubtion = new List<ContentDistribution>();
    
    
    List<ContentVersion> contVersions = [SELECT Id FROM ContentVersion WHERE ContentDocumentId IN: ids];
    System.debug(contVersions);

    for(ContentVersion conVer: contVersions) {
        ContentDistribution conDis = new ContentDistribution();
        conDis.ContentVersionId = conVer.Id;
        conDis.Name = 'Test';

        contDistrubtion.add(conDis);
    }

    // for(ContentDocumentLink content: contDocLink){
    //     // content.ShareType = 'V';
    //     // content.Visibility = 'AllUsers'; 

    //     ContentDistribution conDis = new ContentDistribution();
    //     conDis.ContentVersionId = content.ContentDocumentId;
    //     conDis.Name = content.ContentDocumentId;

    //     //

    //     contenDocLinkToUpdate.add(content);
    // }

     System.debug(contDistrubtion);
     insert contDistrubtion;
     System.debug(contenDocLinkToUpdate);
    

}