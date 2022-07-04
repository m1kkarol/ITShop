import { LightningElement, api, track } from 'lwc';
import getFileVersions from '@salesforce/apex/FileController.getVersionFiles';

export default class PreviewProfilePhoto extends LightningElement {
    @api file;
    @api recordId;
    @api thumbnail;
    
    @api ifProfile;

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
      
      filePreview() {
        const showPreview = this.template.querySelector("c-preview-file-modal");
        showPreview.show();
      }
}