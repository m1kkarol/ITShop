import { LightningElement , wire, api, track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PRODUCT2_OBJECT from '@salesforce/schema/Product2';
import recordId from '@salesforce/schema/Product2.Id';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PROD_FAMILY from '@salesforce/schema/Product2.Family';
import PROD_MODEL from '@salesforce/schema/Product2.Product_Model__c';
import AVAILABLE from '@salesforce/schema/Product2.Available__c';
import PROD_BRAND from '@salesforce/schema/Product2.Product_Brand__c';
import setPrice from '@salesforce/apex/StandardProductPriceBook.setPrice';
import getFileVersions from "@salesforce/apex/FileController.getVersionFiles";

import labelCreateProduct from '@salesforce/label/c.IT_CreateProduct';
import labelPrice from '@salesforce/label/c.Price';
import labelSaveNext from '@salesforce/label/c.IT_SaveNext'
import labelClose from '@salesforce/label/c.HD_Close';

export default class NewProduct extends LightningElement {
    @api recordId = recordId;
    productObject = PRODUCT2_OBJECT;
    prodFamily = PROD_FAMILY;
    prodModel = PROD_MODEL;
    available = AVAILABLE;
    prodBrand = PROD_BRAND;
    prodName = NAME_FIELD;
    price;
    productName;
    isAdded = false;
    isModalOpen = true;
    contDocId;
    
 
    loaded = false;
    @track fileList;
    @track files = [];
    @api isLoading = false;

     get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
     }

     label = {
        labelCreateProduct,
        labelPrice,
        labelSaveNext,
        labelClose,
        
     }

    closeModal(){
        this.isModalOpen = false;
        var close = true;
         const closeclickedevt = new CustomEvent('closeclicked', {
             detail: { close },
            });

         // Fire the custom event
         this.dispatchEvent(closeclickedevt);
    }

    handleSuccess(event) {

        this.isLoading = !this.isLoading;
        this.recordId = event.detail.id;

        console.log(this.price);

        if(this.price == undefined) {
            this.isLoading = false;
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Price missing',
                variant: 'error',
            });
            this.dispatchEvent(event);
            this.isAdded = false;
        } else {

        setPrice({ prodId: event.detail.id, prodPrice: this.price })
            .then((result) => {
                if(result == true){
                    
                    const evt = new ShowToastEvent({
                        title: 'Product created',
                        message: 'Product Name: ' + this.productName,
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                    this.isAdded = true;
                    
                }
            })
            .catch((error) => {
                const evt = new ShowToastEvent({
                    title: 'Sory we got unexpected error',
                    message: 'Error message:' + error,
                    variant: 'error',
                });
                this.dispatchEvent(evt);
                this.isAdded = false;
            })
        }
           
    }

   

    handleProdName(event){
        this.productName = event.target.value;
    }

    handlePriceChange(event) {
        this.price = event.target.value;
    }

    handleImg(){
    
        getFileVersions({recordId: this.recordId})
            .then((result) => {
                this.fileList = "";
                this.files = [];
                if (result) {
                this.fileList = result;
                for (let i = 0; i < this.fileList.length; i++) {
                    let file = {
                    Id: this.fileList[i].Id,
                    Title: this.fileList[i].Title,
                    Extension: this.fileList[i].FileExtension,
                    ContentDocumentId: this.fileList[i].ContentDocumentId,
                    ContentDocument: this.fileList[i].ContentDocument,
                    CreatedDate: this.fileList[i].CreatedDate,
                    ifProfile: false,
                    thumbnailFileCard:
                        "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                        this.fileList[i].Id +
                        "&operationContext=CHATTER&contentId=" +
                        this.fileList[i].ContentDocumentId,
                    downloadUrl:
                        "/sfc/servlet.shepherd/document/download/" +
                        this.fileList[i].ContentDocumentId
                        
                    };
                
                    if(this.contDocId == file.ContentDocumentId){
                        file.ifProfile = true;
                    }
                    
                    this.files.push(file);
                    this.loaded = true;
                }    
                }  else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                        title: "Error loading Files",
                        message: error.body.message,
                        variant: "error"
                        })
                    );
                }       
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Error loading Files",
                    message: error.body.message,
                    variant: "error"
                    })
                );
            })
    }

    handleProfile(event){
        this.contDocId = event.detail;
        this.handleImg();

     }

  handleUploadFinished(event) {
    this.isLoading = !this.isLoading;
    const uploadedFiles = event.detail.files;
    this.handleImg();

    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success!",
        message: uploadedFiles.length + " Files Uploaded Successfully.",
        variant: "success"
      })
    );
  }

  handleUpdateCard(event){
    this.handleImg();
  }

  handleButtonChange(){ 
    this.isLoading = !this.isLoading;
    var close = this.recordId;
    
    const closeclickedevt = new CustomEvent('closeclicked', {
        detail: { close },
    });

    // Fire the custom event
    this.dispatchEvent(closeclickedevt); 
}

   



}

