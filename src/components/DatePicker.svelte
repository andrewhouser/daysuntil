<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Calendar from './Calendar.svelte';
	import { getMonthName } from './date-time.js';

	const dispatch = createEventDispatcher();

	// props
	export let isAllowed = (date: Date) => true;
	export let handleDateChange: (date: string) => void;
	export let selected = new Date();

	// state
	let date: number;
	let month: number;
	let year: number;
	let showDatePicker: boolean = false;

	// so that these change with props
	$: {
		date = selected.getDate();
		month = selected.getMonth();
		year = selected.getFullYear();
	}

	const onFocus = () => (showDatePicker = true);

	const next = () => {
		if (month !== 11) {
			month = month + 1;
			return;
		}

		month = 0;
		year = year + 1;
	};

	const prev = () => {
		if (month !== 0) {
			month = month - 1;
			return;
		}

		month = 11;
		year = year - 1;
	};

	const onDateChange = (d: CustomEvent<Date>) => {
		showDatePicker = false;
		dispatch('datechange', d.detail);
	};

	const goToDate = () => {
		const dateObj = new Date(year, month, date);
		const goDate = `${dateObj.getFullYear()}${(dateObj.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}`;

		handleDateChange(goDate);
	};
</script>

<div class="relative">
	<h2>Days until...</h2>
	<div class="date-input">
		<input type="text" on:focus={onFocus} value={selected.toDateString()} />
		<button on:click={goToDate}>Go</button>
	</div>
	{#if showDatePicker}
		<div class="box">
			<div class="month-name">
				<div class="center">
					<button on:click={prev}>Prev</button>
				</div>
				<div class="center">{getMonthName(month)} {year}</div>
				<div class="center">
					<button on:click={next}>Next</button>
				</div>
			</div>
			<Calendar {month} {year} date={selected} {isAllowed} on:datechange={onDateChange} />
		</div>
	{/if}
</div>

<style>
	.relative {
		align-self: center;
		flex: 0 0 auto;
		margin-top: -25%;
		position: relative;
	}

	h2 {
		color: var(--text-color);
	}

	.date-input {
		align-items: center;
		display: flex;
		gap: 8px;
	}

	input[type='text'] {
		padding: 0.6em;
		border: 1px solid #ccc;
		border-radius: 0.25em;
		outline: none;
	}

	.box {
		background-color: var(--text-color);
		border-radius: 0.5em;
		box-shadow: 0 0 1em 1em rgb(0 0 0 / 30%);
		display: inline-block;
		left: 50%;
		position: absolute;
		top: 105px;
		transform: translateX(-50%);
	}

	.month-name {
		align-items: center;
		display: flex;
		font-weight: bold;
		justify-content: space-around;
		margin: 6px 0;
	}

	.center {
		align-items: center;
		display: flex;
		justify-content: center;
	}
</style>
