import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SectionList, SectionListProps } from 'react-native';
import {
  type IOComponentProps,
  withIO,
} from 'react-native-intersection-observer';

export type IOScrollViewController = SectionList;

export type IOScrollViewProps = IOComponentProps & SectionListProps<any>;

const IOScrollView = withIO(SectionList, [
  'scrollTo',
  'scrollToEnd',
  'getScrollResponder',
  'getScrollableNode',
  'getInnerViewNode',
]);

export default IOScrollView as unknown as ForwardRefExoticComponent<
  IOScrollViewProps & RefAttributes<IOScrollViewController>
>;
