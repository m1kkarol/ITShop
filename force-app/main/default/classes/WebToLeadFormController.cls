public with sharing class WebToLeadFormController {
    String site;

    public WebToLeadFormController() {
        site = getPath();
    }
    
    public String getPath(){
        return Site.getPathPrefix();
    }
}
