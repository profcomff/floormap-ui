<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { mdilChevronDown } from '@mdi/light-js';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';

import Floor0 from './assets/floor_0.svg';
import Floor1 from './assets/floor_1.svg';
import Floor2 from './assets/floor_2.svg';
import Floor3 from './assets/floor_3.svg';
import Floor4 from './assets/floor_4.svg';
import Floor5 from './assets/floor_5.svg';

const tab = ref([5]);

const plans = [
	{ title: 'Цокольный', plan: Floor0 },
	{ title: '1', plan: Floor1 },
	{ title: '2', plan: Floor2 },
	{ title: '3', plan: Floor3 },
	{ title: '4', plan: Floor4 },
	{ title: '5', plan: Floor5 },
];

const active = computed(() => plans[tab.value[0]]);
const box = ref<HTMLDivElement | null>(null);
const boxWidth = ref<number | null>(null);
const boxHeight = ref<number | null>(null);

const resizeHandler = () => {
	if (box.value) {
		boxWidth.value = box.value.getBoundingClientRect().width;
		boxHeight.value = box.value.getBoundingClientRect().height;
	}
};

onMounted(() => {
	resizeHandler();
	window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
	window.removeEventListener('resize', resizeHandler);
});
</script>

<template>
	<v-app>
		<v-main>
			<v-container class="full-height">
				<v-menu>
					<template #activator="{ props }">
						<v-btn variant="text" v-bind="props" :append-icon="mdilChevronDown">
							{{ `${active.title} этаж` }}
						</v-btn>
					</template>
					<v-list v-model:selected="tab">
						<v-list-item v-for="(plan, i) in plans" :key="plan.title" :value="i">
							<v-list-item-title>{{ `${plan.title} этаж` }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<div ref="box" class="full-height box">
					<PinchScrollZoom
						within
						:width="boxWidth ?? 1200"
						:height="boxHeight ?? 750"
						:min-scale="0.3"
						:max-scale="3"
						:content-width="1200"
						:content-height="750"
						class="zoom-container"
					>
						<img :src="active.plan" width="1200" height="750" class="plan-img" />
					</PinchScrollZoom>
				</div>
			</v-container>
		</v-main>
	</v-app>
</template>

<style scoped>
.zoom-container {
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.plan-img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	display: block;
}

.full-height {
	height: 100%;
}
</style>
