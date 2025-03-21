<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Reactive state
const soutenances = ref([]);
const binomes = ref([]); // List of binômes
const etudiants = ref([]); // List of students
const jurys = ref([]); // List of jurys
const classes = ref([]); // List of classes
const selectedClass = ref(null); // Selected class for filtering
const newSoutenance = ref({ 
  date: '', 
  heure: '', 
  salle: '', 
  binome_id: '', 
  jury1_id: '', 
  jury2_id: '' 
});
const editingSoutenance = ref(null);
const showEditModal = ref(false);
const showAddModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const showDeleteConfirm = ref(false);
const soutenanceToDelete = ref(null);

// Computed filtered soutenances
const filteredSoutenances = computed(() => {
  const query = searchQuery.value.toLowerCase();
  let filtered = soutenances.value;

  // Filter by selected class
  if (selectedClass.value) {
    filtered = filtered.filter(soutenance => {
      const binome = binomes.value.find(b => b.id === soutenance.binome_id);
      return binome && binome.class_id === selectedClass.value;
    });
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter(soutenance => {
      const binome = binomes.value.find(b => b.id === soutenance.binome_id);
      const etudiant1 = etudiants.value.find(e => e.id === binome?.etudiant1_id)?.prenom || '';
      const etudiant2 = etudiants.value.find(e => e.id === binome?.etudiant2_id)?.prenom || '';
      const jury1 = jurys.value.find(j => j.id === soutenance.jury1_id)?.prenom || '';
      const jury2 = jurys.value.find(j => j.id === soutenance.jury2_id)?.prenom || '';
      
      return (
        etudiant1.toLowerCase().includes(query) || 
        etudiant2.toLowerCase().includes(query) ||
        jury1.toLowerCase().includes(query) ||
        jury2.toLowerCase().includes(query)
      );
    });
  }

  return filtered;
});

// Fetch data on component mount
onMounted(async () => {
  await fetchSoutenances();
  await fetchBinomes();
  await fetchEtudiants();
  await fetchJurys();
  await fetchClasses();
  // Set the default selected class to the first class in the list
  if (classes.value.length > 0) {
    selectedClass.value = classes.value[0].id;
  }
});

// Methods
const fetchSoutenances = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3001/soutenances');
    soutenances.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des soutenances:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchBinomes = async () => {
  try {
    const response = await axios.get('http://localhost:3001/binomes');
    binomes.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des binômes:', error);
  }
};

const fetchEtudiants = async () => {
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs?role=etudiant');
    etudiants.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants:', error);
  }
};

const fetchJurys = async () => {
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs?role=jury');
    jurys.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des jurys:', error);
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

const addSoutenance = async () => {
  try {
    const response = await axios.post('http://localhost:3001/soutenances', newSoutenance.value);
    soutenances.value.push(response.data);
    newSoutenance.value = { date: '', heure: '', salle: '', binome_id: '', jury1_id: '', jury2_id: '' };
    showAddModal.value = false;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la soutenance:", error);
  }
};

const saveEditedSoutenance = async () => {
  try {
    await axios.put(`http://localhost:3001/soutenances/${editingSoutenance.value.id}`, editingSoutenance.value);
    await fetchSoutenances();
    showEditModal.value = false;
  } catch (error) {
    console.error('Erreur lors de la modification de la soutenance:', error);
  }
};

const deleteSoutenance = async () => {
  try {
    await axios.delete(`http://localhost:3001/soutenances/${soutenanceToDelete.value.id}`);
    await fetchSoutenances();
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Erreur lors de la suppression de la soutenance:', error);
  }
};

// UI control methods
const openAddModal = () => {
  newSoutenance.value = { date: '', heure: '', salle: '', binome_id: '', jury1_id: '', jury2_id: '' };
  showAddModal.value = true;
};

const openEditModal = (soutenance) => {
  editingSoutenance.value = { ...soutenance };
  showEditModal.value = true;
};

const confirmDelete = (soutenance) => {
  soutenanceToDelete.value = soutenance;
  showDeleteConfirm.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showAddModal.value = false;
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="soutenances-container">
    <div class="header-section">
      <h1 class="page-title">
        Gestion des Soutenances de la Classe
        <span class="class-selector">
          <select v-model="selectedClass" class="class-dropdown">
            <option v-for="classe in classes" :key="classe.id" :value="classe.id">
              {{ classe.filiere }}
            </option>
          </select>
          <span class="dropdown-arrow">▼</span>
        </span>
      </h1>
    </div>
    
    <div class="action-bar">
      <input 
        v-model="searchQuery" 
        class="search-input" 
        placeholder="Rechercher une soutenance..."
        type="text"
      >
      <button @click="openAddModal" class="add-btn">
        + Ajouter une soutenance
      </button>
    </div>
    
    <!-- Soutenances table -->
    <div class="table-container">
      <table class="soutenances-table">
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="10%">Heure</th>
            <th width="15%">Salle</th>
            <th width="20%">Binôme</th>
            <th width="20%">Jury 1</th>
            <th width="20%">Jury 2</th>
            <th width="10%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && !soutenances.length">
            <td colspan="7" class="info-cell">Chargement des soutenances...</td>
          </tr>
          <tr v-else-if="!filteredSoutenances.length">
            <td colspan="7" class="info-cell">Aucune soutenance trouvée</td>
          </tr>
          <tr v-for="soutenance in filteredSoutenances" :key="soutenance.id" class="soutenance-row">
            <td>{{ soutenance.date }}</td>
            <td>{{ soutenance.heure }}</td>
            <td>{{ soutenance.salle }}</td>
            <td>
              {{ etudiants.find(e => e.id === binomes.find(b => b.id === soutenance.binome_id)?.etudiant1_id)?.prenom }} & 
              {{ etudiants.find(e => e.id === binomes.find(b => b.id === soutenance.binome_id)?.etudiant2_id)?.prenom }}
            </td>
            <td>{{ jurys.find(j => j.id === soutenance.jury1_id)?.prenom }}</td>
            <td>{{ jurys.find(j => j.id === soutenance.jury2_id)?.prenom }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(soutenance)" class="btn-edit">Éditer</button>
              <button @click="confirmDelete(soutenance)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Soutenance Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter une Nouvelle Soutenance</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addSoutenance">
            <div class="form-group">
              <label for="date">Date</label>
              <input id="date" v-model="newSoutenance.date" type="date" required />
            </div>
            <div class="form-group">
              <label for="heure">Heure</label>
              <input id="heure" v-model="newSoutenance.heure" type="time" required />
            </div>
            <div class="form-group">
              <label for="salle">Salle</label>
              <input id="salle" v-model="newSoutenance.salle" required />
            </div>
            <div class="form-group">
              <label for="binome">Binôme</label>
              <select id="binome" v-model="newSoutenance.binome_id" required>
                <option v-for="binome in binomes" :key="binome.id" :value="binome.id">
                  {{ etudiants.find(e => e.id === binome.etudiant1_id)?.prenom }} & 
                  {{ etudiants.find(e => e.id === binome.etudiant2_id)?.prenom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="jury1">Jury 1</label>
              <select id="jury1" v-model="newSoutenance.jury1_id" required>
                <option v-for="jury in jurys" :key="jury.id" :value="jury.id">
                  {{ jury.prenom }} {{ jury.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="jury2">Jury 2</label>
              <select id="jury2" v-model="newSoutenance.jury2_id" required>
                <option v-for="jury in jurys" :key="jury.id" :value="jury.id">
                  {{ jury.prenom }} {{ jury.nom }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModals">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Soutenance Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier la Soutenance</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedSoutenance">
            <div class="form-group">
              <label for="edit-date">Date</label>
              <input id="edit-date" v-model="editingSoutenance.date" type="date" required />
            </div>
            <div class="form-group">
              <label for="edit-heure">Heure</label>
              <input id="edit-heure" v-model="editingSoutenance.heure" type="time" required />
            </div>
            <div class="form-group">
              <label for="edit-salle">Salle</label>
              <input id="edit-salle" v-model="editingSoutenance.salle" required />
            </div>
            <div class="form-group">
              <label for="edit-binome">Binôme</label>
              <select id="edit-binome" v-model="editingSoutenance.binome_id" required>
                <option v-for="binome in binomes" :key="binome.id" :value="binome.id">
                  {{ etudiants.find(e => e.id === binome.etudiant1_id)?.prenom }} & 
                  {{ etudiants.find(e => e.id === binome.etudiant2_id)?.prenom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-jury1">Jury 1</label>
              <select id="edit-jury1" v-model="editingSoutenance.jury1_id" required>
                <option v-for="jury in jurys" :key="jury.id" :value="jury.id">
                  {{ jury.prenom }} {{ jury.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-jury2">Jury 2</label>
              <select id="edit-jury2" v-model="editingSoutenance.jury2_id" required>
                <option v-for="jury in jurys" :key="jury.id" :value="jury.id">
                  {{ jury.prenom }} {{ jury.nom }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModals">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-backdrop" @click="closeModals">
      <div class="modal-content confirmation-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="warning-icon">⚠️</div>
          <p class="confirmation-text">
            Êtes-vous sûr de vouloir supprimer la soutenance du binôme <strong>{{ etudiants.find(e => e.id === binomes.find(b => b.id === soutenanceToDelete?.binome_id)?.etudiant1_id)?.prenom }}</strong> et <strong>{{ etudiants.find(e => e.id === binomes.find(b => b.id === soutenanceToDelete?.binome_id)?.etudiant2_id)?.prenom }}</strong> ?
          </p>
          <p class="warning-text">Cette action est irréversible.</p>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModals">
              Annuler
            </button>
            <button type="button" class="delete-btn" @click="deleteSoutenance">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Use the same CSS styles as before -->
<style scoped>
/* Clean, minimal styling */
.soutenances-container {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 20px;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.search-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.add-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(26, 115, 232, 0.2);
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: #0d62c9;
  box-shadow: 0 4px 8px rgba(26, 115, 232, 0.3);
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.soutenances-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.soutenances-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.soutenances-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.soutenance-row:hover {
  background-color: rgba(26, 115, 232, 0.03);
}

.soutenance-row:last-child td {
  border-bottom: none;
}

.actions-cell {
  white-space: nowrap;
  text-align: right;
}

.btn-edit, .btn-delete {
  margin-left: 12px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: #f0f6ff;
  color: #1a73e8;
  border: 1px solid #1a73e8;
}

.btn-edit:hover {
  background-color: #1a73e8;
  color: white;
}

.btn-delete {
  background-color: #fff5f5;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

.info-cell {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

/* Modal styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.confirmation-modal {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #1a73e8;
  font-size: 22px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
  font-size: 16px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn, .submit-btn, .delete-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #555;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #eee;
}

.submit-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(26, 115, 232, 0.2);
}

.submit-btn:hover {
  background-color: #0d62c9;
  box-shadow: 0 4px 8px rgba(26, 115, 232, 0.3);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(220, 53, 69, 0.2);
}

.delete-btn:hover {
  background-color: #c82333;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin: 10px 0;
  font-size: 16px;
}

.warning-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 15px;
}

.confirmation-text {
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .soutenances-container {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .soutenances-table th, .soutenances-table td {
    padding: 15px;
  }
  
  .btn-edit, .btn-delete {
    padding: 8px 15px;
    font-size: 14px;
    margin-bottom: 5px;
    margin-left: 0;
    display: block;
    width: 100%;
    text-align: center;
  }
  
  .btn-edit {
    margin-bottom: 8px;
  }
}
</style>