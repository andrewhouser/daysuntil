<script lang="ts">
	import DatePicker from '../components/DatePicker.svelte';
	import DateDisplay from '../components/DateDisplay.svelte';
	import { onMount } from 'svelte';

	export let date: string | null = null;

	let search: string;
	$: search = '';

	let currentDate = new Date();

	const onDateChange = (d: CustomEvent<Date>) => {
		currentDate = d.detail;
	};

	const handleChooseAgain = () => {
		date = null;
		window.history.replaceState({}, '', './');
	};

	const handleDateSubmit = (goto: string) => {
		date = goto;
		window.history.replaceState({}, '', './?date=' + goto);
	};

	const isAllowed = (date: Date) => {
		// const millisecs = date.getTime();
		// if (millisecs + 25 * 3600 * 1000 < Date.now()) return false;
		// if (millisecs > Date.now() + 3600 * 24 * 45 * 1000) return false;
		return true;
	};

	onMount(() => {
		const url = window.document.location.href;

		if (url?.indexOf('date=')) {
			const parts = url.split('date=');
			if (parts[1].length !== 8) return;

			{
				search = url.split('date=')[1];
			}
		}
	});
</script>

<div class="wrapper">
	{#if date || search}
		<DateDisplay date={date || search} onChooseAgain={handleChooseAgain} />
	{:else}
		<DatePicker
			on:datechange={onDateChange}
			handleDateChange={handleDateSubmit}
			selected={currentDate}
			{isAllowed}
		/>
	{/if}
</div>

<style>
	.wrapper {
		justify-content: center;
		display: flex;
		height: 100%;
		place-content: center;
	}
</style>
