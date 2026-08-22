<script setup lang="ts">
import { PhaseExecution, STRING_MAX_LENGTH, STRING_MIN_LENGTH } from '@liftoff/domain'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { object, string, array, enum as zEnum } from 'zod'

import FlightPlanCreationForm from '@/components/sections/FlightPlanCreationForm.vue'
import PhaseCreationForm from '@/components/sections/PhaseCreationForm.vue'
import useLocale from '@/composables/useLocale'
import { useFlightPlanStore } from '@/stores/flightPlanStore'

import type { WizardStep } from '@/components/global/structure/LWizard.vue'
import type { infer as zInfer } from 'zod'
import useNotifications from '@/composables/useNotifications'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

type CreationFormValues = zInfer<typeof creationSchema>

const { translate, translateInScope } = useLocale('pages.flightPlans.creation')

const flightPlanStore = useFlightPlanStore()

const formSteps = computed<WizardStep<CreationFormValues>[]>(() => [
  { label: translateInScope('form.steps.details'), component: FlightPlanCreationForm, fields: ['name', 'workflowBranch', 'environment', 'services'] },
  { label: translateInScope('form.steps.phases'), component: PhaseCreationForm, fields: ['phases'] }
])

const { createState } = storeToRefs(flightPlanStore)

const creationSchema = object({
  name: string({ error: translate('shared.forms.validation.required') })
    .min(STRING_MIN_LENGTH, {
      error: translate('shared.forms.validation.minLength', { minLength: STRING_MIN_LENGTH })
    })
    .max(STRING_MAX_LENGTH, {
      error: translate('shared.forms.validation.maxLength', { maxLength: STRING_MAX_LENGTH })
    }),
  workflowBranch: string({ error: translate('shared.forms.validation.required') })
    .min(STRING_MIN_LENGTH, {
      error: translate('shared.forms.validation.minLength', { minLength: STRING_MIN_LENGTH })
    })
    .max(STRING_MAX_LENGTH, {
      error: translate('shared.forms.validation.maxLength', { maxLength: STRING_MAX_LENGTH })
    }),
  environment: string({ error: translate('shared.forms.validation.required') })
    .min(STRING_MIN_LENGTH, {
      error: translate('shared.forms.validation.minLength', { minLength: STRING_MIN_LENGTH })
    })
    .max(STRING_MAX_LENGTH, {
      error: translate('shared.forms.validation.maxLength', { maxLength: STRING_MAX_LENGTH })
    }),
  services: array(
    string({ error: translate('shared.forms.validation.required') })
      .min(STRING_MIN_LENGTH, {
        error: translate('shared.forms.validation.minLength', { minLength: STRING_MIN_LENGTH })
      })
      .max(STRING_MAX_LENGTH, {
        error: translate('shared.forms.validation.maxLength', { maxLength: STRING_MAX_LENGTH })
      })
  ),
  phases: array(
    object({
      execution: zEnum(PhaseExecution),
      steps: array(
        object({
          repository: string({ error: translate('shared.forms.validation.required') })
            .min(STRING_MIN_LENGTH, {
              error: translate('shared.forms.validation.minLength', {
                minLength: STRING_MIN_LENGTH
              })
            })
            .max(STRING_MAX_LENGTH, {
              error: translate('shared.forms.validation.maxLength', {
                maxLength: STRING_MAX_LENGTH
              })
            }),
          workflowId: string({ error: translate('shared.forms.validation.required') })
            .min(STRING_MIN_LENGTH, {
              error: translate('shared.forms.validation.minLength', {
                minLength: STRING_MIN_LENGTH
              })
            })
            .max(STRING_MAX_LENGTH, {
              error: translate('shared.forms.validation.maxLength', {
                maxLength: STRING_MAX_LENGTH
              })
            }),
          exposedWorkflowInputs: array(
            object({
              key: string({ error: translate('shared.forms.validation.required') })
                .max(STRING_MAX_LENGTH, {
                  error: translate('shared.forms.validation.maxLength', {
                    maxLength: STRING_MAX_LENGTH
                  })
                }).optional(),
              value: string({ error: translate('shared.forms.validation.required') })
                .max(STRING_MAX_LENGTH, {
                  error: translate('shared.forms.validation.maxLength', {
                    maxLength: STRING_MAX_LENGTH
                  })
                }).optional()
            })
          ),
          workflowInputs: array(
            object({
              key: string({ error: translate('shared.forms.validation.required') })
                .max(STRING_MAX_LENGTH, {
                  error: translate('shared.forms.validation.maxLength', {
                    maxLength: STRING_MAX_LENGTH
                  })
                }).optional(),
              value: string({ error: translate('shared.forms.validation.required') })
                .max(STRING_MAX_LENGTH, {
                  error: translate('shared.forms.validation.maxLength', {
                    maxLength: STRING_MAX_LENGTH
                  })
                }).optional()
            })
          )
        })
      )
    })
  )
})

const typedCreationSchema = computed(() => toTypedSchema(creationSchema))

const { handleSubmit, errors } = useForm({
  validationSchema: typedCreationSchema.value,
  initialValues: {
    name: '',
    workflowBranch: '',
    environment: '',
    services: [''],
    phases: [
      {
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
    ]
  }
})

const notifications = useNotifications()
const router = useRouter()

const handleSubmissionAttempt = handleSubmit(async (values) => {
  try {
    await flightPlanStore.create({
      name: values.name,
      workflowBranch: values.workflowBranch,
      environment: values.environment,
      services: values.services,
      phases: values.phases.map(phaseValue =>
      ({
        execution: phaseValue.execution,
        steps: phaseValue.steps.map(stepValue =>
        ({
          repository: stepValue.repository,
          workflowId: stepValue.workflowId,
          exposedWorkflowInputs: stepValue.exposedWorkflowInputs.reduce((map, input) => {
            if (!input.key) {
              return map
            }

            map[input.key] = input.value
            return map
          }, {} as Record<string, unknown>),
          workflowInputs:
            stepValue.workflowInputs.reduce((map, input) => {
              if (!input.key) {
                return map
              }

              map[input.key] = input.value
              return map
            }, {} as Record<string, unknown>)
        }))
      }))
    })

    notifications.add({ content: translateInScope('notifications.create.success'), variant: 'success' })

    await router.push({ name: 'flightPlanOverview' })
  } catch (error) {
    console.error(`Failed to submit the FlightPlan creation form: ${(error as Error).message}`, { cause: error })
    notifications.add({ content: translateInScope('notifications.create.error'), variant: 'error' })
  }
})
</script>

<template>
  <l-page>
    <l-wizard :steps="formSteps" :errors="errors" @submit="handleSubmissionAttempt" :pending="createState.isLoading">
      <template #actions="{ hasPreviousStep, hasNextStep, isLastStep, pending, back, next, submit }">
        <l-button v-if="hasPreviousStep" @click="back" :pending="pending">
          {{ translateInScope('form.actions.back') }}
        </l-button>
        <l-button v-if="hasNextStep" @click="next" :pending="pending">
          {{ translateInScope('form.actions.next') }}
        </l-button>
        <l-button v-if="isLastStep" @click="submit" :pending="pending">
          {{ translateInScope('form.actions.submit') }}
        </l-button>
      </template>
    </l-wizard>
  </l-page>
</template>
