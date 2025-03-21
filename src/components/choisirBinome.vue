<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive state
const students = ref([]); // List of available students
const receivedRequests = ref([]); // List of received binôme requests
const selectedBinome = ref(null); // Selected binôme
const waiting = ref(false); // Waiting for binôme response
const showSuccessMessage = ref(false); // Success message after accepting a request
const acceptedPartner = ref(null); // Accepted partner name
const continueAlone = ref(false); // Student chooses to continue alone

// Fetch data on component mount
onMounted(async () => {
  await fetchStudents();
  await fetchReceivedRequests();
});

// Fetch available students
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3001/utilisateurs?role=etudiant');
    students.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants:', error);
  }
};

// Fetch received binôme requests
const fetchReceivedRequests = async () => {
  try {
    const response = await axios.get('http://localhost:3001/binome_requests?status=pending');
    receivedRequests.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des demandes reçues:', error);
  }
};

// Choose a binôme
const chooseBinome = async (student) => {
  try {
    const response = await axios.post('http://localhost:3001/binome_requests', {
      requester_id: student.id,
      requested_id: selectedBinome.value.id,
      status: 'pending'
    });
    waiting.value = true;
    selectedBinome.value = student;
  } catch (error) {
    console.error('Erreur lors de la demande de binôme:', error);
  }
};

// Accept a binôme request
const approveRequest = async (request) => {
  try {
    await axios.put(`http://localhost:3001/binome_requests/${request.id}`, { status: 'accepted' });
    acceptedPartner.value = request.requester_id;
    showSuccessMessage.value = true;
    receivedRequests.value = receivedRequests.value.filter(req => req.id !== request.id);

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '/dashboard'; // Redirect to dashboard or another page
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande:', error);
  }
};

// Decline a binôme request
const declineRequest = async (request) => {
  try {
    await axios.put(`http://localhost:3001/binome_requests/${request.id}`, { status: 'rejected' });
    receivedRequests.value = receivedRequests.value.filter(req => req.id !== request.id);
  } catch (error) {
    console.error('Erreur lors du refus de la demande:', error);
  }
};

// Cancel a binôme request
const cancelRequest = async () => {
  try {
    await axios.delete(`http://localhost:3001/binome_requests/${selectedBinome.value.id}`);
    waiting.value = false;
    selectedBinome.value = null;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la demande:', error);
  }
};

// Continue alone
const handleContinueAlone = async () => {
  try {
    await axios.post('http://localhost:3001/binomes', {
      etudiant1_id: selectedBinome.value.id,
      etudiant2_id: null, // No partner
      encadrant_id: null,
      sujet_id: null,
      class_id: null
    });
    continueAlone.value = true;
    showSuccessMessage.value = true;

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '/dashboard'; // Redirect to dashboard or another page
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la continuation seule:', error);
  }
};
</script>

<template>
  <div class="choisir-binome-container">
    <div class="header-section">
      <h1 class="page-title">
        Choisir un Binôme
        <span class="class-selector">
          <select v-model="selectedClass" class="class-dropdown">
            <option v-for="classe in classes" :key="classe.id" :value="classe.id">
              {{ classe.filiere }}
            </option>
          </select>
        </span>
      </h1>
    </div>

    <div class="action-bar">
      <button @click="handleContinueAlone" class="continue-alone-btn">
        Continuer seul
      </button>
    </div>

    <!-- Received Requests -->
    <div class="card" v-if="receivedRequests.length > 0">
      <h2>Demandes reçues</h2>
      <table class="binome-table">
        <thead>
          <tr>
            <th width="70%">Nom de l'étudiant</th>
            <th width="30%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in receivedRequests" :key="request.id">
            <td>{{ request.requester_id }}</td>
            <td class="actions-cell">
              <button @click="approveRequest(request)" class="btn-edit">Accepter</button>
              <button @click="declineRequest(request)" class="btn-delete">Refuser</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Available Students -->
    <div class="card" v-if="!waiting && !continueAlone">
      <h2>Étudiants disponibles</h2>
      <table class="binome-table">
        <thead>
          <tr>
            <th width="70%">Nom de l'étudiant</th>
            <th width="30%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.prenom }} {{ student.nom }}</td>
            <td class="actions-cell">
              <button @click="chooseBinome(student)" class="btn-edit">Choisir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Waiting for Response -->
    <div v-if="waiting" class="waiting-message">
      <p>Demande envoyée à <strong>{{ selectedBinome.prenom }} {{ selectedBinome.nom }}</strong>.</p>
      <p>Veuillez patienter pendant que votre demande est examinée.</p>
      <button @click="cancelRequest" class="cancel-btn">Annuler la demande</button>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="success-message">
      <p v-if="acceptedPartner">Vous avez accepté la demande de <strong>{{ acceptedPartner }}</strong>!</p>
      <p v-if="continueAlone">Vous avez choisi de continuer seul.</p>
      <p>Redirection en cours...</p>
    </div>
  </div>
</template>

<!-- Use the same CSS styles as before -->
<style scoped>
.choisir-binome-container {
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

.continue-alone-btn {
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

.continue-alone-btn:hover {
  background-color: #0d62c9;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.binome-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.binome-table th {
  text-align: left;
  padding: 18px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #1a73e8;
  border-bottom: 2px solid #eee;
}

.binome-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
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

.waiting-message {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  text-align: center;
  margin-bottom: 30px;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #c82333;
}

.success-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #20bf6b;
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  animation: fadeOut 2s ease-in-out forwards;
  text-align: center;
}

@keyframes fadeOut {
  0%, 70% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
}
</style>