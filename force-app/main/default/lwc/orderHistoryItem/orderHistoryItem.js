import { LightningElement, api } from 'lwc';

export default class OrderHistoryItem extends LightningElement {

    @api
    order;

    isModalOpen = false;
    isCaseOpen = false;

    openDetails(){
        this.isModalOpen = true;
    }

    handleCloseModal(){
        this.isModalOpen = false;
    }

    handleOpenCase(){
        this.isCaseOpen = true;
    }

    handleCloseCase(){
        this.isCaseOpen = false;
    }

}