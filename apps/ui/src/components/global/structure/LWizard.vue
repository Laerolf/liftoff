<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Component } from 'vue'

export type WizardStep<TValues = Record<string, unknown>> = {
  /**
   * The label of this step.
   */
  label: string
  /**
   * The component of this step.
   */
  component: Component
  /**
   * The names of fields in this step.
   */
  fields: (keyof TValues)[]
}

type Props = {
  /**
   * The steps of this wizard.
   */
  steps: WizardStep[],
  /**
   * The errors in the wizard.
   */
  errors?: Record<string, string>
  /**
   * Is the wizard waiting for something?
   */
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), { errors: () => ({}) })

const emits = defineEmits<{ (event: 'submit'): void }>()

const currentStepIndex = ref(0)

const hasPreviousStep = computed(() => currentStepIndex.value > 0)
const hasNextStep = computed(() => currentStepIndex.value + 1 < props.steps.length)
const isLastStep = computed(() => currentStepIndex.value === props.steps.length - 1)

const stepHasErrors = computed<boolean[]>(() =>
  props.steps.map(({ fields }) =>
    fields.some((fieldName) =>
      Object.keys(props.errors).some(
        (key) => key === fieldName || key.startsWith(`${fieldName}[`) || key.startsWith(`${fieldName}.`)
      )
    )
  )
)

function go(to: number): void {
  if (to < 0 || to >= props.steps.length) {
    return
  }

  currentStepIndex.value = to
}

function next(): void {
  go(currentStepIndex.value + 1)
}

function back(): void {
  go(currentStepIndex.value - 1)
}

function submit() {
  emits('submit')
}
</script>

<template>
  <l-grid rows class="l-wizard">
    <l-grid class="l-wizard-progress">
      <l-grid class="l-wizard-progress-steps">
        <template v-for="(step, index) in steps" :key="`progress-step-${index + 1}`">
          <l-button @click="go(index)" variant="text" class="l-wizard-progress-step"
            :active="currentStepIndex === index" :aria-current="currentStepIndex === index ? 'step' : undefined">
            {{ step.label }}<span v-if="stepHasErrors[index]">!</span>
          </l-button>

          <span v-if="index + 1 < steps.length">•</span>
        </template>
      </l-grid>
    </l-grid>

    <l-grid class="l-wizard-steps">
      <component v-for="(step, index) in steps" v-show="currentStepIndex === index" :key="`step-${index + 1}`"
        :inert="currentStepIndex !== index" :is="step?.component" />
    </l-grid>

    <l-grid class="l-wizard-actions">
      <slot name="actions" v-bind="{
        hasPreviousStep,
        hasNextStep,
        isLastStep,
        pending,
        back,
        next,
        submit
      }">
        <l-button v-if="hasPreviousStep" @click="back" :pending="pending">Back</l-button>
        <l-button v-if="hasNextStep" @click="next" :pending="pending">Next</l-button>
        <l-button v-if="isLastStep" @click="submit" :pending="pending">Submit</l-button>
      </slot>
    </l-grid>
  </l-grid>
</template>

<style scoped>
.l-wizard {
  row-gap: var(--spacing-4);

  .l-wizard-actions {
    grid-auto-columns: max-content;
    align-items: center;
    column-gap: var(--spacing-2);
  }

  .l-wizard-progress {
    justify-content: space-around;

    .l-wizard-progress-steps {
      align-items: center;
      column-gap: var(--spacing-2);
    }
  }
}
</style>
