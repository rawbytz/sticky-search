// ==UserScript==
// @name         Sticky Search for WorkFlowy
// @namespace    https://rawbytz.wordpress.com
// @version      0.1
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

  // [] add end of sibs banner??
  function navSibKeepSearch(prev) {
    const c = WF.currentItem();
    const nav = prev ? c.getPreviousVisibleSibling(true) : c.getNextVisibleSibling(true);
    if (nav) location.href = nav.getUrl() + getSearchParam();
  }

  const getBaseUrl = item => item.isMainDocumentRoot() ? "/#" : item.getUrl(); //need to add # to avoid reload

  function setLocationKeepSearch(item) {
    if (!item) return
    location.href = getBaseUrl(item) + getSearchParam();
    // [] Fix focus on zoomOut
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