({
    handleClick : function(component, event, helper) {
      var searchText = component.get('v.searchText');
      console.log(searchText);
      var action = component.get('c.searchProducts');
      action.setParams({prodName: searchText});
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
          var products = response.getReturnValue();
          sessionStorage.setItem('customSearch--recordIds', JSON.stringify(products));
          var navEvt = $A.get('e.force:navigateToURL');
          navEvt.setParams({url: '/search-result'});
          navEvt.fire();
        }
      });
      $A.enqueueAction(action);
    }
})
