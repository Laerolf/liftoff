<script setup lang="ts">
import useLocale from '@/composables/useLocale'

const { translateInScope } = useLocale('pages.flightPlans.creation.form.sections.flightPlanCreationForm')
</script>

<template>
  <l-form @submit.prevent>
    <l-input-field name="name">{{ translateInScope('fields.name') }}</l-input-field>

    <l-input-field name="workflowBranch">
      {{ translateInScope('fields.workflowBranch') }}
    </l-input-field>

    <l-input-field name="environment">
      {{ translateInScope('fields.environment') }}
    </l-input-field>

    <l-input-repeater name="services" :legend="translateInScope('fields.services')" :new-value="() => ''">
      <template #default="{ name, add, remove, isLast }">
        <l-input-field :name="name">
          <template #append>
            <l-button v-if="isLast" @click="add">+</l-button>
            <l-button v-else @click="remove">-</l-button>
          </template>
        </l-input-field>
      </template>
    </l-input-repeater>
  </l-form>
</template>
