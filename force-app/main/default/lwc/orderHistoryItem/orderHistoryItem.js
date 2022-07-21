import { LightningElement, api } from 'lwc';

export default class OrderHistoryItem extends LightningElement {

    @api
    order;

    isModalOpen = false;

    openDetails(){
        this.isModalOpen = true;
    }

    handleCloseModal(){
        this.isModalOpen = false;
    }
}