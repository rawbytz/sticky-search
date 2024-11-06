// ==UserScript==
// @name         Sticky Search for WorkFlowy
// @namespace    https://rawbytz.wordpress.com
// @version      0.3
// @description  Navigate WorkFlowy and keep search active
// @author       rawbytz
// @match        https://workflowy.com/*
// @match        https://beta.workflowy.com/*
// @grant        none

// ==/UserScript==

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

  function zoomKeepSearch(item, zoomOut) { // zoomOut Boolean
    const target = zoomOut ? item.getParent() : item;
    if (!target) return
    const baseUrl = target.isMainDocumentRoot() ? "/#" : target.getUrl(); //need to add # on home to avoid reload
    location.href = baseUrl + getSearchParam();
    WF.editItemName(item); // set focus
  }

  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.ctrlKey && !event.shiftKey && !event.metaKey) {
      switch (event.key) {
        case "ArrowDown": // Ctrl+Alt+Down = zoom in keep search
          zoomKeepSearch(WF.focusedItem());
          event.stopPropagation();
          event.preventDefault();
          break;
        case "ArrowUp": // Ctrl+Alt+Up = zoom out keep search
          zoomKeepSearch(WF.currentItem(), true);
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