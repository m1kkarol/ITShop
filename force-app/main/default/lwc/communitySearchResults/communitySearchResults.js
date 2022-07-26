import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import getProductList from '@salesforce/apex/IT_CommunitySearchResultController.getProductList';

export default class CommunitySearchResults extends LightningElement {


    products = [];
    prodModel = '';
    prodFamily = '';
    prodBrand = '';
    isLoading = false;
    renderProd;
    allProducts;

    pageForDisplay  = 1;
    disabledPrev = false;
    disabledNext = false;

    // All selected Id values
  allSelectedRows = new Set()
  // Current page index
  pageNumber = 0
  // Current page data rows
  pageData = []
  // Current page selected Id values
  selectedRows = [];

  offset = 0;

  allPages;
  currentPage = 1;

    get options() {
        return [
            { label: 'None', value: '' },
            { label: 'CPU', value: 'CPU' },
            { label: 'GPU', value: 'GPU' },
            { label: 'Motherboard', value: 'Motherboard' },
            { label: 'Mouse', value: 'Mouse' },
            { label: 'Keyboad', value: 'Keyboard' },
            { label: 'Laptop', value: 'Laptop' },
        ];
    }

    connectedCallback(){
        this.isLoading = true;
        this.disabledPrev = true;
        var idsJson = sessionStorage.getItem('customSearch--recordIds');
        this.allProducts = JSON.parse(idsJson);
        for(let i = 0; i < 6; i++){
            this.products.push(this.allProducts[i]);
        }

           this.allPages = Math.ceil((this.allProducts.length / 6));

        if(this.products.length > 0){
            this.renderProd = true;
        } else{
            this.renderProd = false;
        }

        this.isLoading = false;
    }

    handleProdModel(event){
        this.prodModel = event.target.value;
    }
    handleProdBrand(event){
        this.prodBrand = event.target.value;
    }

    handleProdFamily(event){
        this.prodFamily = event.target.value;
    }
    handleSearchKeyword(){
        this.isLoading = true;
        getProductList({prodBrand: this.prodBrand, prodModel: this.prodModel, prodFamily: this.prodFamily, offset: this.offset})
            .then((result)=>{

                

                this.disabledNext = false;
                this.disabledPrev = false;

                if(this.offset == 0) {
                    this.disabledPrev = true;
                }
                
                this.products = result;

                if(this.products.length < 6){
                    this.allPages = 1;
                }else{
                    this.allPages = Math.ceil((this.allProducts.length / 6));
                }

                if(this.products.length > 0){
                    this.renderProd = true;
                } else{
                    this.renderProd = false;
                }

                if(this.products.length < 6) {
                    this.disabledNext = true;

                }
                this.isLoading = false;
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            })


            
    }

    handleSearchKeywords(){
        this.isLoading = true;
        getProductList({prodBrand: this.prodBrand, prodModel: this.prodModel, prodFamily: this.prodFamily, offset: this.offset})
            .then((result)=>{

                this.disabledNext = false;
                this.disabledPrev = false;

                if(this.offset == 0) {
                    this.disabledPrev = true;
                }
                
                this.products = result;

                

                if(this.products.length > 0){
                    this.renderProd = true;
                } else{
                    this.renderProd = false;
                }

                if(this.products.length < 6) {
                    this.disabledNext = true;

                }
                this.isLoading = false;
            })
            .catch((error)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        variant: 'error'
                    })
                );
            })

        }

    previous() {
        console.log(this.products.length);
        this.disabledNext = false;
        this.offset -= 6;
        if(this.offset == 0) {
            this.disabledPrev = true;
        }
        this.currentPage -= 1;
        this.handleSearchKeywords();
      }

      next() {

        
        this.disabledPrev = false;
        this.offset += 6;
        this.currentPage += 1;
        this.handleSearchKeywords();
        
      
      } 

      

}