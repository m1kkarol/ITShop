import { LightningElement, api } from "lwc";
import setProfilImg from '@salesforce/apex/ProfileImageController.setProfileImage';
import deleteImg from '@salesforce/apex/FileController.deleteImg';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import labelProfilePhoto from '@salesforce/label/c.IT_ProfilePhoto';

export default class PreviewFileThumbnailCard extends LightningElement {
  @api file;
  @api recordId;
  @api thumbnail;
  
  @api ifProfile;

  label = {
    labelProfilePhoto,
  }

  get iconName() {
    if (this.file.Extension) {
      if (this.file.Extension === "pdf") {
        return "doctype:pdf";
      }
      if (this.file.Extension === "ppt") {
        return "doctype:ppt";
      }
      if (this.file.Extension === "xls") {
        return "doctype:excel";
      }
      if (this.file.Extension === "csv") {
        return "doctype:csv";
      }
      if (this.file.Extension === "txt") {
        return "doctype:txt";
      }
      if (this.file.Extension === "xml") {
        return "doctype:xml";
      }
      if (this.file.Extension === "doc") {
        return "doctype:word";
      }
      if (this.file.Extension === "zip") {
        return "doctype:zip";
      }
      if (this.file.Extension === "rtf") {
        return "doctype:rtf";
      }
      if (this.file.Extension === "psd") {
        return "doctype:psd";
      }
      if (this.file.Extension === "html") {
        return "doctype:html";
      }
      if (this.file.Extension === "gdoc") {
        return "doctype:gdoc";
      }
    }
    return "doctype:image";
  }


  handleSetProfileImg(event) { 

    setProfilImg({ prodId: this.recordId, imgUrl: this.file.downloadUrl})
        .then((result) => {
            if(result == true){

                const evt = new ShowToastEvent({
                    title: 'Image changed',
                    message: 'Image successfully change',
                    variant: 'success',
                });
                this.dispatchEvent(evt);
                const showProfileImg = new CustomEvent('setprofile', {detail: this.file.ContentDocumentId});
                this.dispatchEvent(showProfileImg); 
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



  handleDeleteImg(event) {
 
    deleteImg({imgId: this.file.ContentDocumentId})
      .then((result) => {
        
          const evt = new ShowToastEvent({
            title: 'Image changed',
            message: 'Image successfully change',
            variant: 'success',
          });
          this.dispatchEvent(new CustomEvent('updatelist', {detail: this.file.Id} ));
          this.dispatchEvent(evt);
        
      })
      .catch((error) => {
        const evt = new ShowToastEvent({
          title: 'Sorry we got unexpected error',
          message: 'Error',
          variant: 'error',
        });
        this.dispatchEvent(evt);
      })
  }
  
  filePreview() {
    const showPreview = this.template.querySelector("c-preview-file-modal");
    showPreview.show();
  }
}