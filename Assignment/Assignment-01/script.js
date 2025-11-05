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

  // Set the first tab as active on page load
  tabButtons[0].classList.add("active");

  /* ============================================================
     ADD NEW CHECKBOX ITEM (+ icon button)
     ============================================================ */

  const addCheckboxItemButton = document.getElementById("add-element-button");

  addCheckboxItemButton.addEventListener("click", () => {
    // Get the value entered in the text input
    const newItemTextInput = document.getElementById("text-input");
    const newItemTextValue = newItemTextInput.value.trim();

    // Ignore empty input values
    if (!newItemTextValue) return;

    // Get the <ul> that contains the checkbox list
    const checkboxListContainer = document.querySelector(".checkbox-list");

    // Create the <li> container for the new item
    const newListItem = document.createElement("li");

    // Create the checkbox input
    const newCheckboxInput = document.createElement("input");
    newCheckboxInput.type = "checkbox";

    // Create the label for the checkbox
    const newCheckboxLabel = document.createElement("label");
    newCheckboxLabel.textContent = newItemTextValue;

    // Append checkbox and label to the <li>
    newListItem.appendChild(newCheckboxInput);
    newListItem.appendChild(newCheckboxLabel);

    // Find the first "done" item to insert the new one before it (so done items stay at the end)
    const firstDoneItem = checkboxListContainer.querySelector("li.done");

    if (firstDoneItem) {
      // Insert before the first completed item
      checkboxListContainer.insertBefore(newListItem, firstDoneItem);
    } else {
      // Otherwise append at the end of the list
      checkboxListContainer.appendChild(newListItem);
    }

    // Clear input field after adding
    newItemTextInput.value = "";
  });

  /* ============================================================
     DELETE CHECKED ITEMS (trash icon button)
     ============================================================ */

  const deleteCheckedItemsButton = document.getElementById("delete-elements-button");

  deleteCheckedItemsButton.addEventListener("click", () => {
    // Select all checked checkboxes
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");

    // Loop and remove each parent <li>
    checkedCheckboxInputs.forEach((checkedCheckbox) => {
      const parentListItem = checkedCheckbox.closest('li');
      if (parentListItem) {
        parentListItem.remove();
      }
    });
  });

  /* ============================================================
     MARK ITEMS AS DONE (checkmark icon button)
     ============================================================ */

  const markItemsAsDoneButton = document.getElementById("mark-elements-as-done-button");

  markItemsAsDoneButton.addEventListener("click", () => {
    // Get all checked checkboxes
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");
    const checkboxListContainer = document.querySelector(".checkbox-list");

    // Move each checked item to the end and mark it as done
    checkedCheckboxInputs.forEach((checkedCheckbox) => {
      const parentListItem = checkedCheckbox.closest('li');
      if (parentListItem) {
        // Move the item to the bottom of the list
        checkboxListContainer.appendChild(parentListItem);

        // Deselect and visually mark as completed
        checkedCheckbox.checked = false;
        checkedCheckbox.classList.add("done");
        parentListItem.classList.add("done");
      }
    });
  });

  /* ============================================================
     COLOR PICKER (custom color selector)
     ============================================================ */

  const colorPickerInput = document.getElementById("change-color-picker");
  const openColorPickerButton = document.getElementById("open-color-picker-button");

  // When clicking the custom button, open the hidden <input type="color">
  openColorPickerButton.addEventListener("click", () => {
    colorPickerInput.click();
  });

  // Initialize the color picker to match the current CSS variable
  const rootStyles = getComputedStyle(document.documentElement);
  const currentMainColor = rootStyles.getPropertyValue("--main-color").trim();
  colorPickerInput.value = currentMainColor;

  // Listen for color changes
  colorPickerInput.addEventListener("input", (event) => {
    const newColor = event.target.value; // e.g. "#ff0000"

    // Update the main color globally (affects CSS instantly)
    document.documentElement.style.setProperty("--main-color", newColor);
  });
});