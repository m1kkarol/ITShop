import { LightningElement, api } from 'lwc';
import deleteComment from '@salesforce/apex/IT_ProductDetailsController.deleteComment'


export default class ConfirmDeleteCommentModal extends LightningElement {
    isModalOpen;
    @api comment; 


    cancelModal() {
        
        
        this.isModalOpen = false;
        const closeModal = new CustomEvent("cancelmodal", {detail: this.isModalOpen});
 
        this.dispatchEvent(closeModal);
       
    }

    handleDeleteComment() { 
   
        
 
        this.isModalOpen = false;
        const closeModal = new CustomEvent("closemodal", {detail: this.isModalOpen});

        this.dispatchEvent(closeModal);
    }
}