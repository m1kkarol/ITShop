import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ORDER from '@salesforce/schema/Order';
import ORDER_START_DATE from '@salesforce/schema/Order.EffectiveDate';
import SHIPPING_ADDRESS from '@salesforce/schema/Order.ShippingAddress';
import BILLING_ADDRESS from '@salesforce/schema/Order.BillingAddress';
import ACCOUNT_OBJECT from '@salesforce/schema/Order.AccountId';
import STATUS from '@salesforce/schema/Order.Status';
import PRICEBOOK from '@salesforce/schema/Order.Pricebook2Id';
import CONTRACT from '@salesforce/schema/Order.ContractId';

import createNewContract from '@salesforce/apex/IT_NewOrderController.createNewContract';
import getStandardPricebook from '@salesforce/apex/IT_NewOrderController.getStandardPricebook';
import addOrderItem from '@salesforce/apex/IT_NewOrderController.addOrderItem';
import clearCache from '@salesforce/apex/IT_NewOrderController.clearCache';
import getAccount from '@salesforce/apex/IT_NewOrderController.getAccount';

import getCache from '@salesforce/apex/IT_ProductCartListController.getCache';
import getProductsDetails from '@salesforce/apex/IT_ProductCartListController.getProductsDetails';

export default class NewOrder extends LightningElement {
    orderObject = ORDER;
    shippingAddress = SHIPPING_ADDRESS;
    billingAddress = BILLING_ADDRESS;
    account = ACCOUNT_OBJECT;
    startDate = ORDER_START_DATE;
    status = STATUS;
    pricebook = PRICEBOOK;
    contract = CONTRACT;
    orderId;
    orderNumber;

    productCartList;
    allProducts = [];
    productDetails;
    productIds = [];
    totalPrice = 0;
    shipingPrice = 5;
    fullOrderPrice = 0;
    isLoading = false;
    accountId;
    sfdcBaseURL;

    url = window.location.origin + '/ithshops/s/order-history' 
    

    isOrdered = false;

    value = 'card';

    get options() {
        return [
            { label: 'Card', value: 'card' },
            { label: 'Blik', value: 'blik' },
            { label: 'Cash', value: 'cash' },
        ];
    }

    renderedCallback() {
        this.sfdcBaseURL = window.location.origin;
    }
  
    connectedCallback(){
        getCache()
        .then((result)=>{
            this.isLoading = true;
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

                    for(let i = 0; i<this.productCartList.length; i++){
                        this.totalPrice = this.productCartList[i].FullPrice + this.totalPrice;
                    }

                    
                    this.fullOrderPrice = this.totalPrice + this.shipingPrice 
                    this.isLoading = false;
                })
                .catch((error)=>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: error.body.message,
                            variant: 'error'
                        })
                    );
                }) 

           
        })
        .catch((error)=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );


        })


        getAccount({})
        .then((result)=>{
            this.accountId = result;
        })
    }

    async handleSubmit(event) { 
        
        event.preventDefault();
        let pricebookId = await getStandardPricebook({});
    
        const fields = event.detail.fields;
        fields.AccountId = this.accountId;
        fields.EffectiveDate = this.dateFormat(new Date());
        fields.Status = 'Draft';
        fields.Pricebook2Id = pricebookId;
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);
       
        
    }

     handleSucess(event){
        this.orderId = event.detail.id;
        this.isLoading = true;
        
        addOrderItem({orderId: this.orderId})
        .then((result)=>{
            this.orderNumber = result;
            clearCache({});
            this.isLoading = false;
            this.isOrdered = true 

            
        })
        .catch((error)=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        })
    }




    dateFormat(date){
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();

        date = yyyy + '-' + mm + '-' + dd;

        return date;
    }
}