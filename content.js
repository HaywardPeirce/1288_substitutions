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

chrome.runtime.sendMessage({getDomainList: true}, function(response) {

  domainListForInputs = response.domainList;
  console.log('domainListForInputs: ', domainListForInputs);

  for (var item in domainListForInputs){
    console.log('domainListForInputs[item]: ',domainListForInputs[item])

    console.log('location.href: ',location.href)

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



//function written by Cory Laviska: https://www.abeautifulsite.net/parsing-urls-in-javascript
function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}

//function written by Joshua Clanton: http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function domainCheck(listEntry, pageURL){

    parsedListDomain = parseURL(listEntry);
    console.log(parsedListDomain);

    parsedThisDomain = parseURL(pageURL);
    console.log(parsedThisDomain);

    //TODO: check for wildcards in hostname

    //check that the both hostnames end the same way to account for a specified subdomain in the list URL
    if (!parsedThisDomain.hostname.endsWith(parsedListDomain.hostname)){
        return false;
    }


    //if the list domain has a path, check the the current domain has the same path
    if (parsedListDomain.pathname != "/"){

        //if the list domain's path is not just a wildcard (which will just let it move on)
        if (parsedListDomain.pathname != "/*"){

            //TODO: need to check for wildcards in the middle of the path

            //if the domain's paths don't match, but they should
            if (parsedListDomain.pathname != parsedThisDomain.pathname){
                return false;
            }
        }
    }

    //TODO: check for explicitly included query string parameters in list entry

    //if there are UTM parameters in the list domain
    if (parsedListDomain.searchObject){
        console.log("the domain has a search object");

        console.log("URL isEquivalent check: ", isEquivalent(parsedListDomain.searchObject, parsedThisDomain.searchObject));

        //TODO: is the following check accounting for a list domain that only requires some, but not all the parameters from the current domain?
        //if the two URLs don't share the same set of UTM parameters, and should
        if (!isEquivalent(parsedListDomain.searchObject, parsedThisDomain.searchObject)){
            return false;
        }
    }

    // //basic "are the domains the same" check
    // if (listEntry == pageURL){
    //     return true;
    // }
    // else return false;

    //if nothing has returned false by this point, then we can safely say that the domains are the same
    return true;

}
