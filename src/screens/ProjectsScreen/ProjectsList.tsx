import { Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { FlatList } from 'react-native';

import { Project } from '@/api/getProjects';
import { useAuthContext } from '@/contexts/AuthContext';

type ProjectsListProps = {
  data: Project[];
  onPress: (project: Project) => void;
};

const ProjectsList = ({ data, onPress }: ProjectsListProps) => {
  const { authState } = useAuthContext();

  return (
    <FlatList
      style={{ paddingHorizontal: 16 }}
      contentContainerStyle={{ gap: 8, paddingVertical: 16 }}
      data={data}
      renderItem={({ item }) => (
        <Button
          key={item.id}
          onPress={() => onPress(item)}
          isDisabled={
            authState.type === 'authenticated' &&
            authState.session.projectId === item.id
          }
        >
          <ButtonText>{item.name}</ButtonText>
        </Button>
      )}
      keyExtractor={(item) => item.name + item.id}
    />
  );
};

export default ProjectsList;
