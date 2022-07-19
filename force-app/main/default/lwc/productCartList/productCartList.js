
import { LightningElement, wire, track  } from 'lwc';

import getCache from '@salesforce/apex/IT_ProductCartListController.getCache';
import getProductsDetails from '@salesforce/apex/IT_ProductCartListController.getProductsDetails';

export default class ProductCartList extends LightningElement {
    

    productCartList;
    allProducts = [];
    productDetails;
    productIds = [];
    totalPrice = 0;
    shipingPrice = 5;
    fullOrderPrice = 0;
    isLoading = false;
    renderCart = false;

    

    connectedCallback(){
        getCache()
        .then((result)=>{
            this.productCartList = result;
    
            for(let i = 0; i < result.length; i++) {
                this.productIds.push(result[i].prodId);
            }

            if(this.productCartList.length > 0){
                this.renderCart = true;
            }

            getProductsDetails({productIds: this.productIds})
                .then((data)=>{
                    
                    this.productDetails = data;
                  

                    for(let i=0; i < this.productIds.length; i++){
                        for(let j=0; j<this.productDetails.length; j++){
                            if(this.productIds[i] == this.productDetails[j].Id){
                                let product = {
                                 DisplayUrl: this.productDetails[j].DisplayUrl,
                                 Price: this.productCartList[i].price,
                                 Name: this.productDetails[j].Name,
                                 Quantity: this.productCartList[i].quantity,
                                 Id: this.productCartList[i].prodId,
                                 Model: this.productDetails[j].Product_Model__c,
                                 FullPrice: this.productCartList[i].quantity * this.productCartList[i].price,
                                }
            
                            this.allProducts.push(product);
                        }
                    }
                        
                    }

                    this.productCartList = this.allProducts;
                    console.log(this.allProducts);

                    for(let i = 0; i<this.productCartList.length; i++){
                        this.totalPrice = this.productCartList[i].FullPrice + this.totalPrice;
                    }

                    
                    this.fullOrderPrice = this.totalPrice + this.shipingPrice 
                    console.log(this.totalPrice);
                })
                .catch((error)=>{
                    console.log(error);
                }) 

            
        })
        .catch((error)=>{
            console.log(error);
        })
       
    }

    countTotalPrice(){
        this.isLoading = true;
        getCache()
        .then((result)=>{
            
            this.totalPrice = 0;
            this.forprice = result;
            for(let i = 0; i <  this.forprice.length; i++) {
                this.totalPrice +=  (this.forprice[i].price * this.forprice[i].quantity);
            }
            this.fullOrderPrice = this.totalPrice + this.shipingPrice;
            this.isLoading = false;
            })
        .catch((error)=>{
            console.log(error);
        })
    }

    handleChangeSubtotal(){
        this.countTotalPrice();
    }

    handleDeleteProd(){
        
        this.productCartList = [];
        this.productDetails = [];
        this.productIds = [];
        this.allProducts = [];
        this.isLoading = true;

        getCache()
        .then((result)=>{
            this.productCartList = result;
            console.log(this.productCartList);
            this.totalPrice = 0;
            

            if(result.length <= 0 ){
                this.totalPrice = 0;
                this.fullOrderPrice = 0;
                this.renderCart = false;
            }
    
            for(let i = 0; i < result.length; i++) {
                this.productIds.push(result[i].prodId);
            }

            getProductsDetails({productIds: this.productIds})
                .then((data)=>{
                    
                    this.productDetails = data;
                  
                    for(let i=0; i < this.productIds.length; i++){
                        for(let j=0; j<this.productDetails.length; j++){
                            if(this.productIds[i] == this.productDetails[j].Id){
                                let product = {
                                 DisplayUrl: this.productDetails[j].DisplayUrl,
                                 Price: this.productCartList[i].price,
                                 Name: this.productDetails[j].Name,
                                 Quantity: this.productCartList[i].quantity,
                                 Id: this.productCartList[i].prodId,
                                 Model: this.productDetails[j].Product_Model__c,
                                 FullPrice: this.productCartList[i].quantity * this.productCartList[i].price,
                                }
            
                            this.allProducts.push(product);
                        }
                    }
                        
                    }

                    this.productCartList = this.allProducts;
                    console.log(this.allProducts);

                    for(let i = 0; i<this.productCartList.length; i++){
                        this.totalPrice = this.productCartList[i].FullPrice + this.totalPrice;
                    }

                    
                    this.fullOrderPrice = this.totalPrice + this.shipingPrice 
                    console.log(this.totalPrice);

                    this.isLoading = false;
                })
                .catch((error)=>{
                    console.log(error);
                }) 

            
        })
        .catch((error)=>{
            console.log(error);
        }) 
      
    }

    

}