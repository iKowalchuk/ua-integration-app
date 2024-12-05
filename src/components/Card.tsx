import { Box } from '@gluestack-ui/themed';
import { type PropsWithChildren } from 'react';

const Card = ({ children }: PropsWithChildren) => {
  return (
    <Box
      bg="$white"
      borderRadius="$md"
      overflow="hidden"
      sx={{
        _dark: {
          bg: '$backgroundDark900',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
