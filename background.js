var defaultSubstitutionList = {
  "subs":[
    {
      "name": "witnesses",
      "value": "these dudes I know",
      "enabled": true,
      "list": 1
    },
    {
      "name": "allegedly",
      "value": "kinda probably",
      "enabled": true,
      "list": 1
    },
    {
      "name": "new study",
      "value": "tumblr post",
      "enabled": true,
      "list": 1
    },
    {
      "name": "rebuild",
      "value": "avenge",
      "enabled": true,
      "list": 1
    },
    {
      "name": "space",
      "value": "spaaace",
      "enabled": true,
      "list": 1
    },
    {
      "name": "google glass",
      "value": "virtual boy",
      "enabled": true,
      "list": 1
    },
    {
      "name": "smartphone",
      "value": "Pokédex",
      "enabled": true,
      "list": 1
    },
    {
      "name": "electric",
      "value": "atomic",
      "enabled": true,
      "list": 1
    },
    {
      "name": "senator",
      "value": "elf-lord",
      "enabled": true,
      "list": 1
    },
    {
      "name": "car",
      "value": "cat",
      "enabled": true,
      "list": 1
    },
    {
      "name": "election",
      "value": "eating contest",
      "enabled": true,
      "list": 1
    },
    {
      "name": "congressional leaders",
      "value": "river spirits",
      "enabled": true,
      "list": 1
    },
    {
      "name": "homeland security",
      "value": "homestar runner",
      "enabled": true,
      "list": 1
    },
    {
      "name": "could not be reached for comment",
      "value": "is guilty and everyone knows it",
      "enabled": true,
      "list": 1
    },
    {
      "name": "debate",
      "value": "dance-off",
      "enabled": true,
      "list": 2
    },
    {
      "name": "gaffe",
      "value": "magic spell",
      "enabled": true,
      "list": 3
    }
]}

var defaultDomainList = ["https://hayward-workspace-hpeirce.c9users.io/test/words.html", "https://hayward-workspace-hpeirce.c9users.io/*", "https://hayward-workspace-hpeirce.c9users.io/\*/words.html", "https://hayward-workspace-hpeirce.c9users.io/?hello=world", "https://www.cbc.ca"]


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    //if the message included info on the number of substitutions
    if (request.substitutionCount){
      //TODO: handle this per-tab
      //chrome.browserAction.setBadgeText({text: '' + request.substitutionCount});
      chrome.browserAction.setBadgeText({text: '' + request.substitutionCount, tabId: sender.tab.id});
      //document.write("this page had " + request.substitutionCount + " substitutions");
      console.log('Substitution Count: ',request.substitutionCount, "sent from tab.id: ", sender.tab.id);
      //console.log("sent from tab.id=", sender.tab.id);
      //alert("Number of substitutions: " + request.substitutions);

      sendResponse({farewell: "goodbye"});
    }
    console.log(request);
    //TODO: check to see what the latest list of substituation words is
    if (request.getSubstitutionList){
      console.log("Looking up substitutions list...");
      //var keywords = {"test":"test1", "and":"and1", "the":"the1", "permission":"permission1"}
      // var defaultSubstitutionList = {
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



      //check if there is already data configured for the substitution words. Return this existing list
      if (typeof localStorage['defaultSubsList'] !== 'undefined' && typeof localStorage['userSubsList'] !== 'undefined') {
        console.log("Found existing substitution data");
          // the variable is defined, return the existing list of substitutions
          //console.log(typeof localStorage["substitutionList"]);

          defaultSubstitutionList = localStorage["defaultSubsList"];
          //console.log("defaultSubstitutionList, raw: ",defaultSubstitutionList);
          //console.log(typeof localStorage["defaultSubsList"]);
          defaultSubstitutionList = JSON.parse(defaultSubstitutionList);
          //console.log("defaultSubstitutionList, parsed: ",defaultSubstitutionList);
          defaultSubstitutionList = defaultSubstitutionList.subs
          //console.log("defaultSubstitutionList, .subs: ",defaultSubstitutionList);

          userSubstitutionList = localStorage['userSubsList'];
          userSubstitutionList = JSON.parse(userSubstitutionList);
          if (userSubstitutionList !== null){
            userSubstitutionList = userSubstitutionList.subs
          }

          //console.log(typeof substitutionList);
          console.log("userSubstitutionList: ", userSubstitutionList);

          //TODO: send back the default list seperately as well
          sendResponse({defaultSubstitutionList: defaultSubstitutionList, userSubstitutionList: userSubstitutionList});

      }
      //there is no existing stored data for the list of words to substitute, add in the defaults and return the list
      else{
        console.log("no existing data");

        //localStorage['defaultSubsList'] = JSON.stringify(defaultSubstitutionList.subs);
        localStorage['defaultSubsList'] = JSON.stringify(defaultSubstitutionList);
        localStorage['userSubsList'] = JSON.stringify(null);

        //TODO: send back the default list seperately as well
        sendResponse({defaultSubstitutionList: defaultSubstitutionList.subs, userSubstitutionList: null});

      }

    }

    if (request.getDomainList){

      if (typeof localStorage['domainList'] !== 'undefined') {
        console.log("Found existing substitution data");

        domainList = localStorage["domainList"];
        console.log("domainList, raw: ",domainList);
        domainList = JSON.parse(domainList);
        console.log("domainList, parsed: ",domainList);

        sendResponse({domainList: domainList});
      }

      else{
        console.log("no existing data");

        //localStorage['defaultSubsList'] = JSON.stringify(defaultSubstitutionList.subs);
        localStorage['domainList'] = JSON.stringify(defaultDomainList);

        //TODO: send back the default list seperately as well
        sendResponse({domainList: defaultDomainList});
      }

    }

    //if the message is intending to save the list of domains
    if (request.submitDomains){
      console.log("Saving submitted domains...");
      //TODO: setup error catching in case it's unable to save here
      //localStorage["substitutionList"] = JSON.stringify(request.subsToSubmit);

      localStorage['domainList'] = JSON.stringify(request.domainsToSubmit);

      sendResponse({domainsSubmitted: true});

    }

    //if the message is intending to save the list of substutions
    if (request.submitSubstitutions){
      console.log("Saving submitted substitutions...");
      //TODO: setup error catching in case it's unable to save here
      //localStorage["substitutionList"] = JSON.stringify(request.subsToSubmit);

      localStorage['defaultSubsList'] = JSON.stringify(request.defaultSubsToSubmit);
      localStorage['userSubsList'] = JSON.stringify(request.userSubsToSubmit);

      sendResponse({subsSubmitted: true});

    }

  });
