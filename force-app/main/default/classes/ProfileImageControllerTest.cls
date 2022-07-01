@isTest
public with sharing class ProfileImageControllerTest {
    

    @isTest 
    public static void shouldSetProfileImage() {

        Product2 newProd = new Product2(Name='TestProd');
        insert newProd;
        String imgUrl = '/sfc/servlet.shepherd/document/download/0697Q000000EZdRQAW';

        System.assertEquals(ProfileImageController.setProfileImage(newProd.id, imgUrl), true);
    
    }

    @isTest 
    public static void shouldUpdateProfileImage() {
        Product2 newProd = new Product2(Name='TestProd');
        insert newProd;
        String imgUrl = '123';

        System.assertEquals(ProfileImageController.updateProfileImg(newProd.id, imgUrl), true);
    }

    @isTest
    public static void shouldGetImgId(){
        Product2 newProd = new Product2();
        ProfileImageController.getImg(newProd.Id);
    }
}
