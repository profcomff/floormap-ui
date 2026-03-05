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
import { useMotionProperties, useSpring } from '@vueuse/motion';
import { useDrag, usePinch, useScroll, useWheel } from '@vueuse/gesture';

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

const scale = ref(1);

const pinchHandler = ({ vdva: [vd, va], pinching }) => {
	console.log(vd, va);
	scale.value = scale.value * (1 + vd);
	if (scale.value < 1) scale.value = 1;
	if (scale.value > 3) scale.value = 3;
	set({ scale: scale.value });
};

const xRef = ref(0);
const yRef = ref(0);
let doubleTap = false;
const dragHandler = ({ delta: [dx, dy], dragging, tap }) => {
	if (tap) {
		console.log(tap);
	}
	if (tap && !doubleTap) {
		doubleTap = true;
		return;
	}
	if (tap && doubleTap) {
		doubleTap = false;
		xRef.value = 0;
		yRef.value = 0;
		scale.value = 1;
		set({ x: 0, y: 0, scale: 1 });
	}
	xRef.value += dx;
	yRef.value += dy;
	set({ x: xRef.value, y: yRef.value });
};

const wheelHandler = ({ movement: [_, y] }) => {
	if (y < 0) {
		scale.value *= 1.1;
	} else {
		scale.value *= 0.9;
	}
	if (scale.value > 3) {
		scale.value = 3;
	}
	if (scale.value < 1) {
		scale.value = 1;
	}
	set({ scale: scale.value });
};

const map = ref();

useWheel(wheelHandler, { domTarget: map, eventOptions: { passive: false } });
useDrag(dragHandler, { domTarget: map, filterTaps: true });
usePinch(pinchHandler, { domTarget: map, eventOptions: { passive: false }, distanceBounds: [1, 3] });

const { motionProperties } = useMotionProperties(map, {
	x: 0,
	y: 0,
});

const { set } = useSpring(motionProperties);
</script>

<template>
	<v-app>
		<div class="zoom-container">
			<img ref="map" src="./assets/floor_0.svg" />
		</div>
		<v-main v-show="false">
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
img {
	-webkit-user-drag: none; /* For WebKit browsers (Chrome, Safari) */
	-moz-user-drag: none; /* For Firefox */
	-ms-user-drag: none; /* For Internet Explorer/Edge */
	user-drag: none; /* Standard property */
}

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
