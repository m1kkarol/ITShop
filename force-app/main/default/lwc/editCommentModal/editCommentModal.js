import { LightningElement, api } from 'lwc';

import getCommentToEdit from '@salesforce/apex/IT_ProductDetailsController.getCommentToEdit';
import updateComment from '@salesforce/apex/IT_ProductDetailsController.updateComment';

export default class EditCommentModal extends LightningElement {
    @api comment;
    isEditOpen;
    commentToEdit;
    newRating;
    newContent;


    connectedCallback(){
        getCommentToEdit({commentId: this.comment})
            .then((result)=>{
                this.commentToEdit = result;
                console.log(this.commentToEdit);
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    handleEditComment() { 

        updateComment({commentId: this.comment, newContent: this.newContent, newRating: this.newRating})
            .then(()=>{
                this.isEditOpen = false;
                const closeModal = new CustomEvent("closemodal", {detail: this.isEditOpen});
        
                this.dispatchEvent(closeModal);
            })
            .catch((error)=>{
                console.log(error);
            })

    
    }

    
    cancelModal() {
        
        
        this.isEditOpen = false;
        const closeModal = new CustomEvent("cancelmodal", {detail: this.isEditOpen});
 
        this.dispatchEvent(closeModal);
       
    }

    handleRatingChanged(event){
        this.newRating = event.detail.rating;
    }
    handleNewContent(event){
        this.newContent = event.target.value;
    }
}