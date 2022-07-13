public with sharing class IT_searchProducts {
    public IT_searchProducts() {

    }

    @AuraEnabled
    public static List<Product2> getProductList(String prodName, String prodBrand, String prodModel, String prodFamily) {


        List<Product2> products = new List<Product2>();
        
        String query = 'SELECT Id, Name,Product_Model__c, Family, Product_Brand__c, ProductCode FROM Product2 WHERE Id != NULL';

        if(prodName != '') { 
            query += ' AND Name LIKE \'%' + String.escapeSingleQuotes(prodName) + '%\'';
        }
        if(prodBrand != '') {
            query += ' AND Product_Brand__c LIKE \'%' + String.escapeSingleQuotes(prodBrand) + '%\'';
        }
        if(prodModel != '') {
            query += ' AND Product_Model__c LIKE \'%' + String.escapeSingleQuotes(prodModel) + '%\'';
        }
        if(prodFamily != '') {
            query += ' AND Family LIKE \'%' +  String.escapeSingleQuotes(prodFamily) + '%\'';
        }
        
        

        products = Database.query(query);

        return products;
    }
}
