import { LightningElement, track, api, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

import selectedPricebook from '@salesforce/messageChannel/Pricebook_Details__c';
import {publish, subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

import getPricebooks from '@salesforce/apex/IT_PricebookManagerController.getPricebooks'



const actions = [
    { label: 'Show details', name: 'show_details' },
];

const columns = [
    { label: 'Pricebook Name', fieldName: 'Name' },
    { label: 'Description', fieldName: 'Description', type: 'text'},
    { label: 'Active', fieldName: 'IsActive', type: 'boolean' },
    { label: 'Standard', fieldName: 'IsStandard' ,type: 'boolean'},
    { label: 'Start Date', fieldName: 'Start_Date__c'},
    { label: 'End Date', fieldName: 'End_Date__c'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class PricebookSearchPanel extends LightningElement {

    @track isModalOpen;
    pricebookName = '';
    allPricebooks = [];
    @api isLoading = false;
    record;
    isLoaded = false;
    detailsOpen = false;
    columns = columns;
    recordId;

    @wire(MessageContext)
    messageContext;
 
    handlePriceBookName(event) {
        this.pricebookName = event.target.value;
    }

    handleModalEvent(event) {
    
        this.isModalOpen = event.detail;

        this.dispatchEvent(
            new ShowToastEvent({
            title: "Pricebook created",
            message: '',
            variant: "success"
            })
        );
       
    }
    handleCancelModal(event){
        this.isModalOpen = event.detail;
    }
    handleSuccessCreate(event) {
        if(event.detil){
            const evt = new ShowToastEvent({
                title: 'Pricebook created',
                message: 'Pricebook succesfully added',
                variant: 'success',
            });
            this.dispatchEvent(evt);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    showRowDetails(row) {
        const { Id } = row;
        const payload = { recordId: Id };

        publish(this.messageContext, selectedPricebook, payload);
           
    }

    handleSearchPricebook() {
        this.isLoading = true;
        this.isLoaded = true;
        getPricebooks({pricebookName: this.pricebookName})
            .then((result) => {
                this.allPricebooks = result;
                console.log(this.allPricebooks);
                this.isLoading = false;
            })
            .catch((error) => {
                console.log(error);
            } ) 
            
        }
     
     
    openModal(){
        this.isModalOpen = true;
    }    


    navigateToRecordPage(event) {
      console.log('test');
    }

    clearTable(){
        this.isLoaded = false;
        this.pricebookName = '';
    }
}