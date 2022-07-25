import { LightningElement, api, wire } from 'lwc';

import getCaseHistory from '@salesforce/apex/IT_CaseHistoryController.getCaseHistory';

export default class CaseHistory extends LightningElement {
    
    @api
    orderId;

    caseHistory;
    renderHistory;

    @wire(getCaseHistory, {orderId: '$orderId'})
    getOrderDetails({error,data}){
        if(data){
            this.caseHistory = data;
            if(this.caseHistory.length > 0){
                this.renderHistory = true;
            } else{
                this.renderHistory = false;
            }
           
            
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
        const closeHistoryCase = new CustomEvent('closehistorycase');
        
        this.dispatchEvent(closeHistoryCase);
    }
}