// var substitutions = {
//   "witnesses": "these dudes I know",
//   "allegedly": "kinda probably",
//   "new study": "tumblr post",
//   "rebuild": "avenge",
//   "space": "spaaace",
//   "google glass": "virtual boy",
//   "smartphone": "Pokédex",
//   "electic": "atomic",
//   "senator": "elf-lord",
//   "car": "cat",
//   "election": "eating contest",
//   "congressional leaders": "river spirits",
//   "homeland security": "homestar runner",
//   "could not be reached for comment": " is guilty and everyone knows it"
// }

// elementBody = ""
//
// for (var item in substitutions){
//   elementBody = elementBody + substitutions[item] + "<br>";
// }
//
// document.getElementById("substitutionList").innerHTML = elementBody;

// var color = "red";
// var changeColor = function(response, sender, sendResponse) {
//   this.color = response.data;
// };
//
// chrome.runtime.sendMessage({method: "getLocalStorage", key: "favColor"},
//     changeColor.bind(this));


// public getObjectChrome(){
//   let myFoo=function(response){
//     console.log(response);
//     this.myObjectExtension = reponse;
//   }
//   chrome.runtime.sendMessage(extensionID, 'getObject' myFoo.bind(this));
// }

//var substitutionList;

getSubstitutionList();

getDomainList();



function getSubstitutionList(){
  //var substitutionList;

  // var setSubList = function(response, sender, sendResponse){
    // console.log("inside setSubList ", response);
    // this.substitutionList = response.substitutionList;
    //
    // console.log('the response inside was: ', substitutionList);
    // console.log('the response inside1 was: ', this.substitutionList);
    //
    // substitutionList = this.substitutionList;
    // console.log('the response inside2 was: ', substitutionList);
    // return this.substitutionList;
  //}

  //chrome.runtime.sendMessage({getSubstitutionList: true}, setSubList.bind(this));

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


      //document.write(item,'<br>');
      defaultSubstitutions.appendChild(makeRadioButton(defaultSubListForInputs[item].name, defaultSubListForInputs[item].value, defaultSubListForInputs[item].enabled));

    }

    //TODO add the submit button in here
  });

  // console.log('the response at the end was: ', substitutionList);
  // console.log('the response at the end1 was: ', this.substitutionList);
  // console.log('the response at the end2 was: ', setSubList);

  // substitutionListBody = ""
  //
  // for (var item in response.substitutionList){
  //   substitutionListBody = substitutionListBody + response.substitutionList[item] + "<br>";
  // }
  //
  // document.getElementById("substitutionList2").innerHTML = substitutionListBody;
  //return substitutionList;
  //}


  //return substitutionList;
}

//get the list of domains that this extension should run on
function getDomainList(){

  chrome.runtime.sendMessage({getDomainList: true}, function(response) {

    //console.log('the response inside was: ', substitutionList);
    domainListForInputs = response.domainList;
    console.log('domainListForInputs: ', domainListForInputs);

    //userSubListForInputs = response.userSubstitutionList;
    //console.log('userSubListForInputs: ', userSubListForInputs);


    //console.log("defaultSubListForInputs: ", defaultSubListForInputs)
    //console.log("substitutionList after subListForInputs: ", substitutionList)

    //var domainList = document.getElementById("domainFormInputs");

    for (var item in domainListForInputs){
      //console.log(domainListForInputs[item])

      appendFormField("domainFormInputs", domainListForInputs[item])

      // domainList.appendChild(makeTextInput(domainListForInputs[item]));
      // linebreak = document.createElement("br");
      // domainList.appendChild(linebreak);

    }
  });
}

// function createRadioElement(name, checked) {
//     var radioHtml = '<input type="radio" name="' + name + '"';
//     if ( checked ) {
//         radioHtml += ' checked="checked"';
//     }
//     radioHtml += '/>';
//
//     var radioFragment = document.createElement('div');
//     radioFragment.innerHTML = radioHtml;
//
//     return radioFragment.firstChild;
// }

function makeTextInput(value = null){
  var input = document.createElement("input");

  input.type = "text";
  input.class = "text_input"
  if (value){
    input.value = value;
  }

  return input;
}

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


function makeRadioButton(name, value, enabled) {

    //TOOD: should these be included in a label? should they also be included in a default subs group?
    var label = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "checkbox";
    radio.name = name;
    radio.value = value;

    //if this is not a default sub entry that has been turned off, set the input as checked
    if (enabled){
      radio.checked = true;
    }

    linebreak = document.createElement("br");

    label.appendChild(radio);

    label.appendChild(document.createTextNode(name + " --> " + value));

    label.appendChild(linebreak);



    //console.log('radio: ',radio);
    //console.log('label: ', label);
    //return radio;
    return label;
}



// function saveSubstitutions(list){
//   chrome.runtime.sendMessage({saveSubstitutionList: list}, function(response) {
//     console.log('the response was: ', response);
//     //return response
//   });
// }
//
//document.getElementById("substitutionsForm").onsubmit = function() {submitSubstitutions()};
window.onload=function(){
  var substutionsForm = document.getElementById("substitutionsForm");
  substutionsForm.addEventListener("submit", submitSubstitutions);

  var domainForm = document.getElementById("domainForm");
  console.log('domainForm: ', domainForm);
  domainForm.addEventListener("submit", submitDomains);

  var addDomain = document.getElementById("addDomain");
  addDomain.addEventListener("click", appendBlankFormField);

  // var subsTab = document.getElementById("subsTab");
  // console.log("here1");
  // subsTab.addEventListener("click", openTab);
  //
  // var domainsTab = document.getElementById("domainsTab");
  // console.log("here2");
  // domainsTab.addEventListener("click", openTab);

  // var whichTab = document.getElementsByClassName("tablink");
  // for (i = 0; i < whichTab.length; i++) {
  //   whichTab[i].addEventListener("click", openTab(whichTab[i]));
  // }


    // var mb = document.getElementById("b");
    // mb.addEventListener("click", handler);
    // mb.addEventListener("click", handler2);
}

function submitSubstitutions(){

  //TODO: collect the inputs from the inform

  var defaultSubsToSubmit = {"subs": []};
  var defaultFormSubsToSubmit = document.getElementById("defaultSubs");
  //console.log(defaultFormSubsToSubmit.children);
  var defaultFormChildren = defaultFormSubsToSubmit.children;

  for (var item=0; item<defaultFormChildren.length; item++){
    //console.log(item, defaultFormChildren[item]);
    //console.log(item, defaultFormChildren[item].children);

    //TODO: maybe organize the default and user-added subs seperately, and then loop through each of them?
    //
    var inputItem = defaultFormChildren[item].getElementsByTagName("input")[0];
    //console.log(inputItem);

    var tempItem = {}

    tempItem["name"] = inputItem.name
    tempItem["value"] = inputItem.value

    console.log(tempItem["name"], tempItem["value"], inputItem.checked);
    //TODO: need to figure out a way to store whether or not the substitution is active or not
    if (inputItem.checked){
      tempItem["enabled"] = true
    }
    else{
      tempItem["enabled"] = false
    }
    console.log(tempItem);


    defaultSubsToSubmit["subs"].push(tempItem)

  }

  var userSubsToSubmit;
  var userFormSubsToSubmit = document.getElementById("userSubs");

  var userFormChildren = userFormSubsToSubmit.children;
  if (userFormChildren > 0){
    for (var item=0; item<userFormChildren.length; item++){
      console.log(item, userFormChildren[item]);

      //TODO: maybe organize the default and user-added subs seperately, and then loop through each of them?



    }
  }
  else{
    userSubsToSubmit = null
  }


  chrome.runtime.sendMessage({submitSubstitutions: true, defaultSubsToSubmit: defaultSubsToSubmit, userSubsToSubmit: userSubsToSubmit}, function(response) {

    //console.log('the response inside was: ', substitutionList);
    subsSubmitted = response.subsSubmitted;
    if (subsSubmitted){
      console.log('The substituions list was updated!');
    }
    else{
      console.log('The substituions list was unable to be updated!');
    }


  });

}


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
    //var inputItem = domainFormChildren[item];

    // var tempItem = {}
    //
    // tempItem["name"] = inputItem.name
    // tempItem["value"] = inputItem.value
    //
    // console.log(tempItem["name"], tempItem["value"], inputItem.checked);
    // //TODO: need to figure out a way to store whether or not the substitution is active or not
    // if (inputItem.checked){
    //   tempItem["enabled"] = true
    // }
    // else{
    //   tempItem["enabled"] = false
    // }
    // console.log(tempItem);
    //
    //
    // defaultSubsToSubmit["subs"].push(tempItem)



  }




  console.log(domainsToSubmit);

  chrome.runtime.sendMessage({submitDomains: true, domainsToSubmit: domainsToSubmit}, function(response) {

    //console.log('the response inside was: ', substitutionList);
    domainsSubmitted = response.domainsSubmitted;
    if (domainsSubmitted){
      console.log('The domain list was updated!');
    }
    else{
      console.log('The domain list was unable to be updated!');
    }


  });
}

// function openSubTab(){
//   openTab(document.getElementById("subsTab"));
// }
//
// function openDomainTab(){
//   openTab(document.getElementById("domainsTab"));
// }
//
// function openTab(tabContentName) {
//     console.log(tabContentName);
//     var i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }
//     tablinks = document.getElementsByClassName("tablink");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].style.backgroundColor = "";
//     }
//     console.log(document.getElementById(tabContentName.value));
//     document.getElementById(tabContentName.value).style.display = "block";
//     tabContentName.style.backgroundColor = "#555";
//     //document.getElementById(tabContentName.value).style.backgroundColor = "#555";
//
// }
// Get the element with id="defaultOpen" and click on it
//document.getElementsByClassName("defaultOpen")[0].click();

// document.getElementById("subsTab").click();
//
// var substitutionsForm = document.getElementById("substitutionsForm");
//
// subListForInputs = getSubstitutionList()
//
// console.log("subListForInputs: ", subListForInputs)
// console.log("substitutionList after subListForInputs: ", substitutionList)
//
// for (var item in subListForInputs){
//   console.log(item, subListForInputs[item])
//   document.write(item);
//   substitutionsForm.appendChild(makeRadioButton(item, subListForInputs[item]));
//
// }
