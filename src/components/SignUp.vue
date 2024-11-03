<template>
  <v-container class="cadastro" fluid>
    <v-row class="header" justify="center">
      <h1>IT´S ME TEACHER</h1>
    </v-row>

    <div class="form pt-15">
      <v-row justify="center">
        <h2 class="form-title">CADASTRO</h2>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-form v-model="formValid">
            <v-text-field
              v-model="user.name"
              label="Nome"
              :rules="nameRules"
              :error-messages="nameError"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              label="Senha"
              type="password"
              :rules="[rules.required, rules.min(6)]"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.confirmPassword"
              label="Confirmar Senha"
              type="password"
              :rules="[rules.required, rules.passwordMatch]"
              required
            ></v-text-field>

            <v-btn
              :disabled="!formValid"
              color="red"
              class="mt-4"
              @click="submitForm"
              block
            >
              Create Account
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formValid = ref(false);

const nameError = ref("");

const user = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const nameRules = [
  (v) => !!v || "Nome é obrigatório",
  () => !nameError.value || nameError.value,
];

const emailRules = [
  (v) => !!v || "E-mail é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
];

const rules = {
  required: (v) => !!v || "Campo obrigatório",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
  min: (min) => (v) => v.length >= min || `Mínimo de ${min} caracteres`,
  passwordMatch: (v) => v === user.password || "As senhas não correspondem",
};

const submitForm = async () => {
  if (formValid.value) {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        formValid.value = false;
        router.push("/classes");
      } else {
        const error = await response.json();
        nameError.value = error.error;
        formValid.value = false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
};
</script>

<style scoped>
.cadastro {
  background-color: #ffffff;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.header {
  background-color: #8b0505;
  padding: 20px;
  color: white;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
}
</style>
