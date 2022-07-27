import { LightningElement, api, wire } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOrderItems from '@salesforce/apex/IT_CaseController.getOrderItems';
import createCase from '@salesforce/apex/IT_CaseController.createCase';
import getCaseHistory from '@salesforce/apex/IT_CaseHistoryController.getCaseHistory';

import Id from '@salesforce/user/Id';

export default class NewCaseModal extends LightningElement {
    
    @api
    orderId;
    orderDetails;
    caseProducts = [];
    userId = Id;

    @wire(getOrderItems, {orderId: '$orderId'})
    getOrderDetails({error,data}){
        if(data){
            this.orderDetails = data;
            console.log(this.orderDetails);
            
        } else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    closeModal(){
        const closeCase = new CustomEvent('closecase');
        
        this.dispatchEvent(closeCase);
    }

    handleSubmit(){
        
        this.template.querySelectorAll('c-new-case-item').forEach(element =>{

            if(element.caseReason != undefined){
                let caseProd = {};

                caseProd['orderId'] = this.orderId;
                caseProd['userId'] = this.userId;
                caseProd['productId'] = element.orderItem.productId;
                caseProd['caseReason'] = element.caseReason;
                caseProd['description'] = element.description;
                this.caseProducts.push(caseProd);
            }
        });

        console.log(this.caseProducts);

        if(this.caseProducts.length > 0){
            this.caseProducts = JSON.parse(JSON.stringify(this.caseProducts));
            createCase({productsCase: JSON.stringify(this.caseProducts)})
                .then(()=>{
                    const evt = new ShowToastEvent({
                        title: 'Complaint created',
                        message: '',
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);

                    

                    setTimeout(function(){
                        this.closeModal();
                    }.bind(this), 1200);
                    

                })
        } else{
            const evt = new ShowToastEvent({
                title: '',
                message: 'You need to fill description and reason type.',
                variant: 'info',
            });
            this.dispatchEvent(evt);
        }

    }
}