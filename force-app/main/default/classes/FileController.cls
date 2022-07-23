public without sharing class FileController{
    @AuraEnabled
        public static List<ContentVersion> getVersionFiles(String recordId){
            
                return [
            SELECT
                    Id,
                    Title,
                    ContentDocumentId,
                    FileType, 
                    ContentSize,
                    FileExtension,
                    VersionNumber,
                    CreatedDate,
                    VersionData,
                    FirstPublishLocationId
            FROM ContentVersion
            WHERE FirstPublishLocationId =:recordId
                ORDER BY CreatedDate DESC
            ];
        
        }

        @AuraEnabled
        public static void deleteImg (String imgId) { 
            delete [SELECT Id FROM ContentDocument WHERE Id =: imgId LIMIT 1];
            

        }

 } 

    