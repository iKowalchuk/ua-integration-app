import { Box, HStack, Pressable, Text } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';

type ControlSectionTabsProps = {
  data: {
    title: string;
  }[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
};

const ControlSectionTabs = ({
  data,
  activeIndex,
  onIndexChange,
}: ControlSectionTabsProps) => {
  return (
    <Box
      borderBottomWidth={1}
      borderColor="$borderLight100"
      sx={{
        _dark: { borderColor: '$borderDark900' },
      }}
    >
      <Box py="$4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="lg" mx="$4">
            {data.map((tab, index) => {
              return (
                <Pressable
                  key={tab.title}
                  my="$0.5"
                  py="$1"
                  borderBottomWidth={activeIndex === index ? 3 : 0}
                  borderColor="$borderLight900"
                  sx={{
                    ':hover': {
                      borderBottomWidth: 3,
                      borderColor:
                        activeIndex === index
                          ? '$borderLight900'
                          : '$borderLight200',
                    },
                    '_dark': {
                      'borderColor': '$borderDark100',
                      ':hover': {
                        borderColor:
                          activeIndex === index
                            ? '$borderDark100'
                            : '$borderDark700',
                      },
                    },
                  }}
                  onPress={() => onIndexChange(index)}
                >
                  <Text
                    size="sm"
                    color={
                      activeIndex === index ? '$textLight900' : '$textLight600'
                    }
                    sx={{
                      _dark: {
                        color:
                          activeIndex === index
                            ? '$textDark50'
                            : '$textDark400',
                      },
                    }}
                    fontWeight="$medium"
                  >
                    {tab.title}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default ControlSectionTabs;
