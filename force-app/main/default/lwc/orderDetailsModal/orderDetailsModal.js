import { LightningElement, api, wire } from 'lwc';



import getOrderItems from '@salesforce/apex/IT_OrderHistoryController.getOrderItems';

const columns = [
    {label: 'Photo', fieldName: 'profile_image', type:'image'},
    {label: 'Product Name', fieldName: 'productName'},
    {label: 'Product Model', fieldName: 'productModel'},
    {label: 'Quantity', fieldName: 'quantity'},
    {label: 'Unit Price', fieldName: 'unitPrice'},
    
]

export default class OrderDetailsModal extends LightningElement {
    @api
    orderId;

    columns = columns;
    orderDetails;

    prodDetails = window.location.origin + '/ithshops/s';

    @wire(getOrderItems, {orderId: '$orderId'})
    getOrderDetails({error,data}){
        if(data){
            this.orderDetails = data;
            console.log(this.orderDetails);
            
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
        const closeModal = new CustomEvent('closemodal');
        
        this.dispatchEvent(closeModal);
    }
}