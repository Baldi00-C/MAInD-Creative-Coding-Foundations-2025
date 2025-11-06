// Wait for the entire HTML document to be loaded before running any script
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     TABS NAVIGATION (switching between sections)
     ============================================================ */

// Select all tab buttons (the ones that change the visible section)
  const tabButtons = document.querySelectorAll(".buttons-group button");
  
  // Select all content sections inside the <article>
  const contentSections = document.querySelectorAll("article section");

  // Add a click event listener to each tab button
  tabButtons.forEach(tabButton => {
    tabButton.addEventListener("click", () => {

      // Derive the ID of the section to show
      // Example: button ID "what-is-trigger" → section ID "what-is"
      const targetSectionId = tabButton.id.replace("-trigger", "");
      
        // Hide all sections first
      contentSections.forEach(section => section.style.display = "none");
      
       // Show only the section corresponding to the clicked tab
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) targetSection.style.display = "block";
      
      // Remove "active" class from all buttons
      tabButtons.forEach(button => button.classList.remove("active"));
      
        // Add "active" class to the clicked button
      tabButton.classList.add("active");
    });
  });

  // Deafult first section
  contentSections.forEach(section => section.style.display = "none");
  const firstSection = document.getElementById("what-is");
  if (firstSection) firstSection.style.display = "block";
  if (tabButtons.length) tabButtons[0].classList.add("active");

  // === ADD ITEM ===
  const addCheckboxItemButton = document.getElementById("add-element-button");
  addCheckboxItemButton.addEventListener("click", () => {
    const newItemTextInput = document.getElementById("text-input");
    const newItemTextValue = newItemTextInput.value.trim();
    if (!newItemTextValue) return;

    const checkboxListContainer = document.querySelector(".checkbox-list");
    const newListItem = document.createElement("li");
    const newCheckboxInput = document.createElement("input");
    newCheckboxInput.type = "checkbox";
    const newCheckboxLabel = document.createElement("label");
    newCheckboxLabel.textContent = newItemTextValue;
    newListItem.appendChild(newCheckboxInput);
    newListItem.appendChild(newCheckboxLabel);

    const firstDoneItem = checkboxListContainer.querySelector("li.done");
    if (firstDoneItem) {
      checkboxListContainer.insertBefore(newListItem, firstDoneItem);
    } else {
      checkboxListContainer.appendChild(newListItem);
    }
    newItemTextInput.value = "";
  });

  // === DELETE CHECKED ===
  const deleteCheckedItemsButton = document.getElementById("delete-elements-button");
  deleteCheckedItemsButton.addEventListener("click", () => {
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");
    checkedCheckboxInputs.forEach(checkedCheckbox => {
      const parentListItem = checkedCheckbox.closest('li');
      if (parentListItem) parentListItem.remove();
    });
  });

  // === MARK AS DONE ===
  const markItemsAsDoneButton = document.getElementById("mark-elements-as-done-button");
  markItemsAsDoneButton.addEventListener("click", () => {
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");
    const checkboxListContainer = document.querySelector(".checkbox-list");
    checkedCheckboxInputs.forEach(checkedCheckbox => {
      const parentListItem = checkedCheckbox.closest('li');
      if (parentListItem) {
        checkboxListContainer.appendChild(parentListItem);
        checkedCheckbox.checked = false;
        checkedCheckbox.disabled = true;
        checkedCheckbox.classList.add("done");
        parentListItem.classList.add("done");
      }
    });
  });

  // === COLOR PICKER ===
  const colorPickerInput = document.getElementById("change-color-picker");
  const openColorPickerButton = document.getElementById("open-color-picker-button");

  if (openColorPickerButton && colorPickerInput) {
    openColorPickerButton.addEventListener("click", () => {
      colorPickerInput.click();
    });

    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    const currentMainColor = rootStyles.getPropertyValue("--main-color").trim();
    if (currentMainColor) colorPickerInput.value = currentMainColor;

    colorPickerInput.addEventListener("input", (event) => {
      const newColor = event.target.value;
      root.style.setProperty("--main-color", newColor);
      root.style.setProperty("--main-color-light", newColor + "33");
    });
  }

  // === VIEW SWITCH (GRID / LIST) ===
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");
  const checkboxList = document.querySelector(".checkbox-list");

  if (gridViewBtn && listViewBtn && checkboxList) {
    gridViewBtn.addEventListener("click", () => {
      checkboxList.classList.add("grid-mode");
      gridViewBtn.classList.add("active-view");
      listViewBtn.classList.remove("active-view");
    });

    listViewBtn.addEventListener("click", () => {
      checkboxList.classList.remove("grid-mode");
      listViewBtn.classList.add("active-view");
      gridViewBtn.classList.remove("active-view");
    });

    // Initialize view based on active button
    if (gridViewBtn.classList.contains("active-view")) {
      checkboxList.classList.add("grid-mode");
    }
  }

  // === DESELECT CHECKBOXES WHEN CLICKING OUTSIDE ===
  document.addEventListener("click", (event) => {
    const isCheckbox = event.target.matches(".checkbox-list input[type='checkbox']");
    const isLabel = event.target.closest(".checkbox-list li");
    if (!isCheckbox && !isLabel) {
      const allChecked = document.querySelectorAll(".checkbox-list input[type='checkbox']:checked:not(:disabled)");
      allChecked.forEach(cb => cb.checked = false);
    }
  });
});

