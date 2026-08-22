<script setup lang="ts">
import useLocale from '@/composables/useLocale'

import StepCreationForm from './StepCreationForm.vue'
import { PhaseExecution } from '@liftoff/domain';
import type { LSelectOption } from '../global/input/LSelectField.vue';
import { computed } from 'vue';

const { translateInScope } = useLocale('pages.flightPlans.creation.form.sections.phaseCreationForm')

const options = computed<LSelectOption[]>(() => Object.values(PhaseExecution).map(value => ({ label: value, value })))

function newPhase() {
  return {
    execution: PhaseExecution.Sequential,
    steps: [
      {
        repository: '',
        workflowId: '',
        exposedWorkflowInputs: [{ key: '', value: '' }],
        workflowInputs: [{ key: '', value: '' }]
      }
    ]
  }
}
</script>

<template>
  <l-form class="phase-creation-form" @submit.prevent>
    <l-grid rows class="phase-creation-form-items">
      <l-input-repeater name="phases" :new-value="newPhase">
        <template #default="{ name, index, add, remove, isLast }">
          <l-grid rows class="phase-creation-form-item">
            <l-grid class="phase-creation-form-item-header">
              <h2>Phase {{ index + 1 }}</h2>
              <l-button @click="add" v-if="isLast">+</l-button>
              <l-button @click="remove" v-else>-</l-button>
            </l-grid>

            <l-grid rows class="phase-creation-form-item-inputs">
              <l-select-field :name="`${name}.execution`" :options="options">
                {{ translateInScope('fields.execution') }}
              </l-select-field>

              <step-creation-form :phase-index="index" />
            </l-grid>
          </l-grid>
        </template>
      </l-input-repeater>
    </l-grid>
  </l-form>
</template>

<style scoped>
.phase-creation-form-items {
  row-gap: var(--spacing-4);
}

.phase-creation-form-item-header {
  grid-template-columns: max-content auto;
  column-gap: var(--spacing-2);
  align-items: center;
}

.phase-creation-form-item-inputs {
  row-gap: var(--spacing-2);
}

.step-creation-form {
  padding-left: var(--spacing-16);
}
</style>
