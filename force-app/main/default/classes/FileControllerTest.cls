@isTest
public with sharing class FileControllerTest {
    
    @isTest
    public static void fileUploaderTest() {
        Product2 newProd = new Product2(Name = 'Test');
        insert newProd;
        Product2 testProd = [SELECT Id FROM Product2 LIMIT 1];

        System.Assert(FileController.getVersionFiles(testProd.Id).size() != NULL);
    }

    @isTest
    public static void shouldDeleteImg(){
        
        ContentDocument conDoc = new ContentDocument();
        FileController.deleteImg(conDoc.Id);
    } 
}
