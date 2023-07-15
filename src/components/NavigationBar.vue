<script setup lang="ts"></script>

<template>
  <VAppBar
    class="navigation-bar"
    density="compact"
    color="primary"
    scroll-behavior="collapse"
    scroll-threshold="10"
    scroll-target=".v-main__scroller"
  >
    <template #prepend>
      <VAppBarNavIcon
        data-vitest="navigation-bar-button"
        icon="mdi-cog"
        size="small"
        @click="$emit('settings-clicked')"
      />
    </template>
    <v-app-bar-title>
      <div class="flex items-center pr-4">
        <div class="navigation-bar__title mr-4 grow">Bill Splitter</div>
      </div>
    </v-app-bar-title>
  </VAppBar>
</template>

<style lang="scss" scoped>
.navigation-bar {
  :deep(.v-field__input) {
    min-height: var(--v-field-input-min-height);
  }
  :deep(.v-select__selection) {
    margin: 0;
  }
}
.navigation-bar__title {
  font-family: var(--custom-title-font);
}
</style>
