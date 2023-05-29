<script lang="ts">
	import { getDateRows, uuid, noop } from './date-time.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ datechange: Date }>();

	interface Cell {
		allowed: boolean;
		value: number | undefined;
	}

	// props
	export let date: Date;
	export let month: number;
	export let year: number;
	export let isAllowed: (date: Date) => boolean;

	// local vars to help in render
	const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	let cells: Cell[];

	// function helpers
	const onChange = (date: number) => {
		dispatch('datechange', new Date(year, month, date));
	};

	const allow = (year: number, month: number, date: number | undefined) => {
		if (!date) return true;
		return isAllowed(new Date(year, month, date));
	};

	$: cells = getDateRows(month, year).map((c: number | undefined): Cell => {
		return { allowed: allow(year, month, c), value: c };
	});
</script>

<div class="container">
	<div class="row">
		{#each weekdays as day}
			<div class="cell">{day}</div>
		{/each}
	</div>

	<div class="row">
		{#each cells as { allowed, value } (uuid())}
			<div
				on:click={allowed && value ? onChange.bind(this, value) : noop}
				class:cell={true}
				class:highlight={allowed && value}
				class:disabled={!allowed}
				class:selected={new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() ===
					new Date(year, month, value).getTime()}
			>
				{value || ''}
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		margin-top: 8px;
		padding: 6px;
		width: 370px;
	}
	.row {
		display: flex;
		margin: 2px 6px;
		flex-wrap: wrap;
	}

	.cell {
		border-radius: 0.25rem;
		display: inline-block;
		height: 20px;
		margin: 1px;
		padding: 4px;
		text-align: center;
		width: 40px;
	}

	.selected {
		background-color: #7284a8;
		color: #fff;
	}

	.highlight {
		transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
	}

	.disabled {
		background: #efefef;
		cursor: not-allowed;
		color: #bfbfbf;
	}

	.highlight:hover {
		background: #a9b3ce;
		color: #fff;
		cursor: pointer;
		transform: scale(1.3);
	}

	.selected.highlight:hover {
		background-color: #7284a8;
	}
</style>
