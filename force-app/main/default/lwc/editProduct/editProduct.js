import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import PRODUCT2_OBJECT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PROD_FAMILY from '@salesforce/schema/Product2.Family';
import PROD_MODEL from '@salesforce/schema/Product2.Product_Model__c';
import AVAILABLE from '@salesforce/schema/Product2.Available__c';
import PROD_BRAND from '@salesforce/schema/Product2.Product_Brand__c';
import PROD_CODE from '@salesforce/schema/Product2.ProductCode';
import PROD_DESC from '@salesforce/schema/Product2.Description';


import getFileVersions from '@salesforce/apex/FileController.getVersionFiles';
import getPrice from '@salesforce/apex/StandardProductPriceBook.getPrice';
import upDatePrice from '@salesforce/apex/StandardProductPriceBook.upDatePrice';
import updateProfileImg from '@salesforce/apex/ProfileImageController.updateProfileImg';
import getImg from '@salesforce/apex/ProfileImageController.getImg';

import labelPrice from '@salesforce/label/c.Price';
import labelSave from '@salesforce/label/c.HD_Save';
import labelEditProduct from '@salesforce/label/c.IT_Edit_Product'




export default class EditProduct extends LightningElement {
    isModalOpen = true;
    productObject = PRODUCT2_OBJECT;
    prodFamily = PROD_FAMILY;
    prodModel = PROD_MODEL;
    available = AVAILABLE;
    prodBrand = PROD_BRAND;
    prodName = NAME_FIELD;
    prodCode = PROD_CODE;
    prodDesc = PROD_DESC;
    productName;
    price;
    @api recordId;
    isLoaded = true;
    @track fileList;
    @track files = [];
    imageId;

    label = {
        labelPrice,
        labelSave,
        labelEditProduct 
    }
    

    connectedCallback(){ 

        this.isModalOpen = true;
        getPrice({prodId : this.recordId})
            .then((result) =>{
                this.price = result;
                
                console.log(this.price);
            })
            .catch((error) => {
                console.log('error');
            })

        getImg({prodId: this.recordId})
            .then((result) =>{
                this.imageId = result;
            })
            .catch((error)=>{
                console.log(error);
            })
            
            this.handleImg();

            
    }

    closeModal(){
        this.isModalOpen = false;
        console.log(this.recordId);
        console.log('est');
    }

    handleSuccess(){
        console.log('test');
    }
    handlePriceChange(event) {
        this.price = event.target.value;
    }

    handleProdName(event) {
        this.productName = event.target.value;
    }

    handleSuccess(event){
        if(this.price == undefined) {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Price missing',
                variant: 'error',
            });
            this.dispatchEvent(event);
        } else {

            upDatePrice({ prodId: this.recordId, prodPrice: this.price })
            .then((result) => {
                if(result == true){
                    
                    const evt = new ShowToastEvent({
                        title: 'Product successfully edited',
                        message: 'Product Name: ' + this.productName, 
                        variant: 'success' ,
                    });
                    this.dispatchEvent(evt);

                    
                }
            })
            .catch((error) => {
                const evt = new ShowToastEvent({
                    title: 'Sory we got unexpected error',
                    message: 'Error message:' + error,
                    variant: 'error',
                });
                this.dispatchEvent(evt);
               
            })
        }

    
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
                
                    
                    if(this.imageId == file.ContentDocumentId){
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


      handleProfile(event){
        this.imageId = event.detail;
       
            updateProfileImg({prodId: this.recordId, imgUrl: this.imageId})
            .then((result) => {
                console.log('test');
                
                this.handleImg();
            })
            .catch((error) => {
                console.log('nie work');
            })
        

     }
     handleUpdateCard(event){
        this.handleImg();
      }

      closeQuickAction() {
        const closeQA = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(closeQA);
    }
    
    
}