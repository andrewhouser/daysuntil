<script lang="ts">
	import { ConfettiExplosion } from 'svelte-confetti-explosion';
	export let date = '';
	export let onChooseAgain = () => {};

	const nowDate = new Date();
	const thisMorning = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());

	let targetDate: Date;
	let diff: number;

	interface CountdownUnits {
		days?: number;
		weeks?: number;
		months?: number;
		years?: number;
	}

	if (date) {
		targetDate = parseDate(date);
		diff = targetDate.getTime() - thisMorning.getTime();
	}

	const daysToWeeks = (days: number): CountdownUnits => {
		const weeks = Math.floor(days / 7);
		const remainingDays = days % 7;
		return {
			weeks,
			days: Math.ceil(remainingDays)
		};
	};

	const daysToMonths = (days: number): CountdownUnits => {
		const months = Math.floor(days / 30);
		const remainingDays = days % 30;
		const { weeks, days: dayCount } = daysToWeeks(remainingDays);

		return {
			months,
			weeks,
			days: dayCount
		};
	};

	const daysToYears = (days: number): CountdownUnits => {
		const years = Math.floor(days / 365);
		const remainingDays = days % 365;
		const { months, weeks, days: dayCount } = daysToMonths(remainingDays);

		return {
			years,
			months,
			weeks,
			days: dayCount
		};
	};

	const getPreferredDisplayUnit = (): string => {
		if (Math.abs(diff) === 0) {
			return "It's Today!";
		}
		const days = Math.abs(diff) / (1000 * 60 * 60 * 24);
		const { years, months, weeks, days: dayCount } = daysToYears(days);

		let ret: string[] = [];
		if (years) ret.push(`${years} year${years === 1 ? '' : 's'}`);
		if (months) ret.push(`${months} month${months === 1 ? '' : 's'}`);
		if (weeks) ret.push(`${weeks} week${weeks === 1 ? '' : 's'}`);
		if (dayCount) ret.push(`${dayCount} day${dayCount === 1 ? '' : 's'}`);

		return ret.join(', ');
	};

	function parseDate(date: string): Date {
		let year = date.substring(0, 4);
		let month = date.substring(4, 6);
		let day = date.substring(6, 8);

		if (date.length !== 8) {
			switch (date.length) {
				case 7:
					if (date.substring(4, 6).indexOf('0') > -1) {
						month = date.substring(4, 6);
						day = date.substring(6, 7);
					} else {
						month = date.substring(4, 5);
						day = date.substring(5, 7);
					}
					break;
				case 6:
					month = date.substring(4, 5);
					day = date.substring(5, 6);
					break;
			}
		}
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	function randomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
</script>

{#if date}
	<ConfettiExplosion
		duration={2000}
		force={0.3}
		particleCount={200}
		particlesShape="rectangles"
		--x={`${randomNumber(0,1) === 0 ? '-': ''}${randomNumber(0,30)}vw`}
	/>
	<div class="inner-wrapper">
		<div class="days-until">Days {diff > 0 ? 'until' : 'since'}</div>
		<div class="target-date">
			{targetDate.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</div>
		<div class="days-value">{getPreferredDisplayUnit()}</div>
		<button on:click={onChooseAgain}>Choose another date</button>
	</div>
{/if}

<style>
	.inner-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		text-align: center;
	}

	.inner-wrapper > div {
		display: inline-block;
		flex: 0 0 auto;
	}

	.days-until {
		color: var(--text-color-2);
		font-size: 1.6rem;
	}

	.target-date {
		color: var(--text-color);
		font-size: 2rem;
		font-weight: bold;
	}

	.days-value {
		color: var(--text-color-2);
		font-size: 1.8rem;
	}

	button {
		align-self: center;
		margin-top: 2rem;
	}
</style>
