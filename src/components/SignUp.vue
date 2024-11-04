<template>
  <v-sheet class="bg-red-darken-4 pa-16 w-100 header d-flex justify-center align-center" height="250">
    <h1 class="text-h5 center text-lg-h2 titleText">IT'S ME A TEACHER</h1>
  </v-sheet>

  <div class="main position-relative mt-10">
    <v-card class="mx-auto px-6 py-15" max-width="369">
      <h1 style="color: rgba(190,0,0); font-size: 35px; text-align: center">CADASTRO</h1>
      <v-form v-model="formValid">
        <v-text-field
          v-model="user.name"
          label="Nome"
          :rules="nameRules"
          :error-messages="nameError"
          clearable
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          :rules="emailRules"
          label="E-mail"
          clearable
          required
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          label="Senha"
          type="password"
          :rules="[rules.required, rules.min(6)]"
          clearable
          required
        ></v-text-field>

        <v-text-field
          v-model="user.confirmPassword"
          label="Confirmar Senha"
          type="password"
          :rules="[rules.required, rules.passwordMatch]"
          clearable
          required
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!formValid"
          color="red"
          size="large"
          @click="submitForm"
          variant="elevated"
          block
        >
          Create Account
        </v-btn>
        
        <br>
        
        <v-btn
          :loading="loading"
          color="white"
          size="large"
          variant="elevated"
          @click="goToLogin"
          block
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </div>

  <div class="logoScreen">
    <img src="../assets/logo.png" class="logo" alt="logo">
  </div>
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

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.logoScreen {
  position: fixed;
  right: 10px;
  bottom: 0;
  z-index: 2000;
  width: 15vw;
}

.logo {
  width: 100%;
  height: auto;
  transition: width 0.3s;
  margin-bottom: 0;
}

.titleText {
  font-family: Segoe UI black; 
  text-align: center;
}

@media (max-width: 600px) {
  .logoScreen {
    width: 20vw;
  }
}
</style>