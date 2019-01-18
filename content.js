//alert("Page Loaded");

function logger(content){

    //TODO: how to lookup the logging status

    //if logging/debugging mode is enabled, then print out this contents that were passed in
    if (loggingStatus){
        console.log(content);
    }
}




// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//
//         //if the subs list has been updated, and the page subs should be refreshed
//         if( request.refreshSubs === true ) {
//             console.log("should refresh")
//             runSubstitutions();
//         }
//     }
// );

chrome.runtime.onMessage.addListener(msgObj => {
    // do something with msgObj
    if( msgObj.refreshSubs === true ) {
        console.log("should refresh")
        runSubstitutions();
    }
    if( msgObj.message === "start" ) {
        console.log("should start")
        //runSubstitutions();
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.message){
          console.log("should start")
      }
  }
);

runSubstitutions();

function runSubstitutions(changedElements = null){

    //TODO: only clear this value if this script is running on page load, otherise append new entries. Maybe if `changedElements` is null? maybe need to retrieve the value from somewhere if not new
    if (!changedElements){
        var substitutionCount = 0;
    }

    chrome.runtime.sendMessage({getDomainList: true}, function(response) {

        domainListForInputs = response.domainList;
        //console.log('domainListForInputs: ', domainListForInputs);

        for (var item in domainListForInputs){
            //console.log('domainListForInputs[item]: ',domainListForInputs[item])

            //console.log('location.href: ',location.href)

            //check if this domain matches the entry in the list
            if (domainCheck(domainListForInputs[item], location.href)){

                if (changedElements){
                    elements = changedElements;
                }
                else{
                    elements = document.querySelectorAll("h1, h2, h3, h4, h4, h5, p")
                }

                chrome.runtime.sendMessage({getSubstitutionList: true}, function(response) {

                    //read in the default substituion list
                    defaultSubListForInputs = response.defaultSubstitutionList;
                    //console.log('defaultSubListForInputs: ', defaultSubListForInputs);

                    //read in the user-defined substituion list
                    userSubListForInputs = response.userSubstitutionList;
                    //console.log('userSubListForInputs: ', userSubListForInputs);

                    //loop through each selected element
                    for (i = 0; i < elements.length; i++) {

                        //declare this element
                        element = elements[i];

                        //console.log("element: ",element)



                        //TODO: should this be `innerText` instead? would this solve the issue of affecting links?
                        if (element.innerHTML){

                            //console.log(element.innerHTML)

                            tempContent = element.innerHTML;


                            //TODO: loop through user substitutions

                            //loop through each of the default substitutions
                            for (var item in defaultSubListForInputs){
                                //console.log(defaultSubListForInputs[item]);

                                //if the particular default substitution is enabled
                                if (defaultSubListForInputs[item].enabled){

                                    //if there at least one instance of the word to be substituted in the page element that has been selected
                                    if (tempContent.search(defaultSubListForInputs[item].name) >= 0){
                                        // = tempContent.search(keyword)

                                        //console.log('full selected page element: ',tempContent);

                                        tempContent = tempContent.split(defaultSubListForInputs[item].name);
                                        //console.log('selected page element after being split on the substitution list entry being checked: ',tempContent);

                                        //check how many instances of the term there are in the current element
                                        searchCount = tempContent.length - 1;

                                        tempContent = tempContent.join(defaultSubListForInputs[item].value);
                                        //console.log('selected page element after being joined back together with the : ',tempContent);

                                        //set the newly re-joined string back as the contents of the element
                                        element.innerHTML = tempContent;

                                        //console.log("searchCount:", searchCount);

                                        //add the number of instance of the term that were found to the substitutionCount
                                        substitutionCount += searchCount;
                                        console.log("substitutionCount: ", substitutionCount);
                                    }
                                }
                            }

                            //loop through each of the user-defined substitutions
                            for (var item in userSubListForInputs){
                                //console.log(defaultSubListForInputs[item]);

                                //if the particular default substitution is enabled
                                if (userSubListForInputs[item].enabled){

                                    //if there at least one instance of the word to be substituted in the page element that has been selected
                                    if (tempContent.search(userSubListForInputs[item].name) >= 0){
                                        // = tempContent.search(keyword)

                                        //console.log('full selected page element: ',tempContent);

                                        tempContent = tempContent.split(userSubListForInputs[item].name);
                                        //console.log('selected page element after being split on the substitution list entry being checked: ',tempContent);

                                        //check how many instances of the term there are in the current element
                                        searchCount = tempContent.length - 1;

                                        tempContent = tempContent.join(userSubListForInputs[item].value);
                                        //console.log('selected page element after being joined back together with the : ',tempContent);

                                        //set the newly re-joined string back as the contents of the element
                                        element.innerHTML = tempContent;

                                        //console.log("searchCount:", searchCount);

                                        //add the number of instance of the term that were found to the substitutionCount
                                        substitutionCount += searchCount;
                                        console.log("substitutionCount: ", substitutionCount);
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

}

//based on https://gist.github.com/zlatkov/a9a437ba28132f561b5c4930bb17e9a5#file-creatingmutationobserver-js and https://gist.github.com/zlatkov/3bbc27c35fdf1f4b334ad5f8b0090285#file-mutationobserverobserve-js

var mutationObserver = new MutationObserver(

    function(mutations) {

        mutationList = [];

        mutations.forEach(function(mutation) {

            if(mutation.target.innerText){
                //console.log(mutation);
                //console.log(mutation.target);

                //TODO: run something like a `querySelectorAll("h1, h2, h3, h4, h4, h5, p")` on the target to account for new child elements which might also have words to substitute

                mutationList.push(mutation.target);

                //mutation.target.innerText = 'hahah';


                // console.log(mutation.target.innerHTML);
                // console.log(mutation.target.innerText);
            }




        });

        //console.log(mutationList)
        if (mutationList){
            runSubstitutions(mutationList);
        }

    }

);

//only start listening for ongoing changes once the page has finished loading for the first time
window.onload=function(){
    // Starts listening for changes in the root HTML element of the page.
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
}





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
    //console.log(parsedListDomain);

    parsedThisDomain = parseURL(pageURL);
    //console.log(parsedThisDomain);

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
        //console.log("the domain has a search object");

        //console.log("URL isEquivalent check: ", isEquivalent(parsedListDomain.searchObject, parsedThisDomain.searchObject));

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
