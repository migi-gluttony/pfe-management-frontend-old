<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Reactive state
const notes = ref([]);
const classes = ref([]); // List of classes
const selectedClass = ref(null); // Selected class for filtering
const isLoading = ref(false);

// Fetch data on component mount
onMounted(async () => {
  await fetchNotes();
  await fetchClasses();
});

// Methods
const fetchNotes = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3001/note_finales');
    notes.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des notes:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchClasses = async () => {
  try {
    const response = await axios.get('http://localhost:3001/classes');
    classes.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des classes:', error);
  }
};

// Computed filtered notes
const filteredNotes = computed(() => {
  if (!selectedClass.value) return [];
  return notes.value.filter(note => {
    const etudiant = etudiants.value.find(e => e.id === note.etudiant_id);
    return etudiant && etudiant.class_id === selectedClass.value;
  });
});

// Fetch students for class filtering
const etudiants = ref([]);
const fetchEtudiants = async () => {
  try {
    const response = await axios.get('http://localhost:3001/etudiants');
    etudiants.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants:', error);
  }
};

// Print the table
const printNotes = () => {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>Notes de la Classe</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .print-header { text-align: center; margin-bottom: 20px; }
          .print-header h1 { font-size: 24px; margin: 0; }
          .print-header p { font-size: 16px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Notes de la Classe</h1>
          <p>Classe: ${classes.value.find(c => c.id === selectedClass.value)?.filiere || ''}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Note Rapport</th>
              <th>Note Soutenance</th>
              <th>Note Encadrant</th>
              <th>Note Finale</th>
            </tr>
          </thead>
          <tbody>
            ${filteredNotes.value.map(note => {
              const etudiant = etudiants.value.find(e => e.id === note.etudiant_id);
              const utilisateur = utilisateurs.value.find(u => u.id === etudiant?.id);
              return `
                <tr>
                  <td>${utilisateur?.prenom} ${utilisateur?.nom}</td>
                  <td>${note.rapport_note}</td>
                  <td>${note.soutenance_note}</td>
                  <td>${note.encadrant_note}</td>
                  <td>${(note.rapport_note + note.soutenance_note + note.encadrant_note) / 3}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

// Fetch utilisateurs for student names
const utilisateurs = ref([]);
const fetchUtilisateurs = async () => {
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs');
    utilisateurs.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
  }
};

// Fetch all required data on mount
onMounted(async () => {
  await fetchNotes();
  await fetchClasses();
  await fetchEtudiants();
  await fetchUtilisateurs();
});
</script>

<template>
  <div class="notes-container">
    <div class="header-section">
      <h1 class="page-title">
        Gestion des Notes
        <span class="class-selector">
          <select v-model="selectedClass" class="class-dropdown">
            <option value="">Sélectionner une classe</option>
            <option v-for="classe in classes" :key="classe.id" :value="classe.id">
              {{ classe.filiere }}
            </option>
          </select>
          <span class="dropdown-arrow">▼</span>
        </span>
      </h1>
    </div>
    
    <div class="action-bar">
      <button @click="printNotes" class="print-btn" :disabled="!selectedClass">
        Imprimer les notes
      </button>
    </div>
    
    <!-- Notes table -->
    <div class="table-container">
      <table class="notes-table">
        <thead>
          <tr>
            <th width="25%">Étudiant</th>
            <th width="15%">Note Rapport</th>
            <th width="15%">Note Soutenance</th>
            <th width="15%">Note Encadrant</th>
            <th width="15%">Note Finale</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && !notes.length">
            <td colspan="5" class="info-cell">Chargement des notes...</td>
          </tr>
          <tr v-else-if="!filteredNotes.length">
            <td colspan="5" class="info-cell">Aucune note trouvée</td>
          </tr>
          <tr v-for="note in filteredNotes" :key="note.id" class="note-row">
            <td>
              {{ utilisateurs.find(u => u.id === etudiants.find(e => e.id === note.etudiant_id)?.id)?.prenom }}
              {{ utilisateurs.find(u => u.id === etudiants.find(e => e.id === note.etudiant_id)?.id)?.nom }}
            </td>
            <td>{{ note.rapport_note }}</td>
            <td>{{ note.soutenance_note }}</td>
            <td>{{ note.encadrant_note }}</td>
            <td>{{ ((note.rapport_note + note.soutenance_note + note.encadrant_note) / 3).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!-- Use the same CSS styles as before -->
<style scoped>
/* Clean, minimal styling */
.notes-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.page-title {
  color: #1a73e8;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 32px;
}

.class-selector {
  position: relative;
  display: inline-block;
  margin-left: 20px;
}

.class-dropdown {
  appearance: none;
  background-color: transparent;
  border: none;
  font-size: 24px;
  font-weight: 600;
  color: #1a73e8;
  cursor: pointer;
  padding-right: 25px; /* Space for the arrow */
}

.dropdown-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #1a73e8;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}

.print-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.print-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.print-btn:hover:not(:disabled) {
  background-color: #0d62c9;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.notes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.notes-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.notes-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.note-row:hover {
  background-color: rgba(26, 115, 232, 0.03);
}

.note-row:last-child td {
  border-bottom: none;
}

.info-cell {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .notes-container {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .notes-table th, .notes-table td {
    padding: 15px;
  }
}
</style>