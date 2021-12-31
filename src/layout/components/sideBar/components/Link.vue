<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Link',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup() {
    const linkProps = (to: any) => {
      return {
        to: to,
      }
    }
    return {
      type: 'router-link',
      linkProps,
    }
  },
})
</script>
