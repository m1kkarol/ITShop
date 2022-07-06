import { LightningElement, track, api } from 'lwc';

import getProductsList from '@salesforce/apex/IT_searchProducts.getProductList'

import {ShowToastEvent} from 'lightning/platformShowToastEvent'

const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Product Type', fieldName: 'Family' },
    { label: 'Product Brand', fieldName: 'Product_Brand__c' },
    { label: 'Product Code', fieldName: 'Product_Code__c' },
];

export default class ProductSearchPanel extends LightningElement {
    @track productsRecord;

    data = [];
    columns = columns;
    tableLoaded = false;
    allPages;
    prodName = '';
    prodModel = '';asdasda
    prodBrand = '';
    prodFamily = '';
    pageForDisplay  = 1;
    disabledNext = true;
    disabledPrev = true;
    disabledLast = true;
    disabledFirst = true;
    @api isLoading = false;

    // All selected Id values
  allSelectedRows = new Set()
  // Current page index
  pageNumber = 0
  // Current page data rows
  pageData = []
  // Current page selected Id values
  selectedRows = []

  recordsPerPage;



    get options() {
        return [
            { label: 'None', value: 'None' },
            { label: 'CPU', value: 'CPU' },
            { label: 'GPU', value: 'GPU' },
            { label: 'Motherboard', value: 'Motherboard' },
            { label: 'Mouse', value: 'Mouse' },
            { label: 'Keyboad', value: 'Keyboard' },
            { label: 'Laptop', value: 'Laptop' },
        ];
    }

    handleProdName(event) {
        this.prodName = event.target.value; 
    }

    handleProdModel(event) {
        this.prodModel = event.target.value;
    }

    handleProdBrand(event) {
        this.prodBrand = event.target.value;
    }

    handleProdFamily(event) {
        this.prodFamily = event.target.value;
    }
  
 



    handleSearchKeyword() {
        
        this.isLoading = true; 
            getProductsList({prodName: this.prodName, prodBrand: this.prodBrand, prodModel: this.prodModel, prodFamily: this.prodFamily})
                .then((result)=>{
                    this.pageNumber = 0;
                    this.data = result;
                    this.isLoading = false;
                    this.pageForDisplay = 1;
                    this.tableLoaded = true;
                     
                    console.log(this.data.length);
                    this.handleMaxPages();

                    

                    this.updatePage();
                    
                               
                    if(this.data.length <= 0 ) {
                        this.tableLoaded = false;
                        const event = new ShowToastEvent({
                            title: 'No record found',
                            variant: 'info',
                            message: '',
                        })
                         
                        this.dispatchEvent(event);
                    }
                    
    
                })
                .catch((error) => {
                    console.log('test');
                    
                })
    
            
                
    }

    handleMaxPages() {
        this.allPages =  Math.round((this.data.length / 10));
        if(this.allPages === 0) { 
            this.allPages = 1;
        }

        if(this.allPages === 1) { 
            this.disabledNext = true;
            this.disabledPrev = true;
            this.disabledFirst = true;
            this.disabledLast = true;
        } else {
            this.disabledNext = false;
            this.disabledPrev = false;
            this.disabledFirst = false;
            this.disabledLast = false;
        }

        
       

    }

    updatePage() {

        this.pageData = this.data.slice(this.pageNumber*10, this.pageNumber*10+10);
        this.selectedRows = this.pageData.map(row => row.id).filter(pageId => this.allSelectedRows.has(pageId));
        this.isLoading = false; 
    
      }
      // Back a page
      previous() {
        this.isLoading = true; 
        this.pageNumber = Math.max(0, this.pageNumber - 1);
        
        this.pageForDisplay = this.pageNumber + 1;

        
        this.updatePage();
      }
      // Back to the beginning
      first() {
        this.isLoading = true; 
        this.pageNumber = 0;
        this.pageForDisplay = this.pageNumber + 1;
        this.updatePage();
      }
      // Forward a page
      next() {
        this.isLoading = true; 
        this.pageNumber = Math.min(Math.round((this.data.length-9)/10), this.pageNumber + 1);
        this.pageForDisplay = this.pageNumber + 1;

        

        this.updatePage();
      }
      // Forward to the end
      last() {
        this.isLoading = true; 
        this.pageNumber = Math.round((this.data.length-9)/10);
        this.pageForDisplay = this.pageNumber + 1;
        this.updatePage();
      }

    handleClear() {
        this.data = null;
        this.tableLoaded = false;
        this.prodName = '';
        this.prodModel = '';
        this.prodFamily = '';
        this.prodBrand = '';
    }
}