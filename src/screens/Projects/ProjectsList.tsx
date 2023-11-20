import { Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { ScrollView } from 'react-native';

import { Project } from '@/api/getProjects';
import { useProjectsContext } from '@/hooks/useProjects';

type ProjectsListProps = {
  data: Project[];
  onPress: (project: Project) => void;
};

const ProjectsList = ({ data, onPress }: ProjectsListProps) => {
  const { project } = useProjectsContext();

  return (
    <ScrollView contentContainerStyle={{ gap: 4 }}>
      {data.map((item) => (
        <Button
          key={item.id}
          mx="$4"
          mb="$2"
          onPress={() => onPress(item)}
          isDisabled={item.id === project?.id}
        >
          <ButtonText>{item.descr}</ButtonText>
        </Button>
      ))}
    </ScrollView>
  );
};

export default ProjectsList;
