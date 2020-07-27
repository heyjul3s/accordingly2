(function(window2, document2) {
  "use strict";
  document2.addEventListener("DOMContentLoaded", function() {
    let accordingly = Accordingly();
    accordingly.init();
  });
  function Accordingly() {
    const accordionContainer = document2.querySelector(".accordion-container");
    const accordions = [...document2.querySelectorAll(".accordion")];
    const panels = document2.querySelectorAll(".accordion-panel-content");
    let targetAccordion;
    let targetAccordionContent;
    let toggleIndex;
    let lastAccordion;
    let currentAccordion;
    let lastAccordionIndex;
    let lastAccordionPanelContent;
    let currentAccordionIndex;
    let currentAccordionPanelContent;
    let panelHeights = getHeights();
    let targetPanelHeight = 0;
    function init() {
      initialPanelHeightsReset();
      accordionContainer.addEventListener("click", function(ev) {
        ev.preventDefault();
        let target = ev.target;
        targetAccordion = target.parentNode.parentNode;
        targetAccordionContent = targetAccordion.querySelector(".accordion-panel-content");
        toggleIndex = target.dataset.toggleIndex;
        lastAccordion = currentAccordion;
        lastAccordionIndex = accordions.indexOf(lastAccordion);
        lastAccordionPanelContent = !!accordions[lastAccordionIndex] ? getTargetAccordionPanelContent(accordions[lastAccordionIndex]) : currentAccordionPanelContent;
        currentAccordion = targetAccordion;
        currentAccordionIndex = accordions.indexOf(currentAccordion);
        currentAccordionPanelContent = getTargetAccordionPanelContent(accordions[currentAccordionIndex]);
        if (target !== this && target.tagName === "A") {
          let initAccordingly = initPanels.bind(null, closeOpenedPanels());
          targetPanelHeight = panelHeights[toggleIndex];
          initAccordingly();
        }
      });
    }
    function initPanels() {
      toggleTargetPanel();
    }
    function toggleTargetPanel() {
      !targetAccordion.classList.contains("panel-is-open") ? openTargetPanel() : closeTargetPanel();
    }
    function openTargetPanel() {
      setHeight();
      setTargetAccordionClass();
      setContainerClass();
    }
    function closeTargetPanel() {
      resetHeight(targetAccordionContent);
      removeTargetAccordionClass();
      removeContainerClass();
    }
    function closeOpenedPanels(classname = "panel-is-open") {
      if (accordions.indexOf(lastAccordion) !== -1) {
        if (currentAccordion !== lastAccordion && accordions[lastAccordionIndex].classList.contains(classname)) {
          lastAccordion = accordions[lastAccordionIndex];
          currentAccordion = accordions[currentAccordionIndex];
          resetHeight(lastAccordionPanelContent);
          lastAccordionPanelContent.addEventListener("transitionend", function callback(ev) {
            if (ev.propertyName === "height") {
              if (lastAccordion.classList.contains(classname)) {
                lastAccordion.classList.remove(classname);
              }
              lastAccordionPanelContent.removeEventListener("transitionend", callback, false);
            }
          });
        }
      }
    }
    function getTargetAccordionPanelContent(targetAccordion2) {
      return targetAccordion2?.querySelector(".accordion-panel-content");
    }
    function setHeight() {
      targetAccordionContent.style.cssText = `max-height: ${targetPanelHeight}px; height: ${targetPanelHeight}px`;
    }
    function setTargetAccordionClass(classname = "panel-is-open") {
      if (!targetAccordion.classList.contains(classname)) {
        targetAccordion.classList.add(classname);
      }
    }
    function resetHeight(el) {
      el.style.cssText = "max-height: 0; height: 0;";
    }
    function initialPanelHeightsReset() {
      if (isPOJO(panelHeights) && Object.keys(panelHeights).length > 0) {
        panels.forEach(function(panel) {
          resetHeight(panel);
        });
      }
    }
    function removeTargetAccordionClass(classname = "panel-is-open") {
      targetAccordion.addEventListener("transitionend", function callback(ev) {
        if (ev.propertyName === "height" && targetAccordion.classList.contains(classname)) {
          targetAccordion.classList.remove(classname);
          targetAccordion.removeEventListener("transitionend", callback, false);
        }
      });
    }
    function setContainerClass(classname = "accordion-open") {
      if (!accordionContainer.classList.contains(classname)) {
        accordionContainer.classList.add(classname);
      }
    }
    function removeContainerClass(classname = "accordion-open") {
      if (accordionContainer.classList.contains(classname)) {
        accordionContainer.classList.remove(classname);
      }
    }
    function getHeights() {
      let heights = {};
      panels.forEach(function(panel, i) {
        if (elemIsVisible(panel)) {
          let panelBoundingRect = panel.getBoundingClientRect();
          let value = panelBoundingRect.height;
          heights[i] = value;
        }
      });
      return heights;
    }
    function elemIsVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
    function isPOJO(value) {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      let proto = value;
      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(value) === proto;
    }
    return Object.freeze({
      init
    });
  }
})(window, document);
