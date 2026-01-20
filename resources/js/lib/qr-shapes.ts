export interface QRShape {
  id: string;
  name: string;
  category: 'body' | 'eye-frame' | 'eye-ball';
  svgPath: string;
  viewBox: string;
}

// Body Shapes - Patterns for QR code dots
export const BODY_SHAPES: QRShape[] = [
  {
    id: 'square',
    name: 'Square',
    category: 'body',
    svgPath: 'M0,0 L10,0 L10,10 L0,10 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    category: 'body',
    svgPath: 'M2,0 L8,0 Q10,0 10,2 L10,8 Q10,10 8,10 L2,10 Q0,10 0,8 L0,2 Q0,0 2,0 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'dots',
    name: 'Dots',
    category: 'body',
    svgPath: 'M5,5 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0',
    viewBox: '0 0 10 10',
  },
  {
    id: 'classy',
    name: 'Classy',
    category: 'body',
    svgPath: 'M0,0 L10,0 L10,10 L0,10 Z M2,2 L8,2 L8,8 L2,8 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'classy-rounded',
    name: 'Classy Rounded',
    category: 'body',
    svgPath: 'M2,0 L8,0 Q10,0 10,2 L10,8 Q10,10 8,10 L2,10 Q0,10 0,8 L0,2 Q0,0 2,0 Z M3,3 L7,3 Q7.5,3 7.5,3.5 L7.5,6.5 Q7.5,7 7,7 L3,7 Q2.5,7 2.5,6.5 L2.5,3.5 Q2.5,3 3,3 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    category: 'body',
    svgPath: 'M3,0 L7,0 Q10,0 10,3 L10,7 Q10,10 7,10 L3,10 Q0,10 0,7 L0,3 Q0,0 3,0 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'body',
    svgPath: 'M5,0 L10,5 L5,10 L0,5 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'star',
    name: 'Star',
    category: 'body',
    svgPath: 'M5,0 L6.5,3.5 L10,3.5 L7,6 L8.5,10 L5,7.5 L1.5,10 L3,6 L0,3.5 L3.5,3.5 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'body',
    svgPath: 'M5,9 L1,5 Q0,4 0,2.5 Q0,0 2.5,0 Q4,0 5,1.5 Q6,0 7.5,0 Q10,0 10,2.5 Q10,4 9,5 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'body',
    svgPath: 'M2.5,0 L7.5,0 L10,5 L7.5,10 L2.5,10 L0,5 Z',
    viewBox: '0 0 10 10',
  },
];

// Eye Frame Shapes - Corner square frames with thick outlines
export const EYE_FRAME_SHAPES: QRShape[] = [
  {
    id: 'square',
    name: 'Square',
    category: 'eye-frame',
    svgPath: 'M0,0 L30,0 L30,30 L0,30 Z M6,6 L24,6 L24,24 L6,24 Z',
    viewBox: '0 0 30 30',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    category: 'eye-frame',
    svgPath: 'M5,0 L25,0 Q30,0 30,5 L30,25 Q30,30 25,30 L5,30 Q0,30 0,25 L0,5 Q0,0 5,0 Z M9,6 L21,6 Q24,6 24,9 L24,21 Q24,24 21,24 L9,24 Q6,24 6,21 L6,9 Q6,6 9,6 Z',
    viewBox: '0 0 30 30',
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    category: 'eye-frame',
    svgPath: 'M8,0 L22,0 Q30,0 30,8 L30,22 Q30,30 22,30 L8,30 Q0,30 0,22 L0,8 Q0,0 8,0 Z M11,6 L19,6 Q24,6 24,11 L24,19 Q24,24 19,24 L11,24 Q6,24 6,19 L6,11 Q6,6 11,6 Z',
    viewBox: '0 0 30 30',
  },
  {
    id: 'circle',
    name: 'Circle',
    category: 'eye-frame',
    svgPath: 'M15,0 A15,15 0 1,0 15,30 A15,15 0 1,0 15,0 Z M15,6 A9,9 0 1,1 15,24 A9,9 0 1,1 15,6 Z',
    viewBox: '0 0 30 30',
  },
  {
    id: 'leaf',
    name: 'Leaf',
    category: 'eye-frame',
    svgPath: 'M0,5 Q0,0 5,0 L25,0 L30,5 L30,25 Q30,30 25,30 L5,30 L0,25 Z M6,7 L24,7 L24,23 Q24,24 23,24 L7,24 L6,23 Z',
    viewBox: '0 0 30 30',
  },
];

// Eye Ball Shapes - Center dots in corners
export const EYE_BALL_SHAPES: QRShape[] = [
  {
    id: 'square',
    name: 'Square',
    category: 'eye-ball',
    svgPath: 'M0,0 L10,0 L10,10 L0,10 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    category: 'eye-ball',
    svgPath: 'M2,0 L8,0 Q10,0 10,2 L10,8 Q10,10 8,10 L2,10 Q0,10 0,8 L0,2 Q0,0 2,0 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'dot',
    name: 'Dot',
    category: 'eye-ball',
    svgPath: 'M5,5 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0',
    viewBox: '0 0 10 10',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'eye-ball',
    svgPath: 'M5,0 L10,5 L5,10 L0,5 Z',
    viewBox: '0 0 10 10',
  },
  {
    id: 'star',
    name: 'Star',
    category: 'eye-ball',
    svgPath: 'M5,0 L6.5,3.5 L10,3.5 L7,6 L8.5,10 L5,7.5 L1.5,10 L3,6 L0,3.5 L3.5,3.5 Z',
    viewBox: '0 0 10 10',
  },
];

export const getAllShapes = () => ({
  body: BODY_SHAPES,
  eyeFrame: EYE_FRAME_SHAPES,
  eyeBall: EYE_BALL_SHAPES,
});

export const getShapeById = (category: 'body' | 'eye-frame' | 'eye-ball', id: string): QRShape | undefined => {
  switch (category) {
    case 'body':
      return BODY_SHAPES.find(s => s.id === id);
    case 'eye-frame':
      return EYE_FRAME_SHAPES.find(s => s.id === id);
    case 'eye-ball':
      return EYE_BALL_SHAPES.find(s => s.id === id);
  }
};
