<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Reactive state
const binomes = ref([]);
const enseignants = ref([]); // List of teachers (encadrants)
const etudiants = ref([]); // List of students
const sujets = ref([]); // List of subjects
const classes = ref([]); // List of classes
const selectedClass = ref(null); // Selected class for filtering
const newBinome = ref({ 
  etudiant1_id: '', 
  etudiant2_id: '', 
  encadrant_id: '', 
  sujet_id: '',
  class_id: '' // Add class_id for binôme
});
const editingBinome = ref(null);
const showEditModal = ref(false);
const showAddModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const showDeleteConfirm = ref(false);
const binomeToDelete = ref(null);

// Computed filtered binômes
const filteredBinomes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  let filtered = binomes.value;

  // Filter by selected class
  if (selectedClass.value) {
    filtered = filtered.filter(binome => binome.class_id === selectedClass.value);
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter(binome => {
      const etudiant1 = etudiants.value.find(e => e.id === binome.etudiant1_id)?.prenom || '';
      const etudiant2 = etudiants.value.find(e => e.id === binome.etudiant2_id)?.prenom || '';
      const encadrant = enseignants.value.find(e => e.id === binome.encadrant_id)?.prenom || '';
      const sujet = sujets.value.find(s => s.id === binome.sujet_id)?.titre || '';
      
      return (
        etudiant1.toLowerCase().includes(query) || 
        etudiant2.toLowerCase().includes(query) ||
        encadrant.toLowerCase().includes(query) ||
        sujet.toLowerCase().includes(query)
      );
    });
  }

  return filtered;
});

// Fetch data on component mount
onMounted(async () => {
  await fetchBinomes();
  await fetchEnseignants();
  await fetchEtudiants();
  await fetchSujets();
  await fetchClasses();
  // Set the default selected class to the first class in the list
  if (classes.value.length > 0) {
    selectedClass.value = classes.value[0].id;
  }
});

// Methods
const fetchBinomes = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3001/binomes');
    binomes.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des binômes:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchEnseignants = async () => {
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs?role=encadrant');
    enseignants.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des enseignants:', error);
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

const fetchSujets = async () => {
  try {
    const response = await axios.get('http://localhost:3001/sujets');
    sujets.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des sujets:', error);
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

const addBinome = async () => {
  try {
    const response = await axios.post('http://localhost:3001/binomes', newBinome.value);
    binomes.value.push(response.data);
    newBinome.value = { etudiant1_id: '', etudiant2_id: '', encadrant_id: '', sujet_id: '', class_id: selectedClass.value };
    showAddModal.value = false;
  } catch (error) {
    console.error("Erreur lors de l'ajout du binôme:", error);
  }
};

const saveEditedBinome = async () => {
  try {
    await axios.put(`http://localhost:3001/binomes/${editingBinome.value.id}`, editingBinome.value);
    await fetchBinomes();
    showEditModal.value = false;
  } catch (error) {
    console.error('Erreur lors de la modification du binôme:', error);
  }
};

const deleteBinome = async () => {
  try {
    await axios.delete(`http://localhost:3001/binomes/${binomeToDelete.value.id}`);
    await fetchBinomes();
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Erreur lors de la suppression du binôme:', error);
  }
};

// UI control methods
const openAddModal = () => {
  newBinome.value = { etudiant1_id: '', etudiant2_id: '', encadrant_id: '', sujet_id: '', class_id: selectedClass.value };
  showAddModal.value = true;
};

const openEditModal = (binome) => {
  editingBinome.value = { ...binome };
  showEditModal.value = true;
};

const confirmDelete = (binome) => {
  binomeToDelete.value = binome;
  showDeleteConfirm.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showAddModal.value = false;
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="binomes-container">
    <div class="header-section">
      <h1 class="page-title">
        Gestion des Binômes de la Classe
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
        placeholder="Rechercher un binôme..."
        type="text"
      >
      <button @click="openAddModal" class="add-btn">
        + Ajouter un binôme
      </button>
    </div>
    
    <!-- Binômes table -->
    <div class="table-container">
      <table class="binomes-table">
        <thead>
          <tr>
            <th width="25%">Étudiant 1</th>
            <th width="25%">Étudiant 2</th>
            <th width="25%">Encadrant</th>
            <th width="20%">Sujet</th>
            <th width="10%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && !binomes.length">
            <td colspan="5" class="info-cell">Chargement des binômes...</td>
          </tr>
          <tr v-else-if="!filteredBinomes.length">
            <td colspan="5" class="info-cell">Aucun binôme trouvé</td>
          </tr>
          <tr v-for="binome in filteredBinomes" :key="binome.id" class="binome-row">
            <td>{{ etudiants.find(e => e.id === binome.etudiant1_id)?.prenom }}</td>
            <td>{{ etudiants.find(e => e.id === binome.etudiant2_id)?.prenom }}</td>
            <td>{{ enseignants.find(e => e.id === binome.encadrant_id)?.prenom }}</td>
            <td>{{ sujets.find(s => s.id === binome.sujet_id)?.titre }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(binome)" class="btn-edit">Éditer</button>
              <button @click="confirmDelete(binome)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Binôme Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter un Nouveau Binôme</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addBinome">
            <div class="form-group">
              <label for="etudiant1">Étudiant 1</label>
              <select id="etudiant1" v-model="newBinome.etudiant1_id" required>
                <option v-for="etudiant in etudiants" :key="etudiant.id" :value="etudiant.id">
                  {{ etudiant.prenom }} {{ etudiant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="etudiant2">Étudiant 2</label>
              <select id="etudiant2" v-model="newBinome.etudiant2_id">
                <option value="">Aucun</option>
                <option v-for="etudiant in etudiants" :key="etudiant.id" :value="etudiant.id">
                  {{ etudiant.prenom }} {{ etudiant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="encadrant">Encadrant</label>
              <select id="encadrant" v-model="newBinome.encadrant_id" required>
                <option v-for="enseignant in enseignants" :key="enseignant.id" :value="enseignant.id">
                  {{ enseignant.prenom }} {{ enseignant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="sujet">Sujet</label>
              <select id="sujet" v-model="newBinome.sujet_id" required>
                <option v-for="sujet in sujets" :key="sujet.id" :value="sujet.id">
                  {{ sujet.titre }}
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

    <!-- Edit Binôme Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier le Binôme</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedBinome">
            <div class="form-group">
              <label for="edit-etudiant1">Étudiant 1</label>
              <select id="edit-etudiant1" v-model="editingBinome.etudiant1_id" required>
                <option v-for="etudiant in etudiants" :key="etudiant.id" :value="etudiant.id">
                  {{ etudiant.prenom }} {{ etudiant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-etudiant2">Étudiant 2</label>
              <select id="edit-etudiant2" v-model="editingBinome.etudiant2_id">
                <option value="">Aucun</option>
                <option v-for="etudiant in etudiants" :key="etudiant.id" :value="etudiant.id">
                  {{ etudiant.prenom }} {{ etudiant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-encadrant">Encadrant</label>
              <select id="edit-encadrant" v-model="editingBinome.encadrant_id" required>
                <option v-for="enseignant in enseignants" :key="enseignant.id" :value="enseignant.id">
                  {{ enseignant.prenom }} {{ enseignant.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-sujet">Sujet</label>
              <select id="edit-sujet" v-model="editingBinome.sujet_id" required>
                <option v-for="sujet in sujets" :key="sujet.id" :value="sujet.id">
                  {{ sujet.titre }}
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
            Êtes-vous sûr de vouloir supprimer le binôme de <strong>{{ etudiants.find(e => e.id === binomeToDelete?.etudiant1_id)?.prenom }}</strong> et <strong>{{ etudiants.find(e => e.id === binomeToDelete?.etudiant2_id)?.prenom }}</strong> ?
          </p>
          <p class="warning-text">Cette action est irréversible.</p>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModals">
              Annuler
            </button>
            <button type="button" class="delete-btn" @click="deleteBinome">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Clean, minimal styling */
.binomes-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  color: #1a73e8;
  font-weight: 600;
  font-size: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.class-selector {
  position: relative;
  display: inline-block;
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

.binomes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.binomes-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.binomes-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.binome-row:hover {
  background-color: rgba(26, 115, 232, 0.03);
}

.binome-row:last-child td {
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
  .binomes-container {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .binomes-table th, .binomes-table td {
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