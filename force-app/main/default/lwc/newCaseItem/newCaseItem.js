import { LightningElement, api, track } from 'lwc';

export default class NewCaseItem extends LightningElement {
    
    @api orderItem;

    @api description;
    @api caseReason;

    
    get options() {
        return [
            { label: 'Payment', value: 'payment' },
            { label: 'Technical', value: 'technical' },
            { label: 'Shipment', value: 'shipment' },
            { label: 'Other', value: 'other' },
        ];
    }

    connectedCallback(){
        if(this.orderItem){
            console.log(JSON.parse(JSON.stringify(this.orderItem)));
        }
    }

    handleDescription(event){
        this.description = event.target.value;
       
    }

    handleCaseReason(event){
        this.caseReason = event.target.value;     
    }


}