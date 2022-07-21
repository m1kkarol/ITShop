import { LightningElement, api, wire, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


import getProductReviews from '@salesforce/apex/IT_ProductDetailsController.getProductReviews';
import userId from '@salesforce/user/Id';
import deleteComment from '@salesforce/apex/IT_ProductDetailsController.deleteComment'

export default class ProductReviews extends LightningElement {

    @api productId;
    @track reviews;
    userId = userId;
    comment;
    isModalOpen = false;
    isDisplay;
    isEditOpen = false;

    connectedCallback() {

        this.getComments();
    }

    
    getComments() {
        getProductReviews({prodId: this.productId})
            .then((result)=>{
                if(result.length <= 0){
                    this.isDisplay = false;
                } else{
                    this.isDisplay = true; 
                }
                this.reviews = [];
                for(let i = 0; i < result.length; i++) {
                    let productReviews = {
                        Id: result[i].Id,
                        SmallPhoto: result[i].CreatedBy.SmallPhotoUrl,
                        CreatedByName: result[i].CreatedBy.Name,
                        CreatedById: result[i].CreatedBy.Id,
                        LastModifiedDate: result[i].LastModifiedDate,
                        Content: result[i].ReviewContent__c,
                        Rating: result[i].Rating__c,
                        OwnerId: result[i].OwnerId,
                        isOwner: false,
                      
                    }

                    if(this.userId === result[i].OwnerId){
                        productReviews.isOwner = true;
                    } else{
                        productReviews.isOwner = false;
                    }
                    
                    this.reviews.push(productReviews);
                    
                } 
                
            
                
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

    handleDelComment(event) {
        var commentId = event.target.dataset.id;
        this.comment = commentId;
        
        this.isModalOpen = true;

    }

    handleEditComment(event){
        var commentId = event.target.dataset.id;
        this.comment = commentId;
        this.isEditOpen = true;
    }

    closeDelModal(){
        this.isModalOpen = false;
    }

    handleCloseEdit(){
        this.isEditOpen = false;
    }

    editComment() {
        this.isEditOpen = false;
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Comment edited",
            message: 'Comment sent to approve',
            variant: "success"
            })
        );
        this.getComments();
    }

    handleCloseModale(event) { 
        this.isModalOpen = false;
        deleteComment({commentId: this.comment})
        .then(()=>{

            this.dispatchEvent(
                new ShowToastEvent({
                title: "Comment deleted",
                message: '',
                variant: "success"
                })
            );
             this.getComments();
             
           
        })
        .catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        })
         
    }
}