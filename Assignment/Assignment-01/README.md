# ADHD Out of the Chat! - Micro App
## Brief
Starting from the concept of a pinboard, implement a web page that:

is responsive (properly layout for smartphone, tablet, and desktop)
allows the user to add and remove elements
allows the user to coustomize elements (i.e. colors, size)
allows the switch between two views (at least)

![Screen](DOC/How?.png)
![Screen](DOC/Phone.png)
![Screen](DOC/Tablet.png)
![Screen](DOC/Use-it!.png)
![Screen](DOC/What-is?.png)



# ADHD Out of the Chat!

**ADHD Out of the Chat!** è una mini web app per la gestione di liste e attività quotidiane, pensata per chi tende a dimenticare le piccole cose tra mille pensieri.  
Permette di aggiungere, contrassegnare, eliminare e completare task in modo visivo e personalizzabile (con vista griglia o lista e colore tema variabile).  
L’interazione è completamente client-side e avviene tramite pulsanti, input testuali e checkbox interattive.  
*(≈300 caratteri)*

---

## Functional Overview

### Interazioni principali:
- Navigazione a tab tra sezioni (“What is?”, “How use it?”, “Use it!”)
- Aggiunta, eliminazione e completamento delle attività
- Personalizzazione del colore principale tramite color picker
- Cambio tra vista griglia e vista lista
- Reset automatico delle checkbox selezionate cliccando fuori dalla lista

---

## Funzioni JavaScript

| Nome Funzione / Blocco | Argomenti | Descrizione | Valore Restituito |
|-------------------------|------------|--------------|-------------------|
| `DOMContentLoaded` listener | — | Inizializza tutti gli event listener e imposta la sezione e la vista predefinita. | `void` |
| `tabButtons.forEach(...)` | `tabButton` (elemento DOM) | Gestisce il cambio di sezione mostrando solo quella corrispondente al pulsante cliccato e aggiornando lo stato “active”. | `void` |
| `addCheckboxItemButton.addEventListener("click", …)` | — | Aggiunge un nuovo elemento alla lista delle attività usando il testo dell’input. | `void` |
| `deleteCheckedItemsButton.addEventListener("click", …)` | — | Rimuove dalla lista tutti gli elementi le cui checkbox sono selezionate. | `void` |
| `markItemsAsDoneButton.addEventListener("click", …)` | — | Sposta in fondo alla lista gli elementi selezionati, li disabilita e li marca come completati (`.done`). | `void` |
| `colorPickerInput.addEventListener("input", …)` | `event` (oggetto evento) | Aggiorna dinamicamente la variabile CSS `--main-color` in base al colore scelto. | `void` |
| `gridViewBtn.addEventListener("click", …)` / `listViewBtn.addEventListener("click", …)` | — | Alterna la modalità di visualizzazione tra griglia e lista modificando le classi CSS. | `void` |
| `document.addEventListener("click", …)` | `event` (oggetto evento) | Deseleziona automaticamente le checkbox non disabilitate quando si clicca al di fuori della lista. | `void` |

---

## Tecnologie utilizzate

- **HTML5** per la struttura semantica  
- **CSS3** con variabili e layout responsive (grid/flex)  
- **Vanilla JavaScript (ES6)** per logica e interattività  

---

## Personalizzazione
- Il colore principale è controllato tramite la variabile CSS `--main-color`, modificabile in tempo reale con il color picker.
- La vista può essere alternata tra **Grid View** e **List View** con i pulsanti dedicati.

---

## Avvio
Apri il file `index.html` in un browser moderno — non sono necessarie dipendenze esterne.

---
