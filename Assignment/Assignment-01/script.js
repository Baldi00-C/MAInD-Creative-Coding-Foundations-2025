document.addEventListener("DOMContentLoaded", () => {
  // Select all tab buttons
  const tabButtons = document.querySelectorAll(".buttons-group button");

  // Select all content sections inside the article
  const contentSections = document.querySelectorAll("article section");

  // Add click event to each tab button
  tabButtons.forEach(tabButton => {
    tabButton.addEventListener("click", () => {
      // Determine the ID of the section to show
      // Example: "what-is-trigger" → "what-is"
      const targetSectionId = tabButton.id.replace("-trigger", "");

      // Hide all sections first
      contentSections.forEach(section => section.style.display = "none");

      // Show only the targeted section
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) targetSection.style.display = "block";

      // Remove the "active" class from all tab buttons
      tabButtons.forEach(button => button.classList.remove("active"));

      // Add "active" class to the clicked tab button
      tabButton.classList.add("active");
    });
  });

  // Make the first tab button active on page load
  tabButtons[0].classList.add("active");

  // Select the "Add Item (the plus icon)" button
  const addCheckboxItemButton = document.getElementById("add-element-button");

  addCheckboxItemButton.addEventListener("click", () => {
    // Get the value from the text input
    const newItemTextInput = document.getElementById("text-input");
    const newItemTextValue = newItemTextInput.value;

    // Select the UL that contains the list of checkboxes
    const checkboxListContainer = document.querySelector(".checkbox-list");

    // Create a new LI element to hold the checkbox and label
    const newListItem = document.createElement("li");

    // Create a new checkbox input
    const newCheckboxInput = document.createElement("input");
    newCheckboxInput.type = "checkbox"; // Set input type to checkbox

    // Create a label element for the checkbox
    const newCheckboxLabel = document.createElement('label');
    newCheckboxLabel.textContent = newItemTextValue;

    // Append checkbox and label to the LI
    newListItem.appendChild(newCheckboxInput);
    newListItem.appendChild(newCheckboxLabel);

    // Find the first LI with class "done" to insert before it
    const firstDoneItem = checkboxListContainer.querySelector("li.done");

    if (firstDoneItem) {
      // Insert the new item before the first done item
      checkboxListContainer.insertBefore(newListItem, firstDoneItem);
    } else {
      // If no done items exist, just append at the end
      checkboxListContainer.appendChild(newListItem);
    }

    // Clear the text input after adding the item
    newItemTextInput.value = "";
  });

  // Select the "Delete Checked Items (the trash icon)" button
  const deleteCheckedItemsButton = document.getElementById("delete-elements-button");

  deleteCheckedItemsButton.addEventListener("click", () => {
    // Select all checked checkboxes inside the list
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");

    // Loop through each checked checkbox
    checkedCheckboxInputs.forEach((checkedCheckbox) => {
      // Find the parent LI element of the checkbox
      const parentListItem = checkedCheckbox.closest('li'); // 'closest' finds the nearest ancestor <li>
      if (parentListItem) {
        parentListItem.remove(); // Remove the LI element from the DOM
      }
    });
  });

  // Select the "Mark items as done (the checkbox icon)" button
  const markItemsAsDoneButton = document.getElementById("mark-elements-as-done-button");

  markItemsAsDoneButton.addEventListener("click", () => {
    // Select all checked checkboxes inside the list
    const checkedCheckboxInputs = document.querySelectorAll(".checkbox-list li input[type='checkbox']:checked");

    console.log({checkedCheckboxInputs})
    // Select the UL that contains the list of checkboxes
    const checkboxListContainer = document.querySelector(".checkbox-list");

    // Loop through each checked checkbox
    checkedCheckboxInputs.forEach((checkedCheckbox) => {
      // Find the parent LI element of the checkbox
      const parentListItem = checkedCheckbox.closest('li'); // 'closest' finds the nearest ancestor <li>
      if (parentListItem) {
        checkboxListContainer.appendChild(parentListItem); // Move LI to the end of the list
        checkedCheckbox.checked = false; // Deselect the checkbox
        checkedCheckbox.classList.add("done");
        parentListItem.classList.add("done");
      }
    });
  });
});

