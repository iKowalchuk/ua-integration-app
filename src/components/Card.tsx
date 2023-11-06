import { Box } from '@gluestack-ui/themed';
import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => {
  return (
    <Box
      bg="$white"
      borderRadius="$lg"
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
