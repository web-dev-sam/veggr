<script setup lang="ts">
import { RouterView } from "vue-router";
import SheetHost from "./components/SheetHost.vue";
import TabBar from "./components/TabBar.vue";
import ToastHost from "./components/ToastHost.vue";
</script>

<template>
  <!--
    No route transition: views are tabs, and a cross-fade between tabs reads as
    lag rather than polish. It also kept every view to a single root element for
    no benefit — they are a header plus a scroll body.
  -->
  <div class="shell">
    <RouterView />
    <TabBar />
    <SheetHost />
    <ToastHost />
  </div>
</template>
