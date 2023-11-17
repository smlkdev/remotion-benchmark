import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {enableTailwind} from '@remotion/tailwind';
import path from 'path';
import chalk from 'chalk';

// The composition you want to render
const compositionId = 'MyComp';

export const webpackOverride = (currentConfiguration) => {
	return enableTailwind(currentConfiguration);
};

const bundled = await bundle({
	entryPoint: path.resolve('./src/index.ts'),
	webpackOverride,
});

// Get the composition you want to render. Pass inputProps if you want to customize the
// duration or other metadata.
const composition = await selectComposition({
	serveUrl: bundled,
	id: compositionId,
});

const max = composition.durationInFrames;
const batchSize = 900;

for (let c = 0; c < max; c += batchSize) {
	const filename = `out/${compositionId}_${c}.mp4`;

	const startFrame = c;
	const stopFrame = Math.min(c + batchSize, max) - 1;

	const startPerf = performance.now();
	await renderMedia({
		composition,
		serveUrl: bundled,
		// ChromiumOptions: {enableMultiProcessOnLinux: true},
		crf: 16,
		codec: 'h264',
		jpegQuality: 100,
		frameRange: [startFrame, stopFrame],
		logLevel: 'verbose',
		outputLocation: filename,
	});
	const stopPerf = performance.now();

	const seconds = Math.round((stopPerf - startPerf) / 1000);
	const rangeText = `${startFrame} - ${stopFrame}`;
	const minutes = Math.round(seconds / 60);
	const fps = Math.round((batchSize / seconds) * 100) / 100;

	const msg = chalk.yellow(
		`RENDER_TIME: ${rangeText} / ${seconds}s / ${minutes}mins / ${fps}fps`
	);
	console.log(msg);
}

console.log('Render done!');
process.exit(0);
