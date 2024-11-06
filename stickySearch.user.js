// ==UserScript==
// @name         Sticky Search for WorkFlowy
// @namespace    https://rawbytz.wordpress.com
// @version      0.2
// @description  Navigate WorkFlowy and keep search active
// @author       rawbytz
// @match        https://workflowy.com/*
// @match        https://beta.workflowy.com/*
// @grant        none

// ==/UserScript==

// [] add modified clicks??

(function () {
  'use strict';
  function getSearchParam() {
    const search = WF.currentSearchQuery(); // returns null when no search
    return search ? `?q=${encodeURIComponent(search)}` : ""
  }

  function navSibKeepSearch(prev) {
    const c = WF.currentItem();
    const nav = prev ? c.getPreviousVisibleSibling(true) : c.getNextVisibleSibling(true);
    if (nav) location.href = nav.getUrl() + getSearchParam();
  }

  function setLocationKeepSearch(item) { // zoomIn Boolean
    if (!item) return
    const baseUrl = item.isMainDocumentRoot() ? "/#" : item.getUrl(); //need to add # on home to avoid reload
    location.href = baseUrl + getSearchParam();
    // [] Fix focus on zoomOut, probably need to modify function inputs with boolean for zoomOut (or In) 
    WF.editItemName(item.isMainDocumentRoot() ? item.getVisibleChildren()[0] : item);
  }

  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.ctrlKey && !event.shiftKey && !event.metaKey) {
      switch (event.key) {
        case "ArrowDown": // Ctrl+Alt+Down = zoom in keep search
          setLocationKeepSearch(WF.focusedItem());
          event.stopPropagation();
          event.preventDefault();
          break;
        case "ArrowUp": // Ctrl+Alt+Up = zoom out keep search
          setLocationKeepSearch(WF.currentItem().getParent());
          event.stopPropagation();
          event.preventDefault();
          break;
        case "ArrowLeft": // Ctrl+Alt+Left Previous Sibling
          navSibKeepSearch(true);
          event.stopPropagation();
          event.preventDefault();
          break;
        case "ArrowRight": // Ctrl+Alt+Right Next Sibling
          navSibKeepSearch();
          event.stopPropagation();
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  });
})();