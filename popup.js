

getSubstitutionList();

getDomainList();


//function for retreiving the latest list of word substitutions
function getSubstitutionList(){

    //reteive the list from the background script
    chrome.runtime.sendMessage({getSubstitutionList: true}, function(response) {

        //console.log('the response inside was: ', substitutionList);
        defaultSubListForInputs = response.defaultSubstitutionList;
        //console.log('defaultSubListForInputs: ', defaultSubListForInputs);

        userSubListForInputs = response.userSubstitutionList;
        //console.log('userSubListForInputs: ', userSubListForInputs);


        //console.log("defaultSubListForInputs: ", defaultSubListForInputs)
        //console.log("substitutionList after subListForInputs: ", substitutionList)

        var defaultSubstitutions = document.getElementById("defaultSubs");

        for (var item in defaultSubListForInputs){
            //console.log(defaultSubListForInputs[item])

            defaultSubstitutions.appendChild(makeRadioButton(defaultSubListForInputs[item].name, defaultSubListForInputs[item].value, defaultSubListForInputs[item].enabled, defaultSubListForInputs[item].list));

            //document.write(item,'<br>');

            linebreak = document.createElement("br");
            defaultSubstitutions.appendChild(linebreak);
        }

        var userSubstitutions = document.getElementById("userSubs");

        for (var item in userSubListForInputs){
            //console.log(userSubListForInputs[item])

            userSubstitutions.appendChild(makeRadioButton(userSubListForInputs[item].name, userSubListForInputs[item].value, userSubListForInputs[item].enabled));
            linebreak = document.createElement("br");
            userSubstitutions.appendChild(linebreak);
        }
    });
}

//get the list of domains that this extension should run on
function getDomainList(){

    //retreive the list of domains that are to be run on from background.js
    chrome.runtime.sendMessage({getDomainList: true}, function(response) {

        //console.log('the response inside was: ', substitutionList);
        domainListForInputs = response.domainList;
        console.log('domainListForInputs: ', domainListForInputs);

        //userSubListForInputs = response.userSubstitutionList;
        //console.log('userSubListForInputs: ', userSubListForInputs);
        //console.log("defaultSubListForInputs: ", defaultSubListForInputs)
        //console.log("substitutionList after subListForInputs: ", substitutionList)

        //loop through each of the entries in the list of domains to run on
        for (var item in domainListForInputs){
            //console.log(domainListForInputs[item])

            appendFormField("domainFormInputs", domainListForInputs[item])
        }
    });
}

//function for creating a text input, accepts an optional value for the new next input
//TODO: maybe support accepting placeholder text
function makeTextInput(value = null){
  var input = document.createElement("input");

  input.type = "text";
  //input.class = "text_input"
  input.classList.add("text_input");
  if (value){
    input.value = value;
  }

  return input;
}

//function for creating a adding a new form field at the end of a given element `elementId`
function appendFormField(elementId, value = null){

    //console.log(elementId);
    element = document.getElementById(elementId);
    //console.log(element);

    element.appendChild(makeTextInput(value));
    linebreak = document.createElement("br");
    //console.log(element);
    element.appendChild(linebreak);
    //console.log(element);

}

function appendBlankFormField() {
    appendFormField("domainFormInputs");
}

//function used to create a new radio button
function makeRadioButton(name, value, enabled, data) {

    var label = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "checkbox";
    radio.name = name;
    radio.value = value;
    radio.dataset.list = data;

    radio.classList.add("checkbox_input");

    //if this is not a default sub entry that has been turned off, set the input as checked
    if (enabled){
      radio.checked = true;
    }

    label.appendChild(radio);

    label.appendChild(document.createTextNode(name + " --> " + value));

    //console.log('radio: ',radio);
    //console.log('label: ', label);
    //return radio;
    return label;
}

//function for creating the form a user can fill out to add another substitition to the list
function makeNewSub(){

    var userSubsForm = document.getElementById("userSubs");

    var span = document.createElement("span");

    var newSubName = document.createElement("input");

    newSubName.type = "text";
    newSubName.classList.add("newSubTextInput");
    newSubName.name = "newSubName";

    var newSubValue = document.createElement("input");

    newSubValue.type = "text";
    newSubValue.classList.add("text_input");
    newSubValue.name = "newSubValue";

    span.appendChild(newSubName);

    span.appendChild(document.createTextNode( " --> " ));

    span.appendChild(newSubValue);

    userSubsForm.appendChild(span)
}

//fuction loaded when the page finishes loading to add event listeners to things (buttons, forms, etc) so as to know when they are clicked/submitted
window.onload=function(){
    var substutionsForm = document.getElementById("defaultSubstitutionsForm");
    substutionsForm.addEventListener("submit", submitSubstitutions);

    var substutionsForm = document.getElementById("userSubstitutionsForm");
    substutionsForm.addEventListener("submit", submitSubstitutions);

    var domainForm = document.getElementById("domainForm");
    console.log('domainForm: ', domainForm);
    domainForm.addEventListener("submit", submitDomains);

    var addDomain = document.getElementById("addDomain");
    addDomain.addEventListener("click", appendBlankFormField);

    var addSub = document.getElementById("addSub");
    addSub.addEventListener("click", makeNewSub);


    var otherSettingsForm = document.getElementById("otherSettingsForm");
    console.log('otherSettingsForm: ', otherSettingsForm);
    domainForm.addEventListener("submit", submitOtherSettings);


}

//function used to submit the pages currently configured list of substitutions back to the background script
function submitSubstitutions(){

    //TODO: collect the inputs from the inform

    var defaultSubsToSubmit = {"subs": []};

    var defaultFormSubsToSubmit = document.getElementById("defaultSubs");
    //console.log(defaultFormSubsToSubmit.children);
    var defaultFormChildren = defaultFormSubsToSubmit.children;
    //console.log(defaultFormChildren);
    //var defaultFormChildren = defaultFormChildren.getElementsByTagName("label");

    //loop through each of the children elements in the default substitutions section of the form
    for (var item=0; item<defaultFormChildren.length; item++){
        //console.log(item, defaultFormChildren[item], defaultFormChildren[item].tagName);
        //console.log(item, defaultFormChildren[item].children);

        //there are page breaks as child elements of this div, so only continue if the one being iterated on is a label, which contains a substitution
        if (defaultFormChildren[item].tagName == "LABEL"){

            var inputItem = defaultFormChildren[item].getElementsByTagName("input")[0];
            //console.log("inputItem: ",inputItem);

            var tempItem = {}

            tempItem["name"] = inputItem.name
            tempItem["value"] = inputItem.value

            //console.log(tempItem["name"], tempItem["value"], inputItem.checked);

            if (inputItem.checked){
            tempItem["enabled"] = true
            }
            else{
            tempItem["enabled"] = false
            }
            tempItem["list"] = inputItem.dataset.list;
            //console.log(tempItem);

            //add the substitution form entry to the list to be saved
            defaultSubsToSubmit["subs"].push(tempItem)

        }
    }

    var userSubsToSubmit = {"subs": []};
    var userFormSubsToSubmit = document.getElementById("userSubs");

    var userFormChildren = userFormSubsToSubmit.children;
    console.log("userFormChildren: ", userFormChildren);

    //only continue if there are user-defined substititions to include
    if (userFormChildren){
        for (var item=0; item<userFormChildren.length; item++){
            console.log(item, userFormChildren[item], userFormChildren[item].tagName);

            //continue if this is an existing user-defined substitution
            if (userFormChildren[item].tagName == "LABEL"){
                console.log("The item was a label!");
                if (userFormChildren[item].checked){
                    var tempItem = {}

                    var inputItem = userFormChildren[item].getElementsByTagName("input")[0];

                    if (defaultFormChildren[item].tagName == "LABEL"){

                        tempItem["name"] = inputItem.name
                        tempItem["value"] = inputItem.value
                        tempItem["enabled"] = true
                        //console.log("tempItem: ",tempItem);
                        userSubsToSubmit["subs"].push(tempItem)
                    }
                }
            }
            //if this is a newly defined user-defined substitution, it needs to be parsed in a slightly different way
            else if (userFormChildren[item].tagName == "SPAN"){
                console.log("The item was a span!");

                var tempItem = {}

                var newSubName = userFormChildren[item].getElementsByTagName("input")[0];

                var newSubValue = userFormChildren[item].getElementsByTagName("input")[1];

                //if the user has filled out both required fields TODO: make the user fill out both requireed fields
                if (newSubName.value || newSubValue.value){
                    tempItem["name"] = newSubName.value
                    tempItem["value"] = newSubValue.value
                    tempItem["enabled"] = true
                    userSubsToSubmit["subs"].push(tempItem)
                }
            }
        }
        //console.log(userSubsToSubmit)
    }
    else{
        userSubsToSubmit = null
    }



    //submit the list currently configured list of substitutions to the background script
    chrome.runtime.sendMessage({submitSubstitutions: true, defaultSubsToSubmit: defaultSubsToSubmit, userSubsToSubmit: userSubsToSubmit}, function(response) {

    //console.log('the response inside was: ', substitutionList);
    subsSubmitted = response.subsSubmitted;

    if (subsSubmitted){


        //send a message to the active tab to refresh the substitutions when the list was updated
        // chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        //     var activeTab = tabs[0];
        //     console.log("activeTab: ", activeTab)
        //     chrome.tabs.sendMessage(activeTab.id, {"refreshSubs": true});
        // });

        //send a message to the all tabs telling them to refresh the substitutions when the list was updated
        chrome.tabs.query({}, function(tabs) {
            var message = {"refreshSubs": true};
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message, function(response){
                    console.log('refreshing tab ', tabs[i].id);
                    //$("#text").text(response);
                });
            }
        });

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            console.log('refreshing tab ', activeTab.id);
            chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
        });


        console.log('The substituions list was updated!');
    }
    else{
        console.log('The substituions list was unable to be updated!');
    }


    });

}

//function for submitting the list of configured domains that this extension should run on
function submitDomains(){

    var domainsToSubmit = []
    var formDomainsToSubmit = document.getElementById("domainFormInputs");

    //var domainFormChildren = formDomainsToSubmit.children;

    var domainFormChildren = formDomainsToSubmit.getElementsByTagName("input");
    //console.log(formDomainsToSubmit.children);
    //console.log(domainFormChildren);

    for (var item=0; item<domainFormChildren.length; item++){

        //console.log(domainFormChildren[item].value);

        //console.log(typeof domainFormChildren[item].value);
        //console.log(domainsToSubmit);
        domainsToSubmit.push(domainFormChildren[item].value)

    }

    console.log(domainsToSubmit);

    chrome.runtime.sendMessage({submitDomains: true, domainsToSubmit: domainsToSubmit}, function(response) {

        //console.log('the response inside was: ', substitutionList);

        //process the response from the domain submission background script, indicating whether or not the save was successful
        domainsSubmitted = response.domainsSubmitted;
        if (domainsSubmitted){
            console.log('The domain list was updated!');
        }
        else{
            console.log('The domain list was unable to be updated!');
        }

    });
}

function resetSubList(){

}


function submitOtherSettings(){

}
