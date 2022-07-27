import { LightningElement, api, wire } from 'lwc';

import getCaseHistory from '@salesforce/apex/IT_CaseHistoryController.getCaseHistory';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class CaseHistory extends LightningElement {
    
    @api
    orderId;

    caseHistory;
    renderHistory;
    wiredActivities ;

    @wire(getCaseHistory, {orderId: '$orderId'})
    getCaseHistory(value){
        
        this.wiredActivities  = value;

        const {data, error} = value;

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

    @api
    refreshCaseHistory(){
    
        refreshApex(this.wiredActivities);
     
    }
}