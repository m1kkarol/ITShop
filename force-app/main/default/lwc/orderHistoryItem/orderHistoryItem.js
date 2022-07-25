import { LightningElement, api } from 'lwc';

import getCaseHistory from '@salesforce/apex/IT_CaseHistoryController.getCaseHistory';

export default class OrderHistoryItem extends LightningElement {

    @api
    order;

    isModalOpen = false;
    isCaseOpen = false;
    isCaseHistoryOpen = false;

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
    
    handleOpenCaseHistory(){
        this.isCaseHistoryOpen = true;
    }

    handleCloseCaseHistory(){
        this.isCaseHistoryOpen = false;
    }

}