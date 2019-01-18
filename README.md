# 1288_substitutions
A Google Chrome extension for substituting words in webpages. Inspired by [XKCD comic 1288](https://xkcd.com/1288/)

### TODO
- ~~Re-do substitutions when content on the page is reloaded~~
- ~~Re-do substitutions when sub list is updated/saved. message passing from popup to content script?~~
    - what about tabs in the background?
- ~~Include nested elements to be substituted~~ already covered by selecting elements by CSS selector (rather than just top level elements by tag)
- ~~Create a form for user to include their own words to substitute~~
- ~~parse current page URL and list of stored domains before comparing them~~
- Domain management so user can select which domains to include/exclude from the script being run on
  - maybe include pre-set options to select from
  - ~~Form for people to add in additional entries~~
- Include substitutions 1, 2, and 3 (add new parameter to json object?) filter default subs based on checkboxes for each instance
- Community lists of substitutions and domains
- handle search terms starting in upper and lower case, add in subed word in same case
- ability to edit user-defined substitutions

### Dependancies
- jquery 3.3.1
- bootstrap 3.3.7

download both dependancies and place them in a folder called `/scripts`
