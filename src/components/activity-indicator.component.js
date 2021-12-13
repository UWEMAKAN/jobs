import { ActivityIndicator as Indicator } from 'react-native-paper';
import styled from 'styled-components/native';

export const ActivityIndicator = styled(Indicator).attrs({
  size: 'large',
  animating: true,
  color: '#4064AC',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
