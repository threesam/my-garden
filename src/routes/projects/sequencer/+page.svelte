<script lang="ts">
	import { onDestroy, onMount } from 'svelte'

	const numTracks = 8
	const numSteps = 16
	let tempo = 120

	let pattern: boolean[][] = Array.from({ length: numTracks }, () =>
		Array.from({ length: numSteps }, () => false),
	)

	let isPlaying = false
	let currentStep = 0

	const trackNames = ['Kick', 'Snare', 'Hi-Hat', 'Tone A', 'Tone C', 'Tone D', 'Tone E', 'Tone G']

	let Tone: typeof import('tone') | null = null
	let loop: import('tone').Loop | null = null
	let trackTriggers: ((time: number) => void)[] = []
	let disposables: Array<{ dispose: () => void }> = []
	let toneReady = false

	onMount(async () => {
		Tone = await import('tone')

		// Create instruments
		const kick = new Tone.MembraneSynth({
			pitchDecay: 0.02,
			octaves: 4,
			volume: -5,
			envelope: { attack: 0.001, decay: 0.2, sustain: 0.0, release: 0.2 },
		}).toDestination()
		const snare = new Tone.NoiseSynth({
			volume: -12,
			envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
		}).toDestination()
		const hat = new Tone.MetalSynth({
			volume: -18,
			envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
			harmonicity: 5.1,
			modulationIndex: 32,
			resonance: 4000,
			octaves: 1.5,
		}).toDestination()

		const toneA = new Tone.Synth({ volume: -10 }).toDestination()
		const toneC = new Tone.Synth({ volume: -10 }).toDestination()
		const toneD = new Tone.Synth({ volume: -10 }).toDestination()
		const toneE = new Tone.Synth({ volume: -10 }).toDestination()
		const toneG = new Tone.Synth({ volume: -10 }).toDestination()

		disposables.push(kick, snare, hat, toneA, toneC, toneD, toneE, toneG)

		trackTriggers = [
			(time) => kick.triggerAttackRelease('C2', '8n', time),
			(time) => snare.triggerAttackRelease('8n', time),
			(time) => hat.triggerAttackRelease('C#6', '16n', time),
			(time) => toneA.triggerAttackRelease('A3', '8n', time),
			(time) => toneC.triggerAttackRelease('C4', '8n', time),
			(time) => toneD.triggerAttackRelease('D4', '8n', time),
			(time) => toneE.triggerAttackRelease('E4', '8n', time),
			(time) => toneG.triggerAttackRelease('G4', '8n', time),
		]

		// Drive the sequencer with 16th notes
		loop = new Tone.Loop((t) => {
			for (let tr = 0; tr < numTracks; tr++) {
				if (pattern[tr]?.[currentStep]) {
					const trigger = trackTriggers[tr]
					if (trigger) trigger(t)
				}
			}
			currentStep = (currentStep + 1) % numSteps
		}, '16n')

		Tone.Transport.bpm.value = tempo
		toneReady = true
	})

	async function start() {
		if (!toneReady || !Tone || !loop) return
		await Tone.start()
		currentStep = 0
		isPlaying = true
		loop.start(0)
		Tone.Transport.start()
	}

	function stop() {
		if (!toneReady || !Tone || !loop) return
		isPlaying = false
		Tone.Transport.stop()
		loop.stop(0)
	}

	$: if (toneReady && Tone) {
		Tone.Transport.bpm.value = tempo
	}

	function getCell(trackIndex: number, stepIndex: number): boolean {
		return Boolean(pattern[trackIndex]?.[stepIndex])
	}

	function toggleCell(trackIndex: number, stepIndex: number) {
		const row = pattern[trackIndex]
		if (!row) return
		row[stepIndex] = !row[stepIndex]
		pattern = pattern
	}

	function resetPattern() {
		pattern = Array.from({ length: numTracks }, () =>
			Array.from({ length: numSteps }, () => false),
		)
		currentStep = 0
	}

	onDestroy(() => {
		try {
			stop()
			loop?.dispose()
			for (const d of disposables) d.dispose()
		} catch {}
	})
</script>

<div class="max-w-5xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Step Sequencer</h1>

	<div class="flex items-center gap-3 mb-6">
		<button
			class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
			on:click={start}
			disabled={isPlaying}
		>
			Play
		</button>
		<button
			class="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white"
			on:click={stop}
			disabled={!isPlaying}
		>
			Stop
		</button>
		<button
			class="px-3 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
			on:click={resetPattern}
		>
			Reset
		</button>
		<label class="ml-4 flex items-center gap-2">
			<span class="text-sm text-gray-600">Tempo</span>
			<input
				class="w-20 px-2 py-1 border rounded"
				type="number"
				min="40"
				max="240"
				bind:value={tempo}
			/>
		</label>
	</div>

	<div class="overflow-x-auto">
		<div
			class="grid gap-2 items-center mb-2"
			style="grid-template-columns: 120px repeat(16, minmax(1.75rem, 1fr));"
		>
			<div class="text-sm font-semibold text-gray-600">Track</div>
			{#each Array.from({ length: numSteps }) as _, s}
				<div class="text-center text-xs text-gray-500">{s + 1}</div>
			{/each}
		</div>

		{#each Array.from({ length: numTracks }) as _, ti}
			<div
				class="grid gap-2 items-center mb-2"
				style="grid-template-columns: 120px repeat(16, minmax(1.75rem, 1fr));"
			>
				<div class="text-sm font-medium">{trackNames[ti] || `Track ${ti + 1}`}</div>
				{#each Array.from({ length: numSteps }) as __, si}
					<button
						on:click={() => toggleCell(ti, si)}
						class="w-8 h-8 rounded border transition-colors focus:outline-none"
						class:bg-emerald-500={getCell(ti, si)}
						class:text-white={getCell(ti, si)}
						class:bg-gray-100={!getCell(ti, si)}
						class:border-emerald-600={getCell(ti, si)}
						class:border-gray-300={!getCell(ti, si)}
						class:ring-2={isPlaying && si === currentStep}
						class:ring-amber-500={isPlaying && si === currentStep && getCell(ti, si)}
						class:ring-sky-500={isPlaying && si === currentStep && !getCell(ti, si)}
						aria-pressed={getCell(ti, si)}
						title={`Step ${si + 1}`}
						aria-label={`Toggle track ${ti + 1} step ${si + 1}`}
					>
						{#if getCell(ti, si)}
							<span class="block w-3 h-3 rounded bg-emerald-700 mx-auto"></span>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>
