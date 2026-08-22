<script setup lang="ts">
import useLocale from '@/composables/useLocale'

type Props = {
  /**
   * The phase index to where this step belongs to.
   */
  phaseIndex: number
}

const props = defineProps<Props>()

const { translateInScope } = useLocale('pages.flightPlans.creation.form.sections.stepCreationForm')

function newStep() {
  return {
    repository: '',
    workflowId: '',
    exposedWorkflowInputs: [{ key: '', value: '' }],
    workflowInputs: [{ key: '', value: '' }]
  }
}
</script>

<template>
  <l-fieldset class="step-creation-form">
    <l-grid rows class="step-creation-form-items">
      <l-input-repeater class="step-creation-form-item" :name="`phases[${props.phaseIndex}].steps`"
        :new-value="newStep">
        <template #default="{ name, index, add, remove, isLast }">
          <l-grid rows>
            <l-grid class="step-creation-form-item-header">
              <h2>Step {{ index + 1 }}</h2>
              <l-button @click="add" v-if="isLast">+</l-button>
              <l-button @click="remove" v-else>-</l-button>
            </l-grid>

            <l-grid rows class="step-creation-form-item-inputs">
              <l-input-field :name="`${name}.repository`">
                {{ translateInScope('fields.repository') }}
              </l-input-field>

              <l-input-field :name="`${name}.workflowId`">
                {{ translateInScope('fields.workflowId') }}
              </l-input-field>

              <l-input-repeater :name="`${name}.exposedWorkflowInputs`"
                :legend="translateInScope('fields.exposedWorkflowInputs')" :new-value="() => ({ key: '', value: '' })">
                <template #default="{ name, add, remove, isLast }">
                  <l-map-entry :name="name">
                    <template #append>
                      <l-button v-if="isLast" @click="add">+</l-button>
                      <l-button v-else @click="remove">-</l-button>
                    </template>
                  </l-map-entry>
                </template>
              </l-input-repeater>

              <l-input-repeater :name="`${name}.workflowInputs`" :legend="translateInScope('fields.workflowInputs')"
                :new-value="() => ({ key: '', value: '' })">
                <template #default="{ name, add, remove, isLast }">
                  <l-map-entry :name="name">
                    <template #append>
                      <l-button v-if="isLast" @click="add">+</l-button>
                      <l-button v-else @click="remove">-</l-button>
                    </template>
                  </l-map-entry>
                </template>
              </l-input-repeater>
            </l-grid>
          </l-grid>
        </template>
      </l-input-repeater>
    </l-grid>
  </l-fieldset>
</template>

<style scoped>
.step-creation-form-items {
  row-gap: var(--spacing-4);
}

.step-creation-form-item-header {
  grid-template-columns: max-content auto;
  column-gap: var(--spacing-2);
  align-items: center;
}

.step-creation-form-item-inputs {
  row-gap: var(--spacing-2);
}
</style>
