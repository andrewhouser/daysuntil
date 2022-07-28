<script lang="ts">
	import { ConfettiExplosion } from 'svelte-confetti-explosion';
	export let date = '';

	const nowDate = new Date();

	let targetDate: Date;
	let diff: number;
	let debug = '';

	interface CountdownUnits {
		days?: number;
		weeks?: number;
		months?: number;
		years?: number;
	}

	if (date) {
		targetDate = parseDate(date);
		diff = targetDate.getTime() - nowDate.getTime();
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
		if (Math.abs(diff) < 0) {
			return "It's Today!";
		}
		const days = Math.abs(diff) / (1000 * 60 * 60 * 24);
		const { years, months, weeks, days: dayCount } = daysToYears(days);

		let ret: string[] = [];
		if (years) ret.push(`${years} years`);
		if (months) ret.push(`${months} months`);
		if (weeks) ret.push(`${weeks} weeks`);
		if (dayCount) ret.push(`${dayCount} days`);

		return ret.join(', ');
	};

	const goBack = () => {
		document.location.href = '.';
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
	<!-- <div class="wrapper"> -->
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
			<button on:click={goBack}>Choose another date</button>
		</div>
	<!-- </div> -->
{/if}

<style>
	.wrapper {
		border: 1px solid red;
		display: flex;
		height: 100%;
		justify-content: center;
		width: 100%;

	}
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
		color: var(--medium);
		font-size: 1.6rem;
	}

	.target-date {
		color: var(--light2);
		font-size: 2rem;
		font-weight: bold;
	}

	.days-value {
		color: var(--light1);
		font-size: 1.8rem;
	}

	button {
		align-self: center;
		margin-top: 2rem;
	}
</style>