import { LightningElement, api } from 'lwc';

import getAllProducts from '@salesforce/apex/IT_PricebookManagerController.getAllProducts';
import addProducts from '@salesforce/apex/IT_PricebookManagerController.addProductsToPricebook';
import getProducts from '@salesforce/apex/IT_PricebookManagerController.getProducts';

const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Product Brand', fieldName: 'Product_Brand__c' },
    { label: 'Model', fieldName: 'Product_Model__c' },
]

export default class AllProducts extends LightningElement {

    allProducts;
    columns = columns
    isAllProducts;
    @api record;
    productName = '';

    connectedCallback() {
        getAllProducts()
        .then((result )=> {
            this.allProducts = result;
            console.log(this.allProducts);

        })
    }

    handleSearchProduct(){
        getProducts({productName: this.productName})
            .then((result) => {
                this.allProducts = result;
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    handleProductName(event) {
        this.productName = event.target.value;
    }
    closeModal() {
        this.isAllProducts = false; 

        const closeModal = new CustomEvent("closemodal", {detail: this.isAllProducts});

        this.dispatchEvent(closeModal);
       
    }

    addProducts() {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows(); 
        if(selectedRecords.length > 0) {
            
            let productIds = [];    
            for(let i = 0; i < selectedRecords.length; i++) {
                productIds.push(selectedRecords[i].Id);
            }
            console.log(productIds);
            console.log(this.record);

            addProducts({pricebookId: this.record, productId: productIds})
            .then((result)=>{
                console.log('udalo sie');
            })
            .catch((error)=>{
                console.log(error);
            })
        }

        

    }

}