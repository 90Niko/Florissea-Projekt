<script setup>
import { register } from '@/services/authService';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']);
const router = useRouter();

// Fields
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// UI state
const loading = ref(false);
const errorMsg = ref('');

// Validation state
const emailError = ref('');
const passwordError = ref('');
const confirmError = ref('');
const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmTouched = ref(false);
const submitted = ref(false);

// Patterns / rules
const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]{2,}$/;
const emailValid = computed(() => emailPattern.test(email.value));
const passwordValid = computed(() => password.value.length >= 8);
const confirmValid = computed(() => confirmPassword.value === password.value && password.value.length > 0);

// Button enabled only when all valid (no errors)
const isValid = computed(() =>
  emailValid.value && passwordValid.value && confirmValid.value
  && !emailError.value && !passwordError.value && !confirmError.value,
);

// --- Validators (show errors only on blur/submit) ---
function validateEmail() {
  if (!emailTouched.value && !submitted.value)
    return;
  emailError.value = '';

  if (!email.value) {
    if (submitted.value)
      emailError.value = 'Please enter your email address';
    return;
  }
  if (!emailValid.value)
    emailError.value = 'Invalid email address';
}

function validatePassword() {
  if (!passwordTouched.value && !submitted.value)
    return;
  passwordError.value = '';

  if (!password.value) {
    if (submitted.value)
      passwordError.value = 'Please enter a password';
    return;
  }
  if (!passwordValid.value)
    passwordError.value = 'Minimum 8 characters';
}

function validateConfirm() {
  if (!confirmTouched.value && !submitted.value)
    return;
  confirmError.value = '';

  if (!confirmPassword.value) {
    if (submitted.value)
      confirmError.value = 'Please confirm your password';
    return;
  }
  if (!confirmValid.value)
    confirmError.value = 'Passwords do not match';
}

// --- Blur handlers ---
function handleEmailBlur() { emailTouched.value = true; validateEmail(); }
function handlePasswordBlur() { passwordTouched.value = true; validatePassword(); validateConfirm(); }
function handleConfirmBlur() { confirmTouched.value = true; validateConfirm(); }

// --- Input handlers (only clear errors when value becomes valid or empty) ---
function handleEmailInput() {
  if (!email.value || emailValid.value)
    emailError.value = '';
}
function handlePasswordInput() {
  if (!password.value || passwordValid.value)
    passwordError.value = '';
  // keep confirm in sync
  if (!confirmPassword.value || confirmValid.value)
    confirmError.value = '';
}
function handleConfirmInput() {
  if (!confirmPassword.value || confirmValid.value)
    confirmError.value = '';
}

// --- Submit ---
async function submitRegister() {
  submitted.value = true;
  emailTouched.value = true;
  passwordTouched.value = true;
  confirmTouched.value = true;

  validateEmail();
  validatePassword();
  validateConfirm();

  if (!isValid.value)
    return;

  loading.value = true;
  errorMsg.value = '';

  try {
    const { user, session } = await register(email.value, password.value);
    console.log('Register success', { user, session });

    if (!session) {
      // e.g. email confirmation flow
      window.alert('Check your email for a confirmation link.');
    }

    emit('close');
    router.push('/login');
  }
  catch (err) {
    errorMsg.value = err?.message || 'Registration failed';
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="auth-form" novalidate @submit.prevent="submitRegister">
    <!-- Email -->
    <div
      class="field"
      :class="{
        error:
          (!!emailError && (submitted || emailTouched))
          || ((submitted || emailTouched) && !!email && !emailPattern.test(email)),
      }"
    >
      <input
        v-model.trim="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        required
        @blur="handleEmailBlur"
        @input="handleEmailInput"
      >
      <p v-if="emailError" class="error">
        {{ emailError }}
      </p>
    </div>

    <!-- Password -->
    <div
      class="field"
      :class="{
        error:
          (!!passwordError && (submitted || passwordTouched))
          || ((submitted || passwordTouched) && !!password && password.length < 8),
      }"
    >
      <input
        v-model="password"
        type="password"
        placeholder="Password (min 8 chars)"
        minlength="8"
        required
        @blur="handlePasswordBlur"
        @input="handlePasswordInput"
      >
      <p v-if="passwordError" class="error">
        {{ passwordError }}
      </p>
    </div>

    <!-- Confirm Password -->
    <div
      class="field"
      :class="{
        error:
          (!!confirmError && (submitted || confirmTouched))
          || ((submitted || confirmTouched) && !!confirmPassword && confirmPassword !== password),
      }"
    >
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        required
        @blur="handleConfirmBlur"
        @input="handleConfirmInput"
      >
      <p v-if="confirmError" class="error">
        {{ confirmError }}
      </p>
    </div>

    <p v-if="errorMsg" class="error global">
      {{ errorMsg }}
    </p>

    <button type="submit" class="submit-btn" :disabled="!isValid || loading">
      <span v-if="!loading">Register</span>
      <span v-else class="spinner" aria-hidden="true" />
    </button>
  </form>
</template>

<style scoped>
.auth-form { display: flex; flex-direction: column; gap: 12px; }

.field { display: flex; flex-direction: column; gap: 6px; }
input {
  padding: 10px;
  border: 1px solid #99AEAD;
  border-radius: 6px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}
input:focus {
  border-color: #2F575D;
  box-shadow: 0 0 0 3px rgba(47, 87, 93, .12);
}
.field.error input {
  border-color: #ff3b5c;
  box-shadow: 0 0 0 3px rgba(255, 59, 92, .12);
}

.error { color: #ff3b5c; font-size: .9em; margin: 0; }
.error.global { text-align: center; font-weight: 600; }

.submit-btn {
  background: #658B6F; border: none; color: #fff; padding: 10px;
  font-weight: 600; border-radius: 6px; cursor: pointer;
  transition: background .3s ease, opacity .2s ease;
}
.submit-btn[disabled] { opacity: .6; cursor: not-allowed; }
.submit-btn:hover { background: #2F575D; }

/* Simple loader */
.spinner {
  display: inline-block;
  width: 18px; height: 18px;
  border: 2px solid #e7f0ee;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
