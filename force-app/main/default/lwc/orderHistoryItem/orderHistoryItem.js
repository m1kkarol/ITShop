import { LightningElement, api } from 'lwc';

import getCaseHistory from '@salesforce/apex/IT_CaseHistoryController.getCaseHistory';
import orderIcon from '@salesforce/resourceUrl/OrderIcon';

export default class OrderHistoryItem extends LightningElement {

    @api
    order;
    orderIcon = orderIcon;

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


        setTimeout(function(){
            this.template.querySelector('c-case-history').refreshCaseHistory();
        }.bind(this), 700);

       

        
    }

    handleCloseCaseHistory(){
        this.isCaseHistoryOpen = false;
    }

}