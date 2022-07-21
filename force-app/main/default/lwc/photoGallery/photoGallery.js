import { LightningElement, api, track } from 'lwc';
import getFileVersions from '@salesforce/apex/FileController.getVersionFiles';
import getImg from '@salesforce/apex/ProfileImageController.getImg';


export default class PhotoGallery extends LightningElement {
    
    @api recordId;
    @track fileList;
    @track files = [];
    
    imageId;
    
    connectedCallback(){
        getImg({prodId: this.recordId})
        .then((result) =>{
            this.imageId = result;
            
        })
        .catch((error)=>{

        })
        
        this.handleImg();

        
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
}