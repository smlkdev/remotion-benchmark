import {interpolate} from 'remotion';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Logo} from './Logo';
import {Subtitle} from './Subtitle';
import {Title} from './Title';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

export const myCompSchema = z.object({
	titleText: z.string(),
	titleColor: zColor(),
	logoColor: zColor(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	titleText: propOne,
	titleColor: propTwo,
	logoColor: propThree,
}) => {
	const frame = useCurrentFrame();
	const scaleMandalas = interpolate(frame, [0, 300, 600, 900], [1, 2, 1, 2]);

	return (
		<AbsoluteFill className="items-center justify-center bg-gray-100">
			<AbsoluteFill>
				<Img
					src={staticFile('mandalas.jpg')}
					style={{scale: `${scaleMandalas}`}}
				/>
			</AbsoluteFill>
			<AbsoluteFill className="items-center justify-center">
				<div className="m-10" />
				<Logo logoColor={propThree} />
				<div className="m-3" />
				<Title titleText={propOne} titleColor={propTwo} />
				<Subtitle />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
