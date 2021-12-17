import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Searchbar } from 'react-native-paper';
import styled from 'styled-components/native';

import { LocationContext } from '../services';

const SearchBarContainer = styled.View`
  padding: 16px 5% 0 5%;
  position: absolute;
  top: ${StatusBar.currentHeight}px;
  width: 100%;
  z-index: 1;
`;

export const Search = ({ icon }) => {
  const { jobTitle, setJobTitle } = useContext(LocationContext);
  const [searchKeyword, setSearchKeyword] = useState(jobTitle);

  useEffect(() => {
    setSearchKeyword(jobTitle);
  }, [jobTitle]);

  return (
    <SearchBarContainer>
      <Searchbar
        icon={icon}
        placeholder="Search job title"
        value={searchKeyword}
        onSubmitEditing={() => {
          setJobTitle(searchKeyword);
        }}
        onChangeText={(text) => {
          setSearchKeyword(text);
        }}
      />
    </SearchBarContainer>
  );
};
