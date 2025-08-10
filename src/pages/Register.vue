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
const showPassword = ref(false);
const showConfirm = ref(false);

// States
const loading = ref(false);
const success = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

// Validation
const emailError = ref('');
const passwordError = ref('');
const confirmError = ref('');
const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmTouched = ref(false);
const submitted = ref(false);

const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]{2,}$/;

// Derived validity
const emailValid = computed(() => emailPattern.test(email.value));
const passwordValid = computed(() => password.value.length >= 8);
const confirmValid = computed(
  () => confirmPassword.value === password.value && password.value.length > 0,
);

const isValid = computed(
  () =>
    !!email.value
    && !!password.value
    && !!confirmPassword.value
    && emailValid.value
    && passwordValid.value
    && confirmValid.value
    && !emailError.value
    && !passwordError.value
    && !confirmError.value,
);

// --- Validators ---
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
function handleEmailBlur() {
  emailTouched.value = true;
  validateEmail();
}
function handlePasswordBlur() {
  passwordTouched.value = true;
  validatePassword();
  validateConfirm();
}
function handleConfirmBlur() {
  confirmTouched.value = true;
  validateConfirm();
}

// --- Input handlers ---
function handleEmailInput() {
  // keep UI consistent with what we submit
  email.value = email.value.toLowerCase();
  if (!email.value || emailValid.value)
    emailError.value = '';
}
function handlePasswordInput() {
  if (!password.value || passwordValid.value)
    passwordError.value = '';
  // keep confirm synced
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
  emailError.value = ''; // clear field-level error

  // normalize email before sending
  const normalizedEmail = email.value.trim().toLowerCase();

  try {
    const { user, session } = await register(normalizedEmail, password.value);
    console.log('Register success', { user, session });

    success.value = true;
    successMsg.value = session
      ? 'Account created! Redirecting to dashboard…'
      : 'Almost done! Check your email for a confirmation link.';

    // small pause for the success animation, then route
    setTimeout(() => {
      emit('close');
      router.push(session ? '/' : '/login');
    }, 900);
  }
  catch (err) {
    const msg = (err?.message || '').toString();
    // surface duplicate email under the email field
    if (/already\s*registered/i.test(msg) || /already\s*exists/i.test(msg) || err?.status === 409 || err?.status === 422) {
      emailError.value = 'This email is already registered';
      // optional: focus the email input if you add id="reg-email" to the input
      // document.getElementById('reg-email')?.focus();
    }
    else {
      errorMsg.value = msg || 'Registration failed';
    }
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="neu-login-card">
    <header class="neu-login-header">
      <div class="neu-icon">
        <div class="icon-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3 6 6 .9-4.5 4.2 1 6-5.5-3-5.5 3 1-6L3 8.9 9 8z" />
          </svg>
        </div>
      </div>
      <h2>Create your account</h2>
      <p>Join us in a few seconds</p>
    </header>

    <form class="neu-login-form" novalidate @submit.prevent="submitRegister">
      <!-- Email -->
      <div
        class="form-group"
        :class="{
          error:
            (!!emailError && (submitted || emailTouched))
            || ((submitted || emailTouched) && !!email && !emailPattern.test(email)),
        }"
      >
        <div
          class="input-group neu-input"
          :class="{ 'focus-green': emailTouched && !emailError && emailPattern.test(email) }"
        >
          <input
            id="reg-email"
            v-model.trim="email"
            type="email"
            placeholder=" "
            autocomplete="email"
            required
            @blur="handleEmailBlur"
            @input="handleEmailInput"
          >
          <label for="reg-email">Email address</label>
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>
        <span class="error-message">{{ emailError }}</span>
      </div>

      <!-- Password -->
      <div
        class="form-group"
        :class="{
          error:
            (!!passwordError && (submitted || passwordTouched))
            || ((submitted || passwordTouched) && !!password && password.length < 8),
        }"
      >
        <div
          class="input-group neu-input password-group"
          :class="{ 'focus-green': passwordTouched && !passwordError && password.length >= 8 }"
        >
          <input
            id="reg-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder=" "
            minlength="8"
            required
            @blur="handlePasswordBlur"
            @input="handlePasswordInput"
          >
          <label for="reg-password">Password</label>
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <button
            type="button"
            class="password-toggle neu-toggle"
            :class="{ 'show-password': showPassword }"
            @click="showPassword = !showPassword"
          >
            <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <span class="error-message">{{ passwordError }}</span>
      </div>

      <!-- Confirm Password -->
      <div
        class="form-group"
        :class="{
          error:
            (!!confirmError && (submitted || confirmTouched))
            || ((submitted || confirmTouched) && !!confirmPassword && confirmPassword !== password),
        }"
      >
        <div
          class="input-group neu-input password-group"
          :class="{ 'focus-green': confirmTouched && !confirmError && confirmValid }"
        >
          <input
            id="reg-confirm"
            v-model="confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder=" "
            required
            @blur="handleConfirmBlur"
            @input="handleConfirmInput"
          >
          <label for="reg-confirm">Confirm password</label>
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 8l6-1z" />
            </svg>
          </div>
          <button
            type="button"
            class="password-toggle neu-toggle"
            :class="{ 'show-password': showConfirm }"
            @click="showConfirm = !showConfirm"
          >
            <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <span class="error-message">{{ confirmError }}</span>
      </div>

      <!-- Submit -->
      <button type="submit" class="neu-button" :class="{ loading }" :disabled="!isValid || loading">
        <span class="btn-text">Create account</span>
        <span class="btn-loader"><span class="neu-spinner" /></span>
      </button>

      <p v-if="errorMsg" class="form-error">
        {{ errorMsg }}
      </p>
    </form>

    <div class="signup-link">
      <p>Already have an account? <a href="#" @click.prevent="$emit('close')">Sign in</a></p>
    </div>

    <!-- Success overlay -->
    <div v-if="success" class="success-overlay">
      <div class="success-message">
        <div class="success-icon neu-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Success!</h3>
        <p>{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bg: #e0e5ec;
  --shadow-dark: #bec3cf;
  --shadow-light: #ffffff;
  --text-strong: #3d4468;
  --text: #6c7293;
  --muted: #9499b7;
  --accent: #00c896;
  --error: #ff3b5c;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1f2430;
    --shadow-dark: #0d1016;
    --shadow-light: #2a3140;
    --text-strong: #e7e9f3;
    --text: #c8cbe0;
    --muted: #9ea3bf;
    --accent: #00c896;
    --error: #ff5c7a;
  }
}

html, body {
  height: 100%;
  margin: 0;
  background: var(--bg);
}
</style>

<style scoped>
/* Card */
.neu-login-card {
  position: relative;
  max-width: 420px;
  margin: 0 auto;
  padding: 45px 40px;
  background: var(--bg);
  border-radius: 25px;
  box-shadow:
    15px 15px 30px var(--shadow-dark),
    -15px -15px 30px var(--shadow-light);
  transition: transform .3s ease;
}
.neu-login-card:hover { transform: translateY(-5px); }

.neu-login-header { text-align: center; margin-bottom: 40px; }

.neu-icon {
  width: 80px; height: 80px; margin: 0 auto 24px; background: var(--bg);
  border-radius: 50%; display: grid; place-items: center; color: var(--text);
  box-shadow: 8px 8px 20px var(--shadow-dark), -8px -8px 20px var(--shadow-light);
  transition: box-shadow .3s ease;
}
.neu-icon:hover {
  box-shadow:
    4px 4px 10px var(--shadow-dark),
    -4px -4px 10px var(--shadow-light),
    inset 4px 4px 10px var(--shadow-dark),
    inset -4px -4px 10px var(--shadow-light);
}
.icon-inner { width: 40px; height: 40px; }
.icon-inner svg { width: 100%; height: 100%; }

.neu-login-header h2 { color: var(--text-strong); font-size: 2rem; font-weight: 700; margin: 0 0 8px; }
.neu-login-header p { color: var(--muted); font-size: 15px; margin: 0; }

.neu-login-form { position: relative; }
.form-group { margin-bottom: 28px; }

/* Inputs */
.neu-input {
  position: relative; background: var(--bg); border-radius: 15px; border: 2px solid transparent;
  box-shadow: inset 8px 8px 16px var(--shadow-dark), inset -8px -8px 16px var(--shadow-light);
  transition: box-shadow .25s ease, border-color .25s ease;
}
.neu-input:focus-within { border-color: var(--accent); }
.neu-input.focus-green { border-color: var(--accent); }
.form-group.error .neu-input { border-color: var(--error); }

.neu-input input {
  width: 100%; background: transparent; border: none; outline: none; box-shadow: none;
  padding: 20px 24px; color: var(--text-strong); font-size: 16px; font-weight: 500; padding-left: 55px;
}
.neu-input input::placeholder { color: transparent; }

.neu-input label {
  position: absolute; left: 55px; top: 50%; transform: translateY(-50%);
  color: var(--muted); font-size: 16px; transition: all .2s ease; pointer-events: none;
}
.neu-input input:focus + label,
.neu-input input:not(:placeholder-shown) + label {
  top: 8px; transform: translateY(0); font-size: 12px; color: var(--text);
}

.input-icon {
  position: absolute; left: 20px; top: 50%; transform: translateY(-85%);
  width: 20px; height: 20px; color: var(--muted); transition: color .2s ease;
}
.input-icon svg { width: 100%; height: 100%; }
.neu-input:focus-within .input-icon { color: var(--text); }

/* Password toggles */
.password-group { padding-right: 50px; }

.neu-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-65%);
  background: transparent;
  border: 0;
  width: 35px;
  height: 35px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--muted);
  box-shadow: none;
  transition: color .15s ease;
}
.neu-toggle:hover { color: var(--text); }
.neu-toggle:active {
  box-shadow: inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light);
}
.neu-toggle svg { width: 18px; height: 18px; }
.eye-closed { display: none; }
.neu-toggle.show-password .eye-open { display: none; }
.neu-toggle.show-password .eye-closed { display: block; }

/* Button */
.neu-button {
  width: 100%; background: var(--bg); border: 0; border-radius: 15px; padding: 18px 32px;
  color: var(--text-strong); font-size: 16px; font-weight: 800; cursor: pointer; position: relative; margin-bottom: 16px; overflow: hidden;
  box-shadow: 8px 8px 20px var(--shadow-dark), -8px -8px 20px var(--shadow-light);
  transition: transform .15s ease, box-shadow .3s ease, opacity .2s ease;
}
.neu-button[disabled] { opacity: .6; cursor: not-allowed; }
.neu-button::before {
  content: ""; position: absolute; inset: 0; left: -100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transition: left .5s ease;
}
.neu-button:hover { transform: translateY(-2px); }
.neu-button:hover::before { left: 100%; }
.neu-button:active {
  transform: translateY(0);
  box-shadow: inset 4px 4px 10px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light);
}

.btn-text { position: relative; z-index: 1; transition: opacity .2s ease; }
.btn-loader { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity .2s ease; }
.neu-spinner { width: 20px; height: 20px; border: 3px solid var(--shadow-dark); border-top: 3px solid var(--text); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.neu-button.loading .btn-text { opacity: 0; }
.neu-button.loading .btn-loader { opacity: 1; }

/* Errors / helper text */
.form-error { color: var(--error); font-weight: 700; font-size: 0.95rem; margin: 6px 0 0; text-align: center; }
.error-message {
  color: var(--error); font-size: 12px; font-weight: 700; margin-top: 8px; margin-left: 20px;
  opacity: 0; transform: translateY(-8px); transition: all .2s ease; display: block; min-height: 1em;
}
.form-group.error .error-message { opacity: 1; transform: translateY(0); }

/* Footer link */
.signup-link { text-align: center; }
.signup-link p { color: var(--muted); font-size: 14px; margin: 0; }
.signup-link a { color: var(--text); text-decoration: none; font-weight: 600; }
.signup-link a:hover { text-decoration: underline; }

/* Success overlay */
.success-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg);
  border-radius: 25px; display: grid; place-items: center; z-index: 10;
}
.success-message { text-align: center; padding: 30px 10px; }
.success-message h3 { color: var(--text-strong); font-size: 1.4rem; margin: 0 0 8px; }
.success-message p { color: var(--muted); font-size: 14px; margin: 0; }

/* Responsive */
@media (max-width: 480px) {
  .neu-login-card { padding: 35px 25px; border-radius: 20px; }
  .neu-login-header h2 { font-size: 1.75rem; }
  .neu-input input { padding: 18px 20px; padding-left: 50px; }
  .neu-input label { left: 50px; }
}
</style>
