<script setup lang="ts"></script>

<template>
  <VAppBar app density="compact" color="primary" absolute>
    <template #prepend>
      <VAppBarNavIcon
        data-vitest="navigation-bar-button"
        icon="mdi-cog"
        size="small"
        @click="$emit('settings-clicked')"
      />
    </template>
    <VAppBarTitle>
      <div class="flex items-center pr-4">
        <div class="navigation-bar__title mr-4 grow text-sm sm:text-lg">Bill Splitter</div>
        <a
          href="https://www.buymeacoffee.com/heavydusk0l"
          target="_blank"
          class="mr-4 navigation__donation-button--xs"
          aria-label="Buy me a coffee"
          >☕️</a
        >
        <a
          href="https://www.buymeacoffee.com/heavydusk0l"
          target="_blank"
          class="mr-4 navigation__donation-button"
          ><img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            class="mr-4 navigation__donation-button-img"
        /></a>
        <a
          href="https://github.com/sw517/bill-splitter"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Github"
        >
          <VIcon icon="mdi-github" />
        </a>
      </div>
    </VAppBarTitle>
  </VAppBar>
</template>

<style lang="scss" scoped>
.navigation-bar__title {
  font-family: var(--custom-title-font);
}

.navigation__donation-button--xs {
  width: 32px;
  height: 32px;
  background-color: #fd0;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 420px) {
    display: none;
  }
}

.navigation__donation-button {
  display: none;

  @media (min-width: 420px) {
    display: block;
  }
}

.navigation__donation-button-img {
  height: 32px;
}
</style>
