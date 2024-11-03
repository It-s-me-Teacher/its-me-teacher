<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

const user = ref({
  name: '',
  email: ''
});

const fetchUserData = async () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData && userData.id) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userData.id}`);
      if (response.ok) {
        const fullUserData = await response.json();
        user.value = fullUserData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

onMounted(() => {
  fetchUserData();
});

const showEditDialog = ref(false);
const editedUser = ref({});

const openEditDialog = () => {
  editedUser.value = { ...user.value };
  showEditDialog.value = true;
};

const updateProfile = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedUser.value),
    });
    
    if (response.ok) {
      const updatedUser = await response.json();
      user.value = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showEditDialog.value = false;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

const logout = () => {
  localStorage.removeItem('user');
  router.push('/signup');
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="/src/assets/user-icon.png"
            :subtitle="user.email"
            :title="user.name"
            @click="openEditDialog"
          >
            <template v-slot:append>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <RouterLink class="nav-item" to="/classes">
            <v-list-item
              class="nav-item"
              title="Aulas"
              prepend-icon="mdi-google-classroom"
              :disabled="route.path === '/' || route.path === '/classes'"
            ></v-list-item>
          </RouterLink>
          
          <RouterLink class="nav-item" to="/students">
            <v-list-item
              class="nav-item"
              title="Alunos"
              prepend-icon="mdi-account"
              :disabled="route.path === '/students'"
            ></v-list-item>
          </RouterLink>

          <v-list-item
            class="nav-item"
            title="Logout"
            prepend-icon="mdi-logout"
            @click="logout"
          ></v-list-item>
        </v-list>

        <v-dialog v-model="showEditDialog" max-width="500px">
          <v-card>
            <v-card-title>Edit Profile</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="editedUser.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="editedUser.email"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="editedUser.password"
                  label="New Password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="showEditDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="updateProfile">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<style scoped>
.nav-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
.nav-item {
  text-decoration: none;
  color: inherit;
}
.v-list-item--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
