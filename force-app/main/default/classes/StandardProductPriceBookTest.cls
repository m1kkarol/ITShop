@isTest
public with sharing class StandardProductPriceBookTest {
    
 


    
    @isTest (SeeAllData=true)
    public static void shouldAddPricebook() {


        Product2 newProd = new Product2(Name='TestProd');
        insert newProd;

        Product2 prod = [SELECT Id FROM Product2 LIMIT 1]; 
        Double prodPrice = 10.0;


        System.assertEquals(StandardProductPriceBook.setPrice(newProd.Id, prodPrice), true);
        
    }

    @IsTest(SeeAllData=true)
    public static void shouldUpdatePrice(){
        Product2 newProd = new Product2(Name='test');
        insert newProd;

        Double price = 10;
        StandardProductPriceBook.setPrice(newProd.Id, price);

        StandardProductPriceBook.upDatePrice(newProd.Id, price);

    }

    @isTest
    public static void shouldGetPrice(){
        Product2 newProd = new Product2();
        StandardProductPriceBook.getPrice(newProd.Id);
     

    }
}
