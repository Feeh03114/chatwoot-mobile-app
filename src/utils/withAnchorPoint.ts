import type { TransformsStyle } from 'react-native';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

type ReadonlyTransformArray = NonNullable<Exclude<TransformsStyle['transform'], string>>;
type TransformArray = Array<ReadonlyTransformArray[number]>;

const isValidSize = (size: Size): boolean => {
  'worklet';
  return size && size.width > 0 && size.height > 0;
};

const defaultAnchorPoint = { x: 0.5, y: 0.5 };

export const withAnchorPoint = (transform: TransformsStyle, anchorPoint: Point, size: Size) => {
  'worklet';
  if (!isValidSize(size)) {
    return transform;
  }

  if (!transform.transform || typeof transform.transform === 'string') {
    return transform;
  }

  let injectedTransform: TransformArray = [...transform.transform];

  if (anchorPoint.x !== defaultAnchorPoint.x && size.width) {
    const shiftTranslateX: TransformArray = [
      {
        translateX: size.width * (anchorPoint.x - defaultAnchorPoint.x),
      },
    ];
    injectedTransform = [...shiftTranslateX, ...injectedTransform];
    injectedTransform.push({
      translateX: size.width * (defaultAnchorPoint.x - anchorPoint.x),
    });
  }

  if (anchorPoint.y !== defaultAnchorPoint.y && size.height) {
    const shiftTranslateY: TransformArray = [
      {
        translateY: size.height * (anchorPoint.y - defaultAnchorPoint.y),
      },
    ];
    injectedTransform = [...shiftTranslateY, ...injectedTransform];
    injectedTransform.push({
      translateY: size.height * (defaultAnchorPoint.y - anchorPoint.y),
    });
  }

  return { transform: injectedTransform };
};
