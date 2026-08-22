export default {
  shared: {
    forms: {
      validation: {
        required: 'This field is required.',
        minLength: 'This field must be at least {minLength} characters long.',
        maxLength: 'This field can only be {maxLength} characters long.'
      }
    }
  },
  pages: {
    flightPlans: {
      overview: {
        title: 'Flight Plans',
        table: {
          headers: {
            name: 'Name',
            services: 'Services',
            environment: 'Environment',
            workflowBranch: 'Workflow branch',
            createdAt: 'Created at'
          }
        },
        actions: {
          create: 'Create'
        }
      },
      creation: {
        title: 'New Flight Plan',
        form: {
          sections: {
            flightPlanCreationForm: {
              fields: {
                name: 'Name',
                services: 'Services',
                environment: 'Environment',
                workflowBranch: 'Workflow branch'
              }
            },
            phaseCreationForm: {
              fields: {
                execution: 'Execution method',
                steps: 'Steps'
              }
            },
            stepCreationForm: {
              fields: {
                repository: 'GitHub repository',
                workflowId: 'GitHub workflow ID',
                exposedWorkflowInputs: 'Exposed GitHub workflow inputs',
                workflowInputs: 'GitHub workflow inputs'
              }
            }
          },
          steps: {
            details: 'Details',
            phases: 'Phases'
          },
          actions: {
            back: 'Back',
            next: 'Next',
            submit: 'Create'
          }
        },
        notifications: {
          create: {
            success: 'The new flight plan has been created!',
            error: 'Failed to create a new flight plan! Please try again later.'
          },
        }
      }
    }
  }
}
