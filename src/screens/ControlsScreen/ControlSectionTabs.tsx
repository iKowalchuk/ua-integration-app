import { Box, HStack, Pressable, Text } from '@gluestack-ui/themed';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

const PADDING = 16;

type ControlSectionTabsProps = {
  data: {
    title: string;
  }[];
  activeTabIndex: number;
  onTabIndexChange: (index: number) => void;
};

const ControlSectionTabs = ({
  data,
  activeTabIndex,
  onTabIndexChange,
}: ControlSectionTabsProps) => {
  const layout = useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);
  const viewsRef = useRef<(View | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(activeTabIndex || 0);

  const handleIndexChange = (index: number) => {
    const selected = viewsRef.current[index];
    selected?.measure((x, y, width, height, pageX) => {
      const center = layout.width / 2;
      const scrollPosition = x + PADDING - center + width / 2;
      scrollRef.current?.scrollTo({ x: scrollPosition, y: 0, animated: true });
    });
    setActiveIndex(index);
    onTabIndexChange(index);
  };

  useEffect(() => {
    handleIndexChange(activeTabIndex);
  }, [activeTabIndex]);

  return (
    <Box
      borderBottomWidth={1}
      borderColor="$borderLight100"
      sx={{
        _dark: { borderColor: '$borderDark900' },
      }}
    >
      <Box py="$4">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <HStack space="lg" mx={PADDING}>
            {data.map((tab, index) => {
              return (
                <View
                  key={`${tab.title}-${index}`}
                  ref={(el) => (viewsRef.current[index] = el)}
                >
                  <Pressable
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
                    onPress={() => handleIndexChange(index)}
                  >
                    <Text
                      size="md"
                      color={
                        activeIndex === index
                          ? '$textLight900'
                          : '$textLight600'
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
                </View>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default ControlSectionTabs;
