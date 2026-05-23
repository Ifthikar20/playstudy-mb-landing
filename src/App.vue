<script setup>
import { onMounted, ref } from 'vue';
import NavBar from './components/NavBar.vue';
import Hero from './components/Hero.vue';
import Trust from './components/Trust.vue';
import Features from './components/Features.vue';
import HowItWorks from './components/HowItWorks.vue';
import Games from './components/Games.vue';
import GameShowcase from './components/GameShowcase.vue';
import CTA from './components/CTA.vue';
import Footer from './components/Footer.vue';
import CursorGlow from './components/CursorGlow.vue';
</script>

<template>
  <CursorGlow />
  <NavBar />
  <Hero />
  <Trust />
  <Features />
  <HowItWorks />
  <Games />
  <GameShowcase />
  <CTA />
  <Footer />
</template>
