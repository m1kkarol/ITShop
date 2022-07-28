import { LightningElement, wire, track } from 'lwc';

import getKnowledgeRecord from '@salesforce/apex/IT_FAQFormController.getKnowledgeRecord';

export default class FAQForm extends LightningElement {
    @track listKnowledgeFAQ = [];
    @track listKnowledgePCBasic = [];
    @wire(getKnowledgeRecord)
    wiredResulted(result){
        const{data, error} = result;
            if(data){
                let tempList = data;
                tempList.forEach(element => {
                    if((element.DataCategoryGroupName == 'FAQ') && (element.Parent != null)){
                        this.listKnowledgeFAQ.push(element);
                    }
                });


                console.log(JSON.parse(JSON.stringify(this.listKnowledgeFAQ)));

            }
        if(error){
           
        }
    }
}