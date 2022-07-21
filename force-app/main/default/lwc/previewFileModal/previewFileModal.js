import { LightningElement, api } from 'lwc';

import labelPhotoPreview from '@salesforce/label/c.IT_PhotoPreview';

export default class PreviewFileModal extends LightningElement {
    @api url;
    @api fileExtension;
    showFrame = false;
    showModal = false;

    label = {
        labelPhotoPreview,
    }

    @api show() { 
        if(this.fileExtension === "pdf") this.showFrame = true;
        else this.showFrame = false;
        this.showModal = true;
    }

    closeModal() { 
        this.showModal = false;
    }
}