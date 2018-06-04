//alert("Page Loaded");

//var keywords = {"test":"test1", "and":"and1", "the":"the1", "permission":"permission1"}
var substitutions = {
  "witnesses": "these dudes I know",
  "allegedly": "kinda probably",
  "new study": "tumblr post",
  "rebuild": "avenge",
  "space": "spaaace",
  "google glass": "virtual boy",
  "smartphone": "Pokédex",
  "electic": "atomic",
  "senator": "elf-lord",
  "car": "cat",
  "election": "eating contest",
  "congressional leaders": "river spirits",
  "homeland security": "homestar runner",
  "could not be reached for comment": " is guilty and everyone knows it"
}

//TODO: load a URL parsing library here

chrome.runtime.sendMessage({getDomainList: true}, function(response) {

  domainListForInputs = response.domainList;
  console.log('domainListForInputs: ', domainListForInputs);

  for (var item in domainListForInputs){
    console.log('domainListForInputs[item]: ',domainListForInputs[item])

    console.log('location.href: ',location.href)

    //TODO process href and domain from list so they can be properly compared

    //check if this domain matches the entry in the list
    if (domainCheck(domainListForInputs[item], location.href)){

      //TODO: get all elements on the page which contain text (not just the top level)
      elements = document.querySelectorAll("h1, h2, h3, h4, h4, h5, p")

      //aString = "These permissions are required if your Chrome extension wants to interact with the code running on pages.";
      //console.log(aString.search("permission"));

      var substitutionCount = 0;

      chrome.runtime.sendMessage({getSubstitutionList: true}, function(response) {

        //console.log('the response inside was: ', substitutionList);
        defaultSubListForInputs = response.defaultSubstitutionList;
        console.log('defaultSubListForInputs: ', defaultSubListForInputs);

        userSubListForInputs = response.userSubstitutionList;
        console.log('userSubListForInputs: ', userSubListForInputs);


        //console.log("defaultSubListForInputs: ", defaultSubListForInputs)
        //console.log("substitutionList after subListForInputs: ", substitutionList)

        //var defaultSubstitutions = document.getElementById("defaultSubs");

        //loop through each selected element
        for (i = 0; i < elements.length; i++) {
            element = elements[i];
            //console.log(element)

            //TODO: loop through nested elements within each element
            if (element.innerHTML){
              tempContent = element.innerHTML;

              //TODO: parse out HTML content (don't want to affect links)
              //loop through each keyword to be checked

              for (var item in defaultSubListForInputs){
                console.log(defaultSubListForInputs[item]);


                if (defaultSubListForInputs[item].enabled){

                  if (tempContent.search(defaultSubListForInputs[item].name) >= 0){
                      // = tempContent.search(keyword)
                      console.log('tempContent1: ',tempContent);
                      // console.log(key +": "+ tempContent.search(key));

                      tempContent = tempContent.split(defaultSubListForInputs[item].name);
                      console.log('tempContent2: ',tempContent);
                      tempContent = tempContent.join(defaultSubListForInputs[item].value);
                      console.log('tempContent3: ',tempContent);
                      element.innerHTML = tempContent;
                      substitutionCount += 1;
                      console.log(substitutionCount);
                  }
                }
              }
            }
          }

          //send a message to background.js to inform it of how many substitutions took place
          chrome.runtime.sendMessage({substitutionCount: substitutionCount}, function(response) {
            //console.log('the response was: ', response.farewell);
          });

      });

    }


  }
});

function domainCheck(listEntry, pageURL){

    // //run through each of the checks, if any of them fail return false, otherwise at the end return true
    //
    // //TODO: remove the protocols
    // if (listEntry.includes("://")){
    //     listEntry = listEntry.split("://")[1];
    // }
    // if (pageURL.includes("://")){
    //     pageURL = pageURL.split("://")[1];
    // }
    //
    // //TODO: remove parameters from href if not included in domain from addListener
    // //TODO: what about strixes in URLs, how to treat them as wildcards
    //
    // else return true;

    if (domainListForInputs[item] == location.href){
        return true;
    }
    else return false;

}
