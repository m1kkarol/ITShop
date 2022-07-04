public with sharing class ProfileImageController {
    public ProfileImageController() {

    }

    @AuraEnabled
    public static Boolean setProfileImage( String prodId, String imgUrl) {

        Product2 prod = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =:prodId LIMIT 1];
        prod.DisplayUrl = imgUrl;
        update prod;
        return true;
    }
    @AuraEnabled
    public static Boolean updateProfileImg(String prodId, String imgUrl) {
        
        Product2 prod = [SELECT Id, DisplayUrl FROM Product2 WHERE Id =:prodId LIMIT 1];
        prod.DisplayUrl = '/sfc/servlet.shepherd/document/download/' + imgUrl;
        update prod;
        return true;
    }

    @AuraEnabled
    public static string getImg( String prodId){
  
       
        List<Product2> prods = [SELECT Id, DisplayUrl FROM Product2 WHERE id =: prodId];
        if(prods.size() <= 0) {
            return null;
        } else {
            return prods[0].DisplayUrl.replaceAll('/sfc/servlet.shepherd/document/download/', '');
        }

        
    }




  
}
