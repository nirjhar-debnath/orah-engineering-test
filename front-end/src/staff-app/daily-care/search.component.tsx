import React from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton, InputAdornment, TextField } from "@material-ui/core"

interface SearchProps {
  setSearchQuery:React.Dispatch<React.SetStateAction<string>>
}
export const Search: React.FC<SearchProps> = (props) => {

  const { setSearchQuery } = props

  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchQuery(event.target.value);
  }
  console.log(props);
  return(
    <div>
      <S.InputField 
        id="outlined-basic"
        placeholder="Search" 
        variant="outlined"
        size="small"
        color="primary"
        InputProps={{
          startAdornment: <InputAdornment position="start">
            <FontAwesomeIcon icon="search" size="1x" color="white"/>
          </InputAdornment>,
        }} 
        onChange={(e)=>{handleSearch(e)}}
      />
    </div>
  )
}

const S = {
  InputField: styled(TextField)`
    & .MuiOutlinedInput-root {
      color:white;
      & fieldset{
        border-radius: 10px;
        
        border: 1px solid grey; 
      }

      &:hover fieldset{
        border: 1px solid white;
      }
    
      &.Mui-focused fieldset{
        border: 1px solid white;
        width: 100%;
      }
    }
  `,
}