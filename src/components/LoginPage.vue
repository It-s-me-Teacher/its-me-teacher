<template>
  <v-sheet class="bg-red-darken-4 pa-16 w-100 header d-flex justify-center align-center" height="250">
    <h1 class="text-h5 center text-lg-h2 titleText">IT'S ME A TEACHER</h1>
  </v-sheet>

  <div class="main position-relative mt-10">
    <v-card class="mx-auto px-6 py-15" max-width="369">
      <h1 style="color: rgba(190,0,0); font-size: 35px; text-align: center">LOGIN</h1>
      <v-form ref="form" v-model="formValid" @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          placeholder="hello@gmail.com"
          class="mb-2" 
          label="Email"
          clearable
        ></v-text-field>
        
        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
          placeholder="Enter your password"
          clearable
          type="password"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!formValid"
          :loading="loading"
          color="red"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Sign In
        </v-btn> 
        <br>
        
        <v-btn
          :loading="loading"
          color="white"
          size="large"
          @click="goToSignUp"
          variant="elevated"
          block
        >
          Create Account
        </v-btn>
      </v-form>
    </v-card>
  </div>

  <div class="logoScreen">
    <img src="../assets/logo.png" class="logo" alt="logo">
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref(null)
const formValid = ref(false)
const email = ref(null)
const password = ref(null)
const loading = ref(false)

const required = (v) => !!v || 'Field is required'

const onSubmit = async () => {
  if (!formValid.value) return
  
  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (response.ok) {
      const userData = await response.json()
      localStorage.setItem('user', JSON.stringify(userData))
      router.push('/classes')
    } else {
      const error = await response.json()
      if (response.status === 404) {
        alert('User not found. Please sign up first!')
        router.push('/signup')
      } else {
        alert(error.error)
      }
    }
  } catch (error) {
    alert('Error connecting to server')
  } finally {
    loading.value = false
  }
}

const goToSignUp = () => {
  router.push('/signup')
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
