public with sharing class IT_CommunitySearchResultController {

    @AuraEnabled
    public static List<Product2> getProductList(String prodBrand, String prodModel, String prodFamily, Integer offset) {


        List<Product2> products = new List<Product2>();
        
        String query = 'SELECT Id, Name,Product_Model__c, Family, Product_Brand__c, DisplayUrl, ProductCode FROM Product2 WHERE Id != NULL ';

        if(prodBrand != '') {
            query += ' AND Product_Brand__c LIKE \'%' + String.escapeSingleQuotes(prodBrand) + '%\'';
        }
        if(prodModel != '') {
            query += ' AND Product_Model__c LIKE \'%' + String.escapeSingleQuotes(prodModel) + '%\'';
        }
        if(prodFamily != '') {
            query += ' AND Family LIKE \'%' +  String.escapeSingleQuotes(prodFamily) + '%\'';
        }

        query += ' LIMIT 6 OFFSET ' + offset;

        System.debug(query);
        
        
        

        products = Database.query(query);

        return products;
    }

}
