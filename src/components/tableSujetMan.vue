<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Reactive state
const sujets = ref([]);
const classes = ref([]); // List of classes
const selectedClass = ref(null); // Selected class for filtering
const newSujet = ref({ titre: '', theme: '', description: '', class_id: '' });
const editingSujet = ref(null);
const showEditModal = ref(false);
const showAddModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const showDeleteConfirm = ref(false);
const sujetToDelete = ref(null);

// Computed filtered sujets
const filteredSujets = computed(() => {
  const query = searchQuery.value.toLowerCase();
  let filtered = sujets.value;

  // Filter by selected class
  if (selectedClass.value) {
    filtered = filtered.filter(sujet => sujet.class_id === selectedClass.value);
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter(sujet => 
      sujet.titre.toLowerCase().includes(query) || 
      sujet.theme.toLowerCase().includes(query) ||
      sujet.description.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Fetch data on component mount
onMounted(async () => {
  await fetchSujets();
  await fetchClasses();
  // Set the default selected class to the first class in the list
  if (classes.value.length > 0) {
    selectedClass.value = classes.value[0].id;
  }
});

// Methods
const fetchSujets = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3001/sujets');
    sujets.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des sujets:', error);
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

const addSujet = async () => {
  try {
    const response = await axios.post('http://localhost:3001/sujets', newSujet.value);
    sujets.value.push(response.data);
    newSujet.value = { titre: '', theme: '', description: '', class_id: selectedClass.value };
    showAddModal.value = false;
  } catch (error) {
    console.error("Erreur lors de l'ajout du sujet:", error);
  }
};

const saveEditedSujet = async () => {
  try {
    await axios.put(`http://localhost:3001/sujets/${editingSujet.value.id}`, editingSujet.value);
    await fetchSujets();
    showEditModal.value = false;
  } catch (error) {
    console.error('Erreur lors de la modification du sujet:', error);
  }
};

const deleteSujet = async () => {
  try {
    await axios.delete(`http://localhost:3001/sujets/${sujetToDelete.value.id}`);
    await fetchSujets();
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Erreur lors de la suppression du sujet:', error);
  }
};

// UI control methods
const openAddModal = () => {
  newSujet.value = { titre: '', theme: '', description: '', class_id: selectedClass.value };
  showAddModal.value = true;
};

const openEditModal = (sujet) => {
  editingSujet.value = { ...sujet };
  showEditModal.value = true;
};

const confirmDelete = (sujet) => {
  sujetToDelete.value = sujet;
  showDeleteConfirm.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showAddModal.value = false;
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="sujets-container">
    <div class="header-section">
      <h1 class="page-title">
        Gestion des Sujets de la Classe
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
        placeholder="Rechercher un sujet..."
        type="text"
      >
      <button @click="openAddModal" class="add-btn">
        + Ajouter un sujet
      </button>
    </div>
    
    <!-- Sujets table -->
    <div class="table-container">
      <table class="sujets-table">
        <thead>
          <tr>
            <th width="20%">Titre</th>
            <th width="15%">Thème</th>
            <th width="45%">Description</th>
            <th width="20%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && !sujets.length">
            <td colspan="4" class="info-cell">Chargement des sujets...</td>
          </tr>
          <tr v-else-if="!filteredSujets.length">
            <td colspan="4" class="info-cell">Aucun sujet trouvé</td>
          </tr>
          <tr v-for="sujet in filteredSujets" :key="sujet.id" class="sujet-row">
            <td class="title-cell">{{ sujet.titre }}</td>
            <td class="theme-cell">{{ sujet.theme }}</td>
            <td class="description-cell">{{ sujet.description }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(sujet)" class="btn-edit">Éditer</button>
              <button @click="confirmDelete(sujet)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Sujet Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter un Nouveau Sujet</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addSujet">
            <div class="form-group">
              <label for="titre">Titre</label>
              <input id="titre" v-model="newSujet.titre" required />
            </div>
            <div class="form-group">
              <label for="theme">Thème</label>
              <input id="theme" v-model="newSujet.theme" required />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" v-model="newSujet.description" required rows="6"></textarea>
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

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier le Sujet</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedSujet">
            <div class="form-group">
              <label for="edit-titre">Titre</label>
              <input id="edit-titre" v-model="editingSujet.titre" required />
            </div>
            <div class="form-group">
              <label for="edit-theme">Thème</label>
              <input id="edit-theme" v-model="editingSujet.theme" required />
            </div>
            <div class="form-group">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" v-model="editingSujet.description" required rows="6"></textarea>
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
          <p class="confirmation-text">Êtes-vous sûr de vouloir supprimer le sujet <strong>{{ sujetToDelete?.titre }}</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModals">
              Annuler
            </button>
            <button type="button" class="delete-btn" @click="deleteSujet">
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
.sujets-container {
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
.class-dropdown {
  appearance: none;
  background-color: transparent;
  border: none;
  font-size: 32px;
  font-weight: 550;
  color: #1a73e8;
  cursor: pointer;
}

.dropdown-arrow {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #1a73e8;
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

.sujets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.sujets-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.sujets-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.sujet-row:hover {
  background-color: rgba(26, 115, 232, 0.03);
}

.sujet-row:last-child td {
  border-bottom: none;
}

.title-cell {
  font-weight: 600;
  color: #1a73e8;
}

.theme-cell {
  color: #555;
}

.description-cell {
  line-height: 1.5;
  color: #333;
  /* Remove truncation to show full text regardless of length */
  white-space: normal;
  overflow: visible;
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
  .sujets-container {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .sujets-table th, .sujets-table td {
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