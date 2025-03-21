<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Reactive state
const comptes = ref([]);
const classes = ref([]); // List of classes
const selectedClass = ref(null); // Selected class for filtering
const selectedRole = ref('etudiant'); // Selected role for filtering
const newCompte = ref({
  nom: '',
  prenom: '',
  email: '',
  cin: '',
  cne: '',
  date_naissance: '',
  role: 'etudiant',
  class_id: ''
});
const editingCompte = ref(null);
const showEditModal = ref(false);
const showAddModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const showDeleteConfirm = ref(false);
const compteToDelete = ref(null);

// Computed filtered comptes
const filteredComptes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  let filtered = comptes.value;

  // Filter by selected role
  filtered = filtered.filter(compte => compte.role === selectedRole.value);

  // Filter by selected class (for students)
  if (selectedRole.value === 'etudiant' && selectedClass.value) {
    filtered = filtered.filter(compte => compte.class_id === selectedClass.value);
  }

  // Filter by search query
  if (query) {
    filtered = filtered.filter(compte =>
      compte.nom.toLowerCase().includes(query) ||
      compte.prenom.toLowerCase().includes(query) ||
      compte.email.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Fetch data on component mount
onMounted(async () => {
  await fetchComptes();
  await fetchClasses();
});

// Methods
const fetchComptes = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs');
    comptes.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des comptes:', error);
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

const addCompte = async () => {
  try {
    const response = await axios.post('http://localhost:3001/utilisateurs', newCompte.value);
    comptes.value.push(response.data);
    resetNewCompte();
    showAddModal.value = false;
  } catch (error) {
    console.error("Erreur lors de l'ajout du compte:", error);
  }
};

const saveEditedCompte = async () => {
  try {
    await axios.put(`http://localhost:3001/utilisateurs/${editingCompte.value.id}`, editingCompte.value);
    await fetchComptes();
    showEditModal.value = false;
  } catch (error) {
    console.error('Erreur lors de la modification du compte:', error);
  }
};

const deleteCompte = async () => {
  try {
    await axios.delete(`http://localhost:3001/utilisateurs/${compteToDelete.value.id}`);
    await fetchComptes();
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
  }
};

const resetNewCompte = () => {
  newCompte.value = {
    nom: '',
    prenom: '',
    email: '',
    cin: '',
    cne: '',
    date_naissance: '',
    role: 'etudiant',
    class_id: ''
  };
};

// UI control methods
const openAddModal = () => {
  resetNewCompte();
  showAddModal.value = true;
};

const openEditModal = (compte) => {
  editingCompte.value = { ...compte };
  showEditModal.value = true;
};

const confirmDelete = (compte) => {
  compteToDelete.value = compte;
  showDeleteConfirm.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showAddModal.value = false;
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="comptes-container">
    <div class="header-section">
      <h1 class="page-title">
        Gestion des Comptes
        <span class="role-selector">
          <select v-model="selectedRole" class="role-dropdown">
            <option value="etudiant">Étudiants</option>
            <option value="encadrant">Enseignants</option>
            <option value="jury">Jurys</option>
          </select>
          <span class="dropdown-arrow">▼</span>
        </span>
        <span v-if="selectedRole === 'etudiant'" class="class-selector">
          <select v-model="selectedClass" class="class-dropdown">
            <option value="">Toutes les classes</option>
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
        placeholder="Rechercher un compte..."
        type="text"
      >
      <button @click="openAddModal" class="add-btn">
        + Ajouter un compte
      </button>
    </div>
    
    <!-- Comptes table -->
    <div class="table-container">
      <table class="comptes-table">
        <thead>
          <tr>
            <th width="20%">Nom</th>
            <th width="20%">Prénom</th>
            <th width="20%">Email</th>
            <th width="20%">Rôle</th>
            <th width="20%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && !comptes.length">
            <td colspan="5" class="info-cell">Chargement des comptes...</td>
          </tr>
          <tr v-else-if="!filteredComptes.length">
            <td colspan="5" class="info-cell">Aucun compte trouvé</td>
          </tr>
          <tr v-for="compte in filteredComptes" :key="compte.id" class="compte-row">
            <td>{{ compte.nom }}</td>
            <td>{{ compte.prenom }}</td>
            <td>{{ compte.email }}</td>
            <td>{{ compte.role }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(compte)" class="btn-edit">Éditer</button>
              <button @click="confirmDelete(compte)" class="btn-delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Compte Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter un Nouveau Compte</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addCompte">
            <div class="form-group">
              <label for="nom">Nom</label>
              <input id="nom" v-model="newCompte.nom" required />
            </div>
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input id="prenom" v-model="newCompte.prenom" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="newCompte.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="role">Rôle</label>
              <select id="role" v-model="newCompte.role" required>
                <option value="etudiant">Étudiant</option>
                <option value="encadrant">Enseignant</option>
                <option value="jury">Jury</option>
              </select>
            </div>
            <div v-if="newCompte.role === 'etudiant'" class="form-group">
              <label for="cne">CNE</label>
              <input id="cne" v-model="newCompte.cne" required />
            </div>
            <div v-if="newCompte.role === 'etudiant'" class="form-group">
              <label for="date_naissance">Date de Naissance</label>
              <input id="date_naissance" v-model="newCompte.date_naissance" type="date" required />
            </div>
            <div v-if="newCompte.role === 'etudiant'" class="form-group">
              <label for="class_id">Classe</label>
              <select id="class_id" v-model="newCompte.class_id" required>
                <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                  {{ classe.filiere }}
                </option>
              </select>
            </div>
            <div v-if="newCompte.role !== 'etudiant'" class="form-group">
              <label for="cin">CIN</label>
              <input id="cin" v-model="newCompte.cin" required />
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

    <!-- Edit Compte Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier le Compte</h3>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedCompte">
            <div class="form-group">
              <label for="edit-nom">Nom</label>
              <input id="edit-nom" v-model="editingCompte.nom" required />
            </div>
            <div class="form-group">
              <label for="edit-prenom">Prénom</label>
              <input id="edit-prenom" v-model="editingCompte.prenom" required />
            </div>
            <div class="form-group">
              <label for="edit-email">Email</label>
              <input id="edit-email" v-model="editingCompte.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="edit-role">Rôle</label>
              <select id="edit-role" v-model="editingCompte.role" required>
                <option value="etudiant">Étudiant</option>
                <option value="encadrant">Enseignant</option>
                <option value="jury">Jury</option>
              </select>
            </div>
            <div v-if="editingCompte.role === 'etudiant'" class="form-group">
              <label for="edit-cne">CNE</label>
              <input id="edit-cne" v-model="editingCompte.cne" required />
            </div>
            <div v-if="editingCompte.role === 'etudiant'" class="form-group">
              <label for="edit-date_naissance">Date de Naissance</label>
              <input id="edit-date_naissance" v-model="editingCompte.date_naissance" type="date" required />
            </div>
            <div v-if="editingCompte.role === 'etudiant'" class="form-group">
              <label for="edit-class_id">Classe</label>
              <select id="edit-class_id" v-model="editingCompte.class_id" required>
                <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                  {{ classe.filiere }}
                </option>
              </select>
            </div>
            <div v-if="editingCompte.role !== 'etudiant'" class="form-group">
              <label for="edit-cin">CIN</label>
              <input id="edit-cin" v-model="editingCompte.cin" required />
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
            Êtes-vous sûr de vouloir supprimer le compte de <strong>{{ compteToDelete?.prenom }} {{ compteToDelete?.nom }}</strong> ?
          </p>
          <p class="warning-text">Cette action est irréversible.</p>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModals">
              Annuler
            </button>
            <button type="button" class="delete-btn" @click="deleteCompte">
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
.comptes-container {
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

.role-selector, .class-selector {
  position: relative;
  display: inline-block;
  margin-left: 20px;
}

.role-dropdown, .class-dropdown {
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

.comptes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.comptes-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.comptes-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.compte-row:hover {
  background-color: rgba(26, 115, 232, 0.03);
}

.compte-row:last-child td {
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

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
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
  .comptes-container {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .comptes-table th, .comptes-table td {
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