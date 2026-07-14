<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Lock, Eye, EyeOff, AlertTriangle, KeyRound, RotateCcw,
  ShieldCheck, ShieldQuestion, Edit3, Check,
} from 'lucide-vue-next'
import { useDiaryStore, SECURITY_QUESTIONS } from '../../stores/diary'

const store = useDiaryStore()

// ========== 主界面状态 ==========
type Mode = 'unlock' | 'setup' | 'change' | 'forgot'
const mode = ref<Mode>('unlock')

// PIN 输入
const pin = ref('')
const newPin = ref('')
const confirmPin = ref('')
const showPin = ref(false)
const error = ref('')
const wrongAttempts = ref(0)

// setup 子步骤: 'pin' → 'confirm' → 'security'
const setupStep = ref<'pin' | 'confirm' | 'security'>('pin')

// change 子步骤: 'verify' → 'newpin' → 'confirm'
const changeStep = ref<'verify' | 'newpin' | 'confirm'>('verify')

// 密保问题
const selectedQuestion = ref(SECURITY_QUESTIONS[0])
const securityAnswer = ref('')
const securityAnswerConfirm = ref('')
const showAnswer = ref(false)

// forgot 流程
const forgotStep = ref<'method' | 'security' | 'newpin' | 'fallback'>('method')
const forgotAnswer = ref('')
const forgotNewPin = ref('')
const forgotConfirmPin = ref('')
const forgotError = ref('')
const securityQuestionText = ref('')

// 成功提示
const successMsg = ref('')

onMounted(() => {
  if (!store.hasPin) {
    mode.value = 'setup'
    setupStep.value = 'pin'
  }
})

// ========== 解锁 ==========
async function handleUnlock() {
  if (!pin.value || pin.value.length < 4) {
    error.value = '请输入至少4位PIN码'
    return
  }

  const isValid = await store.verifyPinCode(pin.value)
  if (isValid) {
    error.value = ''
    pin.value = ''
    wrongAttempts.value = 0
  } else {
    error.value = 'PIN码不正确'
    pin.value = ''
    wrongAttempts.value++
    if (wrongAttempts.value >= 3) {
      error.value = 'PIN码不正确。忘记密码？点击下方"忘记PIN码"'
    }
  }
}

// ========== 设置 PIN + 密保 ==========
function handleSetupPinNext() {
  if (newPin.value.length < 4) {
    error.value = 'PIN码至少需要4位'
    return
  }
  setupStep.value = 'confirm'
  error.value = ''
}

function handleSetupConfirm() {
  if (newPin.value !== confirmPin.value) {
    error.value = '两次输入的PIN码不一致'
    confirmPin.value = ''
    return
  }
  setupStep.value = 'security'
  error.value = ''
}

async function handleSetupComplete() {
  if (!securityAnswer.value.trim()) {
    error.value = '请输入密保答案'
    return
  }
  if (securityAnswer.value !== securityAnswerConfirm.value) {
    error.value = '两次输入的答案不一致'
    securityAnswerConfirm.value = ''
    return
  }

  // 设置 PIN
  await store.setPin(newPin.value)
  // 设置密保问题
  await store.setSecurityQuestion(selectedQuestion.value, securityAnswer.value)

  // 重置表单
  mode.value = 'unlock'
  newPin.value = ''
  confirmPin.value = ''
  securityAnswer.value = ''
  securityAnswerConfirm.value = ''
  error.value = ''
  successMsg.value = 'PIN码和密保问题设置成功！'
  setTimeout(() => (successMsg.value = ''), 3000)
}

// ========== 修改密码 ==========
function startChangePin() {
  mode.value = 'change'
  changeStep.value = 'verify'
  pin.value = ''
  newPin.value = ''
  confirmPin.value = ''
  error.value = ''
}

async function handleChangeVerify() {
  const isValid = await store.verifyPinCode(pin.value)
  if (!isValid) {
    error.value = '当前PIN码不正确'
    pin.value = ''
    return
  }
  changeStep.value = 'newpin'
  error.value = ''
}

function handleChangeNewPin() {
  if (newPin.value.length < 4) {
    error.value = 'PIN码至少需要4位'
    return
  }
  changeStep.value = 'confirm'
  error.value = ''
}

async function handleChangeConfirm() {
  if (newPin.value !== confirmPin.value) {
    error.value = '两次输入的PIN码不一致'
    confirmPin.value = ''
    return
  }

  const success = await store.changePin(pin.value, newPin.value)
  if (success) {
    mode.value = 'unlock'
    pin.value = ''
    newPin.value = ''
    confirmPin.value = ''
    error.value = ''
    successMsg.value = 'PIN码修改成功！'
    setTimeout(() => (successMsg.value = ''), 3000)
  } else {
    error.value = '修改失败，请重试'
  }
}

// ========== 忘记 PIN ==========
function openForgot() {
  mode.value = 'forgot'
  forgotError.value = ''
  forgotAnswer.value = ''
  forgotNewPin.value = ''
  forgotConfirmPin.value = ''

  if (store.hasSecurityQ) {
    forgotStep.value = 'security'
    securityQuestionText.value = store.getSecurityQuestion() || ''
  } else {
    forgotStep.value = 'fallback'
  }
}

async function handleForgotSecurity() {
  const isValid = await store.verifySecurityAnswerCode(forgotAnswer.value)
  if (!isValid) {
    forgotError.value = '密保答案不正确'
    forgotAnswer.value = ''
    return
  }
  forgotStep.value = 'newpin'
  forgotError.value = ''
}

// 用独立变量管理 forgot 的 confirm 步骤
const forgotConfirmStep = ref(false)

function handleForgotNewPinNext() {
  if (forgotNewPin.value.length < 4) {
    forgotError.value = 'PIN码至少需要4位'
    return
  }
  forgotConfirmStep.value = true
  forgotError.value = ''
}

async function handleForgotConfirmPin() {
  if (forgotNewPin.value !== forgotConfirmPin.value) {
    forgotError.value = '两次输入的PIN码不一致'
    forgotConfirmPin.value = ''
    return
  }

  const success = await store.resetPinViaSecurityQuestion(forgotAnswer.value, forgotNewPin.value)
  if (success) {
    mode.value = 'unlock'
    forgotAnswer.value = ''
    forgotNewPin.value = ''
    forgotConfirmPin.value = ''
    forgotConfirmStep.value = false
    forgotError.value = ''
    successMsg.value = 'PIN码重置成功！私密日记已保留'
    setTimeout(() => (successMsg.value = ''), 3000)
  } else {
    forgotError.value = '重置失败，请重试'
  }
}

// 无密保问题时的彻底重置
const resetPhrase = ref('')

async function handleFullReset() {
  if (resetPhrase.value.trim() !== '我确定重置PIN码') {
    forgotError.value = '请输入正确的确认文字：我确定重置PIN码'
    return
  }
  await store.resetPin()
  mode.value = 'setup'
  setupStep.value = 'pin'
  resetPhrase.value = ''
  forgotError.value = ''
  wrongAttempts.value = 0
}

// 返回解锁界面
function backToUnlock() {
  mode.value = 'unlock'
  error.value = ''
  forgotError.value = ''
  forgotConfirmStep.value = false
}
</script>

<template>
  <div class="pin-verify-wrapper">
    <!-- 成功提示 -->
    <transition name="slide-down">
      <div v-if="successMsg" class="success-banner">
        <Check :size="18" />
        {{ successMsg }}
      </div>
    </transition>

    <!-- 主卡片 -->
    <div class="pin-verify-card">
      <!-- 图标 -->
      <div class="pin-verify-icon">
        <Lock v-if="mode === 'unlock'" :size="32" style="color: var(--color-primary)" />
        <ShieldQuestion v-else-if="mode === 'setup'" :size="32" style="color: var(--color-primary)" />
        <Edit3 v-else-if="mode === 'change'" :size="32" style="color: var(--color-primary)" />
        <AlertTriangle v-else :size="32" style="color: #e8860b" />
      </div>

      <!-- ========== 解锁模式 ========== -->
      <template v-if="mode === 'unlock'">
        <h3 class="pin-verify-title">私密日记</h3>
        <p class="pin-verify-desc">你的私密日记已加密存储，输入PIN码即可解锁查看</p>

        <div class="pin-input-wrapper">
          <input
            v-model="pin"
            :type="showPin ? 'text' : 'password'"
            class="pin-input"
            maxlength="8"
            placeholder="请输入PIN码"
            @keyup.enter="handleUnlock"
          />
          <button class="pin-toggle-btn" @click="showPin = !showPin">
            <EyeOff v-if="showPin" :size="20" />
            <Eye v-else :size="20" />
          </button>
        </div>

        <p v-if="error" class="pin-error">{{ error }}</p>

        <button class="pin-unlock-btn" @click="handleUnlock">
          <KeyRound :size="18" />
          解锁私密日记
        </button>

        <div class="pin-actions">
          <button class="pin-forgot-link" @click="openForgot">
            <RotateCcw :size="14" />
            忘记PIN码？
          </button>
          <button class="pin-forgot-link" @click="startChangePin">
            <Edit3 :size="14" />
            修改密码
          </button>
        </div>
      </template>

      <!-- ========== 设置 PIN + 密保 ========== -->
      <template v-else-if="mode === 'setup'">
        <!-- 步骤 1: 输入 PIN -->
        <template v-if="setupStep === 'pin'">
          <h3 class="pin-verify-title">设置PIN码</h3>
          <p class="pin-verify-desc">设置4-8位数字PIN码，保护你的私密日记内容</p>

          <div class="pin-input-wrapper">
            <input
              v-model="newPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="设置PIN码"
              @keyup.enter="handleSetupPinNext"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleSetupPinNext">下一步</button>
        </template>

        <!-- 步骤 2: 确认 PIN -->
        <template v-else-if="setupStep === 'confirm'">
          <h3 class="pin-verify-title">确认PIN码</h3>
          <p class="pin-verify-desc">请再次输入，确认你的PIN码</p>

          <div class="pin-input-wrapper">
            <input
              v-model="confirmPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="确认PIN码"
              @keyup.enter="handleSetupConfirm"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleSetupConfirm">下一步</button>
        </template>

        <!-- 步骤 3: 设置密保问题 -->
        <template v-else>
          <h3 class="pin-verify-title">设置密保问题</h3>
          <p class="pin-verify-desc">
            <ShieldQuestion :size="14" style="display: inline; vertical-align: middle; margin-right: 4px;" />
            忘记PIN码时，可通过密保问题找回
          </p>

          <!-- 步骤指示器 -->
          <div class="step-indicator">
            <div class="step-dot active"></div>
            <div class="step-line active"></div>
            <div class="step-dot active"></div>
            <div class="step-line active"></div>
            <div class="step-dot active"></div>
          </div>

          <div class="security-form">
            <label class="security-label">选择密保问题</label>
            <select v-model="selectedQuestion" class="security-select">
              <option v-for="q in SECURITY_QUESTIONS" :key="q" :value="q">{{ q }}</option>
            </select>

            <label class="security-label" style="margin-top: 1rem;">输入答案</label>
            <div class="pin-input-wrapper" style="margin-top: 0;">
              <input
                v-model="securityAnswer"
                :type="showAnswer ? 'text' : 'password'"
                class="pin-input"
                style="letter-spacing: normal; text-align: left; font-size: 1rem;"
                placeholder="请输入答案"
              />
              <button class="pin-toggle-btn" @click="showAnswer = !showAnswer">
                <EyeOff v-if="showAnswer" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>

            <label class="security-label" style="margin-top: 1rem;">确认答案</label>
            <div class="pin-input-wrapper" style="margin-top: 0;">
              <input
                v-model="securityAnswerConfirm"
                :type="showAnswer ? 'text' : 'password'"
                class="pin-input"
                style="letter-spacing: normal; text-align: left; font-size: 1rem;"
                placeholder="请再次输入答案"
                @keyup.enter="handleSetupComplete"
              />
            </div>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleSetupComplete">
            <ShieldCheck :size="18" />
            完成设置
          </button>
        </template>
      </template>

      <!-- ========== 修改密码 ========== -->
      <template v-else-if="mode === 'change'">
        <!-- 步骤 1: 验证当前 PIN -->
        <template v-if="changeStep === 'verify'">
          <h3 class="pin-verify-title">修改PIN码</h3>
          <p class="pin-verify-desc">请先输入当前PIN码进行验证</p>

          <div class="pin-input-wrapper">
            <input
              v-model="pin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="当前PIN码"
              @keyup.enter="handleChangeVerify"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleChangeVerify">验证</button>
          <button class="pin-back-btn" @click="backToUnlock">返回</button>
        </template>

        <!-- 步骤 2: 输入新 PIN -->
        <template v-else-if="changeStep === 'newpin'">
          <h3 class="pin-verify-title">设置新PIN码</h3>
          <p class="pin-verify-desc">请输入新的4-8位PIN码</p>

          <div class="pin-input-wrapper">
            <input
              v-model="newPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="新PIN码"
              @keyup.enter="handleChangeNewPin"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleChangeNewPin">下一步</button>
        </template>

        <!-- 步骤 3: 确认新 PIN -->
        <template v-else>
          <h3 class="pin-verify-title">确认新PIN码</h3>
          <p class="pin-verify-desc">请再次输入新的PIN码</p>

          <div class="pin-input-wrapper">
            <input
              v-model="confirmPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="确认新PIN码"
              @keyup.enter="handleChangeConfirm"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="error" class="pin-error">{{ error }}</p>
          <button class="pin-unlock-btn" @click="handleChangeConfirm">
            <Check :size="18" />
            确认修改
          </button>
        </template>
      </template>

      <!-- ========== 忘记 PIN ========== -->
      <template v-else>
        <!-- 通过密保问题重置 -->
        <template v-if="forgotStep === 'security'">
          <h3 class="pin-verify-title">密保验证</h3>
          <p class="pin-verify-desc">回答密保问题以重置PIN码，私密日记将完整保留</p>

          <div class="security-question-box">
            <ShieldQuestion :size="18" style="color: var(--color-primary); flex-shrink: 0;" />
            <span>{{ securityQuestionText }}</span>
          </div>

          <div class="pin-input-wrapper">
            <input
              v-model="forgotAnswer"
              :type="showAnswer ? 'text' : 'password'"
              class="pin-input"
              style="letter-spacing: normal; text-align: left; font-size: 1rem;"
              placeholder="请输入答案"
              @keyup.enter="handleForgotSecurity"
            />
            <button class="pin-toggle-btn" @click="showAnswer = !showAnswer">
              <EyeOff v-if="showAnswer" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="forgotError" class="pin-error">{{ forgotError }}</p>
          <button class="pin-unlock-btn" @click="handleForgotSecurity">验证答案</button>
          <button class="pin-back-btn" @click="backToUnlock">返回</button>

          <button v-if="!store.hasSecurityQ || true" class="pin-forgot-link" style="margin-top: 1rem;" @click="forgotStep = 'fallback'">
            无法回答？彻底重置
          </button>
        </template>

        <!-- 设置新 PIN -->
        <template v-else-if="forgotStep === 'newpin' && !forgotConfirmStep">
          <h3 class="pin-verify-title">设置新PIN码</h3>
          <p class="pin-verify-desc">密保验证通过！请设置新的PIN码</p>

          <div class="pin-input-wrapper">
            <input
              v-model="forgotNewPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="新PIN码"
              @keyup.enter="handleForgotNewPinNext"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="forgotError" class="pin-error">{{ forgotError }}</p>
          <button class="pin-unlock-btn" @click="handleForgotNewPinNext">下一步</button>
        </template>

        <!-- 确认新 PIN -->
        <template v-else-if="forgotStep === 'newpin' && forgotConfirmStep">
          <h3 class="pin-verify-title">确认新PIN码</h3>
          <p class="pin-verify-desc">请再次输入新的PIN码</p>

          <div class="pin-input-wrapper">
            <input
              v-model="forgotConfirmPin"
              :type="showPin ? 'text' : 'password'"
              class="pin-input"
              maxlength="8"
              placeholder="确认新PIN码"
              @keyup.enter="handleForgotConfirmPin"
            />
            <button class="pin-toggle-btn" @click="showPin = !showPin">
              <EyeOff v-if="showPin" :size="20" />
              <Eye v-else :size="20" />
            </button>
          </div>

          <p v-if="forgotError" class="pin-error">{{ forgotError }}</p>
          <button class="pin-unlock-btn" @click="handleForgotConfirmPin">
            <ShieldCheck :size="18" />
            确认重置
          </button>
        </template>

        <!-- 无密保问题 - 彻底重置 -->
        <template v-else-if="forgotStep === 'fallback'">
          <h3 class="pin-verify-title">彻底重置</h3>

          <div class="forgot-warning">
            <p><strong>注意：</strong> 未设置密保问题或无法回答密保问题。</p>
            <p>彻底重置后，所有私密日记将<strong>解除加密并转为公开</strong>，需要重新设置PIN码和密保问题。</p>
          </div>

          <div class="forgot-warning" style="margin-bottom: 1rem;">
            <p>请输入下方确认文字：</p>
            <p class="forgot-phrase-hint">我确定重置PIN码</p>
          </div>

          <input
            v-model="resetPhrase"
            class="forgot-phrase-input"
            placeholder="请输入确认文字"
            @keyup.enter="handleFullReset"
          />

          <p v-if="forgotError" class="forgot-error">{{ forgotError }}</p>

          <button class="forgot-confirm-btn" @click="handleFullReset">
            <ShieldCheck :size="18" />
            确认重置
          </button>
          <button v-if="store.hasSecurityQ" class="pin-back-btn" @click="forgotStep = 'security'">
            返回密保验证
          </button>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ========== 主卡片 ========== */
.pin-verify-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.pin-verify-card {
  width: 100%;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(255, 107, 157, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.pin-verify-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 70% 20%, rgba(255, 107, 157, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.pin-verify-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(192, 132, 252, 0.15));
  border: 1px solid rgba(255, 107, 157, 0.2);
  position: relative;
  z-index: 1;
}

.pin-verify-title {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
  position: relative;
  z-index: 1;
}

.pin-verify-desc {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

/* ========== 输入框 ========== */
.pin-input-wrapper {
  position: relative;
  max-width: 320px;
  margin: 0 auto 1rem;
  z-index: 1;
}

.pin-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  font-size: 1.25rem;
  letter-spacing: 0.15em;
  text-align: center;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 157, 0.2);
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pin-input::placeholder {
  color: var(--color-text-muted);
  font-size: 1rem;
  letter-spacing: 0.05em;
}

.pin-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15), 0 4px 12px rgba(255, 107, 157, 0.08);
}

.pin-toggle-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-toggle-btn:hover {
  color: var(--color-primary);
}

/* ========== 错误提示 ========== */
.pin-error {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  margin: 0.5rem 0 1rem 0;
  position: relative;
  z-index: 1;
}

/* ========== 按钮 ========== */
.pin-unlock-btn {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: white;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 107, 157, 0.3);
  position: relative;
  z-index: 1;
}

.pin-unlock-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.pin-unlock-btn:active {
  transform: translateY(0);
}

.pin-back-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  background: none;
  border: 1px solid rgba(255, 107, 157, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.pin-back-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(255, 107, 157, 0.05);
}

/* ========== 操作区 ========== */
.pin-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.pin-forgot-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.pin-forgot-link:hover {
  color: var(--color-primary);
  background: rgba(255, 107, 157, 0.05);
}

/* ========== 步骤指示器 ========== */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: 0 auto 1.5rem;
  position: relative;
  z-index: 1;
}

.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 107, 157, 0.2);
  transition: background 0.3s ease;
}

.step-dot.active {
  background: var(--color-primary);
}

.step-line {
  width: 32px;
  height: 2px;
  background: rgba(255, 107, 157, 0.15);
}

.step-line.active {
  background: var(--color-primary);
}

/* ========== 密保表单 ========== */
.security-form {
  text-align: left;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.security-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.security-select {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 157, 0.2);
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.security-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15);
}

/* ========== 密保问题展示框 ========== */
.security-question-box {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: rgba(255, 107, 157, 0.06);
  border: 1px solid rgba(255, 107, 157, 0.15);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  text-align: left;
  position: relative;
  z-index: 1;
}

/* ========== 警告框 ========== */
.forgot-warning {
  text-align: left;
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(255, 180, 0, 0.08);
  border: 1px solid rgba(255, 180, 0, 0.15);
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.forgot-warning p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0 0 0.5rem 0;
}

.forgot-warning p:last-child {
  margin-bottom: 0;
}

.forgot-warning strong {
  color: var(--color-text-primary);
}

.forgot-phrase-hint {
  font-family: var(--font-heading);
  font-size: 1rem !important;
  color: var(--color-primary) !important;
  font-weight: 600;
  text-align: center;
  margin-top: 0.75rem !important;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 107, 157, 0.06);
  border: 1px dashed rgba(255, 107, 157, 0.2);
}

.forgot-phrase-input {
  width: 100%;
  max-width: 320px;
  margin: 0 auto 0.75rem;
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 157, 0.2);
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  outline: none;
  transition: all 0.3s ease;
  display: block;
  position: relative;
  z-index: 1;
}

.forgot-phrase-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15);
}

.forgot-error {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  margin: 0 0 1rem 0;
  position: relative;
  z-index: 1;
}

.forgot-confirm-btn {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: white;
  background: linear-gradient(135deg, #e8860b, #d97706);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(232, 134, 11, 0.3);
  position: relative;
  z-index: 1;
}

.forgot-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(232, 134, 11, 0.4);
}

/* ========== 成功提示 ========== */
.success-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.08));
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #16a34a;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* ========== 过渡动画 ========== */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
