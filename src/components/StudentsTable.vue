<template>
  <v-data-table
    class="table-container"
    :headers="headers"
    :items="items"
    :sort-by="[{ key: 'name', order: 'asc' }]"
    style="z-index: 1"
    :items-per-page="25"
  >
    <template v-slot:top>
      <v-toolbar class="bg-red-darken-1">
        <v-toolbar-title class="text-h6 font-weight-bold">Students</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2 font-weight-bold" color="white" dark v-bind="props">
              New Student
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.age"
                      label="Age"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.level"
                      label="Level"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Phone"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.payment"
                      label="Payment"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"
                >Cancel</v-btn
              >
              <v-btn color="blue-darken-1" variant="text" @click="save"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this student?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const dialog = ref(false);
const dialogDelete = ref(false);

const headers = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
  { title: "Level", key: "level" },
  { title: "Phone", key: "phone" },
  { title: "Email", key: "email" },
  { title: "Payment", key: "payment" },
  { title: "Actions", key: "actions", sortable: false },
];

const items = ref([]);

const editedIndex = ref(-1);
const editedItem = ref({
  name: "",
  age: "",
  level: "",
  phone: "",
  email: "",
  payment: "",
});
const defaultItem = {
  name: "",
  age: "",
  level: "",
  phone: "",
  email: "",
  payment: "",
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Student" : "Edit Student";
});

async function fetchStudents() {
  try {
    const response = await axios.get("http://localhost:3000/api/students");
    items.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

async function editItem(item) {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

async function deleteItem(item) {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}

async function deleteItemConfirm() {
  try {
    await axios.delete(
      `http://localhost:3000/api/students/${editedItem.value.id}`
    );
    items.value.splice(editedIndex.value, 1);
    closeDelete();
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

function close() {
  dialog.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
}

function closeDelete() {
  dialogDelete.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
}

async function save() {
  try {
    if (editedIndex.value > -1) {
      await axios.put(
        `http://localhost:3000/api/students/${editedItem.value.id}`,
        editedItem.value
      );
      Object.assign(items.value[editedIndex.value], editedItem.value);
    } else {
      const response = await axios.post(
        "http://localhost:3000/api/students",
        editedItem.value
      );
      editedItem.value.id = response.data.id;
      items.value.push(editedItem.value);
    }
    close();
  } catch (error) {
    console.error("Error saving student:", error);
  }
}

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped>
.table-container {
  height: 100vh !important;
  width: 100%;
}
</style>
