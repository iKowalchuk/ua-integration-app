import { Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { ScrollView } from 'react-native';

import { Project } from '@/api/getProjects';
import { useAuthContext } from '@/contexts/AuthContext';

type ProjectsListProps = {
  data: Project[];
  onPress: (project: Project) => void;
};

const ProjectsList = ({ data, onPress }: ProjectsListProps) => {
  const { authState } = useAuthContext();

  return (
    <ScrollView contentContainerStyle={{ gap: 4, paddingTop: 16 }}>
      {data.map((item) => (
        <Button
          key={item.id}
          mx="$4"
          mb="$2"
          onPress={() => onPress(item)}
          isDisabled={
            authState.type === 'authenticated' &&
            authState.session.projectId === item.id
          }
        >
          <ButtonText>{item.name}</ButtonText>
        </Button>
      ))}
    </ScrollView>
  );
};

export default ProjectsList;
